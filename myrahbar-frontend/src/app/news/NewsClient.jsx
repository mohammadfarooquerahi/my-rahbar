"use client";
import { useState, useEffect } from "react";
import { Bell, Search, ExternalLink, Calendar, Sparkles } from "lucide-react";
import { API_BASE } from "@/utils/api";

const TYPE_META = {
  all: { label: "All Updates", bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
  news: { label: "News", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  notification: { label: "Notification", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  announcement: { label: "Announcement", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  admission: { label: "Admission", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

export default function NewsClient({ initialNews = [] }) {
  const [news, setNews] = useState(initialNews);
  const [loading, setLoading] = useState(initialNews.length === 0);
  const [selectedType, setSelectedType] = useState("all");
  const [search, setSearch] = useState("");

  // Live client-side hydration: fetches active news directly from API
  useEffect(() => {
    let isMounted = true;
    const fetchLiveNews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/news`);
        if (!res.ok) throw new Error("Failed to load news");
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.news || []);
        if (isMounted && list.length > 0) {
          setNews(list);
        }
      } catch (err) {
        console.warn("Client news fetch fallback:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLiveNews();
    return () => { isMounted = false; };
  }, []);

  const filtered = news.filter((item) => {
    const matchesType =
      selectedType === "all" || item.type?.toLowerCase() === selectedType.toLowerCase();
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            Live Admission Alerts &amp; Updates
          </div>
          <h1
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3"
            style={{ fontFamily: "Sora" }}
          >
            Admission <span className="text-blue-600">News</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Stay updated with verified university admission deadlines, HEC announcements, syllabus updates, and entry test notifications.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search news, universities, test dates (e.g. MDCAT, NUST, UHS)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {["all", "news", "notification", "announcement", "admission"].map((type) => {
              const meta = TYPE_META[type] || TYPE_META.news;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedType === type
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* News List */}
        {loading && news.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl border border-slate-200 p-6 animate-pulse space-y-3">
                <div className="h-4 bg-slate-100 rounded w-1/4" />
                <div className="h-6 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
            <Bell size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-800 text-lg mb-1">No Updates Found</h3>
            <p className="text-xs text-slate-500 mb-5">
              {search ? `No news matching "${search}".` : "No updates available right now. Check back shortly!"}
            </p>
            <button
              onClick={() => { setSelectedType("all"); setSearch(""); }}
              className="px-5 py-2.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => {
              const meta = TYPE_META[item.type] || TYPE_META.news;
              const date = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "2026";

              return (
                <article
                  key={item._id}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${meta.bg} ${meta.text} ${meta.border}`}>
                        {meta.label}
                      </span>
                      {item.priority === "high" && (
                        <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          Urgent
                        </span>
                      )}
                    </div>
                    {date && (
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Calendar size={13} />
                        {date}
                      </span>
                    )}
                  </div>

                  <h2
                    className="font-bold text-slate-900 text-lg md:text-xl mb-2 leading-snug"
                    style={{ fontFamily: "Sora" }}
                  >
                    {item.title}
                  </h2>

                  {(item.description || item.content) && (
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {item.description || item.content}
                    </p>
                  )}

                  {(item.link || item.referenceLink) && (
                    <a
                      href={item.link || item.referenceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span>Read Official Notification</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
