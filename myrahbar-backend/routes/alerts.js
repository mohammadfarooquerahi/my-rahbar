const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Alert = require("../models/Alert");
const University = require("../models/University");
const { protect } = require("../middleware/auth");
const { checkAndSendAlerts, sendDeadlineAlert } = require("../utils/alertCron");
const sendWhatsApp = require("../utils/sendWhatsApp");
const sendEmail = require("../utils/sendEmail");

// POST /api/alerts — create an alert
router.post("/", protect, async (req, res) => {
  const { universityId, universityName, deadline, degreeLevel, whatsapp, email } = req.body;

  if (!universityId) {
    return res.status(400).json({ message: "University ID is required." });
  }

  let finalUniId = universityId;
  let finalUniName = universityName;

  // If universityId is not a valid ObjectId (e.g. slug like 'neduet-karachi'), look up by slug
  if (!mongoose.Types.ObjectId.isValid(universityId)) {
    const uni = await University.findOne({ slug: universityId.toString().toLowerCase().trim() }).select("_id name");
    if (uni) {
      finalUniId = uni._id;
      if (!finalUniName) finalUniName = uni.name;
    } else {
      return res.status(400).json({ message: "Invalid University ID or slug." });
    }
  }

  const userPhone = whatsapp || req.user.whatsapp || "";
  const userEmail = email || req.user.email || "";

  // Check if active alert already exists for this user + university
  const exists = await Alert.findOne({
    userId: req.user._id,
    universityId: finalUniId,
    isActive: true,
  });

  if (exists) {
    return res.status(400).json({ message: "Alert already active for this university." });
  }

  const alert = await Alert.create({
    userId: req.user._id,
    universityId: finalUniId,
    universityName: finalUniName,
    deadline: deadline || null,
    degreeLevel: degreeLevel || "All",
    whatsapp: userPhone,
    email: userEmail,
  });

  // Optional: Send instant confirmation WhatsApp
  if (userPhone) {
    const confirmMsg = `✅ *Rahbars Alert Activated!*\n\nYou have set an admission deadline reminder for *${finalUniName || "University"}*.\n\nWe will automatically notify you 7 days and 1 day before the deadline so you never miss applying!\n\n👉 https://www.rahbars.com`;
    sendWhatsApp(userPhone, confirmMsg).catch((err) => console.error("Confirm WA error:", err.message));
  }

  res.status(201).json({
    alert,
    message: "Alert created successfully! You will receive WhatsApp & Email reminders before the deadline.",
  });
});

// GET /api/alerts — get user's active alerts
router.get("/", protect, async (req, res) => {
  const alerts = await Alert.find({
    userId: req.user._id,
    isActive: true,
  }).populate("universityId", "name shortName admissionDeadline slug");

  res.json({ alerts });
});

// DELETE /api/alerts/:id — remove alert
router.delete("/:id", protect, async (req, res) => {
  await Alert.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isActive: false },
  );
  res.json({ message: "Alert removed successfully." });
});

/**
 * Trigger deadline check manually or via external cron service (cron-job.org).
 * Can be triggered via GET or POST.
 * Protected by CRON_SECRET or Admin user token.
 */
const handleTriggerCheck = async (req, res) => {
  const providedSecret = req.query.secret || req.headers["x-cron-secret"] || req.body?.secret;
  const cronSecret = process.env.CRON_SECRET || "rahbars-deadline-cron-key-2026";

  if (providedSecret !== cronSecret && req.user?.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized. Provide valid secret or admin token." });
  }

  const result = await checkAndSendAlerts();
  res.json(result);
};

router.get("/trigger", handleTriggerCheck);
router.post("/trigger", handleTriggerCheck);

/**
 * Direct Test: Send an instant test alert to verify WhatsApp and Email configuration.
 * POST /api/alerts/test-direct
 */
router.post("/test-direct", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can send direct test alerts." });
  }

  const { phone, email } = req.body;
  const targetPhone = phone || req.user.whatsapp || "03190211218";
  const targetEmail = email || req.user.email;

  const results = { whatsapp: null, email: null };

  if (targetPhone) {
    const testMsg = `🔔 *Rahbars Alert System Test*\n\nAssalam-o-Alaikum! Your WhatsApp deadline alert system is working properly.\n\nDate: ${new Date().toLocaleDateString("en-PK")}\nPlatform: https://www.rahbars.com`;
    results.whatsapp = await sendWhatsApp(targetPhone, testMsg);
  }

  if (targetEmail) {
    results.email = await sendEmail({
      to: targetEmail,
      subject: "🔔 Rahbars Alert System Test — Email Verified",
      html: `<h2>Rahbars Alert System Test</h2><p>Assalam-o-Alaikum! Your Email notification system is fully operational.</p><p><a href="https://www.rahbars.com">Visit Rahbars</a></p>`,
    });
  }

  res.json({
    message: "Test alerts dispatched!",
    results,
  });
});

// GET /api/alerts/send-test?to=farooqrahi828@gmail.com - Instant public test endpoint
router.get("/send-test", async (req, res) => {
  try {
    const targetEmail = req.query.to || "farooqrahi828@gmail.com";
    const daysLeft = parseInt(req.query.days || "7", 10);
    const result = await sendDeadlineAlert(
      {
        universityName: req.query.uni || "NED University of Engineering & Technology",
        degreeLevel: "BS Computer Science",
        email: targetEmail,
        whatsapp: req.query.phone || "",
      },
      daysLeft
    );
    res.json({
      success: true,
      message: `Test deadline reminder email dispatched to ${targetEmail}!`,
      result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
