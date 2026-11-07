const express = require("express");
const router = express.Router();
const {
  getActiveNews,
  getAllNewsAdmin,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");
const { protect, adminOnly } = require("../middleware/auth");

// Public — active + non-expired items only
router.get("/", getActiveNews);

// Admin — all items (active, inactive, expired)
router.get("/admin", protect, adminOnly, getAllNewsAdmin);

// Admin CRUD
router.post("/", protect, adminOnly, createNews);
router.put("/:id", protect, adminOnly, updateNews);
router.delete("/:id", protect, adminOnly, deleteNews);

module.exports = router;
