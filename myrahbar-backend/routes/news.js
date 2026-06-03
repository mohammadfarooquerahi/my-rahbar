const express = require("express");
const router = express.Router();
const { getActiveNews, createNews, updateNews, deleteNews } = require("../controllers/newsController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getActiveNews);

// Admin routes
router.post("/", protect, adminOnly, createNews);
router.put("/:id", protect, adminOnly, updateNews);
router.delete("/:id", protect, adminOnly, deleteNews);

module.exports = router;
