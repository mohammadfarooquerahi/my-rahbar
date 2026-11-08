"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, BookOpen, Clock, Calendar, Sparkles } from "lucide-react";
import { API_BASE } from "@/utils/api";

const CATEGORIES = [
  "All",
  "Admission Guide",
  "Merit & Aggregate",
  "Entry Tests",
  "Scholarships",
  "University Reviews",
  "Career Guide",
];

const CAT_COLORS = {
  "Admission Guide": "bg-blue-50 text-blue-700 border-blue-200",
  "Merit & Aggregate": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Entry Tests": "bg-red-50 text-red-700 border-red-200",
  "Scholarships": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "University Reviews": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Career Guide": "bg-purple-50 text-purple-700 border-purple-200",
};

const CAT_IMAGES = {
  "Admission Guide": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80&auto=format&fit=crop",
  "Merit & Aggregate": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80&auto=format&fit=crop",
  "Entry Tests": "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80&auto=format&fit=crop",
  "Scholarships": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80&auto=format&fit=crop",
  "University Reviews": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80&auto=format&fit=crop",
  "Career Guide": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80&auto=format&fit=crop",
};

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function getCoverImage(blog) {
  if (blog.featuredImage) {
    if (blog.featuredImage.startsWith("http")) return blog.featuredImage;
    return `${API_BASE}${blog.featuredImage.startsWith("/") ? "" : "/"}${blog.featuredImage}`;
  }
  return CAT_IMAGES[blog.category] || CAT_IMAGES.default;
}

export default function BlogClient({ initialBlogs = [] }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [loading, setLoading] = useState(initialBlogs.length === 0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Live client-side hydration: ensures all published blogs are fetched from DB
  useEffect(() => {
    let isMounted = true;
    const fetchLiveBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/blogs?limit=100`);
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        const list = Array.isArray(data.blogs) ? data.blogs : (Array.isArray(data) ? data : []);
        if (isMounted && list.length > 0) {
          setBlogs(list);
        }
      } catch (err) {
        console.warn("Client blogs fetch fallback:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLiveBlogs();
    return () => { isMounted = false; };
  }, []);

  const filtered = blogs.filter((b) => {
    const matchesCategory =
      activeCategory === "All" || b.category?.toLowerCase() === activeCategory.toLowerCase();
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      b.title?.toLowerCase().includes(query) ||
      b.excerpt?.toLowerCase().includes(query) ||
      b.tags?.some((t) => t.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            Pakistan Higher Education Guide
          </div>
          <h1
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
            style={{ fontFamily: "Sora" }}
          >
            Guides &amp; <span className="text-blue-600">Articles</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Verified admission guides, aggregate formulas, entry test tips, and university rankings for Pakistani students.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="max-w-4xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search guides, tests, formulas (e.g. MDCAT, NUST, Aggregate)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading && blogs.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl border border-slate-200 p-4 animate-pulse">
                <div className="h-44 bg-slate-100 rounded-2xl mb-4" />
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
                <div className="h-6 bg-slate-100 rounded mb-2" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto shadow-sm">
            <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-800 text-lg mb-1">No Articles Found</h3>
            <p className="text-xs text-slate-500 mb-5">
              {search ? `No articles matching "${search}".` : "No articles published in this category yet."}
            </p>
            <button
              onClick={() => { setActiveCategory("All"); setSearch(""); }}
              className="px-5 py-2.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((blog) => {
              const catClass = CAT_COLORS[blog.category] || "bg-slate-50 text-slate-700 border-slate-200";
              const excerpt = stripHtml(blog.excerpt || blog.content || "").substring(0, 130);
              const date = blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "2026";

              return (
                <Link
                  key={blog._id || blog.slug}
                  href={`/blog/${blog.slug}`}
                  className="group flex flex-col bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                  <div className="h-48 overflow-hidden relative bg-slate-100">
                    <img
                      src={getCoverImage(blog)}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${catClass}`}>
                        {blog.category || "Guide"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {blog.readTime || 5} min read
                      </span>
                    </div>

                    <h2
                      className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug"
                      style={{ fontFamily: "Sora" }}
                    >
                      {blog.title}
                    </h2>

                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 mt-auto">
                      {excerpt}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                      <span>Read Full Guide</span>
                      <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
