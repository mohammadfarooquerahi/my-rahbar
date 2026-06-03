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

router.get("/", getAll);
router.get("/search", search);
router.get("/:slug", getOne);
router.get("/:id/reviews", getReviewsByUniversity);
router.post("/:id/reviews", protect, addReview);
router.post("/:id/charges", protect, addCharge);

module.exports = router;
