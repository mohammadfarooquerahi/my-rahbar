const nodemailer = require("nodemailer");

/**
 * Creates and returns a configured Nodemailer transporter using Gmail SSL (port 465).
 * Explicitly sanitizes credentials (stripping whitespace from App Passwords)
 * and sets aggressive socket timeouts to prevent cloud hanging.
 */
const getTransporter = () => {
  const user = (process.env.EMAIL_USER || "").trim();
  // Google App Passwords are 16 letters, often copied with spaces e.g. "abcd efgh ijkl mnop"
  const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "").trim();

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Direct SSL
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000, // 10s max to establish TCP connection
    greetingTimeout: 5000,    // 5s max for SMTP greeting
    socketTimeout: 15000,     // 15s max for data transfer
    tls: {
      rejectUnauthorized: false, // Prevents self-signed or proxy TLS errors on cloud hosts
    },
  });
};

/**
 * Send an email using Nodemailer
 * @param {Object} options { to, subject, html, text, replyTo }
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  const user = (process.env.EMAIL_USER || "").trim();
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("[sendEmail] EMAIL_USER or EMAIL_PASS is not configured on the server. Email skipped for:", to);
    return { success: false, reason: "credentials_missing" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Rahbars" <${user}>`,
      to,
      replyTo: replyTo || user,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    });

    console.log(`[sendEmail] Success! Message sent to ${to} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[sendEmail] Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Diagnostic verify function to test SMTP credentials directly.
 */
const verifyEmailConfig = async () => {
  const user = (process.env.EMAIL_USER || "").trim();
  const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "").trim();

  if (!user || !pass) {
    return {
      configured: false,
      user: user || null,
      passLength: pass.length,
      message: "EMAIL_USER or EMAIL_PASS environment variables are missing on Render.",
    };
  }

  try {
    const transporter = getTransporter();
    await transporter.verify();
    return {
      configured: true,
      verified: true,
      user,
      message: "Gmail SMTP connected and verified successfully!",
    };
  } catch (err) {
    return {
      configured: true,
      verified: false,
      user,
      error: err.message,
      tip: "Ensure 2-Step Verification is ON in Google Account and use a 16-character App Password (not your normal Gmail login password).",
    };
  }
};

module.exports = sendEmail;
module.exports.getTransporter = getTransporter;
module.exports.verifyEmailConfig = verifyEmailConfig;
