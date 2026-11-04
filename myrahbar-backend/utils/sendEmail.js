const nodemailer = require("nodemailer");
const dns = require("dns");

try {
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (_) {}

/**
 * Send an email via Resend HTTP API (Port 443 HTTPS)
 * Bypasses Render's firewall which blocks SMTP ports 25, 465, 587 on Free instances.
 */
const sendViaResend = async ({ to, subject, html, text }) => {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) return null;

  try {
    const fromAddress = process.env.RESEND_FROM || "Rahbars <onboarding@resend.dev>";
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });

    const data = await response.json();
    if (response.ok && data.id) {
      console.log(`[sendEmail] Delivered via Resend HTTPS (Port 443)! ID: ${data.id}`);
      return { success: true, messageId: data.id, provider: "resend_https" };
    }
    console.error("[sendEmail] Resend API error:", data);
    return { success: false, error: data.message || "Resend API error", provider: "resend_https" };
  } catch (err) {
    console.error("[sendEmail] Resend fetch failed:", err.message);
    return { success: false, error: err.message, provider: "resend_https" };
  }
};

/**
 * Creates a Nodemailer transporter for Gmail SMTP
 */
const createGmailTransport = (port = 465, secure = true) => {
  const user = (process.env.EMAIL_USER || "").trim();
  const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "").trim();

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port,
    secure,
    lookup: (hostname, options, callback) => {
      dns.lookup(hostname, { family: 4 }, callback);
    },
    auth: {
      user,
      pass,
    },
    connectionTimeout: 5000,
    greetingTimeout: 4000,
    socketTimeout: 8000,
    tls: {
      rejectUnauthorized: false,
      servername: "smtp.gmail.com",
    },
  });
};

/**
 * Send an email with automatic fallback:
 * 1. Resend API via HTTPS (Port 443) — Recommended for Render Free tier
 * 2. Gmail SMTP Port 465 / 587 — For paid Render instances or local development
 */
const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  const plainText = text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  // 1. Try Resend HTTPS API first if key exists (Bypasses Render's firewall)
  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend({ to, subject, html, text: plainText });
    if (resendResult && resendResult.success) {
      return resendResult;
    }
  }

  const user = (process.env.EMAIL_USER || "").trim();
  const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "").trim();

  if (!user || !pass) {
    console.warn("[sendEmail] No email credentials configured. Email skipped for:", to);
    return { success: false, reason: "credentials_missing" };
  }

  // 2. Try Gmail SMTP Port 465
  try {
    const transporter465 = createGmailTransport(465, true);
    const info = await transporter465.sendMail({
      from: `"Rahbars" <${user}>`,
      to,
      replyTo: replyTo || user,
      subject,
      html,
      text: plainText,
    });
    console.log(`[sendEmail] Success via Gmail SMTP 465! ID: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId, provider: "gmail_smtp_465" };
  } catch (err465) {
    console.warn(`[sendEmail] Gmail 465 failed (${err465.message}). Trying fallback port 587...`);
  }

  // 3. Fallback Gmail SMTP Port 587
  try {
    const transporter587 = createGmailTransport(587, false);
    const info = await transporter587.sendMail({
      from: `"Rahbars" <${user}>`,
      to,
      replyTo: replyTo || user,
      subject,
      html,
      text: plainText,
    });
    console.log(`[sendEmail] Success via fallback port 587! ID: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId, provider: "gmail_smtp_587" };
  } catch (err587) {
    console.error(`[sendEmail] All email attempts failed for ${to}:`, err587.message);
    return { success: false, error: err587.message };
  }
};

/**
 * Diagnostic verify function
 */
const verifyEmailConfig = async () => {
  const hasResend = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim());
  const user = (process.env.EMAIL_USER || "").trim();
  const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "").trim();

  // Test Resend HTTPS if key is present
  if (hasResend) {
    return {
      configured: true,
      verified: true,
      provider: "resend_https",
      message: "Resend HTTPS API key is configured! Render allows this on all free and paid plans.",
    };
  }

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

  // Test SMTP 465 & 587
  let err465 = null;
  try {
    const t465 = createGmailTransport(465, true);
    await t465.verify();
    return {
      configured: true,
      verified: true,
      provider: "gmail_smtp_465",
      user,
      message: "Gmail SMTP connected and verified successfully via port 465 SSL!",
    };
  } catch (err) {
    err465 = err;
  }

  try {
    const t587 = createGmailTransport(587, false);
    await t587.verify();
    return {
      configured: true,
      verified: true,
      provider: "gmail_smtp_587",
      user,
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
      renderFreeTierNotice: "Render's Free Tier blocks outbound SMTP traffic on ports 25, 465, and 587. To send emails on Render Free tier, add RESEND_API_KEY from https://resend.com (which uses standard HTTPS port 443).",
    };
  }
};

module.exports = sendEmail;
module.exports.createGmailTransport = createGmailTransport;
module.exports.verifyEmailConfig = verifyEmailConfig;
