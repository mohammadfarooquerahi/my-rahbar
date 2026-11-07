const PastPaper = require("../models/PastPaper");
const University = require("../models/University");
const path = require("path");
const fs = require("fs");

// GET /api/pastpapers?universityId=xxx
const getPastPapers = async (req, res) => {
  try {
    const { universityId } = req.query;
    const filter = { isActive: true };

    if (universityId) filter.universityId = universityId;

    const papers = await PastPaper.find(filter).sort({ year: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/pastpapers/upload — admin only
const uploadPastPaper = async (req, res) => {
  try {
    const { universityId, year, subject, degreeLevel } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }
    if (!universityId || !year || !subject) {
      return res.status(400).json({
        message: "University, year, and subject are required",
      });
    }

    // Get university details
    const uni = await University.findById(universityId);
    if (!uni) {
      return res.status(404).json({ message: "University not found" });
    }

    // Build file URL — served as static file
    const fileUrl = "/uploads/pastpapers/" + req.file.filename;

    // File size in KB
    const fileSizeKB = (req.file.size / 1024).toFixed(0) + " KB";

    const paper = await PastPaper.create({
      universityId,
      universityName: uni.name,
      universitySlug: uni.slug,
      subject,
      year: parseInt(year),
      degreeLevel: degreeLevel || "Bachelors",
      fileUrl,
      fileName: req.file.originalname,
      fileSize: fileSizeKB,
      isFree: true,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      paper,
      message: "Past paper uploaded successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/pastpapers/:id — admin only
const deletePastPaper = async (req, res) => {
  try {
    const paper = await PastPaper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Past paper not found" });
    }

    // Delete actual file from disk
    const filePath = path.join(__dirname, "..", paper.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await PastPaper.findByIdAndDelete(req.params.id);
    res.json({ message: "Past paper deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/pastpapers/:id/download — increment count
const trackDownload = async (req, res) => {
  try {
    await PastPaper.findByIdAndUpdate(req.params.id, {
      $inc: { downloadCount: 1 },
    });
    res.json({ message: "Download tracked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPastPapers,
  uploadPastPaper,
  deletePastPaper,
  trackDownload,
};
