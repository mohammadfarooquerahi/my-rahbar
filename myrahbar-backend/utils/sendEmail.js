const nodemailer = require("nodemailer");
const dns = require("dns");

// Force IPv4 lookup first on Linux/Render containers to prevent IPv6 ENETUNREACH errors
try {
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (e) {
  // Ignored if older node version
}

/**
 * Creates a Nodemailer transporter.
 */
const createGmailTransport = (port = 465, secure = true) => {
  const user = (process.env.EMAIL_USER || "").trim();
  const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "").trim();

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port,
    secure,
    family: 4, // Explicit IPv4
    auth: {
      user,
      pass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 5000,
    socketTimeout: 12000,
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send an email with automatic fallback:
 * 1. Tries port 465 SSL with IPv4
 * 2. If connection fails or times out, tries port 587 STARTTLS with IPv4
 */
const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  const user = (process.env.EMAIL_USER || "").trim();
  const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "").trim();

  if (!user || !pass) {
    console.warn("[sendEmail] EMAIL_USER or EMAIL_PASS is missing in environment variables. Skipped sending to:", to);
    return { success: false, reason: "credentials_missing" };
  }

  // Attempt 1: Port 465 (Direct SSL, IPv4)
  try {
    const transporter465 = createGmailTransport(465, true);
    const info = await transporter465.sendMail({
      from: `"Rahbars" <${user}>`,
      to,
      replyTo: replyTo || user,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    });
    console.log(`[sendEmail] Success via port 465! ID: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId, port: 465 };
  } catch (err465) {
    console.warn(`[sendEmail] Port 465 failed (${err465.message}). Trying fallback port 587...`);
  }

  // Attempt 2: Port 587 (STARTTLS, IPv4)
  try {
    const transporter587 = createGmailTransport(587, false);
    const info = await transporter587.sendMail({
      from: `"Rahbars" <${user}>`,
      to,
      replyTo: replyTo || user,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    });
    console.log(`[sendEmail] Success via fallback port 587! ID: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId, port: 587 };
  } catch (err587) {
    console.error(`[sendEmail] Both port 465 and 587 failed for ${to}:`, err587.message);
    return { success: false, error: err587.message };
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

  const passPreview = pass.length >= 4 
    ? `${pass.slice(0, 2)}••••••••${pass.slice(-2)}` 
    : "••••";

  // Test port 465
  let err465 = null;
  try {
    const t465 = createGmailTransport(465, true);
    await t465.verify();
    return {
      configured: true,
      verified: true,
      workingPort: 465,
      user,
      passLength: pass.length,
      passPreview,
      message: "Gmail SMTP connected and verified successfully via port 465 SSL!",
    };
  } catch (err) {
    err465 = err;
  }

  // Fallback test port 587
  try {
    const t587 = createGmailTransport(587, false);
    await t587.verify();
    return {
      configured: true,
      verified: true,
      workingPort: 587,
      user,
      passLength: pass.length,
      passPreview,
      message: "Gmail SMTP connected and verified successfully via fallback port 587 STARTTLS!",
    };
  } catch (err587) {
    return {
      configured: true,
      verified: false,
      user,
      passLength: pass.length,
      passPreview,
      errorPort465: err465 ? err465.message : null,
      errorPort587: err587.message,
      tip: pass.length !== 16
        ? `Your password is currently ${pass.length} characters (${passPreview}). A Google App Password is EXACTLY 16 letters (4 groups of 4: e.g. abcd efgh ijkl mnop). You appear to have missed 1 character or entered a 15-character password!`
        : "Ensure 2-Step Verification is ON in your Google Account and that you created an App Password under https://myaccount.google.com/apppasswords",
    };
  }
};

module.exports = sendEmail;
module.exports.createGmailTransport = createGmailTransport;
module.exports.verifyEmailConfig = verifyEmailConfig;
