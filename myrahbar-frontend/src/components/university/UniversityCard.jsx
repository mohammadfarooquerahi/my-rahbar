import { Link } from "react-router-dom";
import { MapPin, Star, Heart, ArrowRight, Calendar, DollarSign, BookOpen, Clock } from "lucide-react";
import { useWatchlistStore } from "../../store/index";
import { daysUntilDeadline } from "../../utils/merit";

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

  const daysLeft = uni.admissionOpen && uni.admissionDeadline ? daysUntilDeadline(uni.admissionDeadline) : null;
  
  // Calculate fee range
  let feeRange = "N/A";
  if (uni.departments && uni.departments.length > 0) {
    const fees = uni.departments.map(d => d.semesterFee).filter(f => f > 0);
    if (fees.length > 0) {
      const minFee = Math.min(...fees);
      const maxFee = Math.max(...fees);
      feeRange = minFee === maxFee 
        ? `${(minFee/1000).toFixed(0)}k` 
        : `${(minFee/1000).toFixed(0)}k - ${(maxFee/1000).toFixed(0)}k`;
    }
  }

  // Get top department category
  const categories = [...new Set((uni.departments || []).map(d => d.category))];
  const topCategory = categories.length > 0 ? categories[0] : "General";

  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-border overflow-hidden flex flex-col card-hover transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="p-5 flex-1 relative">
        <button
          onClick={toggleWatch}
          className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform z-10"
        >
          <Heart size={16} className={watched ? "text-red-500" : "text-slate-400 dark:text-slate-500"} fill={watched ? "currentColor" : "none"} />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ background: "var(--navy)", fontFamily: "Sora" }}
          >
            {uni.shortName ? uni.shortName.slice(0, 2) : uni.name?.slice(0, 2)}
          </div>
          <div>
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
                  (uni.admissionOpen
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700")
                }
              >
                {uni.admissionOpen ? "Open" : "Closed"}
              </span>
            </div>
            <h3
              className="font-bold text-slate-800 dark:text-white line-clamp-1 mt-1"
              style={{ fontFamily: "Sora", color: "var(--navy)" }}
              title={uni.name}
            >
              {uni.shortName || uni.name}
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2" title={uni.name}>
          {uni.name}
        </p>

        <div className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin size={13} /> {uni.city || "Karachi"}
            </span>
            <span className="flex items-center gap-1">
              <Star size={13} className="text-amber-400" fill="currentColor" />
              {uni.overallRating || "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={13} /> {topCategory}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <DollarSign size={13} /> {feeRange} / sem
            </span>
            {uni.testRequired && (
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {uni.testRequired}
              </span>
            )}
          </div>
          {uni.admissionOpen && daysLeft !== null && daysLeft >= 0 && (
            <div className="flex items-center gap-1 font-semibold text-red-600 bg-red-50 p-1.5 rounded-lg w-fit mt-1">
              <Clock size={14} className="animate-pulse" />
              {daysLeft === 0 ? "Deadline Today!" : `${daysLeft} Days Left to Apply`}
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-bg border-t border-slate-100 dark:border-border">
        <Link
          to={`/university/${uni.slug}`}
          className="flex items-center justify-center gap-2 w-full py-2 bg-white dark:bg-card border border-slate-200 dark:border-border text-sm font-semibold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-bg hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
