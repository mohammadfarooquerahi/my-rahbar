"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

export default function AIChatWidget() {
  const pathname = usePathname();
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
  const messagesContainerRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    if (open) {
      scrollToBottom("smooth");
      const t = setTimeout(() => scrollToBottom("smooth"), 50);
      return () => clearTimeout(t);
    }
  }, [messages, open, loading]);

  // Hide floating widget on full AI chat page and admin
  if (pathname === "/career-match" || pathname?.startsWith("/admin")) {
    return null;
  }

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const updated = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setTimeout(() => scrollToBottom("smooth"), 20);

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
      if (!res.ok) throw new Error(data.message || "Failed to get AI response");
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
          content: "Sorry, could not connect. Please try again.",
        },
      ]);
      setTimeout(() => scrollToBottom("smooth"), 50);
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
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full text-white shadow-xl flex items-center justify-center pulse-green transition-all hover:scale-105 cursor-pointer"
          style={{ background: "var(--green)" }}
          aria-label="Open AI Chat Assistant"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-80 md:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden bg-white border border-slate-200"
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
                <p className="font-semibold text-sm leading-tight">Rahbars AI Guide</p>
                <p className="text-[11px] text-green-300">● Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
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
                    "max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap " +
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
                className="p-1.5 rounded-lg text-white disabled:opacity-40 transition-opacity cursor-pointer"
                style={{ background: "var(--navy)" }}
                aria-label="Send message"
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
