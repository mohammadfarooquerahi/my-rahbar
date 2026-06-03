// WhatsApp message sender
// We use Twilio WhatsApp API
// Sign up free at twilio.com â€” get sandbox number for testing

const sendWhatsApp = async (to, message) => {
  try {
    // Add your Twilio credentials in .env
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM;

    // If credentials not set â€” just log for now
    if (!accountSid || !authToken || !from) {
      console.log("WhatsApp would send to " + to + ":");
      console.log(message);
      return true;
    }

    const client = require("twilio")(accountSid, authToken);

    await client.messages.create({
      from: "whatsapp:" + from,
      to: "whatsapp:" + to,
      body: message,
    });

    console.log("WhatsApp sent to " + to);
    return true;
  } catch (err) {
    console.error("WhatsApp send failed: " + err.message);
    return false;
  }
};

module.exports = sendWhatsApp;
