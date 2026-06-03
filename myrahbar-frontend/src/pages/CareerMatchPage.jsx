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
Always give honest advice â€” if a field has limited jobs, say so.
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
  const [messages, setMessages] = 
<truncated 6496 bytes>
g-slate-400 rounded-full animate-bounce"
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
              AI guidance only â€” always verify with official university sources
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
