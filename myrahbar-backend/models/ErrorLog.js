const mongoose = require("mongoose");

const errorLogSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    stack: { type: String },
    url: { type: String },
    method: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userAgent: { type: String },
    severity: { type: String, enum: ["warning", "error", "critical"], default: "error" },
    isResolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ErrorLog", errorLogSchema);
