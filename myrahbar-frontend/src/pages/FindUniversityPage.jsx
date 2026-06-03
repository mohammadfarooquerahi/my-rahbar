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
      { label: "Low — Under PKR 30,000", value: "low" },
      { label: "Medium — PKR 30,000 to 80,000", value: "medium" },
      { label: "High — Above PKR 80,000", value: "high" },
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
    key: "scholarship",
    question: "Do you need a scholarship?",
    options: [
      { label: "Yes — I need financial support", value: "yes" },
      { label: "No — I can manage fees", value: "no" },
    ],
  },
  {
    key: "hostel",
    question: "Do you need hostel accommodation?",
    options: [
      { label: "Yes — I need hostel", value: "yes" },
      { label: "No — I will commute", value: "no" },
    ],
  },
  {
    key: "result",
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
    question: "Which seat type are you applying for?",
    options: [
      { label: "Merit Seat", value: "merit" },
      { label: "Self-Finance Seat", value: "selfFinance" },
      { label: "Not Sure Yet", value: "any" },
    ],
  },
  {
    key: "coeducation",
    question: "Do you prefer co-education?",
    options: [
      { label: "Yes — co-education is fine", value: "yes" },
      { label: "No — single gender preferred", value: "no" },
      { label: "Does not matter to me", value: "any" },
    ],
  },
  {
    key: "distance",
    question: "How far are you willing to travel for university?",
    options: [
      { label: "Close to home only", value: "close" },
      { label: "Anywhere in Karachi", value: "karachi" },
      { label: "Other cities also fine", value: "anywhere" },
    ],
  },
  {
    key: "priority",
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
    const fieldMatch = uni.departments.some(
      (d) => d.category === answers.field,
    );
    if (fieldMatch) score += 30;

    // Budget match
    const avgFee = uni.departments[0]?.semesterFee || 0;
    if (answers.budget === "low" && avgFee < 30000) score += 20;
    if (answers.budget === "medium" && avgFee >= 30000 && avgFee <= 80000)
      score += 20;
    if (answers.budget === "high" && avgFee > 80000) score += 20;

    // Sector match
    if (answers.sector === "any" || answers.sector === uni.type) score += 15;

    // Scholarship need
    if (answers.scholarship === "yes" && uni.scholarships.length > 0)
      score += 10;

    // Hostel need
    if (answers.hostel === "yes" && uni.hostelAvailable) score += 10;
    if (answers.hostel === "no" && !uni.hostelAvailable) score += 5;

    // Result vs last merit
    const resultMap = { aplus: 90, a: 85, b: 75, c: 65 };
    const resultScore = resultMap[answers.result] || 70;
    const deptMatch = uni.departments.find((d) => d.category === answers.field);
    if (deptMatch?.lastMerit?.[0]) {
      if (resultScore >= deptMatch.lastMerit[0].closing) score += 15;
    }

    return { uni, score: Math.min(score, 100) };
  })
    .filter((r) => r.score > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
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

  const question = QUESTIONS[currentStep];
  const totalSteps = QUESTIONS.length;
  const progress = (currentStep / totalSteps) * 100;

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

  const handleReset = () => {
    reset();
    setFinished(false);
  };

  const selectedAnswer = answers[question?.key];
  const canGoNext = !!selectedAnswer;

  // Score color
  const scoreColor = (score) => {
    if (score >= 70) return "text-green-600 bg-green-50";
    if (score >= 50) return "text-orange-500 bg-orange-50";
    return "text-blue-600 bg-blue-50";
  };

  return (
    <>
      <Helmet>
        <title>Find My University — Smart Matcher | MyRahbar</title>
        <meta
          name="description"
          content="Answer 10 questions and MyRahbar will match you to the best university in Karachi based on your budget, field, and goals."
        />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "Sora", color: "var(--navy)" }}
          >
            Find Your Best University
          </h1>
          <p className="text-slate-500">
            Answer {totalSteps} simple questions — we will match you to your
            best options
          </p>
        </div>

        {/* Results screen */}
        {finished ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "Sora", color: "var(--navy)" }}
              >
                Your Best Matches
              </h2>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
              >
                <RotateCcw size={14} />
                Retake Quiz
              </button>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500 mb-4">
                  No strong matches found. Try adjusting your preferences.
                </p>
                <button
                  onClick={handleReset}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Retake the quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map(({ uni, score }, i) => (
                  <div
                    key={uni.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {/* Rank badge */}
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                          style={{ background: "var(--navy)" }}
                        >
                          {i + 1}
                        </div>

                        <div>
                          <h3
                            className="font-bold text-slate-800"
                            style={{ fontFamily: "Sora" }}
                          >
                            {uni.name}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin size={11} /> {uni.city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star
                                size={11}
                                className="text-amber-400"
                                fill="currentColor"
                              />
                              {uni.overallRating}
                            </span>
                            <span
                              className={
                                uni.type === "government"
                                  ? "text-blue-600"
                                  : "text-purple-600"
                              }
                            >
                              {uni.type === "government"
                                ? "Government"
                                : "Private"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Match score */}
                      <div
                        className={
                          "text-center px-3 py-1.5 rounded-xl font-bold shrink-0 " +
                          scoreColor(score)
                        }
                      >
                        <p
                          className="text-lg"
                          style={{ fontFamily: "DM Mono" }}
                        >
                          {score}%
                        </p>
                        <p className="text-xs font-normal">match</p>
                      </div>
                    </div>

                    {/* Department tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {uni.departments.slice(0, 3).map((d) => (
                        <span
                          key={d.name}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                        >
                          {d.name}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Link
                        to={"/university/" + uni.slug}
                        className="flex-1 text-center py-2 text-sm font-medium text-white rounded-xl"
                        style={{ background: "var(--navy)" }}
                      >
                        View Details
                      </Link>
                      <Link
                        to={"/merit-calculator?uni=" + uni.slug}
                        className="flex-1 text-center py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100"
                      >
                        Check Merit
                      </Link>
                    </div>
                  </div>
                ))}

                <div className="text-center pt-4">
                  <Link
                    to="/search"
                    className="text-sm text-slate-500 hover:text-slate-700 hover:underline"
                  >
                    See all universities →
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Quiz screen
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Progress bar */}
            <div className="h-1.5 bg-slate-100">
              <div
                className="h-full transition-all duration-300"
                style={{ width: progress + "%", background: "var(--green)" }}
              />
            </div>

            <div className="p-6 md:p-8">
              {/* Step counter */}
              <div className="flex items-center justify-between mb-6">
                <span
                  className="text-xs font-medium text-slate-400"
                  style={{ fontFamily: "DM Mono" }}
                >
                  Question {currentStep + 1} of {totalSteps}
                </span>
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                )}
              </div>

              {/* Question */}
              <h2
                className="text-xl font-bold text-slate-800 mb-6"
                style={{ fontFamily: "Sora" }}
              >
                {question.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.value;
                  return (
                    <button
                      key={opt.value}
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
