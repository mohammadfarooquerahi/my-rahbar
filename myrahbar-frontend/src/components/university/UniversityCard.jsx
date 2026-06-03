import { Link } from "react-router-dom";
import { MapPin, Clock, Star, Heart, BookOpen } from "lucide-react";
import { useWatchlistStore } from "../../store";
import { daysUntilDeadline, deadlineLabel } from "../../utils/merit";

export default function UniversityCard({ uni, compact = false }) {
  const { isWatched, addUniversity, removeUniversity } = useWatchlistStore();
  const watched = isWatched(uni.id);
  const days = daysUntilDeadline(uni.admissionDeadline);
  const dl = deadlineLabel(days);

  const toggleWatchlist = (e) => {
    e.preventDefault();
    if (watched) {
      removeUniversity(uni.id);
    } else {
      addUniversity(uni);
    }
  };

  // Deadline color mapping
  const colorMap = {
    red: "text-red-600",
    orange: "text-orange-500",
    yellow: "text-yellow-600",
    green: "text-green-600",
  };

  return (
    <Link
      to={"/university/" + uni.slug}
      className="card-hover block bg-white rounded-2xl border border-slate-200 overflow-hidden"
    >
      {/* Top section */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* University initial logo */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ background: "var(--navy)", fontFamily: "Sora" }}
          
<truncated 1857 bytes>
        <span className="flex items-center gap-1">
              <MapPin size={11} />
              {uni.city}
            </span>
            <span className="flex items-center gap-1">
              <Star size={11} className="text-amber-400" fill="currentColor" />
              {uni.overallRating}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={11} />
              {uni.departments?.length} Depts
            </span>
          </div>
        </div>
      </div>

      {/* Department tags */}
      {!compact && (
        <div className="px-5 py-2">
          <div className="flex flex-wrap gap-1">
            {uni.departments?.slice(0, 3).map((d) => (
              <span
                key={d.name}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
              >
                {d.name}
              </span>
            ))}
            {uni.departments?.length > 3 && (
              <span className="text-xs text-slate-400 px-2 py-0.5">
                +{uni.departments.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 mt-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span
          className={
            "flex items-center gap-1 text-xs font-medium " +
            (colorMap[dl.color] || "text-slate-500")
          }
        >
          <Clock size={11} />
          {dl.text}
        </span>
        <span className="text-xs text-slate-400">Est. {uni.established}</span>
      </div>
    </Link>
  );
}
