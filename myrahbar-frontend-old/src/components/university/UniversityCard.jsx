import { useState, useEffect } from "react";
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
  // Keep closestDeadlineDays for display label only (showing days left)
  if (uni.admissionDeadlines?.length > 0) {
    uni.admissionDeadlines.forEach(dl => {
      if (dl.deadline) {
        const days = daysUntilDeadline(dl.deadline);
        if (days !== null) {
          if (closestDeadlineDays === null || days < closestDeadlineDays) {
            closestDeadlineDays = days;
          }
        }
      }
    });
  }
  if (closestDeadlineDays === null && uni.admissionDeadline) {
    closestDeadlineDays = daysUntilDeadline(uni.admissionDeadline);
  }

  // Trust backend's auto-computed value — don't re-derive on frontend
  const isActuallyOpen = uni.admissionOpen === true;
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
  const displayCategories = categories.length > 0 ? categories.slice(0, 2).join(", ") + (categories.length > 2 ? ", ..." : "") : "General";

  const rating = getFakeRating(uni.name);
  const reviewCount = getFakeReviewCount(uni.name);
  const deadlineFormatted = uni.admissionDeadline
    ? formatDeadlineDate(uni.admissionDeadline)
    : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative p-5 md:p-6">
      
      {/* Mobile Heart Button (Absolute top right) */}
      <button aria-label="Add to Watchlist" onClick={toggleWatch}
        className="absolute top-5 right-5 p-2.5 bg-slate-50 rounded-full shadow-sm z-10 border border-slate-100 hover:bg-slate-100 transition-colors"
      >
        <Heart size={18} className={watched ? "text-red-500" : "text-slate-400"} fill={watched ? "currentColor" : "none"} />
      </button>

      {/* ── TOP SECTION: Initials & Title ── */}
      <div className="flex items-start gap-4 mb-5 pr-12">
        {/* Avatar / Initials */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm" style={{ background: "linear-gradient(135deg, var(--navy), #3b82f6)", fontFamily: "Sora" }}>
          {uni.shortName ? uni.shortName.slice(0, 2) : uni.name?.slice(0, 2)}
        </div>
        
        <div className="flex-1 pt-0.5">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={"text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded shadow-sm " + (uni.type === "government" ? "bg-blue-600 text-white" : "bg-purple-600 text-white")}>
              {uni.type === "government" ? "Govt" : "Private"}
            </span>
            <span className={"text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded shadow-sm " + (isActuallyOpen ? "bg-emerald-500 text-white" : "bg-red-500 text-white")}>
              {isActuallyOpen ? "● Open" : "Closed"}
            </span>
          </div>
          <h3 className="text-[19px] md:text-[21px] font-bold text-slate-900 leading-tight mb-1.5" style={{ fontFamily: "Sora" }}>
            {uni.name}
          </h3>
          <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" /> 
            {uni.city || "Karachi"} {uni.province ? `, ${uni.province}` : ""}
          </p>
        </div>
      </div>

      {/* ── MIDDLE SECTION: Pricing & Badges ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div>
          <div className="text-[12px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Estimated Fee</div>
          <div className="text-[18px] font-bold text-slate-800 whitespace-nowrap">
            PKR {feeRange} <span className="text-[12px] text-slate-400 font-normal">/ sem</span>
          </div>
        </div>
        <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
        <div>
          <div className="text-[12px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Admission Status</div>
          {isActuallyOpen ? (
            <div className="text-[13px] font-bold text-emerald-600 whitespace-nowrap flex items-center gap-1.5">
              {daysLeft === 0 ? <><Clock size={14}/> Deadline Today</> : daysLeft ? <><Clock size={14}/> {daysLeft} Days Left</> : "Admissions Open"}
            </div>
          ) : (
            <div className="text-[13px] font-medium text-slate-400 whitespace-nowrap">
              Admissions Closed
            </div>
          )}
        </div>
      </div>

      {/* ── INFO TAGS ── */}
      <div className="flex flex-wrap items-center gap-2.5 mb-5 text-[12.5px]">
        <span className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-medium">
          <BookOpen size={14} className="text-slate-400" />
          {displayCategories}
        </span>
        {uni.testRequired && (
          <span className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded-lg">
            <Calendar size={14} />
            {uni.testRequired} {uni.testDate && `(${formatDeadlineDate(uni.testDate)})`}
          </span>
        )}
        {uni.admissionDeadline && deadlineFormatted && (
          <span className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-medium">
            Deadline: <span className="font-semibold text-slate-800">{deadlineFormatted}</span>
          </span>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* ── BOTTOM ROW: Stats & Buttons ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 pt-4 border-t border-slate-100">
        
        <div className="flex flex-wrap items-center gap-5 text-slate-500 text-[13px] font-medium">
          <div className="flex items-center gap-1.5">
            <BookOpen size={15} className="text-slate-400"/>
            <span>{uni.departments?.length || 5}+ Depts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={15} className="text-amber-400" fill="currentColor"/>
            <span className="text-slate-700 font-bold">{rating}</span>
            <span className="text-slate-400 text-[12px]">({reviewCount} reviews)</span>
          </div>
        </div>

        <Link
          to={`/university/${uni.slug}`}
          className="flex justify-center items-center gap-2 px-8 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-[13.5px] font-bold rounded-lg shadow-sm transition-all duration-300 w-full sm:w-auto"
        >
          View Details
          <ArrowRight size={15} />
        </Link>

      </div>
    </div>
  );
}
