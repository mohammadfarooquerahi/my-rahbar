const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
    universityName: { type: String },
    deadline: { type: Date },
    degreeLevel: { type: String, enum: ["BS", "MS", "PhD", "BBA", "MBA", "MBBS", "BDS", "All"], default: "All" },
    whatsapp: { type: String },
    email: { type: String },
    sent7Day: { type: Boolean, default: false },
    sent1Day: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Alert", alertSchema);

