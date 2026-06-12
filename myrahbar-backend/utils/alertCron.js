const cron = require("node-cron");
const Alert = require("../models/Alert");
const sendWhatsApp = require("./sendWhatsApp");
const sendEmail = require("./sendEmail");

// Run every day at 9:00 AM Pakistan time
const startAlertCron = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("Running deadline alert check...");
    try {
      const now = new Date();
      const active = await Alert.find({ isActive: true });

      for (const alert of active) {
        if (!alert.deadline) continue;

        const deadline = new Date(alert.deadline);
        const diffMs = deadline - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 7 && !alert.sent7Day) {
          await sendDeadlineAlert(alert, diffDays);
          await Alert.findByIdAndUpdate(alert._id, { sent7Day: true });
        }

        if (diffDays === 1 && !alert.sent1Day) {
          await sendDeadlineAlert(alert, diffDays);
          await Alert.findByIdAndUpdate(alert._id, { sent1Day: true });
        }

        if (diffDays < 0) {
          await Alert.findByIdAndUpdate(alert._id, { isActive: false });
        }
      }
      console.log("Alert check complete.");
    } catch (err) {
      console.error("Alert cron error: " + err.message);
    }
  });
  console.log("Deadline alert cron job started.");
};

const sendDeadlineAlert = async (alert, daysLeft) => {
  const uniName = alert.universityName || "University";
  const degreeLabel = alert.degreeLevel && alert.degreeLevel !== "All" ? ` (${alert.degreeLevel})` : "";
  const urgent = daysLeft === 1;

  const waMessage = [
    urgent ? "🚨 *URGENT — Last Day Tomorrow!*" : "⏰ *Deadline Reminder — Rahbars*",
    "",
    `University: *${uniName}*`,
    degreeLabel ? `Program: *${alert.degreeLevel}*` : "",
    `Admission deadline is in *${daysLeft}${daysLeft === 1 ? " day*" : " days*"}`,
    "",
    urgent
      ? "This is your last chance to apply. Do not miss it!"
      : "Make sure your documents are ready and form is submitted.",
    "",
    "Visit rahbars.com to check details.",
    "",
    "Reply STOP to unsubscribe.",
  ].filter(Boolean).join("\n");

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #1545A5, #0f286b); padding: 28px; text-align: center;">
        <h2 style="color: white; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 0.02em;">Rahbars</h2>
        <p style="color: rgba(255,255,255,0.75); margin: 4px 0 0; font-size: 13px;">LEARN. GROW. SUCCEED.</p>
      </div>

      <div style="padding: 32px 28px; background: #f8faff;">
        <h3 style="color: #1545A5; font-size: 20px; margin: 0 0 16px;">
          ${urgent ? "🚨 Last Day Tomorrow!" : `⏰ ${daysLeft} Days Left — Act Now!`}
        </h3>

        <div style="background: white; border-radius: 10px; padding: 20px; border-left: 4px solid #1545A5; margin-bottom: 20px;">
          <p style="color: #333; margin: 0 0 8px; font-size: 15px;">
            <strong>University:</strong> ${uniName}
          </p>
          ${degreeLabel ? `<p style="color: #333; margin: 0 0 8px; font-size: 15px;"><strong>Program:</strong> ${alert.degreeLevel}</p>` : ""}
          <p style="color: ${urgent ? "#e74c3c" : "#1545A5"}; margin: 0; font-size: 15px; font-weight: bold;">
            Deadline: ${daysLeft} ${daysLeft === 1 ? "day" : "days"} remaining
          </p>
        </div>

        <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
          ${urgent
            ? "This is your last chance to submit your application. Visit the university website and submit your form immediately!"
            : "Prepare your documents now. Make sure your admission form is complete and submitted before the deadline."}
        </p>

        <a href="https://rahbars.com"
          style="display: inline-block; background: #1545A5; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
          Open Rahbars → Check University
        </a>
      </div>

      <div style="padding: 16px; text-align: center; color: #999; font-size: 12px; background: #f0f4ff;">
        You are receiving this because you saved ${uniName} on Rahbars.<br>
        <a href="https://rahbars.com/profile" style="color: #1545A5;">Manage your alerts here</a>
      </div>
    </div>
  `;

  if (alert.whatsapp) await sendWhatsApp(alert.whatsapp, waMessage);
  if (alert.email) {
    await sendEmail({
      to: alert.email,
      subject: `${urgent ? "🚨 Last Day — " : `⏰ ${daysLeft} Days Left — `}${uniName}${degreeLabel} Admission Deadline`,
      html: emailHtml,
    });
  }
};

module.exports = startAlertCron;
