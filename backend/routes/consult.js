const express = require("express");
const router = express.Router();
const Booking = require("../models/ConsultingBooking");
const sendEmail = require("../utils/sendEmail");

// POST /api/consult/book
router.post("/book", async (req, res) => {
  try {
    const { name, email, whatsapp, topic, slot, message } = req.body;

    if (!name || !email || !whatsapp || !topic || !slot) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // 1. Save booking to MongoDB
    const booking = await Booking.create({
      name,
      email,
      whatsapp,
      topic,
      slot,
      message: message || "",
    });

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "rahbarsofficial@gmail.com";
    const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, "");

    // 2. Send email notification to Admin
    const adminEmailPromise = sendEmail({
      to: adminEmail,
      replyTo: email,
      subject: `🎯 New Counseling Booking: ${name} (${topic})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <h2 style="color: #4f46e5; margin: 0; font-size: 22px;">🎓 New 1:1 Counseling Request</h2>
          </div>
          <p style="font-size: 15px; color: #475569; margin: 0 0 16px;">A student has booked a counseling session on <strong>Rahbars</strong>:</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 130px;"><strong>Student Name:</strong></td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>WhatsApp:</strong></td>
                <td style="padding: 6px 0; color: #0f172a;">
                  <a href="https://wa.me/${cleanWhatsapp}" style="color: #16a34a; font-weight: 600; text-decoration: none;">+${cleanWhatsapp} 💬 (Click to chat)</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Email:</strong></td>
                <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Topic:</strong></td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${topic}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Preferred Slot:</strong></td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${slot}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Booked At:</strong></td>
                <td style="padding: 6px 0; color: #0f172a;">${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}</td>
              </tr>
            </table>
          </div>

          ${message ? `
            <div style="margin-bottom: 24px;">
              <p style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 0 0 8px;">Student Note / Questions:</p>
              <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; font-size: 14px; color: #0f172a; white-space: pre-wrap; line-height: 1.6;">${message}</div>
            </div>
          ` : ""}

          <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
            <a href="https://wa.me/${cleanWhatsapp}" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 24px; border-radius: 8px; margin-right: 8px;">Contact Student on WhatsApp</a>
            <a href="mailto:${email}" style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 24px; border-radius: 8px;">Reply via Email</a>
          </div>

          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 24px; margin-bottom: 0;">Sent via Rahbars Counseling Booking System</p>
        </div>
      `,
    });

    // 3. Send confirmation email to Student
    const studentEmailPromise = sendEmail({
      to: email,
      subject: `Booking Confirmed: 1:1 Counseling with Rahbars`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; background: #ffffff;">
          <h2 style="color: #4f46e5; margin: 0 0 12px; font-size: 20px;">Assalam-o-Alaikum, ${name}!</h2>
          <p style="font-size: 14px; color: #475569; margin: 0 0 16px;">Thank you for requesting a 1:1 counseling session with Rahbars. We have received your booking details:</p>
          
          <div style="background: #f8fafc; border-left: 4px solid #4f46e5; padding: 14px 18px; margin-bottom: 20px; font-size: 14px;">
            <p style="margin: 0 0 6px;"><strong>Topic:</strong> ${topic}</p>
            <p style="margin: 0 0 6px;"><strong>Preferred Slot:</strong> ${slot}</p>
            <p style="margin: 0;"><strong>WhatsApp Contact:</strong> ${whatsapp}</p>
          </div>

          <p style="font-size: 14px; color: #475569; margin: 0 0 16px;">Our senior counselor will reach out to you directly on WhatsApp to confirm the final meeting time and video call link.</p>
          <p style="font-size: 13px; color: #64748b; margin: 0;">Need immediate help? Save our official WhatsApp number: <strong>+92 319 0211218</strong>.</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px;" />
          <p style="font-size: 11px; color: #94a3b8; margin: 0;">Rahbars • Hyderabad, Pakistan • <a href="https://www.rahbars.com" style="color: #4f46e5; text-decoration: none;">rahbars.com</a></p>
        </div>
      `,
    });

    // Execute email sends in parallel
    const [adminResult] = await Promise.all([adminEmailPromise, studentEmailPromise]);

    res.status(201).json({
      booking,
      emailSent: adminResult.success,
      emailError: adminResult.error || null,
      message:
        "Booking confirmed. Our counselor will contact you on WhatsApp within 2 hours.",
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Failed to create booking: " + err.message });
  }
});

// GET /api/consult/slots — available time slots
router.get("/slots", (req, res) => {
  const slots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
  ];
  res.json({ slots });
});

module.exports = router;
