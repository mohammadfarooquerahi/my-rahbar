const University = require("../models/University");
const Review = require("../models/Review");
const Booking = require("../models/ConsultingBooking");
const User = require("../models/User");
const Blog = require("../models/Blog");
const PastPaper = require("../models/PastPaper");
const ErrorLog = require("../models/ErrorLog");
const CookieConsent = require("../models/CookieConsent");
const xlsx = require("xlsx");
const slugify = require("slugify");

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

// GET all reviews (
<truncated 3811 bytes>
ls ? row.degreeLevels.split(",").map(s => s.trim()) : [],
      };

      const existing = await University.findOne({ slug });
      if (existing) {
        await University.findByIdAndUpdate(existing._id, uniData);
        updatedCount++;
      } else {
        await University.create(uniData);
        addedCount++;
      }
    }

    res.json({ 
      message: "Excel data processed successfully.",
      added: addedCount,
      updated: updatedCount 
    });
  } catch (error) {
    console.error("Excel processing error:", error);
    res.status(500).json({ message: "Failed to process Excel file." });
  }
};

// GET error logs
const getErrorLogs = async (req, res) => {
  const logs = await ErrorLog.find({}).sort({ createdAt: -1 }).populate("userId", "name email");
  res.json(logs);
};

// Resolve error
const resolveError = async (req, res) => {
  const log = await ErrorLog.findByIdAndUpdate(
    req.params.id,
    { isResolved: true, resolvedAt: new Date(), resolvedBy: req.user._id },
    { new: true }
  );
  if (!log) return res.status(404).json({ message: "Error log not found." });
  res.json({ message: "Error resolved.", log });
};

// GET user tracking data
const getUserTracking = async (req, res) => {
  const tracking = await CookieConsent.find({}).sort({ lastActive: -1 }).populate("userId", "name email");
  res.json(tracking);
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
  uploadExcel,
  getErrorLogs,
  resolveError,
  getUserTracking,
};
