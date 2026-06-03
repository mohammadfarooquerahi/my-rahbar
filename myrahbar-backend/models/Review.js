const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["overall", "faculty", "hostel", "fee", "campus"],
      default: "overall",
    },
    hiddenCharges: [
      {
        label: { type: String },
        amount: { type: Number },
        comment: { type: String },
      },
    ],
    helpfulCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
