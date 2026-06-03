const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    // If email credentials not set — just log
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email would send to " + to);
      console.log("Subject: " + subject);
      return true;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"MyRahbar" <' + process.env.EMAIL_USER + ">",
      to,
      subject,
      html,
    });

    console.log("Email sent to " + to);
    return true;
  } catch (err) {
    console.error("Email send failed: " + err.message);
    return false;
  }
};

module.exports = sendEmail;
