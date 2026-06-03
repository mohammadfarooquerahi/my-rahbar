const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  seats: {
    merit: { type: Number, default: 0 },
    selfFinance: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  semesterFee: { type: Number, default: 0 },
  lastMerit: [
    {
      year: { type: Number },
      closing: { type: Number }, // This can be the aggregate score
      closingPercentage: { type: Number }, // The percentage value requested by user
      quota: { type: String, default: "merit" },
    },
  ],
});

const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortName: { type: String, required: true },
    type: {
      type: String,
      enum: ["government", "private"],
      required: true,
    },
    city: { type: String, default: "Karachi" },
    campuses: [{ type: String }],
    established: { type: Number },
    website: { type: String },
    logo: { type: String, default: null },
    photos: [{ type: String }],
    degreeLevels: [{ type: String }], // e.g. ['BS', 'MS', 'PhD']

    admissionOpen: { type: Boolean, default: false },
    admissionDeadline: { type: Date },
    admissionProcess: { type: String, default: "" },
    requiredDocuments: [{ type: String }],

    aggregateFormula: {
      matric: { type: Number, default: 0.1 },
      fsc: { type: Number, default: 0.4 },
      test: { type: Number, default: 0.5 },
      portfolio: { type: Number, default: 0 },
    },
    testRequired: { type: String, default: "Own Entry Test" },
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
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

// Text search index
universitySchema.index({ name: "text", shortName: "text" });

module.exports = mongoose.model("University", universitySchema);
