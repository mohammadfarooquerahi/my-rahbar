const mongoose = require("mongoose");

const pastPaperSchema = new mongoose.Schema(
  {
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    universityName: { type: String, required: true },
    universitySlug: { type: String, required: true },
    subject: { type: String, required: true },
    year: { type: Number, required: true },
    degreeLevel: { type: String, default: "Bachelors" },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: String, default: "" },
    isFree: { type: Boolean, default: true },
    downloadCount: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PastPaper", pastPaperSchema);
