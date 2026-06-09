const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/collect-university", async (req, res) => {
  const { universityName } = req.body;
  if (!universityName)
    return res.status(400).json({ message: "University name required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a professional university data researcher for Pakistan. 
Find the official, real, and current data for "${universityName}" in Pakistan.
Verify details from HEC records, official university websites, and recent prospectus.

Return ONLY valid JSON (no markdown, no backticks) matching this exact structure:
{
  "name": "full official university name",
  "shortName": "abbreviation like MUET or UoK",
  "slug": "lowercase-with-dashes",
  "type": "government or private",
  "city": "city name",
  "establishedYear": 1900,
  "officialWebsite": "https://website.edu.pk",
  "entryTest": "NTS or ECAT or Own Test or None",
  "admissionFee": 3500,
  "admissionOpen": true,
  "hostelAvailable": true,
  "matricWeight": 0.10,
  "fscWeight": 0.40,
  "testWeight": 0.50,
  "scholarships": ["HEC Need-Based Scholarship", "Merit Scholarship"],
  "requiredDocuments": ["Matric Certificate", "FSc Certificate", "CNIC", "Domicile", "4 Passport Photos"],
  "description": "Write 2 sentences about this university",
  "departments": [
    {
      "name": "BS Computer Science",
      "category": "CS",
      "semesterFee": 25000,
      "lastMerit": 75.5,
      "meritSeats": 60,
      "selfFinanceSeats": 40
    }
  ]
}

IMPORTANT RULES:
- Fill ALL fields with REAL data from the actual university.
- Include ALL major departments (minimum 10 departments if available).
- Categories must be one of: CS, Engineering, Medical, Business, Arts, Law, Social Sciences, Education, Agriculture, Sciences
- type must be lowercase "government" or "private"
- Weights must sum to exactly 1.00
- Fees should be in PKR
- Return ONLY the JSON object, nothing else.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Gemini raw response length:", text.length);

    // Clean the response - remove markdown code blocks if present
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.slice(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.slice(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.slice(0, -3);
    }
    cleanText = cleanText.trim();

    const data = JSON.parse(cleanText);
    res.json(data);
  } catch (err) {
    console.error("AI Collect Error:", err.message);
    res
      .status(500)
      .json({ message: "AI data collection failed: " + err.message });
  }
});

module.exports = router;
