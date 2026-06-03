import { Link } from "react-router-dom";
import { MapPin, Star, Heart, ArrowRight } from "lucide-react";
import { useWatchlistStore } from "../../store/index";

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col card-hover transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="p-5 flex-1 relative">
        <button
          onClick={toggleWatch}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform z-10"
        >
          <Heart size={16} className={watched ? "text-red-500" : "text-slate-400"} fill={watched ? "currentColor" : "none"} />
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
              className="font-bold text-slate-800 line-clamp-1 mt-1"
              style={{ fontFamily: "Sora", color: "var(--navy)" }}
              title={uni.name}
            >
              {uni.shortName || uni.name}
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-4 line-clamp-2" title={uni.name}>
          {uni.name}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {uni.city || "Karachi"}
          </span>
          <span className="flex items-center gap-1">
            <Star size={13} className="text-amber-400" fill="currentColor" />
            {uni.overallRating || "N/A"}
          </span>
        </div>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100">
        <Link
          to={`/university/${uni.slug}`}
          className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-slate-200 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors"
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
