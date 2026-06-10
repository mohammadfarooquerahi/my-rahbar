import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Search, BookOpen, Clock, ArrowRight, Tag, ChevronRight,
  TrendingUp, Filter, X
} from "lucide-react";

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
  "Admission Guide":   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  "Merit & Aggregate": { bg: "bg-indigo-50",  text: "text-indigo-700", border: "border-indigo-200" },
  "Entry Tests":       { bg: "bg-red-50",     text: "text-red-700",    border: "border-red-200"    },
  "Scholarships":      { bg: "bg-yellow-50",  text: "text-yellow-700", border: "border-yellow-200" },
  "University Reviews":{ bg: "bg-green-50",   text: "text-green-700",  border: "border-green-200"  },
  "Career Guide":      { bg: "bg-purple-50",  text: "text-purple-700", border: "border-purple-200" },
  "Guide":             { bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200"   },
};

// Real Unsplash images per category (reliable, education-related)
const CAT_IMAGES = {
  "Admission Guide":   "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80&auto=format&fit=crop",
  "Merit & Aggregate": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80&auto=format&fit=crop",
  "Entry Tests":       "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80&auto=format&fit=crop",
  "Scholarships":      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80&auto=format&fit=crop",
  "University Reviews":"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80&auto=format&fit=crop",
  "Career Guide":      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80&auto=format&fit=crop",
  "Guide":             "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80&auto=format&fit=crop",
  "default":           "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80&auto=format&fit=crop",
};

// Strip HTML tags and return plain text
function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
}

// Get cover image for a blog
function getCoverImage(blog) {
  if (blog.featuredImage) {
    return blog.featuredImage.startsWith("http") ? blog.featuredImage : `/${blog.featuredImage}`;
  }
  return CAT_IMAGES[blog.category] || CAT_IMAGES["default"];
}

function BlogCard({ blog, featured = false }) {
  const cat = CAT_COLORS[blog.category] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" };
  const date = new Date(blog.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
  const excerpt = stripHtml(blog.excerpt || blog.content || "").substring(0, featured ? 200 : 120);
  const coverImg = getCoverImage(blog);

  const blogLink = `/blog/${blog.slug || blog._id}`;

  if (featured) {
    return (
      <Link to={blogLink} className="group block bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 md:col-span-2">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-2/5 h-56 md:h-auto min-h-[240px] flex-shrink-0 overflow-hidden">
            <img
              src={coverImg}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={e => { e.target.src = CAT_IMAGES["default"]; }}
            />
          </div>
          {/* Content */}
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                {blog.category}
              </span>
              <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">⭐ FEATURED</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors" style={{ fontFamily: "Sora" }}>
              {blog.title}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-3">{excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime || 5} min read</span>
              <span>{date}</span>
            </div>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-3 transition-all">
              Read Article <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${blog.slug}`} className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Card Image */}
      <div className="h-44 flex-shrink-0 overflow-hidden">
        <img
          src={coverImg}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = CAT_IMAGES["default"]; }}
        />
      </div>
      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
            {blog.category}
          </span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock size={10} /> {blog.readTime || 5} min
          </span>
        </div>
        <h2 className="font-bold text-slate-800 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm" style={{ fontFamily: "Sora" }}>
          {blog.title}
        </h2>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">{excerpt}</p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <span className="text-[10px] text-slate-400">{date}</span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
            Read <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-100 w-full" />
      <div className="p-5">
        <div className="h-3 w-20 bg-slate-100 rounded mb-3" />
        <div className="h-5 w-4/5 bg-slate-200 rounded mb-2" />
        <div className="h-3 w-full bg-slate-100 rounded mb-1" />
        <div className="h-3 w-3/4 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [searchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [query, setQuery]       = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("cat") || "All");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 9 });
      if (debouncedQuery) params.set("search", debouncedQuery);
      if (category && category !== "All") params.set("category", category);
      const res = await fetch(`/api/blogs?${params}`);
      const data = await res.json();
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setBlogs([]);
    }
    setLoading(false);
  }, [debouncedQuery, category, currentPage]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);
  useEffect(() => { setCurrentPage(1); }, [debouncedQuery, category]);

  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Helmet>
        <title>University Admission Blog — Pakistan 2025 | Rahbars</title>
        <meta name="description" content="Expert guides on university admission in Pakistan 2025. Learn about aggregate calculation, MDCAT, ECAT, scholarships, merit lists, and top universities. Free advice for every student." />
        <meta name="keywords" content="university admission pakistan 2025, aggregate calculator, MDCAT guide, merit calculator, university scholarships pakistan, NED FAST NUST LUMS admission" />
        <meta property="og:title" content="University Admission Blog — Pakistan 2025 | Rahbars" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rahbars.com/blog" />
        <link rel="canonical" href="https://rahbars.com/blog" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Rahbars — University Admission Blog Pakistan",
          "url": "https://rahbars.com/blog",
          "publisher": { "@type": "Organization", "name": "Rahbars", "url": "https://rahbars.com" },
          "inLanguage": "en-PK"
        })}</script>
      </Helmet>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <TrendingUp size={13} /> EDUCATIONAL GUIDES
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight" style={{ fontFamily: "Sora" }}>
            Pakistan University<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-300">Admission Guide</span>
          </h1>
          <p className="text-blue-200 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Free expert guides on MDCAT, ECAT, aggregate calculation, scholarships, and top universities — everything a Pakistani student needs.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search MDCAT, Scholarship, NED, NUST..."
              className="w-full pl-11 pr-10 py-4 rounded-2xl text-slate-900 text-sm font-medium outline-none bg-white shadow-lg placeholder:text-slate-400"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Category Filters */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            <Filter size={14} className="text-slate-400 shrink-0" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap border transition-all shrink-0 ${
                  category === cat
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              {query && <span>Results for "<strong className="text-slate-700">{query}</strong>" — </span>}
              <strong className="text-slate-700">{blogs.length}</strong> article{blogs.length !== 1 ? "s" : ""}
              {category !== "All" && <span> in <strong className="text-blue-600">{category}</strong></span>}
            </p>
            {(query || category !== "All") && (
              <button onClick={() => { setQuery(""); setCategory("All"); }} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1">
                <X size={12} /> Clear
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
            <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-600 mb-2">No articles found</h3>
            <p className="text-sm text-slate-400 mb-4">Try a different search or category</p>
            <button onClick={() => { setQuery(""); setCategory("All"); }} className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
              Show all articles
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Featured card spans 2 cols */}
              {featured && !query && category === "All" && (
                <BlogCard blog={featured} featured={true} />
              )}
              {(query || category !== "All" ? blogs : rest).map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl text-slate-600 hover:border-blue-300 disabled:opacity-40">
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 text-sm font-bold rounded-xl border transition-all ${
                      currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:border-blue-300"
                    }`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl text-slate-600 hover:border-blue-300 disabled:opacity-40">
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* SEO Keywords */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-bold text-slate-600 mb-3 flex items-center gap-2"><Tag size={14} /> Popular Topics</h2>
          <div className="flex flex-wrap gap-2">
            {["MDCAT 2025","ECAT Guide","Aggregate Calculator","NED University","FAST-NUCES","NUST Admission",
              "HEC Scholarship","Pharm-D","MBBS vs DPT","Merit List","Closing Merit","University Fee Pakistan",
              "LUMS Admission","Karachi University","Gap Year FSc","Arts Students Admission"].map(kw => (
              <button key={kw} onClick={() => setQuery(kw)}
                className="text-xs text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-full transition-all">
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}