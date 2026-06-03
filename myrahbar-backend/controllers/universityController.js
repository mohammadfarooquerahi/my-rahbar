const University = require("../models/University");
const Review = require("../models/Review");

// GET /api/universities
const getAll = async (req, res) => {
  const { type, city, open } = req.query;

  const filter = { status: "approved" };
  if (type) filter.type = type;
  if (city) filter.city = city;
  if (open === "true") filter.admissionOpen = true;

  const universities = await University.find(filter).sort({
    overallRating: -1,
  });
  res.json({ universities });
};

// GET /api/universities/search
const search = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ universities: [] });

  const universities = await University.find({
    status: "approved",
    $or: [
      { name: { $regex: q, $options: "i" } },
      { shortName: { $regex: q, $options: "i" } },
      { "departments.name": { $regex: q, $options: "i" } },
      { "departments.category": { $regex: q, $options: "i" } },
    ],
  }).limit(20);

  res.json({ universities });
};

// GET /api/universities/:slug
const getOne = async (req, res) => {
  const university = await University.findOne({
    slug: req.params.slug,
    status: "approved",
  });

  if (!university) {
    return res.status(404).json({ message: "University not found." });
  }

  res.json({ university });
};

// POST /api/universities/:id/reviews
const addReview = async (req, res) => {
  const { rating, text, category } = req.body;

  if (!rating || !text) {
    return res
      .status(400)
      .json({ message: "Rating and review text are required." });
  }

  const review = await Review.create({
    universityId: req.params.id,
    userId: req.user._id,
    rating,
    text,
    category: category || "overall",
  });

  res.status(201).json({ review, message: "Review submitted for approval." });
};

// POST /api/universities/:id/charges (hidden charges)
const addCharge = async (req, res) => {
  const { label, amount, comment } = req.body;

  const university = await University.findById(req.params.id);
  if (!university) {
    return res.status(404).json({ message: "University not found." });
  }

  // Add to first department as example â€” in production handle separately
  res.json({
    message: "Hidden charge submitted. Thank you for helping students!",
  });
};

// GET /api/universities/:id/reviews
const getReviewsByUniversity = async (req, res) => {
  const reviews = await Review.find({ 
    universityId: req.params.id, 
    status: "approved" 
  })
    .sort({ createdAt: -1 })
    .populate("userId", "name profileImage");
  
  res.json({ reviews });
};

module.exports = { getAll, search, getOne, addReview, addCharge, getReviewsByUniversity };
