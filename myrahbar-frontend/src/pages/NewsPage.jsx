import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Newspaper,
  Clock,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Radio,
  Megaphone,
  Info,
} from "lucide-react";

const TYPE_META = {
  news: {
    label: "News",
    icon: <Newspaper size={11} />,
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-400",
  },
  notification: {
    label: "Notification",
    icon: <Radio size={11} />,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  announcement: {
    label: "Announcement",
    icon: <Megaphone size={11} />,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
  },
};

const PRIORITY_DOT = {
  high: "bg-red-500",
  medium: "bg-amber-400",
  low: "bg-slate-300",
};

const FILTERS = ["All", "news", "notification", "announcement"];

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-24 bg-slate-100 rounded-full" />
        <div className="h-4 w-20 bg-slate-100 rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-slate-100 rounded-lg mb-2" />
      <div className="h-4 w-1/3 bg-slate-100 rounded-lg" />
    </div>
  );
}

function NewsCard({ item }) {
  const meta = TYPE_META[item.type] || TYPE_META.news;
  const isNew =
    Date.now() - new Date(item.createdAt).getTime() < 48 * 60 * 60 * 1000;

  return (
    <article
      className="group bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 
        hover:border-slate-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)] 
        transition-all duration-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
    >
      <div className="flex-1 min-w-0">
        {/* badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 
              rounded-full border ${meta.bg} ${meta.text} ${meta.border} uppercase tracking-wide`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>

          {item.priority && (
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold 
                px-2.5 py-1 rounded-full border bg-white text-slate-500 border-slate-200`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[item.priority] || "bg-slate-300"}`}
              />
              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}{" "}
              Priority
            </span>
          )}

          {isNew && (
            <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
              New
            </span>
          )}

          <span className="flex items-center gap-1 text-xs text-slate-400 ml-auto sm:ml-0">
            <Clock size={11} />
            {new Date(item.createdAt || item.date).toLocaleDateString("en-PK", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* title */}
        <h3 className="text-[15px] font-bold text-slate-800 leading-snug mb-2 group-hover:text-blue-700 transition-colors">
          {item.title}
        </h3>

        {/* content preview - strip HTML tags for plain text display */}
        {item.content && (
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
            {item.content.replace(/<[^>]+>/g, "")}
          </p>
        )}
      </div>

      {/* CTA */}
      {item.referenceLink && item.referenceLink !== "#" ? (
        <a
          href={item.referenceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 border border-slate-200 
            hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700
            font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-150"
        >
          Read More <ExternalLink size={13} />
        </a>
      ) : item.link && item.link !== "#" ? (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 border border-slate-200 
            hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700
            font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-150"
        >
          Read More <ExternalLink size={13} />
        </a>
      ) : null}
    </article>
  );
}

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async (filter, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const url = filter === "All" ? "/api/news" : `/api/news?type=${filter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setNews(data);
    } catch (err) {
      setError(err.message || "Failed to load news. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews(activeFilter);
  }, [activeFilter]);

  return (
    <>
      <Helmet>
        <title>Latest Admission News | Rahbars</title>
        <meta
          name="description"
          content="Stay updated with the latest admission news, notifications, and announcements from Pakistani universities."
        />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-16 sm:py-20">
        {/* subtle background texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 0), radial-gradient(circle at 75% 75%, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Updates
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black mb-3 tracking-tight"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Admissions News
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Announcements, merit lists, and deadlines — all in one place.
          </p>
        </div>
      </section>

      {/* ── Filters + Refresh ── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 text-sm font-semibold px-4 py-1.5 rounded-full border transition-all duration-150
                ${
                  activeFilter === f
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              {f === "All" ? "All" : TYPE_META[f]?.label}
            </button>
          ))}

          <button
            onClick={() => fetchNews(activeFilter, true)}
            disabled={refreshing}
            className="ml-auto shrink-0 flex items-center gap-1.5 text-xs font-semibold text-slate-500 
              hover:text-blue-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-6">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={() => fetchNews(activeFilter)}
              className="ml-auto text-xs font-bold underline underline-offset-2 hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* News list */}
        {!loading && !error && (
          <>
            {news.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <Newspaper size={40} className="mx-auto mb-3 opacity-40" />
                <p className="font-semibold text-slate-500">No news yet</p>
                <p className="text-sm mt-1">Check back soon for updates.</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-400 font-medium mb-4">
                  Showing{" "}
                  <span className="text-slate-600 font-bold">
                    {news.length}
                  </span>{" "}
                  {activeFilter === "All"
                    ? "items"
                    : TYPE_META[activeFilter]?.label + " items"}
                </p>
                <div className="space-y-3">
                  {news.map((item) => (
                    <NewsCard key={item._id} item={item} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}
