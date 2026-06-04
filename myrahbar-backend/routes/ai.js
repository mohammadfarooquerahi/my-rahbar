const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();

// Groq ko initialize karein (Yeh automatically aap ki .env se GROQ_API_KEY utha lega)
const groq = new Groq();

const EDU_SYSTEM = `You are MyRahbar AI, a helpful guide for Pakistani students.
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

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  try {
    const { messages, type } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Messages array required" });
    }

    const systemPrompt = type === "career" ? CAREER_SYSTEM : EDU_SYSTEM;

    // Groq ke mutabiq system prompt ko messages array ke shuru mein add karein
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // Groq API Call
    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: "llama-3.1-8b-instant", // Groq ka fast aur free model
      max_tokens: 1000,
    });

    const text =
      chatCompletion.choices[0]?.message?.content ||
      "Sorry I could not get a response. Please try again.";

    // Frontend ke crash hone se bachane ke liye dono keys response mein send karein
    res.json({
      reply: text,
      response: text,
    });
  } catch (error) {
    console.error("Groq AI Error:", error);
    res.status(500).json({ message: "AI service error: " + error.message });
  }
});

module.exports = router;
