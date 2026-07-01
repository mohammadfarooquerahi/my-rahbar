const University = require("../models/University");
const Review = require("../models/Review");

// VULN-05 FIX: Escape regex special chars to prevent ReDoS + NoSQL injection
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 100);


// ─── Helper: auto-compute admissionOpen from deadlines ───────────────────────
const enrichAdmissionStatus = (uni) => {
  const uniObj = uni.toObject ? uni.toObject() : { ...uni };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlines = uniObj.admissionDeadlines || [];

  if (deadlines.length === 0) {
    // No per-degree deadlines — keep admissionOpen as stored by admin
    return uniObj;
  }

  // Find deadlines that are today or in the future
  const activeDeadlines = deadlines.filter((dl) => {
    if (!dl.deadline) return false;
    const d = new Date(dl.deadline);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  });

  // Auto-set admissionOpen based on upcoming deadlines
  uniObj.admissionOpen = activeDeadlines.length > 0;
  uniObj.activeDeadlines = activeDeadlines;

  return uniObj;
};

// GET /api/universities
const getAll = async (req, res) => {
  const { type, city, open, degree, dept, maxFee, maxMerit } = req.query;

  const filter = {};
  if (type) filter.type = escapeRegex(type);
  if (city) filter.city = { $regex: new RegExp(`^${escapeRegex(city)}$`, "i") };

  if (degree) {
    filter.degreeLevels = { $regex: new RegExp(`^${escapeRegex(degree)}$`, "i") };
  }

  if (dept) {
    filter["departments.name"] = { $regex: new RegExp(escapeRegex(dept), "i") };
  }

  if (maxFee) {
    filter.admissionFee = { $lte: Number(maxFee) };
  }

  if (maxMerit) {
    filter["departments.lastMerit.closingPercentage"] = { $lte: Number(maxMerit) };
  }

  const universities = await University.find(filter).sort({ overallRating: -1 });

  // Enrich each university with auto-computed admissionOpen
  const enriched = universities.map(enrichAdmissionStatus);

  // If filtering by open=true, apply AFTER enrichment
  const result = open === "true" ? enriched.filter((u) => u.admissionOpen) : enriched;

  res.json({ universities: result });
};

// GET /api/universities/search
const search = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ universities: [] });

  const universities = await University.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { shortName: { $regex: q, $options: "i" } },
      { "departments.name": { $regex: q, $options: "i" } },
      { "departments.category": { $regex: q, $options: "i" } },
    ],
  }).limit(20);

  res.json({ universities: universities.map(enrichAdmissionStatus) });
};

// GET /api/universities/:slug
const getOne = async (req, res) => {
  try {
    const university = await University.findOne({
      slug: req.params.slug.toLowerCase(),
    });

    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    // Auto-compute admissionOpen from deadlines
    res.json({ university: enrichAdmissionStatus(university) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/universities/:id/reviews
const addReview = async (req, res) => {
  try {
    const { rating, text, category } = req.body;

    if (!rating || !text) {
      return res.status(400).json({ message: "Rating and review text are required." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    if (text.trim().length < 10) {
      return res.status(400).json({ message: "Review must be at least 10 characters." });
    }

    // Check if user already reviewed this university
    const existing = await Review.findOne({
      universityId: req.params.id,
      userId: req.user._id,
    });
    if (existing) {
      return res.status(400).json({ message: "You have already submitted a review for this university." });
    }

    const review = await Review.create({
      universityId: req.params.id,
      userId: req.user._id,
      rating: Number(rating),
      text: text.trim(),
      category: category || "overall",
    });

    res.status(201).json({ review, message: "Review submitted! It will appear after admin approval." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to submit review." });
  }
};

// POST /api/universities/:id/charges (hidden charges)
const addCharge = async (req, res) => {
  const { label, amount, comment } = req.body;

  const university = await University.findById(req.params.id);
  if (!university) {
    return res.status(404).json({ message: "University not found." });
  }

  // Add to first department as example — in production handle separately
  res.json({
    message: "Hidden charge submitted. Thank you for helping students!",
  });
};

// GET /api/universities/:id/reviews
const getReviewsByUniversity = async (req, res) => {
  try {
    const reviews = await Review.find({
      universityId: req.params.id,
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .populate("userId", "name profileImage");

    // Calculate average rating and category breakdown
    const total = reviews.length;
    const avgRating = total > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : 0;

    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => { if (breakdown[r.rating] !== undefined) breakdown[r.rating]++; });

    res.json({ reviews, total, avgRating: Number(avgRating), breakdown });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch reviews." });
  }
};

module.exports = {
  getAll,
  search,
  getOne,
  addReview,
  addCharge,
  getReviewsByUniversity,
};
