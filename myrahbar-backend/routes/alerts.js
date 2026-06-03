const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const { protect } = require("../middleware/auth");

// POST /api/alerts â€” create alert
router.post("/", protect, async (req, res) => {
  const { universityId, universityName, deadline } = req.body;

  if (!universityId) {
    return res.status(400).json({ message: "University ID is required." });
  }

  // Check if alert already exists for this user + university
  const exists = await Alert.findOne({
    userId: req.user._id,
    universityId: universityId,
    isActive: true,
  });

  if (exists) {
    return res
      .status(400)
      .json({ message: "Alert already set for this university." });
  }

  const alert = await Alert.create({
    userId: req.user._id,
    universityId,
    universityName,
    deadline: deadline || null,
    whatsapp: req.user.whatsapp,
    email: req.user.email,
  });

  res
    .status(201)
    .json({
      alert,
      message: "Alert created. You will be notified before the deadline.",
    });
});

// GET /api/alerts â€” get my alerts
router.get("/", protect, async (req, res) => {
  const alerts = await Alert.find({
    userId: req.user._id,
    isActive: true,
  }).populate("universityId", "name shortName admissionDeadline");

  res.json({ alerts });
});

// DELETE /api/alerts/:id â€” remove alert
router.delete("/:id", protect, async (req, res) => {
  await Alert.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isActive: false },
  );
  res.json({ message: "Alert removed." });
});

module.exports = router;
