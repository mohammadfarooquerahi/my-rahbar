const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    whatsapp: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
      select: false,
    },
    contactMethod: {
      type: String,
      enum: ["email", "whatsapp"],
      default: "email",
    },
    termsAccepted: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["student", "admin", "counselor"],
      default: "student",
    },

    // Watchlist â€” array of university IDs
    watchlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "University",
      },
    ],

    // Student profile for AI matching
    profile: {
      matricPercent: { type: Number, default: null },
      fscPercent: { type: Number, default: null },
      fscSubjects: { type: String, default: "" },
      interestedField: { type: String, default: "" },
      budget: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
      },
      needsScholarship: { type: Boolean, default: false },
      needsHostel: { type: Boolean, default: false },
      preferredSector: {
        type: String,
        enum: ["government", "private", "any"],
        default: "any",
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password on login
userSchema.methods.checkPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
