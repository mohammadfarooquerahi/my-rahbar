const cron = require("node-cron");
const Alert = require("../models/Alert");
const sendWhatsApp = require("./sendWhatsApp");
const sendEmail = require("./sendEmail");

/**
 * Checks all active alerts and sends reminders for upcoming deadlines.
 * Can be called automatically by cron OR manually via the /api/alerts/trigger endpoint.
 */
const checkAndSendAlerts = async () => {
  console.log("[alertCron] Running deadline alert check at", new Date().toISOString());
  const stats = { totalChecked: 0, sent7Day: 0, sent1Day: 0, expired: 0, errors: [] };

  try {
    const now = new Date();
    const active = await Alert.find({ isActive: true });
    stats.totalChecked = active.length;

    for (const alert of active) {
      if (!alert.deadline) continue;

      const deadline = new Date(alert.deadline);
      const diffMs = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      // 7-day window reminder (7 days or less, but more than 1 day)
      if (diffDays <= 7 && diffDays > 1 && !alert.sent7Day) {
        try {
          await sendDeadlineAlert(alert, diffDays);
          await Alert.findByIdAndUpdate(alert._id, { sent7Day: true });
          stats.sent7Day++;
        } catch (err) {
          stats.errors.push({ alertId: alert._id, error: err.message });
        }
      }

      // 1-day urgent reminder (tomorrow or today)
      if (diffDays <= 1 && diffDays >= 0 && !alert.sent1Day) {
        try {
          await sendDeadlineAlert(alert, diffDays);
          await Alert.findByIdAndUpdate(alert._id, { sent1Day: true });
          stats.sent1Day++;
        } catch (err) {
          stats.errors.push({ alertId: alert._id, error: err.message });
        }
      }

      // Deactivate expired deadlines
      if (diffDays < 0) {
        await Alert.findByIdAndUpdate(alert._id, { isActive: false });
        stats.expired++;
      }
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
    `Admission deadline is in *${daysLeft}${daysLeft === 1 ? " day*" : " days*"}`,
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
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #0F172A, #2563EB); padding: 28px; text-align: center;">
        <h2 style="color: white; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 0.02em;">Rahbars</h2>
        <p style="color: rgba(255,255,255,0.75); margin: 4px 0 0; font-size: 13px;">LEARN. GROW. SUCCEED.</p>
      </div>

      <div style="padding: 32px 28px; background: #f8faff;">
        <h3 style="color: #0F172A; font-size: 20px; margin: 0 0 16px;">
          ${urgent ? "🚨 Urgent: Last Day to Apply!" : `🔔 ${daysLeft} Days Remaining — Apply Now`}
        </h3>

        <div style="background: white; border-radius: 10px; padding: 20px; border-left: 4px solid #2563EB; margin-bottom: 20px;">
          <p style="color: #333; margin: 0 0 8px; font-size: 15px;">
            <strong>University:</strong> ${uniName}
          </p>
          ${degreeLabel ? `<p style="color: #333; margin: 0 0 8px; font-size: 15px;"><strong>Program:</strong> ${alert.degreeLevel.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>` : ""}
          <p style="color: ${urgent ? "#e74c3c" : "#2563EB"}; margin: 0; font-size: 15px; font-weight: bold;">
            Deadline: ${daysLeft} ${daysLeft === 1 ? "day" : "days"} remaining
          </p>
        </div>

        <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
          ${urgent
            ? "This is your last chance to complete and submit your application. Visit the university portal immediately!"
            : "Prepare your required documents, calculate your aggregate score, and submit your admission form before the closing date."}
        </p>

        <a href="https://www.rahbars.com"
          style="display: inline-block; background: #0F172A; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
          Open Rahbars → Check University
        </a>
      </div>

      <div style="padding: 16px; text-align: center; color: #999; font-size: 12px; background: #f0f4ff;">
        You are receiving this alert because you requested deadline reminders for ${uniName} on Rahbars.<br>
        <a href="https://www.rahbars.com/profile" style="color: #2563EB;">Manage your alerts in Profile</a>
      </div>
    </div>
  `;

  if (alert.whatsapp) {
    await sendWhatsApp(alert.whatsapp, waMessage);
  }

  if (alert.email) {
    await sendEmail({
      to: alert.email,
      subject: `${urgent ? "🚨 URGENT: Last Day — " : `🔔 ${daysLeft} Days Left — `}${uniName}${degreeLabel} Admission Deadline`,
      html: emailHtml,
    });
  }
};

module.exports = startAlertCron;
module.exports.checkAndSendAlerts = checkAndSendAlerts;
module.exports.sendDeadlineAlert = sendDeadlineAlert;
