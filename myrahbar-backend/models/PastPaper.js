const mongoose = require("mongoose");

const pastPaperSchema = new mongoose.Schema(
  {
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
    universityName: { type: String, required: true },
    year: { type: Number, required: true },
    subject: { type: String, required: true },
    degreeLevel: { type: String },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PastPaper", pastPaperSchema);
