import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

const SYSTEM = `You are Rahbars AI, a helpful guide for Pakistani students.
You ONLY answer questions about:
- Universities in Pakistan (especially Karachi)
- Admission process, merit, aggregate calculation
- Scholarships, fee structure, hostel
- Career paths and degree selection
- Required documents for admission

If someone asks anything unrelated, say:
"I am only here to help with university admissions and education in Pakistan. Ask me about universities, merit, or career guidance!"

Be friendly, brief, and supportive. Use PKR for amounts.`;

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Assalamu Alaikum! I am your Rahbars AI guide. Ask me anything about university admissions, merit calculation, scholarships, or career guidance in Pakistan 🎓",
    },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const updated = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "edu",
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
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center pulse-green"
          style={{ background: "var(--green)" }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 w-80 md:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden bg-white border border-slate-200"
          style={{ height: "480px" }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between text-white"
            style={{ background: "var(--navy)" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ fontFamily: "Sora" }}
                >
                  Rahbar AI Guide
                </p>
                <p className="text-xs text-blue-200">Education help only</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  "flex gap-2 " + (m.role === "user" ? "flex-row-reverse" : "")
                }
              >
                <div
                  className={
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 " +
                    (m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200")
                  }
                >
                  {m.role === "user" ? (
                    <User size={13} />
                  ) : (
                    <Bot size={13} className="text-slate-600" />
                  )}
                </div>
                <div
                  className={
                    "max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed " +
                    (m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                  <Bot size={13} className="text-slate-600" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-3 py-2">
                  <div className="flex gap-1 items-center h-4">
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

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about admissions, merit..."
                className="flex-1 bg-transparent py-1.5 text-sm outline-none text-slate-700 placeholder:text-slate-400"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="p-1.5 rounded-lg text-white disabled:opacity-40 transition-opacity"
                style={{ background: "var(--navy)" }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
