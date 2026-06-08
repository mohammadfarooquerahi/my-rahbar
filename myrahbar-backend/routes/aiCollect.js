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

    const prompt = `Research "${universityName}" university in Pakistan using your knowledge and return ONLY valid JSON, no markdown, no backticks, no explanation.

Return exactly this structure:
{
  "name": "Full official name",
  "shortName": "e.g. MUET",
  "slug": "muet-jamshoro",
  "type": "Government",
  "city": "Jamshoro",
  "establishedYear": 1963,
  "officialWebsite": "https://muet.edu.pk",
  "entryTest": "ECAT",
  "admissionFee": 3000,
  "admissionOpen": true,
  "hostelAvailable": true,
  "matricWeight": 0.10,
  "fscWeight": 0.40,
  "testWeight": 0.50,
  "scholarships": ["HEC Need-Based", "Merit Scholarship"],
  "requiredDocuments": ["Matric Certificate", "FSc Certificate", "CNIC", "Domicile", "4 Photos"],
  "description": "2-3 sentence description of the university",
  "departments": [
    {
      "name": "BE Computer Systems",
      "category": "Engineering",
      "semesterFee": 28000,
      "lastMerit": 72.5,
      "meritSeats": 60,
      "selfFinanceSeats": 30
    }
  ]
}

Include ALL departments this university offers. Use real accurate data.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
      return res.status(500).json({ message: "Could not parse response" });

    const data = JSON.parse(jsonMatch[0]);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed: " + err.message });
  }
});

module.exports = router;
