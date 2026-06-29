const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  degreeLevel: { type: String, enum: ["BS", "MS", "MPhil", "PhD", "BBA", "MBA", "MBBS", "BDS", "Other"], default: "BS" },
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
  round: { type: String, default: "Round 1" },
  degreeLevel: { type: String, enum: ["BS", "MS", "MPhil", "PhD", "BBA", "MBA", "MBBS", "BDS", "All"], default: "All" },
  testDate: { type: String },
  testCities: [{ type: String }],
  resultDate: { type: String },
  deadline: { type: String },
  note: { type: String, default: "" },
  eligibilityCriteria: { type: String, default: "" },
  aggregateFormula: {
    matric: { type: Number, default: 0.1 },
    fsc: { type: Number, default: 0.4 },
    test: { type: Number, default: 0.5 },
  }
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
    admissionDeadlines: [admissionDeadlineSchema],       // NEW: per-degree/round deadlines
    admissionProcess: { type: String, default: "" },
    requiredDocuments: [{ type: String }],
    eligibilityCriteria: { type: String, default: "" },  // e.g. "Intermediate 65%"

    aggregateFormula: {
      matric: { type: Number, default: 0.1 },
      fsc: { type: Number, default: 0.4 },
      test: { type: Number, default: 0.5 },
      portfolio: { type: Number, default: 0 },
    },
    testRequired: { type: String, default: "Own Entry Test" },
    testDetails: {
      totalMcqs: { type: Number, default: 0 },
      negativeMarking: { type: Boolean, default: false },
      syllabus: [
        {
          category: { type: String }, // e.g., Pre-Medical, ICS
          details: { type: String },  // e.g., Biology 30%, Chemistry 30%
        }
      ]
    },

    // Structured test type badge
    admissionTestType: {
      type: String,
      enum: ["Own Test", "HEC-NAT", "NTS", "SAT", "MDCAT", "ECAT", "NUMS", "None", "Multiple"],
      default: "Own Test",
    },

    feeStructure: [
      {
        title: { type: String },
        amount: { type: Number },
        description: { type: String }
      }
    ],
    feeNotes: [
      {
        title: { type: String },
        description: { type: String }
      }
    ],
    admissionFee: { type: Number, default: 0 }, // kept for compat
    hostelAvailable: { type: Boolean, default: false },
    hostelFee: { type: Number, default: null },
    messFee: { type: Number, default: null },
    scholarships: [{ type: String }],
    sources: [{ type: String }],  // AI verification source URLs
    departments: [departmentSchema],

    overallRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    // Merit & Fee ranges (e.g. merit 78-82, fee 76000-80000)
    meritRange: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
    },
    feeRange: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
    },


    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    isVerified: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

universitySchema.index({ name: "text", shortName: "text" });

module.exports = mongoose.model("University", universitySchema);
