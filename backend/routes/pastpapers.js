const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getPastPapers,
  uploadPastPaper,
  deletePastPaper,
  trackDownload,
} = require("../controllers/pastPaperController");
const { protect, adminOnly } = require("../middleware/auth");

// Save files to disk in uploads/pastpapers/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/pastpapers/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = "paper-" + Date.now() + ext;
    cb(null, name);
  },
});

// Only allow PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

// Public routes
router.get("/", getPastPapers);
router.post("/:id/download", trackDownload);

// Admin routes
router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("file"),
  uploadPastPaper,
);
router.delete("/:id", protect, adminOnly, deletePastPaper);

module.exports = router;
