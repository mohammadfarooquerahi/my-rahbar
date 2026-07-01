const University = require("../models/University");
const Review = require("../models/Review");
const Booking = require("../models/ConsultingBooking");
const User = require("../models/User");
const ErrorLog = require("../models/ErrorLog");
const xlsx = require("xlsx");
const fs = require("fs");
const slugify = require("slugify");

const getAllUnis = async (req, res) => {
  const universities = await University.find({}).sort({ createdAt: -1 });
  res.json({ universities });
};

const approveUni = async (req, res) => {
  const uni = await University.findByIdAndUpdate(
    req.params.id, { status: "approved", approvedBy: req.user._id }, { new: true }
  );
  if (!uni) return res.status(404).json({ message: "University not found." });
  res.json({ university: uni, message: "University approved and is now live." });
};

const rejectUni = async (req, res) => {
  const uni = await University.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
  if (!uni) return res.status(404).json({ message: "University not found." });
  res.json({ university: uni, message: "University rejected." });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).sort({ createdAt: -1 })
    .populate("userId", "name email").populate("universityId", "name shortName");
  res.json({ reviews });
};

const approveReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
  if (!review) return res.status(404).json({ message: "Review not found." });
  const allApproved = await Review.find({ universityId: review.universityId, status: "approved" });
  if (allApproved.length > 0) {
    const avg = allApproved.reduce((sum, r) => sum + r.rating, 0) / allApproved.length;
    await University.findByIdAndUpdate(review.universityId, {
      overallRating: Math.round(avg * 10) / 10, reviewCount: allApproved.length,
    });
  }
  res.json({ review, message: "Review approved." });
};

const rejectReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
  if (!review) return res.status(404).json({ message: "Review not found." });
  res.json({ review, message: "Review rejected." });
};

const getAllBookings = async (req, res) => {
  const bookings = await Booking.find({}).sort({ createdAt: -1 });
  res.json({ bookings });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.json({ users });
};

const getDashboardStats = async (req, res) => {
  const [totalUsers, totalReviews, totalBookings, totalErrors] = await Promise.all([
    User.countDocuments(), Review.countDocuments(), Booking.countDocuments(), ErrorLog.countDocuments()
  ]);
  res.json({ totalUsers, totalReviews, totalBookings, totalErrors });
};

const getErrorLogs = async (req, res) => {
  const logs = await ErrorLog.find().sort({ createdAt: -1 }).limit(50);
  res.json(logs);
};

// ─── EXCEL HELPERS ───────────────────────────────────────────────────────────
const parseExcelRow = (row) => {
  const name = row["University Name"] || row["name"] || "";
  if (!name.trim()) return null;
  const slug = slugify(name, { lower: true, strict: true });

  // Departments format: "CS,60,50000,78.5 | Math,40,35000,71.2"
  let departments = [];
  const deptStr = row["Departments"] || row["departments"] || "";
  if (deptStr) {
    departments = deptStr.split("|").map(d => {
      const parts = d.trim().split(",").map(p => p.trim());
      return {
        name: parts[0] || "Unknown",
        category: parts[0] || "General",
        degreeLevel: parts[4] || "BS",
        seats: { merit: Number(parts[1]) || 0, selfFinance: 0 },
        semesterFee: Number(parts[2]) || 0,
        lastMerit: parts[3] ? [{ year: 2024, closing: Number(parts[3]) }] : [],
      };
    }).filter(d => d.name);
  }

  const docsStr = row["Required Documents"] || row["requiredDocuments"] || "";
  const requiredDocuments = docsStr ? docsStr.split(",").map(d => d.trim()).filter(Boolean) : [];
  const schStr = row["Scholarships"] || row["scholarships"] || "";

  // Auto-compute admissionOpen: if deadline is provided and in the future -> open
  const deadlineStr = row["Admission Deadline"] || row["admissionDeadline"] || row["Deadline"] || "";
  let admissionOpen = false;
  let admissionDeadline = undefined;
  if (deadlineStr) {
    const d = new Date(deadlineStr);
    if (!isNaN(d.getTime())) {
      admissionDeadline = d;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      d.setHours(0, 0, 0, 0);
      admissionOpen = d >= today;
    }
  } else {
    // If no deadline column, fall back to explicit Yes/No column
    admissionOpen = String(row["Admission Open"] || row["admissionOpen"] || "").toLowerCase() === "yes";
  }

  return {
    name: name.trim(),
    slug,
    shortName: (row["Short Name"] || row["shortName"] || name.substring(0, 20)).trim(),
    type: (row["Type"] || row["type"] || "government").toLowerCase() === "private" ? "private" : "government",
    city: (row["City"] || row["city"] || "Karachi").trim(),
    website: (row["Website"] || row["website"] || "").trim(),
    established: Number(row["Established"] || row["established"]) || undefined,
    description: (row["Description"] || row["description"] || "").trim(),
    admissionOpen,
    admissionDeadline,
    admissionFee: Number(row["Admission Fee"] || row["admissionFee"]) || 0,
    testRequired: (row["Test Required"] || row["testRequired"] || "Own Entry Test").trim(),
    admissionTestType: (row["Test Type"] || row["admissionTestType"] || "Own Test").trim(),
    aggregateFormula: {
      matric: Number(row["Matric %"] || row["matric"] || 10) / 100,
      fsc: Number(row["FSc %"] || row["fsc"] || 40) / 100,
      test: Number(row["Test %"] || row["test"] || 50) / 100,
    },
    hostelAvailable: String(row["Hostel"] || row["hostelAvailable"] || "").toLowerCase() === "yes",
    hostelFee: Number(row["Hostel Fee"] || row["hostelFee"]) || null,
    scholarships: schStr ? schStr.split(",").map(s => s.trim()).filter(Boolean) : [],
    requiredDocuments,
    departments,
    status: "pending",
  };
};

// POST /api/admin/preview-excel — parse and return preview without saving
const previewExcelFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  try {
    const workbook = xlsx.readFile(req.file.path);
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    fs.unlinkSync(req.file.path);

    const parsed = data.map(parseExcelRow).filter(Boolean);
    const slugs = parsed.map(u => u.slug);
    const existing = await University.find({ slug: { $in: slugs } }).select("slug name");
    const existingSlugs = new Set(existing.map(e => e.slug));
    const preview = parsed.map(u => ({ ...u, isDuplicate: existingSlugs.has(u.slug) }));
    res.json({ preview, total: preview.length, duplicates: existing.length });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Error parsing: " + err.message });
  }
};

// POST /api/admin/upload-excel — save to DB
const uploadExcelFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  try {
    const workbook = xlsx.readFile(req.file.path);
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    fs.unlinkSync(req.file.path);

    const parsed = data.map(parseExcelRow).filter(Boolean);
    let imported = 0, updated = 0;
    const results = [];

    for (const uniData of parsed) {
      const existing = await University.findOne({ slug: uniData.slug });
      if (existing) {
        await University.findByIdAndUpdate(existing._id, { $set: uniData });
        updated++;
        results.push({ name: uniData.name, status: "updated" });
      } else {
        await University.create(uniData);
        imported++;
        results.push({ name: uniData.name, status: "imported" });
      }
    }

    res.json({ message: `Done! Imported: ${imported}, Updated: ${updated}`, imported, updated, results });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Error: " + err.message });
  }
};

module.exports = {
  getAllUnis, approveUni, rejectUni,
  getAllReviews, approveReview, rejectReview,
  getAllBookings, getAllUsers,
  getDashboardStats, getErrorLogs,
  uploadExcelFile, previewExcelFile,
};
