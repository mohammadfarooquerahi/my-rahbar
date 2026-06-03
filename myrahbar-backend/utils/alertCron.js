const cron = require("node-cron");
const Alert = require("../models/Alert");
const sendWhatsApp = require("./sendWhatsApp");
const sendEmail = require("./sendEmail");

// Run every day at 9:00 AM
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

        // 7 day alert
        if (diffDays === 7 && !alert.sent7Day) {
          await sendDeadlineAlert(alert, diffDays);
          await Alert.findByIdAndUpdate(alert._id, { sent7Day: true });
        }

        // 1 day alert
        if (diffDays === 1 && !alert.sent1Day) {
          await sendDeadlineAlert(alert, diffDays);
          await Alert.findByIdAndUpdate(alert._id, { sent1Day: true });
        }

        // Deactivate if deadline passed
        if (diffDays < 0) {
          await Alert.findByIdAndUpdate(alert._id, { isActive: false });
        }
      }

      console.log("Alert check complete.");
    } catch (err) {
      console.error("Alert cron error: " + err.message);
    }
  });

  consol
<truncated 1190 bytes>
>MyRahbar</h2>
        <p style="color: #7DD3A8; margin: 4px 0 0;">Your University Guide</p>
      </div>

      <div style="padding: 24px; background: #f5f8fc;">
        <h3 style="color: #1E3A5F;">
          ${urgent ? "ðŸš¨ Last Day Tomorrow!" : "â° Deadline Reminder"}
        </h3>

        <p style="color: #333;">
          The admission deadline for <strong>${uniName}</strong> is in
          <strong>${daysLeft} ${daysLeft === 1 ? "day" : "days"}</strong>.
        </p>

        <p style="color: #333;">
          ${
            urgent
              ? "This is your last chance to submit your application. Do not miss it!"
              : "Make sure your documents are ready and your admission form is submitted."
          }
        </p>

        
          href="https://myrahbar.com"
          style="display: inline-block; background: #27AE60; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;"
        >
          View on MyRahbar
        </a>
      </div>

      <div style="padding: 16px; text-align: center; color: #999; font-size: 12px;">
        You are receiving this because you saved ${uniName} on MyRahbar.
        <br>To unsubscribe visit your watchlist settings.
      </div>
    </div>
  `;

  // Send both
  if (alert.whatsapp) {
    await sendWhatsApp(alert.whatsapp, waMessage);
  }
  if (alert.email) {
    await sendEmail({
      to: alert.email,
      subject:
        (urgent ? "ðŸš¨ Last Day â€” " : "â° " + daysLeft + " Days Left â€” ") +
        uniName +
        " Admission Deadline",
      html: emailHtml,
    });
  }
};

module.exports = startAlertCron;
