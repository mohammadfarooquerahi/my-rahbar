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

  // Array of high quality Unsplash university/campus images
  const placeholderImages = [
    "1541339907198-e08756dedf3f",
    "1523050854058-8df90110c9f1",
    "1562774053716-65f018d09ce4",
    "1498243691581-b145c3f54a5a",
    "1525921429624-479b67ef8956",
    "1503676260728-1c00da094a0b",
    "1607237138185-eedd9c632b0b",
    "1517486808906-6ca8b3f04846"
  ];
  const displayImage = uni.image || `https://images.unsplash.com/photo-${placeholderImages[hashString(uni.name) % placeholderImages.length]}?auto=format&fit=crop&q=80&w=600`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col sm:flex-row transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative">
      
      {/* ── LEFT: Image Area with Gradient Overlay ── */}
      <div className="w-full sm:w-[260px] md:w-[280px] h-[200px] sm:h-auto relative bg-slate-900 flex-shrink-0 border-r border-slate-100 overflow-hidden">
        <img 
          src={displayImage} 
          alt={uni.name} 
          className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent pointer-events-none" />
        
        {/* Mobile Heart Button */}
        <button
          onClick={toggleWatch}
          className="sm:hidden absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full shadow-md z-10 border border-white/20 hover:bg-white/40 transition-colors"
        >
          <Heart size={18} className={watched ? "text-red-500" : "text-white"} fill={watched ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ── RIGHT: Content Area ── */}
      <div className="flex-1 p-5 md:p-6 flex flex-col">
        
        {/* Top Row: Title, location, fee, days left */}
        <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-3 xl:gap-4 mb-4">
          <div className="flex-1">
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

          <div className="xl:text-right flex flex-col xl:items-end shrink-0 w-full xl:w-auto mt-2 xl:mt-0 pt-3 xl:pt-0 border-t xl:border-none border-slate-100">
            <div className="text-[17px] font-bold text-slate-800 whitespace-nowrap">
              PKR {feeRange} <span className="text-[11px] text-slate-400 font-normal uppercase tracking-wider">/ sem</span>
            </div>
            {isActuallyOpen ? (
              <div className="text-[12px] font-bold text-emerald-600 mt-1 whitespace-nowrap flex items-center xl:justify-end gap-1.5 bg-emerald-50 px-2 py-1 rounded-md w-fit xl:w-auto">
                {daysLeft === 0 ? <><Clock size={13}/> Deadline Today</> : daysLeft ? <><Clock size={13}/> {daysLeft} Days Left</> : "Admissions Open"}
              </div>
            ) : (
              <div className="text-[12px] font-medium text-slate-400 mt-1 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md w-fit xl:w-auto">
                Admissions Closed
              </div>
            )}
          </div>
        </div>

        {/* Middle Row: Badges / Tags */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4 text-[12.5px]">
          <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-md font-medium">
            <BookOpen size={14} className="text-slate-400" />
            {displayCategories}
          </span>
          {uni.testRequired && (
            <span className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-md">
              <Calendar size={14} />
              {uni.testRequired} {uni.testDate && `(${formatDeadlineDate(uni.testDate)})`}
            </span>
          )}
          {uni.admissionDeadline && deadlineFormatted && (
            <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-md font-medium">
              Deadline: <span className="font-semibold text-slate-800">{deadlineFormatted}</span>
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Row: Quick Stats & Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 pt-4 border-t border-slate-100">
          
          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[13px] font-medium">
            <div className="flex items-center gap-1">
              <BookOpen size={15} className="text-slate-400"/>
              <span>{uni.departments?.length || 5}+ Depts</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={15} className="text-amber-400" fill="currentColor"/>
              <span className="text-slate-700 font-bold">{rating}</span>
              <span className="hidden lg:inline text-slate-400 text-[11px]">({reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={toggleWatch}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors shrink-0"
              title={watched ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Heart size={18} className={watched ? "text-red-500" : "text-slate-400"} fill={watched ? "currentColor" : "none"} strokeWidth={2} />
            </button>
            
            <Link
              to={`/university/${uni.slug}`}
              className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold rounded-lg shadow-sm transition-all duration-300"
            >
              View Details
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
