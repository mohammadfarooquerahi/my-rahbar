const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    universityName: { type: String },
    deadline: { type: Date },
    whatsapp: { type: String },
    email: { type: String },

    // Track which alerts already sent
    sent7Day: { type: Boolean, default: false },
    sent1Day: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Alert", alertSchema);
