const University = require("../models/University");
const Review = require("../models/Review");
const Booking = require("../models/ConsultingBooking");
const User = require("../models/User");

// GET all universities (any status)
const getAllUnis = async (req, res) => {
  const universities = await University.find({}).sort({ createdAt: -1 });
  res.json({ universities });
};

// Approve university
const approveUni = async (req, res) => {
  const uni = await University.findByIdAndUpdate(
    req.params.id,
    { status: "approved", approvedBy: req.user._id },
    { new: true },
  );
  if (!uni) return res.status(404).json({ message: "University not found." });
  res.json({
    university: uni,
    message: "University approved and is now live.",
  });
};

// Reject university
const rejectUni = async (req, res) => {
  const uni = await University.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true },
  );
  if (!uni) return res.status(404).json({ message: "University not found." });
  res.json({ university: uni, message: "University rejected." });
};

// GET all reviews (pending first)
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .populate("universityId", "name shortName");
  res.json({ reviews });
};

// Approve review
const approveReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true },
  );
  if (!review) return res.status(404).json({ message: "Review not found." });

  // Update university rating
  const allApproved = await Review.find({
    universityId: review.universityId,
    status: "approved",
  });
  if (allApproved.length > 0) {
    const avg =
      allApproved.reduce((sum, r) => sum + r.rating, 0) / allApproved.length;
    await University.findByIdAndUpdate(review.universityId, {
      overallRating: Math.round(avg * 10) / 10,
      reviewCount: allApproved.length,
    });
  }

  res.json({ review, message: "Review approved." });
};

// Reject review
const rejectReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true },
  );
  if (!review) return res.status(404).json({ message: "Review not found." });
  res.json({ review, message: "Review rejected." });
};

// GET all bookings
const getAllBookings = async (req, res) => {
  const bookings = await Booking.find({}).sort({ createdAt: -1 });
  res.json({ bookings });
};

// GET all users
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.json({ users });
};

module.exports = {
  getAllUnis,
  approveUni,
  rejectUni,
  getAllReviews,
  approveReview,
  rejectReview,
  getAllBookings,
  getAllUsers,
};
