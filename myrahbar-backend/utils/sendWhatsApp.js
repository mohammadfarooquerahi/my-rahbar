/**
 * WhatsApp message sender supporting:
 * 1. UltraMsg (Direct WhatsApp instance via QR scan) - Recommended for easy setup
 * 2. Twilio WhatsApp API (Official Twilio Sandbox or approved number)
 */

// Formats phone numbers to international Pakistani format: +923190211218
function formatPakistaniPhone(phone) {
  if (!phone) return "";
  let clean = phone.toString().replace(/[\s\-\(\)\+]/g, "").trim();
  if (clean.startsWith("92")) return "+" + clean;
  if (clean.startsWith("03")) return "+92" + clean.slice(1);
  if (clean.startsWith("3")) return "+92" + clean;
  return "+" + clean;
}

const sendViaUltraMsg = async (to, message) => {
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
  const token = process.env.ULTRAMSG_TOKEN;
  if (!instanceId || !token) return null;

  try {
    const formatted = formatPakistaniPhone(to).replace("+", "");
    const res = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        token,
        to: formatted,
        body: message,
      }),
    });
    const data = await res.json();
    if (data.sent === "true" || data.id) {
      console.log(`[sendWhatsApp] UltraMsg delivered to ${to}! ID: ${data.id}`);
      return { success: true, id: data.id, provider: "ultramsg" };
    }
    console.error("[sendWhatsApp] UltraMsg response error:", data);
    return { success: false, error: data.error || "UltraMsg error" };
  } catch (err) {
    console.error("[sendWhatsApp] UltraMsg fetch error:", err.message);
    return { success: false, error: err.message };
  }
};

const sendViaTwilio = async (to, message) => {
  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!accountSid || !authToken || !from) return null;

  try {
    const client = require("twilio")(accountSid, authToken);
    const formattedTo = formatPakistaniPhone(to);
    const formattedFrom = from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;

    const res = await client.messages.create({
      from: formattedFrom,
      to: `whatsapp:${formattedTo}`,
      body: message,
    });
    console.log(`[sendWhatsApp] Twilio delivered to ${to}! SID: ${res.sid}`);
    return { success: true, sid: res.sid, provider: "twilio" };
  } catch (err) {
    console.error("[sendWhatsApp] Twilio send failed:", err.message);
    return { success: false, error: err.message };
  }
};

const sendWhatsApp = async (to, message) => {
  if (!to) {
    console.warn("[sendWhatsApp] No phone number provided.");
    return false;
  }

  // 1. Try UltraMsg if configured
  if (process.env.ULTRAMSG_INSTANCE_ID && process.env.ULTRAMSG_TOKEN) {
    const result = await sendViaUltraMsg(to, message);
    if (result && result.success) return true;
  }

  // 2. Try Twilio if configured
  if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
    const result = await sendViaTwilio(to, message);
    if (result && result.success) return true;
  }

  // Fallback: Log to console when credentials are not yet added
  console.log(`[sendWhatsApp] SIMULATION (No WhatsApp credentials set in .env):`);
  console.log(`To: ${formatPakistaniPhone(to)}`);
  console.log(`Message: \n${message}\n`);
  return true;
};

module.exports = sendWhatsApp;
module.exports.formatPakistaniPhone = formatPakistaniPhone;
