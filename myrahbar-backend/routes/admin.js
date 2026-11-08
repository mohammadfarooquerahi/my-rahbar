const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const University = require("../models/University");
const {
  getAllUnis,
  approveUni,
  rejectUni,
  getAllReviews,
  approveReview,
  rejectReview,
  getAllBookings,
  getAllUsers,
  getDashboardStats,
  getErrorLogs,
  uploadExcelFile,
  previewExcelFile,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");
const { uploadExcel } = require("../config/multer");

router.use(protect);
router.use(adminOnly);

// Dashboard & Logs
router.get("/dashboard", getDashboardStats);
router.get("/error-logs", getErrorLogs);

// Excel Upload & Preview
router.post("/preview-excel", uploadExcel.single("file"), previewExcelFile);
router.post("/upload-excel", uploadExcel.single("file"), uploadExcelFile);

// Universities
router.get("/universities", getAllUnis);
router.post("/universities", async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.name || !body.name.trim()) {
      return res.status(400).json({ message: "University name is required." });
    }
    if (!body.slug || !body.slug.trim()) {
      body.slug = slugify(body.name, { lower: true, strict: true });
    } else {
      body.slug = slugify(body.slug, { lower: true, strict: true });
    }
    if (!body.shortName || !body.shortName.trim()) {
      body.shortName = body.name.split(" ").map(w => w[0]).join("").toUpperCase() || "UNK";
    }
    body.type = (body.type || "government").toLowerCase();
    if (!["government", "private"].includes(body.type)) {
      body.type = "government";
    }

    // Ensure unique slug
    let candidateSlug = body.slug;
    const existing = await University.findOne({ slug: candidateSlug });
    if (existing) {
      candidateSlug = `${candidateSlug}-${Date.now().toString().slice(-4)}`;
      body.slug = candidateSlug;
    }

    const uni = await University.create(body);
    res.status(201).json({ university: uni });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put("/universities/:id", async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.type) {
      body.type = body.type.toLowerCase();
      if (!["government", "private"].includes(body.type)) {
        body.type = "government";
      }
    }
    if (body.slug) {
      body.slug = slugify(body.slug, { lower: true, strict: true });
    }
    const uni = await University.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!uni) return res.status(404).json({ message: "University not found." });
    res.json({ university: uni });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put("/universities/:id/approve", approveUni);
router.put("/universities/:id/reject", rejectUni);
router.delete("/universities/:id", async (req, res) => {
  await University.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Reviews
router.get("/reviews", getAllReviews);
router.put("/reviews/:id/approve", approveReview);
router.put("/reviews/:id/reject", rejectReview);

// Bookings and users
router.get("/bookings", getAllBookings);
router.get("/users", getAllUsers);
router.get("/contact-messages", async (req, res) => { try { const ContactMessage = require("../models/ContactMessage"); const messages = await ContactMessage.find().sort({ createdAt: -1 }); res.json({ success: true, count: messages.length, messages }); } catch (err) { res.status(500).json({ error: err.message }); } });

module.exports = router;
