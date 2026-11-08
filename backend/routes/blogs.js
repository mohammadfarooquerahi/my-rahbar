const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  seedBlogs,
  approveBlog,
  rejectBlog,
  getTrendingTopics,
  aiGenerateBlog,
} = require("../controllers/blogController");
const { protect, adminOnly, optionalAuth } = require("../middleware/auth");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/blogs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `blog-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images (PNG, JPG, WebP) are allowed."), false);
    }
  },
});

// Middleware for clean JSON error responses from multer
const handleUpload = (req, res, next) => {
  upload.single("featuredImage")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Failed to upload image." });
    }
    next();
  });
};

// Public routes
router.get("/", getBlogs);

// Specific admin actions (MUST be placed before :slug to prevent matching as a slug)
router.post("/seed", protect, adminOnly, seedBlogs);
router.get("/trending-topics", optionalAuth, getTrendingTopics);
router.post("/ai-generate", protect, adminOnly, aiGenerateBlog);

// Single blog by slug (Public)
router.get("/:slug", getBlogBySlug);

// Admin CRUD routes
router.post("/", protect, adminOnly, handleUpload, createBlog);
router.put("/:id/approve", protect, adminOnly, approveBlog);
router.put("/:id/reject", protect, adminOnly, rejectBlog);
router.put("/:id", protect, adminOnly, handleUpload, updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);

module.exports = router;
