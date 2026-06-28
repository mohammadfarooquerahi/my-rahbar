const express = require("express");
const router = express.Router();
const { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, seedBlogs, getTrendingTopics, aiGenerateBlog, approveBlog, rejectBlog } = require("../controllers/blogController");
const { protect, adminOnly } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads/blogs directory exists
const uploadDir = "uploads/blogs/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `blog-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  // VULN-14 FIX: Whitelist only safe image types to prevent malicious file uploads
  fileFilter: (req, file, cb) => {
    const allowedMimes = /jpeg|jpg|png|gif|webp/;
    const mimeOk = allowedMimes.test(file.mimetype);
    const extOk = allowedMimes.test(path.extname(file.originalname).toLowerCase().slice(1));
    if (mimeOk && extOk) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed."), false);
    }
  },
});

// Public routes — optionalAuth reads the token if present (for admin status filter)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  // Reuse protect logic but don't block if no token
  protect(req, res, () => next());
};

router.get("/trending-topics", protect, adminOnly, getTrendingTopics);
router.get("/", optionalAuth, getBlogs);
router.get("/:slug", getBlogBySlug);

// Admin only routes
router.post("/seed", protect, adminOnly, seedBlogs);
router.post("/ai-generate", protect, adminOnly, aiGenerateBlog);
router.post("/", protect, adminOnly, upload.single("featuredImage"), createBlog);
router.put("/:id/approve", protect, adminOnly, approveBlog);
router.put("/:id/reject", protect, adminOnly, rejectBlog);
router.put("/:id", protect, adminOnly, upload.single("featuredImage"), updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);

module.exports = router;

