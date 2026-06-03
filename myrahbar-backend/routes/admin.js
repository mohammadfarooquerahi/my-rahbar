const express = require("express");
const router = express.Router();
const University = require("../models/University");
const {
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
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");
const { uploadExcel: uploadExcelMiddleware } = require("../config/multer");

router.use(protect);
router.use(adminOnly);

// Dashboard Stats
router.get("/dashboard", getDashboardStats);

// Universities
router.get("/universities", getAllUnis);
router.post("/upload-excel", uploadExcelMiddleware.single("file"), uploadExcel);
router.post("/universities", async (req, res) => {
  try {
    const uni = await University.create(req.body);
    res.status(201).json({ university: uni });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put("/universities/:id", async (req, res) => {
  try {
    const uni = await University.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ university: uni });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put("/universities/:id/approve", approveUni);
router.put("/universities/:id/reject", rejectUni);
router.delete("/universities/:id", async (req, res) => {
  await University.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Reviews
router.get("/reviews", getAllReviews);
router.put("/reviews/:id/approve", approveReview);
router.put("/reviews/:id/reject", rejectReview);

// Bookings and users
router.get("/bookings", getAllBookings);
router.get("/users", getAllUsers);
router.get("/user-tracking", getUserTracking);

// Error Logs
router.get("/error-logs", getErrorLogs);
router.put("/error-logs/:id/resolve", resolveError);

module.exports = router;
