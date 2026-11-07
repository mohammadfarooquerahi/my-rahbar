const mongoose = require("mongoose");

const cookieConsentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    consentGiven: { type: Boolean, default: false },
    consentDate: { type: Date },
    lastActive: { type: Date, default: Date.now },
    pagesVisited: [{ type: String }],
    device: { type: String },
    browser: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CookieConsent", cookieConsentSchema);
