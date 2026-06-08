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

    const prompt = `You are a professional university data researcher for Pakistan. 
Perform a live web search to find the official, real, and current data for "${universityName}" in Pakistan.
Verify the details from HEC, official websites, and recent prospectus.

Return the response strictly matching this JSON structure:
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

Fill ALL fields with real data. Make sure the weights sum up to exactly 1.00. Include major departments.`;

    // 🌟 FIXED: Added tools for web search & forced JSON output schema
    const result = await model.generateContent({
      contents: prompt,
      tools: [{ googleSearch: {} }], // Live data nikalne ke liye search grounding enable ki
      generationConfig: {
        responseMimeType: "application/json", // Model direct pure JSON hi return karega
      },
    });

    const text = result.response.text();
    console.log("Gemini raw response:", text);

    // AI is now strictly returning JSON, directly parse it safely
    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    console.error("AI Collect Error:", err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error during data collection" });
  }
});

module.exports = router;
