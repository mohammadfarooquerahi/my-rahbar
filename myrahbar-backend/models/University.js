const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  degreeLevel: { type: String, enum: ["BS", "MS", "PhD", "BBA", "MBA", "MBBS", "BDS", "Other"], default: "BS" },
  seats: {
    merit: { type: Number, default: 0 },
    selfFinance: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  semesterFee: { type: Number, default: 0 },
  lastMerit: [
    {
      year: { type: Number },
      closing: { type: Number },
      closingPercentage: { type: Number },
      quota: { type: String, default: "merit" },
    },
  ],
});

const admissionDeadlineSchema = new mongoose.Schema({
  degreeLevel: { type: String, enum: ["BS", "MS", "PhD", "BBA", "MBA", "MBBS", "BDS", "All"], default: "All" },
  deadline: { type: Date },
  note: { type: String, default: "" },
});

const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortName: { type: String, required: true },
    type: { type: String, enum: ["government", "private"], required: true },
    city: { type: String, default: "Karachi" },
    campuses: [{ type: String }],
    established: { type: Number },
    website: { type: String },
    logo: { type: String, default: null },
    photos: [{ type: String }],
    degreeLevels: [{ type: String }],

    admissionOpen: { type: Boolean, default: false },
    admissionDeadline: { type: Date },                   // kept for backward compat
    admissionDeadlines: [admissionDeadlineSchema],       // NEW: per-degree deadlines
    admissionProcess: { type: String, default: "" },
    requiredDocuments: [{ type: String }],

    aggregateFormula: {
      matric: { type: Number, default: 0.1 },
      fsc: { type: Number, default: 0.4 },
      test: { type: Number, default: 0.5 },
      portfolio: { type: Number, default: 0 },
    },
    testRequired: { type: String, default: "Own Entry Test" },

    // Structured test type badge
    admissionTestType: {
      type: String,
      enum: ["Own Test", "HEC-NAT", "NTS", "SAT", "MDCAT", "ECAT", "NUMS", "None", "Multiple"],
      default: "Own Test",
    },

    admissionFee: { type: Number, default: 0 },
    hostelAvailable: { type: Boolean, default: false },
    hostelFee: { type: Number, default: null },
    messFee: { type: Number, default: null },
    scholarships: [{ type: String }],
    departments: [departmentSchema],

    overallRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

universitySchema.index({ name: "text", shortName: "text" });

module.exports = mongoose.model("University", universitySchema);
