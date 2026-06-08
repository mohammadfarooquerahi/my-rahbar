const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/collect-university", async (req, res) => {
  const { universityName } = req.body;
  if (!universityName)
    return res.status(400).json({ message: "University name required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a data researcher for Pakistani universities. 
Give me detailed information about "${universityName}" in Pakistan.
Respond with ONLY a raw JSON object. No markdown. No backticks. No explanation. Just the JSON.

{
  "name": "full official university name",
  "shortName": "abbreviation like MUET or UoK",
  "slug": "lowercase-with-dashes",
  "type": "Government",
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

Fill ALL fields with real data. Include every department this university offers.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Log raw response to see what Gemini returns
    console.log("Gemini raw response:", text);

    // Clean response - remove markdown if Gemini adds it
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log("No JSON found in:", cleaned);
      return res
        .status(500)
        .json({ message: "AI did not return valid data", raw: cleaned });
    }

    const data = JSON.parse(jsonMatch[0]);
    res.json(data);
  } catch (err) {
    console.error("AI Collect Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
