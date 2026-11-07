const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const User = require("../models/User");

// GET /api/watchlist
router.get("/", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ watchlist: user.watchlist || [] });
});

// POST /api/watchlist
router.post("/", protect, async (req, res) => {
  const { universityId } = req.body;
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { watchlist: universityId },
  });
  res.json({ message: "Added to watchlist." });
});

// DELETE /api/watchlist/:id
router.delete("/:id", protect, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { watchlist: req.params.id },
  });
  res.json({ message: "Removed from watchlist." });
});

module.exports = router;
