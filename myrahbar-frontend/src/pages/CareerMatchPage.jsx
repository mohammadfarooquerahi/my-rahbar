import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Briefcase, Send, Bot, User, Sparkles } from "lucide-react";

const SYSTEM_PROMPT = `You are a career counselor for Pakistani students.
You help students choose the right degree, university, and career path in Pakistan.

You know about:
- Job market in Pakistan for different fields (IT, Engineering, Medicine, Business, Law, Arts)
- Which degrees have best career prospects in Pakistan
- Salary ranges in Pakistan for different professions
- Which Karachi universities are best for which fields
- Internship and entry level job advice for fresh graduates
- HEC recognized degrees and their scope

Keep answers short, friendly, and practical.
Always give honest advice — if a field has limited jobs, say so.
Use PKR for salaries. Focus on Pakistan job market.

If someone asks anything unrelated to careers or education, say:
"I am here to help with career and education guidance for Pakistani students only."
`;

const STARTER_QUESTIONS = [
  "I finished FSc Pre-Medical. Should I go for MBBS or try CS?",
  "What careers are available after BBA in Pakistan?",
  "Is software engineering a good field in Pakistan right now?",
  "I scored 75% in FSc. What are my best options?",
  "What is the salary of a software engineer in Karachi?",
];

export default function CareerMatchPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Assalamu Alaikum! I am your AI Career Counselor 🎯

I can help you with:
- Which degree to choose based on your results
- Career scope and salary in Pakistan
- Best universities for your field
- Job market advice for fresh graduates

What is your question?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const updated = [...messages, { role: "user", content: msg }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "career",
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, could not connect. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Career Counselor — Find Your Path | MyRahbar</title>
        <meta
          name="description"
          content="Get AI-powered career guidance for Pakistani students. Ask about degrees, job prospects, salaries and the best universities for your field."
        />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#FEF2F2" }}
          >
            <Briefcase size={26} style={{ color: "#E74C3C" }} />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "Sora", color: "var(--navy)" }}
          >
            AI Career Counselor
          </h1>
          <p className="text-slate-500">
            Ask any question about careers, degrees, and job market in Pakistan
          </p>
        </div>

        {/* Starter questions */}
        <div className="mb-5">
          <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">
            Students usually ask:
          </p>
          <div className="flex flex-wrap gap-2">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700 px-3 py-1.5 rounded-xl transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col"
          style={{ height: "500px" }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  "flex gap-3 " + (m.role === "user" ? "flex-row-reverse" : "")
                }
              >
                {/* Avatar */}
                <div
                  className={
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 " +
                    (m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200")
                  }
                >
                  {m.role === "user" ? (
                    <User size={14} />
                  ) : (
                    <Bot size={14} className="text-slate-600" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap " +
                    (m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                  <Bot size={14} className="text-slate-600" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-1">
              <Sparkles size={15} className="text-slate-400 shrink-0" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about careers, salaries, or which degree to choose..."
                className="flex-1 bg-transparent py-2.5 text-sm outline-none text-slate-700 placeholder:text-slate-400"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="p-1.5 rounded-lg text-white disabled:opacity-40 transition-opacity shrink-0"
                style={{ background: "var(--navy)" }}
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-xs text-center text-slate-400 mt-2">
              AI guidance only — always verify with official university sources
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
