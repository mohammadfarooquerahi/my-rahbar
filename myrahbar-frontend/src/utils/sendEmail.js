const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass || pass === "your_app_password") {
      console.log("Email skipped — Gmail not configured");
      console.log("Would send to:", to);
      console.log("Subject:", subject);
      return true;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: '"MyRahbar" <' + user + ">",
      to,
      subject,
      html,
    });

    console.log("Email sent to", to);
    return true;
  } catch (err) {
    console.error("Email failed:", err.message);
    return false;
  }
};

module.exports = sendEmail;
