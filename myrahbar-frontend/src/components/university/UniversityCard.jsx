"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Star, Heart, ArrowRight, Calendar, BookOpen, Clock } from "lucide-react";
import { useWatchlistStore } from "@/store";
import { daysUntilDeadline } from "@/utils/merit";

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
  return (3.8 + (h % 100) / 100).toFixed(1);
}

function getFakeReviewCount(name) {
  const h = hashString(name + "_reviews");
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
  const router = useRouter();
  const { isWatched, addUniversity, removeUniversity } = useWatchlistStore();

  if (!uni) return null;

  const uniId = uni._id || uni.id;
  const watched = isWatched(uniId);

  const toggleWatch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (watched) {
      removeUniversity(uniId);
      if (typeof window !== "undefined") {
        try {
          const auth = JSON.parse(localStorage.getItem("rahbar-auth") || "{}");
          const token = auth?.state?.token;
          if (token) {
            fetch(`/api/watchlist/${uniId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }).catch(() => {});
          }
        } catch {}
      }
    } else {
      addUniversity({ ...uni, id: uniId });
      if (typeof window !== "undefined") {
        try {
          const auth = JSON.parse(localStorage.getItem("rahbar-auth") || "{}");
          const token = auth?.state?.token;
          if (token) {
            fetch("/api/watchlist", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ universityId: uniId, sendConfirmation: true }),
            }).catch(() => {});
          }
        } catch {}
      }
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    router.push(`/university/${uni.slug}`);
  };

  let closestDeadlineDays = null;
  if (uni.admissionDeadlines?.length > 0) {
    uni.admissionDeadlines.forEach((dl) => {
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
  const displayCategories =
    categories.length > 0
      ? categories.slice(0, 2).join(", ") + (categories.length > 2 ? ", ..." : "")
      : "General";

  const rating = getFakeRating(uni.name);
  const reviewCount = getFakeReviewCount(uni.name);
  const deadlineFormatted = uni.admissionDeadline
    ? formatDeadlineDate(uni.admissionDeadline)
    : null;

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative p-5 md:p-6"
    >
      {/* Mobile Heart Button (Absolute top right) */}
      <button
        type="button"
        aria-label="Add to Watchlist"
        onClick={toggleWatch}
        className="absolute top-5 right-5 p-2.5 bg-slate-50 rounded-full shadow-sm z-10 border border-slate-100 hover:bg-slate-100 transition-colors"
      >
        <Heart
          size={18}
          className={watched ? "text-red-500 fill-red-500" : "text-slate-400"}
        />
      </button>

      {/* TOP SECTION: Initials & Title */}
      <div className="flex items-start gap-4 mb-5 pr-12">
        {/* Avatar / Initials */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #0F172A, #2563EB)",
            fontFamily: "Sora",
          }}
        >
          {uni.shortName ? uni.shortName.slice(0, 3).toUpperCase() : uni.name?.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex-1 pt-0.5">
          <div className="flex flex-wrap gap-2 mb-2">
            <span
              className={
                "text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded shadow-sm " +
                (uni.type === "government"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-600 text-white")
              }
            >
              {uni.type === "government" ? "Govt" : "Private"}
            </span>
            <span
              className={
                "text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded shadow-sm " +
                (isActuallyOpen
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white")
              }
            >
              {isActuallyOpen ? "● Open" : "Closed"}
            </span>
          </div>
          <h3
            className="text-[18px] md:text-[20px] font-bold text-slate-900 leading-tight mb-1.5 group-hover:text-blue-600 transition-colors"
            style={{ fontFamily: "Sora" }}
          >
            {uni.name}
          </h3>
          <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" />
            {uni.city || "Karachi"}
            {uni.province ? `, ${uni.province}` : ""}
          </p>
        </div>
      </div>

      {/* MIDDLE SECTION: Pricing & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
            Estimated Fee
          </div>
          <div className="text-[17px] font-bold text-slate-800 whitespace-nowrap">
            PKR {feeRange}{" "}
            <span className="text-[12px] text-slate-400 font-normal">/ sem</span>
          </div>
        </div>
        <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
            Admission Status
          </div>
          {isActuallyOpen ? (
            <div className="text-[13px] font-bold text-emerald-600 whitespace-nowrap flex items-center gap-1.5">
              {daysLeft === 0 ? (
                <>
                  <Clock size={14} /> Deadline Today
                </>
              ) : daysLeft ? (
                <>
                  <Clock size={14} /> {daysLeft} Days Left
                </>
              ) : (
                "Admissions Open"
              )}
            </div>
          ) : (
            <div className="text-[13px] font-medium text-slate-400 whitespace-nowrap">
              Admissions Closed
            </div>
          )}
        </div>
      </div>

      {/* INFO TAGS */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-[12px]">
        <span className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-medium">
          <BookOpen size={14} className="text-slate-400" />
          {displayCategories}
        </span>
        {uni.testRequired && (
          <span className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded-lg">
            <Calendar size={14} />
            {uni.testRequired}
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

      {/* BOTTOM ROW: Stats & Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[13px] font-medium">
          <div className="flex items-center gap-1.5">
            <BookOpen size={15} className="text-slate-400" />
            <span>{uni.departments?.length || 5}+ Depts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={15} className="text-amber-400 fill-amber-400" />
            <span className="text-slate-700 font-bold">{rating}</span>
            <span className="text-slate-400 text-[12px]">({reviewCount})</span>
          </div>
        </div>

        <Link
          href={`/university/${uni.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="flex justify-center items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-[13px] font-bold rounded-xl shadow-sm transition-all duration-300 w-full sm:w-auto"
        >
          View Details
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
