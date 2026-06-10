const express = require("express");
const router = express.Router();
const { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, seedBlogs } = require("../controllers/blogController");
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
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// Public routes
router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);

// Admin only routes
router.post("/seed", protect, adminOnly, seedBlogs);
router.post("/", protect, adminOnly, upload.single("featuredImage"), createBlog);
router.put("/:id", protect, adminOnly, upload.single("featuredImage"), updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);

module.exports = router;
