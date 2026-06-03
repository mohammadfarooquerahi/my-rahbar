import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Star,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { KARACHI_UNIVERSITIES } from "../data/universities";
import { useQuizStore } from "../store";

const QUESTIONS = [
  {
    key: "field",
    question: "What field do you want to study?",
    options: [
      { label: "Computer Science / IT", value: "CS" },
      { label: "Engineering", value: "Engineering" },
      { label: "Medical / Health", value: "Medical" },
      { label: "Business / Management", value: "Business" },
      { label: "Arts / Design", value: "Arts" },
      { label: "Architecture", value: "Architecture" },
    ],
  },
  {
    key: "budget",
    question: "What is your semester fee budget?",
    options: [
      { label: "Low â€” Under PKR 30,000", value: "low" },
      { label: "Medium â€” PKR 30,000 to 80,000", value: "medium" },
      { label: "High â€” Above PKR 80,000", value: "high" },
    ],
  },
  {
    key: "sector",
    question: "Do you prefer government or private university?",
    options: [
      { label: "Government University", value: "government" },
      { label: "Private University", value: "private" },
      { label: "No Preference", value: "any" },
    ],
  },
  {

<truncated 14927 bytes>
:                       key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={
                        "w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-medium text-left transition-all " +
                        (isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50")
                      }
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <CheckCircle
                          size={16}
                          className="text-blue-500 shrink-0"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={
                  "mt-6 w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity " +
                  (!canGoNext
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:opacity-90")
                }
                style={{ background: "var(--navy)" }}
              >
                {currentStep === totalSteps - 1
                  ? "Find My University"
                  : "Next Question"}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
