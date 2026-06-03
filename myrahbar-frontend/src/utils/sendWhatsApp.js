const sendWhatsApp = async (to, message) => {
  try {
    const sid = process.env.TWILIO_SID;
    const token = process.env.TWILIO_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM;

    if (!sid || !token || sid === "your_twilio_account_sid") {
      console.log("WhatsApp skipped â€” Twilio not configured");
      console.log("Would send to:", to);
      console.log("Message:", message);
      return true;
    }

    // Format number
    let number = to.replace(/\s/g, "");
    if (number.startsWith("0")) {
      number = "+92" + number.slice(1);
    }
    if (!number.startsWith("+")) {
      number = "+" + number;
    }

    const accountSid = sid;
    const authToken = token;

    const params = new URLSearchParams();
    params.append("From", "whatsapp:" + from);
    params.append("To", "whatsapp:" + number);
    params.append("Body", message);

    const https = require("https");
    const auth = Buffer.from(accountSid + ":" + authToken).toString("base64");
    const data = params.toString();

    return new Promise((resolve) => {
      const options = {
        hostname: "api.twilio.com",
        path: "/2010-04-01/Accounts/" + accountSid + "/Messages.json",
        method: "POST",
        headers: {
          Authorization: "Basic " + auth,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(data),
        },
      };

      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          const parsed = JSON.parse(body);
          if (parsed.sid) {
            console.log("WhatsApp sent to", number);
            resolve(true);
          } else {
            console.error("WhatsApp failed:", parsed.message);
            resolve(false);
          }
        });
      });

      req.on("error", (err) => {
        console.error("WhatsApp error:", err.message);
        resolve(false);
      });

      req.write(data);
      req.end();
    });
  } catch (err) {
    console.error("WhatsApp send failed:", err.message);
    return false;
  }
};

module.exports = sendWhatsApp;
