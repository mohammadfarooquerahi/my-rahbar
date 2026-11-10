"use client";
import { useState, useRef, useEffect } from "react";
const Helmet = () => null;
import { Send, Bot, User, Sparkles } from "lucide-react";

const STARTER_QUESTIONS = [
  "I finished FSc Pre-Medical. Should I go for MBBS or try CS?",
  "What careers are available after BBA in Pakistan?",
  "Is software engineering a good field in Pakistan right now?",
  "I scored 75% in FSc. What are my best options?",
  "What is the salary of a software engineer in Karachi?",
];

// Helper to format assistant responses (handles **bold**, bullet points, and newlines)
function formatAssistantMessage(content) {
  if (!content) return null;
  const lines = content.split("\n");
  return lines.map((line, lIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formatted = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    return (
      <span key={lIdx} className="block min-h-[1.25rem]">
        {formatted}
      </span>
    );
  });
}

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
  const messagesContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  };

  // Scroll to latest message whenever messages or loading state changes
  useEffect(() => {
    scrollToBottom("smooth");
    const t = setTimeout(() => scrollToBottom("smooth"), 60);
    return () => clearTimeout(t);
  }, [messages, loading]);

  // Lock outer window scrolling so the page never jumps to the footer
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    inputRef.current?.focus({ preventScroll: true });

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const updated = [...messages, { role: "user", content: msg }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    // Immediately scroll down to reveal the user's message
    setTimeout(() => scrollToBottom("smooth"), 20);

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
      if (!res.ok) throw new Error(data.message || "Failed to fetch response");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
      setTimeout(() => scrollToBottom("smooth"), 50);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, could not connect to AI advisor. Please try again.",
        },
      ]);
      setTimeout(() => scrollToBottom("smooth"), 50);
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
        scrollToBottom("smooth");
      }, 80);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Career Counselor — Find Your Path | Rahbars</title>
        <meta
          name="description"
          content="Get AI-powered career guidance for Pakistani students. Ask about degrees, job prospects, salaries and the best universities for your field."
        />
        <link rel="canonical" href="https://www.rahbars.com/career-match" />
        <meta property="og:title" content="AI Career Counselor | Rahbars" />
        <meta property="og:description" content="Confused about your career? Chat with our AI counselor about degrees, scope, and admissions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rahbars.com/career-match" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="AI Career Counselor" />
        <meta name="twitter:description" content="Confused about your career? Chat with our AI counselor about degrees, scope, and admissions." />
      </Helmet>

      {/* Full-screen chat layout — strictly contained within viewport height below navbar */}
      <div className="flex flex-col flex-1 h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)] max-h-[calc(100dvh-4rem)] md:max-h-[calc(100dvh-5rem)] overflow-hidden bg-slate-50">
        
        {/* Messages area — scrollable container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:py-6 overscroll-contain"
        >
          <div className="max-w-3xl mx-auto space-y-4">
            
            {/* Header / Intro — only shown at the top when starting */}
            {messages.length <= 1 && (
              <div className="text-center py-4 sm:py-6 fade-up">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
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
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Ask any question about degrees, careers, merit, and job market scope in Pakistan
                </p>

                {/* Starter questions */}
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-xs bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700 hover:shadow-sm px-3.5 py-2 rounded-xl transition-all text-left cursor-pointer active:scale-95"
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
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs " +
                    (m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200")
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
                    "max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap " +
                    (m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm shadow-sm"
                      : "bg-white text-slate-700 border border-slate-100 shadow-sm rounded-tl-sm")
                  }
                >
                  {m.role === "user" ? m.content : formatAssistantMessage(m.content)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3 fade-up">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-indigo-600" />
                </div>
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center">
                    <span
                      className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} className="h-1" />
          </div>
        </div>

        {/* Input bar — pinned at bottom */}
        <div className="shrink-0 bg-white border-t border-slate-200 px-4 py-3 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white transition-all border border-transparent focus-within:border-indigo-200">
              <Sparkles size={16} className="text-indigo-500 shrink-0" />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about careers, salaries, or which degree to choose..."
                className="flex-1 bg-transparent py-2 text-sm outline-none text-slate-800 placeholder:text-slate-400"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[11px] text-center text-slate-400 mt-1.5">
              AI guidance only — always verify with official university sources
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
