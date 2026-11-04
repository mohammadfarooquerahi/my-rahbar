const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");
const ContactMessage = require("../models/ContactMessage");

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({ message: "First name, email, and message are required." });
    }

    // 1. Save to MongoDB so inquiries are never lost
    let savedMsg = null;
    try {
      savedMsg = await ContactMessage.create({
        firstName,
        lastName: lastName || "",
        email,
        message,
      });
    } catch (dbErr) {
      console.warn("Could not save contact message to database:", dbErr.message);
    }

    const fullName = `${firstName} ${lastName || ""}`.trim();
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "rahbarsofficial@gmail.com";

    // 2. Dispatch notification email to admin
    await sendEmail({
      to: adminEmail,
      subject: `New Inquiry from ${fullName} (Rahbars)`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin: 0; font-size: 22px;">?? New Contact Form Inquiry</h2>
          </div>
          <p style="font-size: 15px; color: #475569; margin: 0 0 16px;">A user has submitted a message through the <strong>Rahbars</strong> contact page:</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 110px;"><strong>Name:</strong></td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Email:</strong></td>
                <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Date:</strong></td>
                <td style="padding: 6px 0; color: #0f172a;">${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}</td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 24px;">
            <p style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 0 0 8px;">Message:</p>
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; font-size: 14px; color: #0f172a; white-space: pre-wrap; line-height: 1.6;">${message}</div>
          </div>

          <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
            <a href="mailto:${email}?subject=Re:%20Inquiry%20on%20Rahbars" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 24px; border-radius: 8px;">Reply Directly to ${firstName}</a>
          </div>

          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 24px; margin-bottom: 0;">Sent via Rahbars (rahbars.com)</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Thank you! Your message has been sent to our team.",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ message: "Failed to send message: " + error.message });
  }
});

module.exports = router;
