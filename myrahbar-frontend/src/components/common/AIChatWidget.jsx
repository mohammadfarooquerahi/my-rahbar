import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

const SYSTEM = `You are MyRahbar AI, a helpful guide for Pakistani students.
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
        "Assalamu Alaikum! I am your MyRahbar AI guide. Ask me anything about university admissions, merit calculation, scholarships, or career guidance in Pakistan ðŸŽ“",
    },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const updated = [.
<truncated 4883 bytes>
ms-center h-4">
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
