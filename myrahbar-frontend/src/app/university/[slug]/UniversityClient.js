"use client";
import { Heart, Share2, Check } from "lucide-react";
import { useState } from "react";
import { useWatchlistStore } from "@/store";

export default function UniversityClient({ uni }) {
  const { addUniversity, removeUniversity, isWatched } = useWatchlistStore();
  const [copied, setCopied] = useState(false);
  const watched = isWatched(uni._id || uni.id);

  const toggleWatch = () => {
    if (watched) {
      removeUniversity(uni._id || uni.id);
    } else {
      addUniversity({
        id: uni._id || uni.id,
        _id: uni._id || uni.id,
        name: uni.name,
        slug: uni.slug,
        city: uni.city,
        type: uni.type,
        departments: uni.departments,
      });
    }
  };

  const share = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={toggleWatch}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
          watched
            ? "bg-red-50 text-red-600 border border-red-200"
            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
        }`}
      >
        <Heart size={16} className={watched ? "fill-red-600 text-red-600" : ""} />
        {watched ? "Saved to Watchlist" : "Save to Watchlist"}
      </button>

      <button
        onClick={share}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all"
      >
        {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
        {copied ? "Link Copied!" : "Share"}
      </button>
    </div>
  );
}
