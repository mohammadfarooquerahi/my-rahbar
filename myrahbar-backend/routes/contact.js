const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");
const { verifyEmailConfig } = require("../utils/sendEmail");
const ContactMessage = require("../models/ContactMessage");

// GET /api/contact/test-email - Diagnostic route to test Render email configuration
router.get("/test-email", async (req, res) => {
  try {
    const diag = await verifyEmailConfig();
    res.json({
      status: "diagnostic",
      timestamp: new Date().toISOString(),
      adminEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "rahbarsofficial@gmail.com",
      ...diag,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contact/send-test?to=farooqrahi828@gmail.com - Send instant test email
router.get("/send-test", async (req, res) => {
  try {
    const targetEmail = req.query.to || "farooqrahi828@gmail.com";
    const result = await sendEmail({
      to: targetEmail,
      subject: "Rahbars Test Email - Verified and Working!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #2563eb; margin-top: 0;">Rahbars Email System Test</h2>
          <p>Assalam-o-Alaikum Farooq!</p>
          <p>Aapka email alert system <strong>100% operational</strong> hai aur Render se successfully deliver ho raha hai.</p>
          <p style="color: #64748b; font-size: 13px;">Sent at: ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <a href="https://www.rahbars.com" style="display: inline-block; background: #0f172a; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">Visit Rahbars</a>
        </div>
      `,
    });
    res.json({
      status: "sent",
      to: targetEmail,
      result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, firstName, lastName, email, phone, whatsapp, subject, message } = req.body;

    const resolvedFirst = firstName || (name ? name.split(" ")[0] : "");
    const resolvedLast = lastName || (name ? name.split(" ").slice(1).join(" ") : "");
    const resolvedPhone = phone || whatsapp || "";
    const resolvedSubject = subject || "General Inquiry";

    if (!resolvedFirst || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    // 1. Save to MongoDB immediately so inquiries are never lost
    let savedMsg = null;
    try {
      savedMsg = await ContactMessage.create({
        firstName: resolvedFirst,
        lastName: resolvedLast,
        email,
        phone: resolvedPhone,
        subject: resolvedSubject,
        message,
      });
    } catch (dbErr) {
      console.warn("Could not save contact message to database:", dbErr.message);
    }

    const fullName = `${resolvedFirst} ${resolvedLast}`.trim();
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "farooqrahi828@gmail.com";

    // 2. Dispatch notification email to admin
    const adminEmailPromise = sendEmail({
      to: adminEmail,
      replyTo: email,
      subject: `📩 New Contact Form Inquiry: ${fullName} - ${resolvedSubject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin: 0; font-size: 22px;">New Contact Form Message</h2>
          </div>
          <p style="font-size: 15px; color: #475569; margin: 0 0 16px;">A user has submitted a message via the <strong>Rahbars</strong> contact page:</p>
          
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
              ${resolvedPhone ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Phone:</strong></td>
                <td style="padding: 6px 0; color: #0f172a;"><a href="https://wa.me/${resolvedPhone.replace(/[^0-9]/g, '')}" style="color: #16a34a; font-weight: 600; text-decoration: none;">${resolvedPhone} (WhatsApp)</a></td>
              </tr>` : ''}
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Subject:</strong></td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${resolvedSubject}</td>
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
            <a href="mailto:${email}?subject=Re:%20${encodeURIComponent(resolvedSubject)}%20(Rahbars)" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 24px; border-radius: 8px;">Reply Directly to ${resolvedFirst}</a>
          </div>

          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 24px; margin-bottom: 0;">Sent via Rahbars (rahbars.com)</p>
        </div>
      `,
    });

    // 3. Dispatch auto-confirmation email to the sender
    const userConfirmPromise = sendEmail({
      to: email,
      subject: `We received your message - Rahbars Team`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; background: #ffffff;">
          <h2 style="color: #2563eb; margin: 0 0 12px; font-size: 20px;">Thank You, ${firstName}!</h2>
          <p style="font-size: 14px; color: #475569; margin: 0 0 16px;">We have received your message and our team will get back to you as soon as possible.</p>
          <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #334155; font-style: italic;">
            "${message}"
          </div>
          <p style="font-size: 13px; color: #64748b; margin: 0;">For urgent inquiries, you can also reach us directly on WhatsApp at <strong>+92 319 0211218</strong>.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px;" />
          <p style="font-size: 11px; color: #94a3b8; margin: 0;">Rahbars - Hyderabad, Pakistan - <a href="https://www.rahbars.com" style="color: #2563eb; text-decoration: none;">rahbars.com</a></p>
        </div>
      `,
    });

    // Run emails without blocking the HTTP response indefinitely
    const [adminResult] = await Promise.all([adminEmailPromise, userConfirmPromise]);

    res.json({
      success: true,
      emailSent: adminResult.success,
      emailError: adminResult.error || (adminResult.reason === "credentials_missing" ? "EMAIL_USER/EMAIL_PASS not configured on server" : null),
      message: "Thank you! Your message has been sent to our team.",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ message: "Failed to send message: " + error.message });
  }
});

module.exports = router;