const University = require("../models/University");
const Review = require("../models/Review");
const Booking = require("../models/ConsultingBooking");
const User = require("../models/User");
const ErrorLog = require("../models/ErrorLog");
const xlsx = require("xlsx");
const fs = require("fs");

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

// GET Dashboard Stats
const getDashboardStats = async (req, res) => {
  const [totalUsers, totalReviews, totalBookings, totalErrors] = await Promise.all([
    User.countDocuments(),
    Review.countDocuments(),
    Booking.countDocuments(),
    ErrorLog.countDocuments()
  ]);

  res.json({
    totalUsers,
    totalReviews,
    totalBookings,
    totalErrors
  });
};

// GET Error Logs
const getErrorLogs = async (req, res) => {
  const logs = await ErrorLog.find().sort({ createdAt: -1 }).limit(50);
  res.json(logs);
};

// POST Upload Excel
const uploadExcelFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let count = 0;
    for (const row of data) {
      if (!row.name || !row.slug) continue;
      
      const uniData = {
        name: row.name,
        slug: row.slug.toLowerCase(),
        shortName: row.shortName || "",
        city: row.city || "Karachi",
        type: row.type?.toLowerCase() === "private" ? "private" : "government",
        status: "approved"
      };

      await University.findOneAndUpdate(
        { slug: uniData.slug },
        { $set: uniData },
        { upsert: true, new: true }
      );
      count++;
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ message: "Success", universitiesAdded: count });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Error processing file: " + err.message });
  }
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
  getDashboardStats,
  getErrorLogs,
  uploadExcelFile,
};
