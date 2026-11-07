const cron = require("node-cron");
const Alert = require("../models/Alert");
const User = require("../models/User");
const University = require("../models/University");
const sendWhatsApp = require("./sendWhatsApp");
const sendEmail = require("./sendEmail");

// Helper to determine the nearest active deadline
function resolveDeadlineDate(alert, populatedUni) {
  if (alert.deadline) {
    const d = new Date(alert.deadline);
    if (!isNaN(d.getTime())) return d;
  }
  if (populatedUni?.admissionDeadline) {
    const d = new Date(populatedUni.admissionDeadline);
    if (!isNaN(d.getTime())) return d;
  }
  if (populatedUni?.admissionDeadlines?.length > 0) {
    const now = new Date();
    const valid = populatedUni.admissionDeadlines
      .map(dl => new Date(dl.deadline))
      .filter(d => !isNaN(d.getTime()) && d > now)
      .sort((a, b) => a - b);
    if (valid.length > 0) return valid[0];
  }
  return null;
}

/**
 * Checks all active alerts and sends reminders for upcoming deadlines.
 * Can be called automatically by cron OR manually via the /api/alerts/trigger endpoint.
 */
const checkAndSendAlerts = async () => {
  console.log("[alertCron] Running deadline alert check at", new Date().toISOString());
  const stats = { totalChecked: 0, sent7Day: 0, sent1Day: 0, watchlistAlerts: 0, expired: 0, errors: [] };

  try {
    const now = new Date();

    // 1. Check explicit active alerts in Alert collection
    const activeAlerts = await Alert.find({ isActive: true }).populate("universityId");
    stats.totalChecked = activeAlerts.length;

    for (const alert of activeAlerts) {
      const deadline = resolveDeadlineDate(alert, alert.universityId);
      if (!deadline) continue;

      const diffMs = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      // 7-day reminder
      if (diffDays <= 7 && diffDays > 1 && !alert.sent7Day) {
        try {
          await sendDeadlineAlert(alert, diffDays);
          await Alert.findByIdAndUpdate(alert._id, { sent7Day: true });
          stats.sent7Day++;
        } catch (err) {
          stats.errors.push({ alertId: alert._id, error: err.message });
        }
      }

      // 1-day urgent reminder
      if (diffDays <= 1 && diffDays >= 0 && !alert.sent1Day) {
        try {
          await sendDeadlineAlert(alert, diffDays);
          await Alert.findByIdAndUpdate(alert._id, { sent1Day: true });
          stats.sent1Day++;
        } catch (err) {
          stats.errors.push({ alertId: alert._id, error: err.message });
        }
      }

      // Expired
      if (diffDays < 0) {
        await Alert.findByIdAndUpdate(alert._id, { isActive: false });
        stats.expired++;
      }
    }

    // 2. Check Users with saved Watchlist (Favorites) to ensure they never miss alerts
    try {
      const usersWithWatchlist = await User.find({
        "watchlist.0": { $exists: true },
        emailAlerts: { $ne: false },
      }).populate("watchlist");

      for (const user of usersWithWatchlist) {
        if (!user.email && !user.whatsapp) continue;

        for (const uni of user.watchlist) {
          if (!uni) continue;
          const deadline = resolveDeadlineDate({}, uni);
          if (!deadline) continue;

          const diffMs = deadline.getTime() - now.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

          // Only send if within 7 or 1 day and no explicit alert already handled it today
          if ((diffDays <= 7 && diffDays > 1) || (diffDays <= 1 && diffDays >= 0)) {
            const alreadyAlert = await Alert.findOne({
              userId: user._id,
              universityId: uni._id,
              isActive: true,
            });

            // If an explicit alert already exists, it was handled in step 1
            if (!alreadyAlert) {
              const pseudoAlert = {
                universityName: uni.name,
                degreeLevel: "All Programs",
                email: user.email,
                whatsapp: user.whatsapp || "",
              };
              await sendDeadlineAlert(pseudoAlert, diffDays);
              stats.watchlistAlerts++;

              // Create recorded alert so we don't duplicate
              await Alert.create({
                userId: user._id,
                universityId: uni._id,
                universityName: uni.name,
                deadline,
                email: user.email,
                whatsapp: user.whatsapp || "",
                sent7Day: diffDays > 1,
                sent1Day: diffDays <= 1,
                isActive: true,
              });
            }
          }
        }
      }
    } catch (wlErr) {
      console.warn("[alertCron] Watchlist check non-fatal error:", wlErr.message);
    }

    console.log("[alertCron] Alert check complete:", stats);
    return { success: true, stats };
  } catch (err) {
    console.error("[alertCron] Fatal alert check error:", err.message);
    return { success: false, error: err.message };
  }
};

// Run automatically every day at 9:00 AM Pakistan time
const startAlertCron = () => {
  cron.schedule("0 9 * * *", async () => {
    await checkAndSendAlerts();
  });
  console.log("[alertCron] Deadline alert daily cron schedule initialized (09:00 AM PKT).");
};

const sendDeadlineAlert = async (alert, daysLeft) => {
  const uniName = alert.universityName || "University";
  const degreeLabel = alert.degreeLevel && alert.degreeLevel !== "All" ? ` (${alert.degreeLevel})` : "";
  const urgent = daysLeft <= 1;

  const waMessage = [
    urgent ? "🚨 *URGENT — Last Day Tomorrow!*" : "🔔 *Admission Deadline Reminder — Rahbars*",
    "",
    `University: *${uniName}*`,
    degreeLabel ? `Program: *${alert.degreeLevel}*` : "",
    `Admission deadline is in *${daysLeft} ${daysLeft === 1 ? "day" : "days"}*!`,
    "",
    urgent
      ? "⚠️ This is your final chance to submit your application form. Don't miss it!"
      : "📋 Make sure your documents and entry test details are prepared before the portal closes.",
    "",
    `👉 Check details: https://www.rahbars.com`,
    "",
    "Reply STOP to unsubscribe from alerts.",
  ].filter(Boolean).join("\n");

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #0f172a, #2563eb); padding: 28px; text-align: center;">
        <h2 style="color: white; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.02em;">Rahbars</h2>
        <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">Pakistan Admission Guide</p>
      </div>

      <div style="padding: 32px 28px; background: #ffffff;">
        <div style="display: inline-block; background: ${urgent ? "#fee2e2" : "#dbeafe"}; color: ${urgent ? "#dc2626" : "#1d4ed8"}; font-weight: bold; font-size: 12px; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 14px;">
          ${urgent ? "🚨 Urgent Reminder" : "🔔 Deadline Reminder"}
        </div>

        <h3 style="color: #0f172a; font-size: 22px; margin: 0 0 16px; font-weight: 800;">
          ${urgent ? "Last Chance: Apply by Tomorrow!" : `${daysLeft} Days Remaining to Apply`}
        </h3>

        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid ${urgent ? "#ef4444" : "#2563eb"}; margin-bottom: 22px;">
          <p style="color: #0f172a; margin: 0 0 8px; font-size: 16px;">
            <strong>University:</strong> ${uniName}
          </p>
          ${degreeLabel ? `<p style="color: #334155; margin: 0 0 8px; font-size: 14px;"><strong>Program:</strong> ${alert.degreeLevel}</p>` : ""}
          <p style="color: ${urgent ? "#dc2626" : "#2563eb"}; margin: 0; font-size: 15px; font-weight: bold;">
            ⏳ Time Left: ${daysLeft} ${daysLeft === 1 ? "day" : "days"} remaining
          </p>
        </div>

        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
          ${urgent
            ? "The admission deadline is closing tomorrow. Please submit your online application form and fee voucher immediately so your merit seat is reserved."
            : "Review your required documents, calculate your aggregate percentage, and complete your admission portal application before the closing date."}
        </p>

        <div style="text-align: center; margin-bottom: 20px;">
          <a href="https://www.rahbars.com"
            style="display: inline-block; background: #0f172a; color: white; padding: 13px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);">
            Open Rahbars & Check Deadlines →
          </a>
        </div>
      </div>

      <div style="padding: 16px 24px; text-align: center; color: #94a3b8; font-size: 12px; background: #f8fafc; border-top: 1px solid #f1f5f9;">
        You received this reminder because you saved ${uniName} to your Rahbars favorites.<br/>
        <a href="https://www.rahbars.com/watchlist" style="color: #2563eb; text-decoration: none;">Manage your saved universities</a>
      </div>
    </div>
  `;

  const results = { whatsapp: null, email: null };

  if (alert.whatsapp) {
    try {
      results.whatsapp = await sendWhatsApp(alert.whatsapp, waMessage);
    } catch (waErr) {
      console.warn("[alertCron] WhatsApp dispatch failed:", waErr.message);
    }
  }

  if (alert.email) {
    try {
      results.email = await sendEmail({
        to: alert.email,
        subject: `${urgent ? "🚨 URGENT: Last Day to Apply — " : `🔔 ${daysLeft} Days Left: `}${uniName}${degreeLabel}`,
        html: emailHtml,
      });
    } catch (mErr) {
      console.warn("[alertCron] Email dispatch failed:", mErr.message);
    }
  }

  return results;
};

module.exports = startAlertCron;
module.exports.checkAndSendAlerts = checkAndSendAlerts;
module.exports.sendDeadlineAlert = sendDeadlineAlert;