import { Link } from "react-router-dom";
import { MapPin, Star, Heart, ArrowRight, Calendar, BookOpen, Clock, Users } from "lucide-react";
import { useWatchlistStore } from "../../store/index";
import { daysUntilDeadline } from "../../utils/merit";

// Generate a consistent pseudo-random number from a string (uni name hash)
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < (str || "").length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function getFakeRating(name) {
  const h = hashString(name);
  // Rating between 3.8 and 4.8
  return (3.8 + (h % 100) / 100).toFixed(1);
}

function getFakeReviewCount(name) {
  const h = hashString(name + "_reviews");
  // Review count between 5 and 10
  return 5 + (h % 6);
}

function formatDeadlineDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

export default function UniversityCard({ uni }) {
  const { isWatched, addUniversity, removeUniversity } = useWatchlistStore();

  if (!uni) return null;

  const uniId = uni._id || uni.id;
  const watched = isWatched(uniId);

  const toggleWatch = (e) => {
    e.preventDefault();
    if (watched) {
      removeUniversity(uniId);
    } else {
      addUniversity({ ...uni, id: uniId });
    }
  };

  let closestDeadlineDays = null;
  if (uni.admissionDeadline) {
    const days = daysUntilDeadline(uni.admissionDeadline);
    if (days !== null && days >= 0) closestDeadlineDays = days;
  }
  if (uni.admissionDeadlines?.length > 0) {
    uni.admissionDeadlines.forEach(dl => {
      if (dl.deadline) {
        const days = daysUntilDeadline(dl.deadline);
        if (days !== null && days >= 0) {
          if (closestDeadlineDays === null || days < closestDeadlineDays) {
            closestDeadlineDays = days;
          }
        }
      }
    });
  }

  const isActuallyOpen = uni.admissionOpen || (closestDeadlineDays !== null && closestDeadlineDays >= 0);
  const daysLeft = closestDeadlineDays;

  let feeRange = "N/A";
  if (uni.departments && uni.departments.length > 0) {
    const fees = uni.departments.map((d) => d.semesterFee).filter((f) => f > 0);
    if (fees.length > 0) {
      const minFee = Math.min(...fees);
      const maxFee = Math.max(...fees);
      feeRange =
        minFee === maxFee
          ? `${(minFee / 1000).toFixed(0)}k`
          : `${(minFee / 1000).toFixed(0)}k - ${(maxFee / 1000).toFixed(0)}k`;
    }
  }

  const categories = [
    ...new Set((uni.departments || []).map((d) => d.category)),
  ];
  const topCategory = categories.length > 0 ? categories[0] : "General";

  const rating = getFakeRating(uni.name);
  const reviewCount = getFakeReviewCount(uni.name);
  const deadlineFormatted = uni.admissionDeadline
    ? formatDeadlineDate(uni.admissionDeadline)
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-100/50 group">
      {/* ── Card Body ── */}
      <div className="p-5 flex-1 relative">
        {/* Heart / Watchlist Button */}
        <button
          onClick={toggleWatch}
          className={
            "absolute top-4 right-4 p-2.5 rounded-full shadow-md z-10 transition-all duration-300 hover:scale-125 active:scale-95 " +
            (watched
              ? "bg-gradient-to-br from-pink-500 to-red-500 shadow-red-200"
              : "bg-white/90 backdrop-blur-sm hover:bg-red-50 shadow-slate-200")
          }
          title={watched ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Heart
            size={20}
            className={
              "transition-colors duration-200 " +
              (watched ? "text-white" : "text-slate-400 group-hover:text-red-400")
            }
            fill={watched ? "currentColor" : "none"}
            strokeWidth={watched ? 0 : 2}
          />
        </button>

        {/* Header: Avatar + Badges + Name */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md"
            style={{
              background: "linear-gradient(135deg, var(--navy), #4338ca)",
              fontFamily: "Sora",
            }}
          >
            {uni.shortName ? uni.shortName.slice(0, 2) : uni.name?.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 mb-1">
              <span
                className={
                  "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full " +
                  (uni.type === "government"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-purple-50 text-purple-700")
                }
              >
                {uni.type === "government" ? "Govt" : "Private"}
              </span>
              <span
                className={
                  "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full " +
                  (isActuallyOpen
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700")
                }
              >
                {isActuallyOpen ? "● Open" : "Closed"}
              </span>
            </div>
            <h3
              className="font-bold text-slate-800 line-clamp-1 mt-1 text-[15px]"
              style={{ fontFamily: "Sora", color: "var(--navy)" }}
              title={uni.name}
            >
              {uni.shortName || uni.name}
            </h3>
          </div>
        </div>

        {/* Full Name */}
        <p
          className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed"
          title={uni.name}
        >
          {uni.name}
        </p>

        {/* Rating + Reviews */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={13}
                className={s <= Math.round(parseFloat(rating)) ? "text-amber-400" : "text-slate-200"}
                fill={s <= Math.round(parseFloat(rating)) ? "currentColor" : "currentColor"}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-amber-600">{rating}</span>
          <span className="text-xs text-slate-400">({reviewCount} reviews)</span>
        </div>

        {/* Info Rows */}
        <div className="flex flex-col gap-2.5 text-xs text-slate-500 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-slate-400" />
              {uni.city || "Karachi"}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={13} className="text-slate-400" />
              {topCategory}
            </span>
          </div>

          {/* Fee Range with PKR label */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold tracking-tight bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                PKR
              </span>
              <span className="font-medium text-slate-600">
                {feeRange}
              </span>
              <span className="text-slate-400">/ sem</span>
            </span>
          </div>

          {/* Test Required Badge */}
          {uni.testRequired && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100">
                <Calendar size={13} />
                {uni.testRequired}
                {uni.testDate && (
                  <span className="font-normal normal-case text-indigo-500 ml-1">
                    · {formatDeadlineDate(uni.testDate)}
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Admission Deadline Date */}
          {uni.admissionDeadline && deadlineFormatted && (
            <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
              <Calendar size={13} className="text-slate-400" />
              <span>
                Deadline:{" "}
                <span className="font-semibold text-slate-700">
                  {deadlineFormatted}
                </span>
              </span>
            </div>
          )}

          {/* Urgent Countdown */}
          {isActuallyOpen && daysLeft !== null && daysLeft >= 0 && (
            <div className="flex items-center gap-1.5 font-semibold text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg w-fit mt-1">
              <Clock size={14} className="animate-pulse" />
              {daysLeft === 0
                ? "Deadline Today!"
                : `${daysLeft} Days Left to Apply`}
            </div>
          )}
        </div>
      </div>

      {/* ── CTA Footer ── */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100">
        <Link
          to={`/university/${uni.slug}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
          }}
        >
          View Details
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
