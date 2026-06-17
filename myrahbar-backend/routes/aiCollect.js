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

// ── BULLETPROOF JSON EXTRACTION ──────────────────────────────────────
// Handles: markdown code blocks, conversational fluff, nested braces, etc.
function extractJSON(raw) {
  if (!raw || typeof raw !== "string") return null;

  let text = raw.trim();

  // Step 1: Strip markdown code fences
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

  // Step 2: Try parsing the whole thing as-is first
  try { return JSON.parse(text); } catch (_) { /* continue */ }

  // Step 3: Find the outermost balanced { ... } or [ ... ]
  const startIdx = text.search(/[{\[]/);
  if (startIdx === -1) return null;

  const opener = text[startIdx];
  const closer = opener === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIdx; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === opener) depth++;
    if (ch === closer) depth--;
    if (depth === 0) {
      const candidate = text.slice(startIdx, i + 1);
      try { return JSON.parse(candidate); } catch (_) { return null; }
    }
  }
  return null;
}

// ── RETRY HELPER WITH MODEL FALLBACK ─────────────────────────────────
async function generateWithRetry(prompt, maxRetries = 3) {
  let lastError = null;

  for (const modelName of MODEL_CHAIN) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[AI] Trying model: ${modelName} (attempt ${attempt}/${maxRetries})`);

        const model = genAI.getGenerativeModel({
          model: modelName,
          tools: [{ googleSearch: {} }],
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log(`[AI] Success with model: ${modelName} — ${text.length} chars`);
        return text;
      } catch (err) {
        lastError = err;
        const status = err.status || err.httpStatusCode || 0;
        const msg = err.message || "";
        console.error(`[AI] Model ${modelName} attempt ${attempt} failed: ${msg}`);

        // 503 / 429 — overloaded or quota — retry with backoff, then next model
        if (status === 503 || status === 429 || msg.includes("503") || msg.includes("429") || msg.includes("quota") || msg.includes("overloaded") || msg.includes("high demand")) {
          if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, 1500 * attempt));
            continue;
          }
          break; // next model
        }

        // 404 — model doesn't exist, skip immediately
        if (status === 404 || msg.includes("not found")) break;

        // 400 — bad API key — no point retrying
        if (status === 400 || msg.includes("API key not valid")) throw err;

        // Other errors — retry with backoff
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1500 * attempt));
        }
      }
    }
  }

  throw lastError || new Error("All AI models failed. Please try again later.");
}

// ── UNIVERSITY DATA PROMPT ───────────────────────────────────────────
const PROMPT_TEMPLATE = (universityName) => `You are a professional, highly accurate university data researcher for Pakistan. 
You MUST use Google Search to find the absolute latest, real, and current 2025-2026 data for "${universityName}" in Pakistan.

CRITICAL RULES AGAINST HALLUCINATION:
1. You must strictly verify details from the official university website and HEC records.
2. DO NOT invent departments or degrees that the university does not offer. For example, do not add MBBS to an engineering or general arts university.
3. DO NOT guess fee amounts or closing merit percentages. If you cannot find the exact number, set the value to 0 or omit it.
4. For dates you cannot confirm, use an empty string "" instead of making one up.
5. Include ONLY the top real departments (MAXIMUM 8) that the university actually offers.

Return ONLY valid JSON (no markdown, no backticks, no explanation text) matching this exact structure:
{
  "name": "full official university name",
  "shortName": "abbreviation like NUST or UoK",
  "slug": "lowercase-with-dashes",
  "type": "government",
  "city": "city name",
  "campuses": ["Main Campus"],
  "established": 1900,
  "website": "https://website.edu.pk",
  "degreeLevels": ["BS", "MS", "PhD"],
  "admissionOpen": true,
  "admissionTestType": "Own Test",
  "testRequired": "NAT-IE / NAT-ICS",
  "testDetails": {
    "totalMcqs": 100,
    "negativeMarking": false,
    "syllabus": [
      { "category": "Pre-Engineering", "details": "Math 40%, Physics 30%, English 20%, IQ 10%" }
    ]
  },
  "eligibilityCriteria": "Intermediate with minimum 60% marks",
  "admissionProcess": "Apply online at university website",
  "requiredDocuments": ["Matric Certificate", "FSc Certificate", "CNIC", "Domicile"],
  "admissionDeadlines": [
    {
      "round": "Fall 2026",
      "degreeLevel": "BS",
      "testDate": "August 2026",
      "testCities": ["Islamabad", "Karachi", "Lahore"],
      "resultDate": "September 2026",
      "deadline": "July 2026",
      "note": "Fall 2026 admissions"
    }
  ],
  "feeStructure": [
    { "title": "Tuition Fee", "amount": 120000, "description": "Per semester" },
    { "title": "Admission Fee", "amount": 25000, "description": "One-time" }
  ],
  "feeNotes": [
    { "title": "Note", "description": "Fee may vary by program" }
  ],
  "hostelAvailable": true,
  "hostelFee": 30000,
  "messFee": 10000,
  "aggregateFormula": {
    "matric": 0.10,
    "fsc": 0.40,
    "test": 0.50,
    "portfolio": 0
  },
  "scholarships": ["HEC Need-Based", "Merit Scholarship"],
  "departments": [
    {
      "name": "BS Computer Science",
      "category": "CS",
      "degreeLevel": "BS",
      "semesterFee": 120000,
      "lastMerit": 75.5,
      "seats": { "merit": 60, "selfFinance": 40, "other": 0 }
    }
  ],
  "sources": ["https://official-university-url.edu.pk/admissions"]
}

FIELD RULES:
- type: must be lowercase "government" or "private"
- admissionTestType: must be one of "Own Test", "HEC-NAT", "NTS", "SAT", "MDCAT", "ECAT", "NUMS", "None", "Multiple"
- categories: must be one of CS, Engineering, Medical, Business, Arts, Law, Social Sciences, Education, Agriculture, Sciences
- aggregateFormula weights must sum to exactly 1.00
- lastMerit: a single number (the closing percentage). Use 0 if unknown.
- All date fields in admissionDeadlines: use readable text like "August 2026" or "" if unknown. Do NOT use "N/A" or "TBA".
- sources: array of real URLs you verified from. This is mandatory.
- Return ONLY the JSON object, nothing else. No commentary before or after.`;

// ── POST /collect-university ─────────────────────────────────────────
router.post("/collect-university", async (req, res) => {
  const { universityName } = req.body;
  if (!universityName)
    return res.status(400).json({ message: "University name required" });

  try {
    const prompt = PROMPT_TEMPLATE(universityName);
    const rawText = await generateWithRetry(prompt);

    const data = extractJSON(rawText);
    if (!data) {
      console.error("[AI] Failed to extract JSON from response:", rawText.slice(0, 300));
      throw new Error("AI returned an unrecognizable format. Please try again.");
    }

    res.json(data);
  } catch (err) {
    console.error("[AI] Collect Error:", err.message);

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

    res.status(500).json({ message: "AI data collection failed: " + msg });
  }
});

// ── POST /submit-university ──────────────────────────────────────────
router.post("/submit-university", async (req, res) => {
  try {
    const University = require("../models/University");
    const p = req.body;

    // Sanitize and build a clean payload that matches the Mongoose schema exactly
    const payload = {
      name: p.name || "Unknown University",
      slug: p.slug || p.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "unknown",
      shortName: p.shortName || p.name?.split(" ").map(w => w[0]).join("").toUpperCase() || "UNK",
      type: ["government", "private"].includes(p.type?.toLowerCase()) ? p.type.toLowerCase() : "government",
      city: p.city || "Karachi",
      campuses: Array.isArray(p.campuses) ? p.campuses : [],
      established: Number(p.established) || null,
      website: p.website || "",
      degreeLevels: Array.isArray(p.degreeLevels) ? p.degreeLevels : [],
      admissionOpen: !!p.admissionOpen,
      admissionTestType: p.admissionTestType || "Own Test",
      testRequired: p.testRequired || "Own Entry Test",
      eligibilityCriteria: p.eligibilityCriteria || "",
      admissionProcess: p.admissionProcess || "",
      requiredDocuments: Array.isArray(p.requiredDocuments) ? p.requiredDocuments : [],
      scholarships: Array.isArray(p.scholarships) ? p.scholarships : [],
      hostelAvailable: !!p.hostelAvailable,
      hostelFee: Number(p.hostelFee) || 0,
      messFee: Number(p.messFee) || 0,
      aggregateFormula: {
        matric: Number(p.aggregateFormula?.matric) || 0.1,
        fsc: Number(p.aggregateFormula?.fsc) || 0.4,
        test: Number(p.aggregateFormula?.test) || 0.5,
        portfolio: Number(p.aggregateFormula?.portfolio) || 0,
      },
      // Sanitize admissionDeadlines — convert all date-like fields to strings
      admissionDeadlines: Array.isArray(p.admissionDeadlines) ? p.admissionDeadlines.map(d => ({
        round: String(d.round || "Round 1"),
        degreeLevel: d.degreeLevel || "All",
        testDate: String(d.testDate || ""),
        testCities: Array.isArray(d.testCities) ? d.testCities : [],
        resultDate: String(d.resultDate || ""),
        deadline: String(d.deadline || ""),
        note: String(d.note || ""),
      })) : [],
      feeStructure: Array.isArray(p.feeStructure) ? p.feeStructure.map(f => ({
        title: String(f.title || ""),
        amount: Number(f.amount) || 0,
        description: String(f.description || ""),
      })) : [],
      feeNotes: Array.isArray(p.feeNotes) ? p.feeNotes.map(f => ({
        title: String(f.title || ""),
        description: String(f.description || ""),
      })) : [],
      testDetails: {
        totalMcqs: Number(p.testDetails?.totalMcqs) || 0,
        negativeMarking: !!p.testDetails?.negativeMarking,
        syllabus: Array.isArray(p.testDetails?.syllabus) ? p.testDetails.syllabus.map(s => ({
          category: String(s.category || ""),
          details: String(s.details || ""),
        })) : [],
      },
      // Sanitize departments
      departments: Array.isArray(p.departments) ? p.departments.map(d => ({
        name: d.name || "Unknown",
        category: d.category || "CS",
        degreeLevel: d.degreeLevel || "BS",
        semesterFee: Number(d.semesterFee) || 0,
        seats: {
          merit: Number(d.seats?.merit || d.meritSeats) || 0,
          selfFinance: Number(d.seats?.selfFinance || d.selfFinanceSeats) || 0,
          other: Number(d.seats?.other) || 0,
        },
        lastMerit: buildLastMerit(d.lastMerit),
      })) : [],
      status: "pending",
    };

    const uni = await University.create(payload);
    res.status(201).json(uni);
  } catch (err) {
    console.error("[AI] Submit university error:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: "A university with this slug already exists." });
    }
    res.status(400).json({ message: err.message });
  }
});

// Helper: normalize lastMerit into the array format the schema expects
function buildLastMerit(val) {
  if (!val) return [];
  // If it's already an array of objects, return as-is
  if (Array.isArray(val)) {
    return val.map(m => ({
      year: Number(m.year) || 2025,
      closing: Number(m.closing || m.closingPercentage) || 0,
      closingPercentage: Number(m.closingPercentage || m.closing) || 0,
      quota: m.quota || "merit",
    }));
  }
  // If it's a single number, wrap it
  const num = Number(val);
  if (!isNaN(num) && num > 0) {
    return [{ year: 2025, closing: num, closingPercentage: num, quota: "merit" }];
  }
  return [];
}

// ── GET /trending-topics ─────────────────────────────────────────────
router.get("/trending-topics", async (req, res) => {
  try {
    const prompt = `You are an SEO expert and educational consultant for Pakistan.
    Using Google Search, find the absolute latest trending topics (year 2026) related to universities, admissions, MDCAT, ECAT, or higher education in Pakistan.
    Return ONLY a valid JSON array of 5 highly engaging, click-worthy blog post topics.
    Example: ["Top 10 Universities in Karachi for BS CS in 2026", "MDCAT 2026 Complete Preparation Guide"]
    Return the JSON array directly. No markdown, no backticks, no explanation.`;

    const rawText = await generateWithRetry(prompt);
    const topics = extractJSON(rawText);
    if (!topics || !Array.isArray(topics)) {
      throw new Error("AI did not return a valid topics array.");
    }
    res.json({ topics });
  } catch (err) {
    console.error("[AI] Trending Topics Error:", err.message);
    res.status(500).json({ message: "Failed to fetch trending topics: " + err.message });
  }
});

// ── POST /generate-blog ──────────────────────────────────────────────
router.post("/generate-blog", async (req, res) => {
  try {
    const { topic, geo } = req.body;
    if (!topic) return res.status(400).json({ message: "Topic is required" });

    const geoContext = geo ? ` Target Audience Location (Geo-targeting): ${geo}. Make sure the content specifically appeals to students in or looking at ${geo}.` : "";

    const prompt = `You are an expert SEO blog writer and educational consultant for Pakistan.
    Write a comprehensive, engaging, and highly informative blog post about: "${topic}".
    ${geoContext}
    
    Use Google Search to ensure all facts, dates, and statistics mentioned are accurate for the year 2026.
    
    Format the response as a single valid JSON object matching this exact structure:
    {
      "title": "A highly engaging SEO title",
      "excerpt": "A compelling 2-3 sentence meta description/excerpt.",
      "content": "The full blog post content in HTML format. Use <h2> and <h3> tags for subheadings, <p> for paragraphs, and <ul>/<li> for lists. Do NOT include the main title <h1> in the content.",
      "seoTitle": "SEO optimized title under 60 chars",
      "seoDescription": "SEO optimized description under 160 chars",
      "keywords": ["keyword1", "keyword2"],
      "faqs": [
        { "question": "Common question?", "answer": "Clear answer" }
      ]
    }
    
    Return ONLY the raw JSON object. No markdown, no backticks, no explanation.`;

    const rawText = await generateWithRetry(prompt, 3);
    const blogData = extractJSON(rawText);
    if (!blogData) {
      throw new Error("AI did not return valid blog JSON.");
    }
    res.json(blogData);
  } catch (err) {
    console.error("[AI] Generate Blog Error:", err.message);
    res.status(500).json({ message: "Failed to generate blog: " + err.message });
  }
});

module.exports = router;
