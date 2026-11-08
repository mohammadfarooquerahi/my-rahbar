"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Check,
  Star,
  MapPin,
  RotateCcw,
  Sparkles,
  School,
  GraduationCap,
} from "lucide-react";
import { KARACHI_UNIVERSITIES } from "@/data/universities";
import { useQuizStore } from "@/store";

const QUESTIONS = [
  {
    key: "field",
    title: "Field",
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
    title: "Budget",
    question: "What is your semester fee budget?",
    options: [
      { label: "Low — Under PKR 30,000", value: "low" },
      { label: "Medium — PKR 30,000 to 80,000", value: "medium" },
      { label: "High — Above PKR 80,000", value: "high" },
    ],
  },
  {
    key: "sector",
    title: "Sector",
    question: "Do you prefer government or private university?",
    options: [
      { label: "Government University", value: "government" },
      { label: "Private University", value: "private" },
      { label: "No Preference", value: "any" },
    ],
  },
  {
    key: "scholarship",
    title: "Scholarship",
    question: "Do you need a scholarship?",
    options: [
      { label: "Yes — I need financial support", value: "yes" },
      { label: "No — I can manage fees", value: "no" },
    ],
  },
  {
    key: "hostel",
    title: "Hostel",
    question: "Do you need hostel accommodation?",
    options: [
      { label: "Yes — I need hostel", value: "yes" },
      { label: "No — I will commute", value: "no" },
    ],
  },
  {
    key: "result",
    title: "Result",
    question: "What is your expected FSc / Matric result?",
    options: [
      { label: "A+ — 90% and above", value: "aplus" },
      { label: "A  — 80% to 89%", value: "a" },
      { label: "B  — 70% to 79%", value: "b" },
      { label: "C  — 60% to 69%", value: "c" },
    ],
  },
  {
    key: "seat",
    title: "Seat Type",
    question: "Which seat type are you applying for?",
    options: [
      { label: "Merit Seat", value: "merit" },
      { label: "Self-Finance Seat", value: "selfFinance" },
      { label: "Not Sure Yet", value: "any" },
    ],
  },
  {
    key: "coeducation",
    title: "Co-Ed",
    question: "Do you prefer co-education?",
    options: [
      { label: "Yes — co-education is fine", value: "yes" },
      { label: "No — single gender preferred", value: "no" },
      { label: "Does not matter to me", value: "any" },
    ],
  },
  {
    key: "distance",
    title: "Location",
    question: "How far are you willing to travel for university?",
    options: [
      { label: "Close to home only", value: "close" },
      { label: "Anywhere in Karachi", value: "karachi" },
      { label: "Other cities also fine", value: "anywhere" },
    ],
  },
  {
    key: "priority",
    title: "Priority",
    question: "What matters most to you when choosing a university?",
    options: [
      { label: "Low fee and affordability", value: "fee" },
      { label: "Strong job placement", value: "jobs" },
      { label: "University reputation", value: "reputation" },
      { label: "Scholarship availability", value: "scholarship" },
    ],
  },
];

// Simple matching logic
function matchUniversities(answers) {
  return KARACHI_UNIVERSITIES.map((uni) => {
    let score = 0;

    // Field match
    const fieldMatch = uni.departments?.some(
      (d) => d.category === answers.field,
    );
    if (fieldMatch) score += 30;

    // Budget match
    const avgFee = uni.departments?.[0]?.semesterFee || 0;
    if (answers.budget === "low" && avgFee < 30000) score += 20;
    if (answers.budget === "medium" && avgFee >= 30000 && avgFee <= 80000)
      score += 20;
    if (answers.budget === "high" && avgFee > 80000) score += 20;

    // Sector match
    if (answers.sector === "any" || answers.sector === uni.type) score += 15;

    // Scholarship need
    if (answers.scholarship === "yes" && uni.scholarships?.length > 0)
      score += 10;

    // Hostel need
    if (answers.hostel === "yes" && uni.hostelAvailable) score += 10;
    if (answers.hostel === "no" && !uni.hostelAvailable) score += 5;

    // Result vs last merit
    const resultMap = { aplus: 90, a: 85, b: 75, c: 65 };
    const resultScore = resultMap[answers.result] || 70;
    const deptMatch = uni.departments?.find((d) => d.category === answers.field);
    if (deptMatch?.lastMerit?.[0]) {
      if (resultScore >= deptMatch.lastMerit[0].closing) score += 15;
    }

    return { uni, score: Math.min(score, 100) };
  })
    .filter((r) => r.score > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export default function FindUniversityPage() {
  const {
    answers,
    currentStep,
    setAnswer,
    nextStep,
    prevStep,
    results,
    setResults,
    reset,
  } = useQuizStore();
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[currentStep] || QUESTIONS[0];
  const totalSteps = QUESTIONS.length;
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleSelect = (value) => {
    setAnswer(question.key, value);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      nextStep();
    } else {
      // Last question — run matching
      const matched = matchUniversities(answers);
      setResults(matched);
      setFinished(true);
    }
  };

  const handleBack = () => {
    if (finished) {
      setFinished(false);
    } else {
      prevStep();
    }
  };

  const handleJumpToStep = (index) => {
    if (finished) setFinished(false);
    const store = useQuizStore.getState();
    if (index > currentStep) {
      for (let i = currentStep; i < index; i++) store.nextStep();
    } else if (index < currentStep) {
      for (let i = currentStep; i > index; i--) store.prevStep();
    }
  };

  const handleReset = () => {
    reset();
    setFinished(false);
  };

  const selectedAnswer = answers[question?.key];
  const canGoNext = !!selectedAnswer;

  // Score color
  const scoreColor = (score) => {
    if (score >= 70) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 50) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-blue-700 bg-blue-50 border-blue-200";
  };

  return (
    <main className="min-h-[85vh] bg-slate-50/60 pb-12 pt-4 md:pt-6 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Compact Hero Header */}
        <div className="text-center mb-4 md:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles size={13} className="text-blue-600" />
            AI-Powered Smart Matcher
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Find Your Best University
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
            Answer 10 quick questions — our algorithm finds the highest-matching universities in Pakistan for you
          </p>
        </div>

        {/* Results Screen */}
        {finished ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2
                  className="text-xl sm:text-2xl font-bold text-slate-900"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  🎯 Your Best University Matches
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Showing top {results.length} matches based on your preferences
                </p>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                Retake Quiz
              </button>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <School size={40} className="mx-auto text-slate-400 mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No strong matches found</h3>
                <p className="text-sm text-slate-500 mt-1 mb-4 max-w-md mx-auto">
                  Try adjusting your budget, degree sector, or admission criteria to see more universities.
                </p>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Adjust Preferences & Retake
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map(({ uni, score }, i) => (
                  <div
                    key={uni.id || uni.slug || i}
                    className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="space-y-3">
                      {/* Card Top Strip */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 bg-slate-900">
                            #{i + 1}
                          </div>
                          <div>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                              uni.type === "government"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                            }`}>
                              {uni.type === "government" ? "Government" : "Private"}
                            </span>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className={`text-center px-2.5 py-1 rounded-xl font-bold border shrink-0 ${scoreColor(score)}`}>
                          <p className="text-sm leading-tight font-black" style={{ fontFamily: "DM Mono, monospace" }}>
                            {score}%
                          </p>
                          <p className="text-[10px] font-medium leading-none">match</p>
                        </div>
                      </div>

                      {/* University Name & Location */}
                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors" style={{ fontFamily: "Sora, sans-serif" }}>
                          {uni.name}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" /> {uni.city}
                          </span>
                          {uni.overallRating && (
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <Star size={12} className="text-amber-400 fill-amber-400" /> {uni.overallRating}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Department Tags */}
                      {uni.departments?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {uni.departments.slice(0, 3).map((d) => (
                            <span
                              key={d.name}
                              className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                            >
                              {d.name}
                            </span>
                          ))}
                          {uni.departments.length > 3 && (
                            <span className="text-[11px] text-slate-400 font-medium px-1">
                              +{uni.departments.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                      <Link
                        href={`/university/${uni.slug}`}
                        className="text-center py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/${uni.slug}/merit-cal`}
                        className="text-center py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                      >
                        Check Merit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center pt-2">
              <Link
                href="/search"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Browse all universities in Pakistan →
              </Link>
            </div>
          </div>
        ) : (
          /* Single-Screen Horizontal Questionnaire Card */
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Horizontal Question Stepper Bar (Clickable & Responsive) */}
            <div className="bg-slate-50/80 border-b border-slate-200 px-3 sm:px-6 py-2.5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-blue-600" />
                  Question {currentStep + 1} of {totalSteps}
                </span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {progress}% Completed
                </span>
              </div>

              {/* Horizontal Stepper Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                {QUESTIONS.map((q, idx) => {
                  const isAnswered = !!answers[q.key];
                  const isCurrent = currentStep === idx;
                  return (
                    <button
                      key={q.key}
                      type="button"
                      onClick={() => handleJumpToStep(idx)}
                      title={`Go to ${q.title}`}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-slate-900 text-white shadow-xs"
                          : isAnswered
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {isAnswered && !isCurrent ? (
                        <Check size={11} className="stroke-[3] text-emerald-600" />
                      ) : (
                        <span>{idx + 1}.</span>
                      )}
                      <span>{q.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quiz Body (Sleek, Compact, No Scroll Needed) */}
            <div className="p-4 sm:p-6 md:p-8">
              {/* Question Title & Back Button */}
              <div className="flex items-start justify-between gap-4 mb-4 md:mb-5">
                <div>
                  <h2
                    className="text-lg sm:text-xl font-bold text-slate-900"
                    style={{ fontFamily: "Sora, sans-serif" }}
                  >
                    {question.question}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select an option below to proceed
                  </p>
                </div>
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
              </div>

              {/* Options arranged horizontally in responsive grid */}
              <div
                className={`grid gap-2.5 sm:gap-3 ${
                  question.options.length <= 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : question.options.length <= 4
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {question.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/80 text-blue-950 font-semibold shadow-xs ring-2 ring-blue-500/20"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/90"
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-medium pr-2 leading-snug">
                        {opt.label}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-slate-300 bg-slate-50 group-hover:border-slate-400"
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle size={14} className="stroke-[2.5]" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer Controls: Progress Status & Next Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500 font-medium hidden sm:block">
                  {selectedAnswer ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle size={13} className="text-emerald-600" />
                      Option selected — ready to proceed
                    </span>
                  ) : (
                    <span>Click any card to select your choice</span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="sm:hidden px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      !canGoNext
                        ? "bg-slate-300 cursor-not-allowed opacity-60"
                        : "bg-slate-900 hover:bg-blue-600 shadow-sm hover:shadow"
                    }`}
                  >
                    {currentStep === totalSteps - 1
                      ? "Find My University 🎯"
                      : "Next Question"}
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informative SEO Content Strip */}
        <div className="mt-8 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 text-slate-600 space-y-3">
          <h2
            className="text-base sm:text-lg font-bold text-slate-800"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Find the Best University in Pakistan with Rahbars
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-500">
            Confused about which university matches your career and budget? The <strong>Smart Uni Finder</strong> is designed to help Pakistani students navigate admissions. By answering simple questions regarding your field, budget, location, and FSc score, our algorithm filters through HEC-recognized institutions to find your top matches.
          </p>
        </div>
      </div>
    </main>
  );
}
