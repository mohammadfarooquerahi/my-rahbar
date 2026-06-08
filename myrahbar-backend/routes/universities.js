const express = require("express");
const router = express.Router();
const University = require("../models/University");
const {
  getAll,
  search,
  getOne,
  addReview,
  addCharge,
  getReviewsByUniversity,
} = require("../controllers/universityController");
const { protect } = require("../middleware/auth");

// Clean and explicit routes
router.get("/", getAll);
router.get("/search", search);

// Create university (from AI collector or admin)
router.post("/", protect, async (req, res) => {
  try {
    const uni = await University.create(req.body);
    res.status(201).json(uni);
  } catch (err) {
    console.error("Create university error:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: "A university with this slug already exists." });
    }
    res.status(400).json({ message: err.message });
  }
});

router.get("/:slug", getOne);
router.get("/:id/reviews", getReviewsByUniversity);
router.post("/:id/reviews", protect, addReview);
router.post("/:id/charges", protect, addCharge);

module.exports = router;

