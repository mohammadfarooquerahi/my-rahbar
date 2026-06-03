const express = require("express");
const router = express.Router();
const { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } = require("../controllers/blogController");
const { protect, adminOnly } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/blogs/",
  filename: (req, file, cb) => {
    cb(null, `blog-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);

// Admin routes
router.post("/", protect, adminOnly, upload.single("featuredImage"), createBlog);
router.put("/:id", protect, adminOnly, upload.single("featuredImage"), updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);

module.exports = router;
