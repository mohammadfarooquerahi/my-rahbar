const express = require("express");
const router = express.Router();
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
router.get("/:slug", getOne); // This controller function will handle everything cleanly now!
router.get("/:id/reviews", getReviewsByUniversity);
router.post("/:id/reviews", protect, addReview);
router.post("/:id/charges", protect, addCharge);

// ⚡ ALWAYS EXPORT AT THE VERY BOTTOM OF THE FILE
module.exports = router;
