const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    fullName: {
      type: String,
      trim: true,
      default: "",
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
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin", "counselor"],
      default: "student",
    },

    // Watchlist — array of university IDs
    watchlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "University",
      },
    ],

    // Preferences
    emailAlerts: {
      type: Boolean,
      default: true,
    },

    // Student profile for AI matching and tools
    profile: {
      matricMarks: { type: Number, default: null },
      matricTotal: { type: Number, default: 850 }, // default total for matric
      matricPercent: { type: Number, default: null },
      matricGroup: { type: String, default: "" }, // Science, Arts, Computer Science
      
      fscMarks: { type: Number, default: null },
      fscTotal: { type: Number, default: 1100 }, // default total for inter
      fscPercent: { type: Number, default: null },
      fscGroup: { type: String, default: "" }, // Pre-Med, Pre-Eng, ICS, Commerce, Arts
      
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
