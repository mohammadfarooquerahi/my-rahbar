const mongoose = require("mongoose");

const heroStudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    tag: {
      type: String,
      required: [true, "University/institution tag is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, "Program/subtitle is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    color: {
      type: String,
      enum: ["blue", "emerald", "purple", "rose", "amber", "sky"],
      default: "blue",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroStudent", heroStudentSchema);
