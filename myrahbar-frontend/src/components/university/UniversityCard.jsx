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
  const topCategory = categories.length > 0 ? categories[0] : "General";

  const rating = getFakeRating(uni.name);
  const reviewCount = getFakeReviewCount(uni.name);
  const deadlineFormatted = uni.admissionDeadline
    ? formatDeadlineDate(uni.admissionDeadline)
    : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-lg group relative">
      
      {/* Optional Top-Left Marker (like the image's red line) */}
      <div className="absolute left-0 top-6 bottom-6 w-1 bg-orange-400 hidden md:block rounded-r-md z-10" />

      {/* ── LEFT: Image / Logo Area ── */}
      <div className="w-full md:w-[300px] md:min-w-[300px] h-52 md:h-auto relative bg-slate-100 flex-shrink-0">
        {uni.image ? (
          <img src={uni.image} alt={uni.name} className="w-full h-full object-cover" />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white"
            style={{
              background: "linear-gradient(135deg, var(--navy), #3b82f6)",
              fontFamily: "Sora",
            }}
          >
            <div className="w-16 h-16 border-2 border-white/20 rounded-2xl mb-3 flex items-center justify-center text-2xl font-black bg-white/10 backdrop-blur-sm">
              {uni.shortName ? uni.shortName.slice(0, 2) : uni.name?.slice(0, 2)}
            </div>
            <span className="font-bold text-xl tracking-wide">{uni.shortName || uni.name}</span>
          </div>
        )}
        
        {/* Mobile Heart Button (Absolute top right on image for mobile) */}
        <button
          onClick={toggleWatch}
          className="md:hidden absolute top-3 right-3 p-2 bg-white rounded-full shadow-md z-10"
        >
          <Heart size={18} className={watched ? "text-red-500" : "text-slate-400"} fill={watched ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ── RIGHT: Content Area ── */}
      <div className="flex-1 p-5 md:p-6 flex flex-col">
        
        {/* Top Row: Title & Fee */}
        <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 mb-5">
          <div>
            <h3 className="text-xl md:text-[22px] font-bold text-slate-800 leading-tight mb-1" style={{ fontFamily: "Sora" }}>
              {uni.name}
            </h3>
            <p className="text-[14px] text-slate-400 font-medium">
              By {uni.city || "Karachi"} {uni.province ? `, ${uni.province}` : ""}
            </p>
          </div>
          
          <div className="md:text-right flex flex-col md:items-end">
            <div className="text-[18px] font-bold text-slate-800 whitespace-nowrap">
              PKR {feeRange}
            </div>
            {isActuallyOpen ? (
              <div className="text-[13px] font-bold text-red-500 mt-1 whitespace-nowrap">
                {daysLeft === 0 ? "Deadline Today" : daysLeft ? `${daysLeft} Days Left` : "Admissions Open"}
              </div>
            ) : (
              <div className="text-[13px] font-bold text-slate-400 mt-1 whitespace-nowrap">
                Admissions Closed
              </div>
            )}
          </div>
        </div>

        {/* Middle Row: Tabular Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 mb-6 text-[14px] border-l-2 border-slate-100 pl-4 py-1">
          <div className="flex items-start gap-2">
            <span className="text-slate-400 min-w-[70px]">Details :</span>
            <span className="font-medium text-slate-700 capitalize">{uni.type || "Private"} Sector, {topCategory}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-slate-400 min-w-[70px]">Status :</span>
            <span className="font-medium text-slate-700">
              {isActuallyOpen ? "Accepting Applications" : "Not Accepting Applications"}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-slate-400 min-w-[70px]">Deadline :</span>
            <span className="font-medium text-slate-700">{deadlineFormatted || "TBA"}</span>
          </div>
        </div>

        {/* Spacer to push bottom row down if height is large */}
        <div className="flex-1" />

        {/* Bottom Row: Icons & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          
          {/* Quick Icons (like Bed/Bath in real estate) */}
          <div className="flex items-center gap-6 text-slate-400 text-[13px] font-medium">
            <div className="flex items-center gap-1.5">
              <BookOpen size={18} strokeWidth={1.5} />
              <span>{uni.departments?.length || 5}+ Depts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star size={18} strokeWidth={1.5} />
              <span>{rating} Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={18} strokeWidth={1.5} />
              <span>Co-ed</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Desktop Heart Button */}
            <button
              onClick={toggleWatch}
              className="hidden md:flex items-center justify-center w-[46px] h-[46px] rounded border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors"
              title={watched ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Heart size={20} className={watched ? "text-red-500" : "text-slate-400"} fill={watched ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
            
            <Link
              to={`/university/${uni.slug}`}
              className="flex-1 sm:flex-none text-center px-10 py-3 bg-[#fbb03b] hover:bg-[#f59e0b] text-white text-[15px] font-bold rounded shadow-sm transition-colors"
            >
              View Details
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
