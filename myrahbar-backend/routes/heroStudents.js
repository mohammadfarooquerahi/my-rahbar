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
const uploadDir = "uploads/hero/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `hero-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowed.test(file.mimetype) && allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png, webp, gif) are allowed."), false);
    }
  },
});

// Public route to get hero students
router.get("/", getPublicHeroStudents);

// Admin-only routes
router.get("/admin/all", protect, adminOnly, getAdminHeroStudents);
router.post("/admin", protect, adminOnly, upload.single("image"), createHeroStudent);
router.put("/admin/:id", protect, adminOnly, upload.single("image"), updateHeroStudent);
router.delete("/admin/:id", protect, adminOnly, deleteHeroStudent);
router.post("/admin/reset", protect, adminOnly, resetDefaultHeroStudents);

module.exports = router;
