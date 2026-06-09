const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fallback model chain — if one is overloaded or quota-limited, try the next
const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
];

// Retry helper with model fallback
async function generateWithRetry(prompt, maxRetries = 3) {
  let lastError = null;

  for (const modelName of MODEL_CHAIN) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Trying model: ${modelName} (attempt ${attempt}/${maxRetries})`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log(`Success with model: ${modelName}`);
        return text;
      } catch (err) {
        lastError = err;
        const status = err.status || err.httpStatusCode || 0;
        const msg = err.message || "";
        console.error(`Model ${modelName} attempt ${attempt} failed: ${msg}`);

        // If 503 (overloaded) or 429 (quota), try next model immediately
        if (status === 503 || status === 429 || msg.includes("503") || msg.includes("429") || msg.includes("quota") || msg.includes("overloaded") || msg.includes("high demand")) {
          // Wait a bit before retry (exponential backoff)
          if (attempt < maxRetries) {
            await new Promise(r => setTimeout(r, 1000 * attempt));
            continue;
          }
          // Move to next model
          break;
        }

        // If 404 (model not found), skip to next model immediately
        if (status === 404 || msg.includes("404") || msg.includes("not found")) {
          break;
        }

        // If 400 (bad key), no point retrying any model
        if (status === 400 || msg.includes("API key not valid")) {
          throw err;
        }

        // Other errors — retry with backoff
        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
        }
      }
    }
  }

  throw lastError || new Error("All AI models failed. Please try again later.");
}

const PROMPT_TEMPLATE = (universityName) => `You are a professional university data researcher for Pakistan. 
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

// Collect university data via AI
router.post("/collect-university", async (req, res) => {
  const { universityName } = req.body;
  if (!universityName)
    return res.status(400).json({ message: "University name required" });

  try {
    const prompt = PROMPT_TEMPLATE(universityName);
    const text = await generateWithRetry(prompt);

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

    // Give user-friendly error messages
    const msg = err.message || "";
    if (msg.includes("API key not valid")) {
      return res.status(500).json({ message: "Gemini API key is invalid. Please update it in Railway environment variables." });
    }
    if (msg.includes("quota") || msg.includes("429")) {
      return res.status(500).json({ message: "API quota exceeded. Please wait a few minutes and try again." });
    }
    if (msg.includes("503") || msg.includes("overloaded") || msg.includes("high demand")) {
      return res.status(500).json({ message: "AI servers are busy right now. Please wait 30 seconds and try again." });
    }

    res.status(500).json({ message: "AI data collection failed: " + err.message });
  }
});

// Submit university to DB (from AI collector tool — admin use)
router.post("/submit-university", async (req, res) => {
  try {
    const University = require("../models/University");
    const payload = req.body;
    
    // Ensure status is pending so admin can review
    payload.status = payload.status || "pending";
    
    const uni = await University.create(payload);
    res.status(201).json(uni);
  } catch (err) {
    console.error("Submit university error:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: "A university with this slug already exists." });
    }
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
