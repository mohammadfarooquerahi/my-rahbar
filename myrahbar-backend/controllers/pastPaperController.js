const PastPaper = require("../models/PastPaper");
const University = require("../models/University");

// GET /api/pastpapers
const getPastPapers = async (req, res) => {
  const { universityId, year, degreeLevel } = req.query;
  const query = { isActive: true };

  if (universityId) query.university = universityId;
  if (year) query.year = Number(year);
  if (degreeLevel) query.degreeLevel = degreeLevel;

  const pastPapers = await PastPaper.find(query).sort({ year: -1 });
  res.json(pastPapers);
};

// POST /api/pastpapers (Admin only)
const uploadPastPaper = async (req, res) => {
  const { universityId, year, subject, degreeLevel } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ message: "File is required." });
  }

  if (!universityId || !year || !subject) {
    return res.status(400).json({ message: "University ID, year, and subject are required." });
  }

  const university = await University.findById(universityId);
  if (!university) {
    return res.status(404).json({ message: "University not found." });
  }

  const pastPaper = await PastPaper.create({
    university: universityId,
    universityName: university.name,
    year: Number(year),
    subject,
    degreeLevel,
    fileUrl: `/uploads/pastpapers/${req.file.filename}`,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    uploadedBy: req.user._id,
  });

  res.status(201).json(pastPaper);
};

// DELETE /api/pastpapers/:id (Admin only)
const deletePastPaper = async (req, res) => {
  const pastPaper = await PastPaper.findByIdAndDelete(req.params.id);
  if (!pastPaper) {
    return res.status(404).json({ message: "Past paper not found." });
  }
  res.json({ message: "Past paper deleted successfully." });
};

module.exports = { getPastPapers, uploadPastPaper, deletePastPaper };
