const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["news", "notification", "announcement"], default: "news" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    image: { type: String },
    referenceLink: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
