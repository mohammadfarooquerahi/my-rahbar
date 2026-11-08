const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// genAI initialized dynamically

// Fallback model chain — active and supported models on Google Gemini API
const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-pro",
];

// ── BULLETPROOF JSON EXTRACTION ──────────────────────────────────────
// Handles: markdown code blocks, conversational fluff, nested braces, etc.
function extractJSON(raw) {
  if (!raw || typeof raw !== "string") return null;

  let text = raw.trim();

  // 1. Direct parse
  try { return JSON.parse(text); } catch (_) {}

  // 2. Strip code fences if present anywhere
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    try { return JSON.parse(fenceMatch[1].trim()); } catch (_) {}
  }

  // 3. Outermost { ... }
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try { return JSON.parse(text.slice(firstBrace, lastBrace + 1)); } catch (_) {}
  }

  // 4. Outermost [ ... ]
  const firstBracket = text.indexOf("[");
  const lastBracket = text.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    try { return JSON.parse(text.slice(firstBracket, lastBracket + 1)); } catch (_) {}
  }

  return null;
}

// -- RETRY HELPER WITH MODEL & GROQ FALLBACK ---------------------------
async function generateWithGroq(prompt) {
  const Groq = require("groq-sdk");
  const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY || process.env.GROQ_KEY;
  if (!apiKey) {
    throw new Error("Neither GEMINI_API_KEY nor GROQ_API_KEY is configured in Render environment variables.");
  }
  const groq = new Groq({ apiKey });

  let selectedModel = "openai/gpt-oss-20b";
  try {
    const mList = await groq.models.list();
    const valid = mList.data
      .map((m) => m.id)
      .filter((id) => !id.includes("whisper") && !id.includes("guard"));
    selectedModel = valid.find((id) => id.includes("gpt-oss") || id.includes("qwen") || id.includes("llama")) || valid[0] || selectedModel;
  } catch (_) {}

  const completion = await groq.chat.completions.create({
    model: selectedModel,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 4096,
  });

  return completion.choices[0]?.message?.content || "";
}

async function generateWithRetry(prompt) {
  let lastError = null;

  // 1. Try Google Gemini with multi-model fallback chain
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "") {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());

    for (const modelName of MODEL_CHAIN) {
      try {
        console.log(`[AI] Attempting Gemini model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result?.response?.text();
        if (text && text.trim().length > 0) {
          console.log(`[AI] Success with ${modelName} (${text.length} chars)`);
          return text;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[AI] Gemini ${modelName} failed (${err.message}). Trying next candidate...`);
      }
    }
  }

  // 2. Seamless Fallback to Groq if Gemini is unavailable
  console.log("[AI] Falling back to Groq for generation...");
  try {
    return await generateWithGroq(prompt);
  } catch (groqErr) {
    console.error("[AI] Both Gemini and Groq failed. Groq error:", groqErr.message);
    throw (lastError || groqErr);
  }
}

// ── UNIVERSITY DATA PROMPT ───────────────────────────────────────────
const PROMPT_TEMPLATE = (universityName) => `You are a professional, highly accurate university data researcher for Pakistan. 
You MUST provide the absolute latest, real, verified, and current 2025-2026 data for "${universityName}" in Pakistan.

PRIMARY TRUSTED VERIFICATION SOURCES (Pakistani Higher Education Ecosystem):
1. Official University Website (.edu.pk) — The #1 most reliable authority for current deadlines, fee structure per semester, closing merit percentage, and eligibility criteria.
2. HEC Official Portal (hec.gov.pk) — Higher Education Commission of Pakistan recognized universities list and degree accreditation status.
3. Eduvision Pakistan (eduvision.edu.pk) — Comprehensive degree programs list, duration, fee per semester estimates, and admission calendar.
4. ProPakistani Education (propakistani.pk/category/education) — Latest admission open news, test dates, and official announcements.
5. PakMustaqbil (pakmustaqbil.com) — Cross-reference for degrees, departments, and admission updates.

RESEARCH & VERIFICATION METHODOLOGY:
- Cross-reference Eduvision and PakMustaqbil for full program lists and fee estimates.
- Strictly confirm HEC recognition on hec.gov.pk.
- Confirm final deadlines, eligibility, and fee structure directly from the official university website.

CRITICAL RULES AGAINST HALLUCINATION:
1. You must strictly verify details from the official university website and HEC records.
2. DO NOT invent departments or degrees that the university does not offer. For example, do not add MBBS to an engineering or general arts university.
3. DO NOT guess fee amounts or closing merit percentages. If you cannot find the exact number, set the value to 0 or omit it.
4. For dates you cannot confirm, use an empty string "" instead of making one up.
5. Include ONLY the top real departments (MAXIMUM 8) that the university actually offers.
6. Populate "sources" array with verified URLs (e.g. university official portal, hec.gov.pk, eduvision.edu.pk).

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
      return res.status(500).json({ message: "Gemini API key is invalid. Please update it in Render environment variables." });
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

    let candidateSlug = payload.slug;
    const existing = await University.findOne({ slug: candidateSlug });
    if (existing) {
      payload.slug = `${candidateSlug}-${Date.now().toString().slice(-4)}`;
    }

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

const FALLBACK_TOPICS = [
  "MDCAT 2026 Registration Dates and Complete Preparation Guide",
  "Top 10 Engineering and Computer Science Universities in Pakistan (HEC Recognized)",
  "Latest Fall 2026 Admissions Open in Karachi, Lahore and Islamabad",
  "ECAT 2026 Engineering Entry Test — Syllabus, Marks and Eligibility",
  "HEC Recognized Universities List 2026 — Avoid Fake and Unrecognized Institutes",
  "FAST vs NUST vs GIKI — Which is Best for BS Computer Science in 2026?",
  "How to Apply for HEC Need-Based and Merit Scholarships 2026 (Step-by-Step)",
  "Dow vs King Edward vs AKU — Top Medical Colleges in Pakistan 2026"
];

// ── GET /trending-topics ─────────────────────────────────────────────
router.get("/trending-topics", async (req, res) => {
  try {
    const prompt = `You are an SEO expert and educational consultant for Pakistan.
    Using verified education trends, find the absolute latest trending topics (year 2026) related to universities, admissions, MDCAT, ECAT, or higher education in Pakistan.
    Return ONLY a valid JSON array of 5 highly engaging, click-worthy blog post topics.
    Example: ["Top 10 Universities in Karachi for BS CS in 2026", "MDCAT 2026 Complete Preparation Guide"]
    Return the JSON array directly. No markdown, no backticks, no explanation.`;

    const rawText = await generateWithRetry(prompt);
    const topics = extractJSON(rawText);
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return res.json({ topics: FALLBACK_TOPICS });
    }
    res.json({ topics });
  } catch (err) {
    console.warn("[AI] Trending Topics AI error, serving fallback:", err.message);
    res.json({ topics: FALLBACK_TOPICS });
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
