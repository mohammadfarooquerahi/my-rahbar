require("dotenv").config();
const mongoose = require("mongoose");
const University = require("../models/University");
const connectDB = require("../config/db");

const universities = [
  {
    name: "University of Karachi",
    slug: "university-of-karachi",
    shortName: "UoK",
    type: "government",
    city: "Karachi",
    campuses: ["Main Campus (University Road)"],
    established: 1951,
    website: "https://uok.edu.pk",
    admissionOpen: true,
    admissionDeadline: new Date("2025-08-15"),
    overallRating: 3.8,
    reviewCount: 142,
    status: "approved",
    departments: [
      {
        name: "BS Computer Science",
        category: "CS",
        seats: { merit: 60, selfFinance: 30 },
        semesterFee: 18000,
        lastMerit: [
          { year: 2024, closing: 72.5 },
          { year: 2023, closing: 70.1 },
        ],
      },
      {
        name: "MBBS",
        category: "Medical",
        seats: { merit: 80, selfFinance: 20 },
        semesterFee: 85000,
        lastMerit: [{ year: 2024, closing: 88.2 }],
      },
      {
        name: "BBA",
        category: "Business",
        seats: { merit: 80, selfFinance: 40 },
        semesterFee: 14000,
        lastMerit: [{ year: 2024, closing: 68.0 }],
      },
    ],
    aggregateFormula: { matric: 0.1, fsc: 0.4, test: 0.5 },
    testRequired: "NTS / Own Entry Test",
 
<truncated 2321 bytes>
government",
    city: "Karachi",
    campuses: ["Main Campus (Baba-e-Urdu Road)", "OJHA Campus"],
    established: 2004,
    website: "https://duhs.edu.pk",
    admissionOpen: true,
    admissionDeadline: new Date("2025-07-20"),
    overallRating: 4.1,
    reviewCount: 203,
    status: "approved",
    departments: [
      {
        name: "MBBS",
        category: "Medical",
        seats: { merit: 150, selfFinance: 50 },
        semesterFee: 55000,
        lastMerit: [{ year: 2024, closing: 86.5 }],
      },
      {
        name: "BDS",
        category: "Medical",
        seats: { merit: 60, selfFinance: 30 },
        semesterFee: 45000,
        lastMerit: [{ year: 2024, closing: 78.0 }],
      },
      {
        name: "Pharm-D",
        category: "Medical",
        seats: { merit: 80, selfFinance: 40 },
        semesterFee: 40000,
        lastMerit: [{ year: 2024, closing: 74.5 }],
      },
    ],
    aggregateFormula: { matric: 0.1, fsc: 0.4, test: 0.5 },
    testRequired: "MDCAT",
    admissionFee: 3000,
    hostelAvailable: true,
    hostelFee: 5000,
    messFee: 6500,
    scholarships: ["Sindh Merit Scholarship", "HEC Need-Based"],
    requiredDocuments: [
      "Matric Certificate",
      "FSc Pre-Medical",
      "CNIC / B-Form",
      "Domicile",
      "MDCAT Result",
      "4 Passport Photos",
    ],
  },
];

const seed = async () => {
  await connectDB();
  await University.deleteMany({});
  await University.insertMany(universities);
  console.log(
    "Seed complete â€” " + universities.length + " universities added.",
  );
  process.exit(0);
};

seed();
