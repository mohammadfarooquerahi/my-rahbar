const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect, adminOnly } = require("../middleware/auth");
const {
  getPublicHeroStudents,
  getAdminHeroStudents,
  createHeroStudent,
  updateHeroStudent,
  deleteHeroStudent,
  resetDefaultHeroStudents,
} = require("../controllers/heroStudentController");

// Ensure uploads/hero directory exists
const uploadDir = path.join(__dirname, "../uploads/hero");
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    console.error("[Multer] Failed to create uploadDir:", e.message);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) {}
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".png";
    cb(null, `hero-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    if (allowed.test(file.mimetype) || allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png, webp, gif) are allowed."), false);
    }
  },
});

// Middleware to safely catch and format multer errors as JSON
const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
};

// Public route to get hero students
router.get("/", getPublicHeroStudents);

// Admin-only routes
router.get("/admin/all", protect, adminOnly, getAdminHeroStudents);
router.post("/admin", protect, adminOnly, handleUpload, createHeroStudent);
router.put("/admin/:id", protect, adminOnly, handleUpload, updateHeroStudent);
router.delete("/admin/:id", protect, adminOnly, deleteHeroStudent);
router.post("/admin/reset", protect, adminOnly, resetDefaultHeroStudents);

module.exports = router;
