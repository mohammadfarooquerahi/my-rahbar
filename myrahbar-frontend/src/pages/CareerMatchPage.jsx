import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Send, Bot, User, Sparkles } from "lucide-react";

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
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      inputRef.current?.focus();
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
        <link rel="canonical" href="https://myrahbar.com/career-match" />
        <meta property="og:title" content="AI Career Counselor | MyRahbar" />
        <meta property="og:description" content="Confused about your career? Chat with our AI counselor about degrees, scope, and admissions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myrahbar.com/career-match" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="AI Career Counselor" />
        <meta name="twitter:description" content="Confused about your career? Chat with our AI counselor about degrees, scope, and admissions." />
      </Helmet>

      {/* Full-screen chat layout — fills viewport below navbar */}
      <div
        className="flex flex-col"
        style={{ height: "calc(100vh - 64px)" }}
      >
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
            {/* Header — only shown at the top */}
            {messages.length <= 1 && (
              <div className="text-center py-4 fade-up">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  <Sparkles size={26} className="text-white" />
                </div>
                <h1
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "Outfit", color: "var(--navy)" }}
                >
                  AI Career Counselor
                </h1>
                <p className="text-slate-500 text-sm">
                  Ask any question about careers, degrees, and job market in Pakistan
                </p>

                {/* Starter questions */}
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-xs bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700 hover:shadow-sm px-3 py-2 rounded-xl transition-all text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  "flex gap-3 fade-up " +
                  (m.role === "user" ? "flex-row-reverse" : "")
                }
              >
                {/* Avatar */}
                <div
                  className={
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 " +
                    (m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200 shadow-sm")
                  }
                >
                  {m.role === "user" ? (
                    <User size={14} />
                  ) : (
                    <Bot size={14} className="text-indigo-600" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap " +
                    (m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white text-slate-700 border border-slate-100 shadow-sm rounded-tl-sm")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3 fade-up">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  <Bot size={14} className="text-indigo-600" />
                </div>
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center">
                    <span
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input bar — sticky at bottom */}
        <div className="bg-white border-t border-slate-200 px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-1">
              <Sparkles size={15} className="text-indigo-400 shrink-0" />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about careers, salaries, or which degree to choose..."
                className="flex-1 bg-transparent py-2.5 text-sm outline-none text-slate-700 placeholder:text-slate-400"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl text-white disabled:opacity-40 transition-all hover:scale-105 shrink-0"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-xs text-center text-slate-400 mt-1.5">
              AI guidance only — always verify with official university sources
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
