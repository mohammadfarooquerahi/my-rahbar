const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();

// Groq ko initialize karein (Yeh automatically aap ki .env se GROQ_API_KEY utha lega)
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY || process.env.GROQ_KEY;
  return new Groq({ apiKey });
};

const EDU_SYSTEM = `You are Rahbars AI, a helpful guide for Pakistani students.
You ONLY answer questions about:
- Universities in Pakistan especially Karachi
- Admission process, merit, aggregate calculation
- Scholarships, fee structure, hostel
- Career paths and degree selection in Pakistan
- Required documents for admission
- Job market and salaries in Pakistan

If someone asks anything unrelated say:
I am only here to help with university admissions and education in Pakistan.

Be friendly, brief and supportive. Use PKR for amounts.`;

const CAREER_SYSTEM = `You are a career counselor for Pakistani students.
You help students choose the right degree, university and career path in Pakistan.

You know about:
- Job market in Pakistan for IT, Engineering, Medicine, Business, Law, Arts
- Which degrees have best career prospects in Pakistan
- Salary ranges in Pakistan for different professions
- Which Karachi universities are best for which fields
- Internship and entry level job advice for fresh graduates

Keep answers short, friendly and practical.
Always give honest advice. Use PKR for salaries.
Focus on Pakistan job market only.

If someone asks anything unrelated say:
I am here to help with career and education guidance for Pakistani students only.`;

// GET /api/ai/models
router.get("/models", async (req, res) => {
  try {
    const groq = getGroqClient();
    const list = await groq.models.list();
    res.json({ models: list.data.map(m => m.id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const { messages, type } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Messages array required" });
    }

    // VULN-12 FIX: Validate message objects — only allow user/assistant roles, block system injection
    if (messages.length > 20) {
      return res.status(400).json({ message: "Too many messages in request." });
    }
    const validRoles = ["user", "assistant"];
    const sanitizedMessages = messages
      .filter(m => m && typeof m.content === "string" && validRoles.includes(m.role))
      .map(m => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

    if (sanitizedMessages.length === 0) {
      return res.status(400).json({ message: "No valid messages provided." });
    }

    const systemPrompt = type === "career" ? CAREER_SYSTEM : EDU_SYSTEM;

    // Groq ke mutabiq system prompt ko messages array ke shuru mein add karein
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...sanitizedMessages,
    ];

    // Groq API Call with robust model fallback
    const groq = getGroqClient();
    const candidateModels = [
      "llama-3.3-70b-versatile",
      "llama3-8b-8192",
      "llama-3.1-8b-instant",
      "gemma2-9b-it",
      "mixtral-8x7b-32768"
    ];

    let chatCompletion = null;
    let lastErr = null;

    for (const model of candidateModels) {
      try {
        chatCompletion = await groq.chat.completions.create({
          messages: formattedMessages,
          model,
          max_tokens: 1000,
        });
        if (chatCompletion) break;
      } catch (err) {
        lastErr = err;
        if (err.status === 404 || (err.message && err.message.includes("model"))) {
          continue;
        }
        throw err;
      }
    }

    if (!chatCompletion && lastErr) {
      throw lastErr;
    }

    const text =
      chatCompletion.choices[0]?.message?.content ||
      "Sorry I could not get a response. Please try again.";

    res.json({
      reply: text,
      response: text,
    });
  } catch (error) {
    console.error("Groq AI Error:", error);
    
    // Fallback response so it doesn't break the frontend if API key is invalid
    const fallbackResponse = "I'm currently experiencing high traffic and my AI brain is resting. But I can tell you that for admissions in Pakistan, you should focus on your FSc marks and entry test preparations. For medical, aim for MDCAT. For engineering, prepare for ECAT or NUST NET. How else can I help?";
    
    res.json({
      reply: fallbackResponse,
      response: fallbackResponse,
      debugError: error.message
    });
  }
});

module.exports = router;
