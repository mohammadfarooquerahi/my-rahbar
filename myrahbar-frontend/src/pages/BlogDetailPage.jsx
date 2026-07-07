import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify"; // VULN-03 FIX: Sanitize HTML to prevent stored XSS
import {
  ArrowLeft, Calendar, Eye, Clock, Tag, Share2,
  ChevronRight, BookOpen, MessageCircle, Target, Calculator, Search
} from "lucide-react";

// Inline Facebook SVG (not in lucide-react)
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// Category → Unsplash image map
const CAT_IMAGES = {
  "Admission Guide":    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=80&auto=format&fit=crop",
  "Merit & Aggregate":  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&q=80&auto=format&fit=crop",
  "Entry Tests":        "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=900&q=80&auto=format&fit=crop",
  "Scholarships":       "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80&auto=format&fit=crop",
  "University Reviews": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=80&auto=format&fit=crop",
  "Career Guide":       "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80&auto=format&fit=crop",
  "Guide":              "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&q=80&auto=format&fit=crop",
  "default":            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&q=80&auto=format&fit=crop",
};

const CAT_COLORS = {
  "Admission Guide":    { bg: "bg-blue-50",   text: "text-blue-700"   },
  "Merit & Aggregate":  { bg: "bg-indigo-50", text: "text-indigo-700" },
  "Entry Tests":        { bg: "bg-red-50",    text: "text-red-700"    },
  "Scholarships":       { bg: "bg-yellow-50", text: "text-yellow-700" },
  "University Reviews": { bg: "bg-green-50",  text: "text-green-700"  },
  "Career Guide":       { bg: "bg-purple-50", text: "text-purple-700" },
  "Guide":              { bg: "bg-blue-50",   text: "text-blue-700"   },
};

function getCoverImage(blog) {
  if (blog.featuredImage) {
    return blog.featuredImage.startsWith("http") ? blog.featuredImage : `/${blog.featuredImage}`;
  }
  return CAT_IMAGES[blog.category] || CAT_IMAGES["default"];
}

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) { setError("Invalid article URL."); setLoading(false); return; }
    setLoading(true);
    setError("");
    fetch(`/api/blogs/${slug}`)
      .then(r => r.json())
      .then(data => {
        // Handle both { blog, related } and direct blog object formats
        const blogData = data.blog || (data._id ? data : null);
        if (blogData) {
          setBlog(blogData);
          setRelated(data.related || []);
        } else {
          setError("Blog post not found.");
        }
      })
      .catch(() => setError("Could not load this article."))
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Loading state ──────────────────────────────────────
  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-slate-400 text-sm">Loading article...</p>
    </div>
  );

  // ── Error state ────────────────────────────────────────
  if (error || !blog) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
      <h1 className="text-xl font-bold text-slate-700 mb-2">Article Not Found</h1>
      <p className="text-slate-400 text-sm mb-6">{error || "This article could not be found."}</p>
      <Link to="/blog" className="text-sm font-semibold text-blue-600 bg-blue-50 px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors">
        ← Back to Blog
      </Link>
    </div>
  );

  // ── Derived values ─────────────────────────────────────
  const cat       = CAT_COLORS[blog.category] || { bg: "bg-slate-50", text: "text-slate-700" };
  const coverImg  = getCoverImage(blog);
  const dateStr   = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const plainExcerpt = stripHtml(blog.excerpt || "");
  const pageUrl   = `https://www.rahbars.com/blog/${blog.slug}`;
  const seoTitle  = blog.seoTitle || `${blog.title} | Rahbars Blog`;
  const seoDesc   = blog.seoDescription || plainExcerpt || stripHtml(blog.content || "").slice(0, 155);
  const keywords  = [...(blog.keywords || []), ...(blog.tags || [])].join(", ");
  const plainText = stripHtml(blog.content || "");
  const readTime  = blog.readTime || Math.max(1, Math.ceil(plainText.split(" ").length / 200));

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(blog.title + "\n" + pageUrl)}`, "_blank");
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, "_blank");
  const shareTwitter  = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(pageUrl)}`, "_blank");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": seoDesc,
    "url": pageUrl,
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "author": { "@type": "Person", "name": blog.author?.name || "Rahbars Editorial Team" },
    "publisher": { "@type": "Organization", "name": "Rahbars", "url": "https://rahbars.com",
      "logo": { "@type": "ImageObject", "url": "https://rahbars.com/logo-full.png" } },
    "articleSection": blog.category,
    "keywords": keywords,
    "image": coverImg,
    "inLanguage": "en-PK",
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO — use seoTitle/seoDesc from CMS, fall back to derived values */}
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta name="robots" content={blog.noIndex ? "noindex, nofollow" : "index, follow"} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="author" content={blog.author?.name || "Rahbars Editorial Team"} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={coverImg} />
        <meta property="og:site_name" content="Rahbars" />
        <meta property="article:section" content={blog.category} />
        <meta property="article:published_time" content={blog.createdAt} />
        <meta property="article:modified_time" content={blog.updatedAt || blog.createdAt} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        <meta name="twitter:image" content={coverImg} />

        {/* Article (BlogPosting) JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

        {/* BreadcrumbList JSON-LD */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.rahbars.com" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.rahbars.com/blog" },
            { "@type": "ListItem", "position": 3, "name": blog.title, "item": pageUrl }
          ]
        })}</script>

        {/* FAQ JSON-LD — only if FAQs exist */}
        {blog.faqs && blog.faqs.length > 0 && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": blog.faqs.map(f => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": { "@type": "Answer", "text": f.answer }
            }))
          })}</script>
        )}
      </Helmet>

      <div className="bg-slate-50 min-h-screen pb-20">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <ChevronRight size={12} />
            <span className="text-slate-700 font-medium truncate max-w-xs">{blog.title}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full h-64 sm:h-80 overflow-hidden relative">
          <img
            src={coverImg}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = CAT_IMAGES["default"]; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {/* Category badge over image */}
          <div className="absolute bottom-5 left-5">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${cat.bg} ${cat.text}`}>
              {blog.category}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Main Article ── */}
            <div className="flex-1 min-w-0">

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-5 text-xs text-slate-400">
                {dateStr && <span className="flex items-center gap-1"><Calendar size={11} /> {dateStr}</span>}
                <span className="flex items-center gap-1"><Clock size={11} /> {readTime} min read</span>
                {blog.views > 0 && <span className="flex items-center gap-1"><Eye size={11} /> {blog.views} views</span>}
                <span>By {blog.author?.name || "Rahbars Team"}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 leading-tight" style={{ fontFamily: "Sora" }}>
                {blog.title}
              </h1>

              {/* Excerpt (plain text) */}
              {blog.excerpt && plainExcerpt && (
                <p className="text-base text-blue-800 leading-relaxed mb-8 border-l-4 border-blue-500 pl-4 bg-blue-50 py-3 pr-4 rounded-r-xl italic font-medium">
                  {plainExcerpt}
                </p>
              )}

              {/* Rich HTML Content — VULN-03 FIX: sanitized with DOMPurify */}
              <article
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
              />

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Tag size={12} /> Tags:</span>
                  {blog.tags.map(t => (
                    <Link key={t} to={`/blog?q=${encodeURIComponent(t)}`}
                      className="text-xs font-medium bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-200 transition-all">
                      #{t}
                    </Link>
                  ))}
                </div>
              )}

              {/* Official Links */}
              <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-sm font-bold text-slate-800 mb-3">🔗 Official Resources</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://hec.gov.pk" target="_blank" rel="noreferrer" className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:border-blue-300 transition-all">
                    HEC Official Website <ChevronRight size={12} />
                  </a>
                  <a href="https://pmc.gov.pk" target="_blank" rel="noreferrer" className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:border-blue-300 transition-all">
                    PMC / PMDC <ChevronRight size={12} />
                  </a>
                </div>
              </div>

              {/* FAQs */}
              {blog.faqs?.length > 0 && (
                <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-2">
                    ❓ Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {blog.faqs.map((faq, i) => (
                      <details key={i} className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-bold text-sm text-slate-800 hover:bg-slate-50 transition-colors select-none list-none">
                          <span>{faq.question}</span>
                          <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0 ml-2">▼</span>
                        </summary>
                        <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Share2 size={15} /> Share this article
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={shareWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                    <MessageCircle size={16} /> WhatsApp
                  </button>
                  <button onClick={shareFacebook}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                    <FacebookIcon /> Facebook
                  </button>
                  <button onClick={shareTwitter}
                    className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                    𝕏 Twitter
                  </button>
                </div>
              </div>

              {/* Back */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:gap-3 transition-all">
                  <ArrowLeft size={14} /> Browse more articles
                </Link>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside className="w-full lg:w-72 shrink-0">

              {/* Related Articles */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 lg:sticky lg:top-20 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                    <BookOpen size={14} className="text-blue-600" /> Related Articles
                  </h3>
                  <div className="space-y-4">
                    {related.map(r => (
                      <Link key={r._id} to={`/blog/${r.slug || r._id}`} className="block group">
                        <div className="h-24 rounded-xl mb-3 overflow-hidden border border-slate-100">
                          <img
                            src={CAT_IMAGES[r.category] || CAT_IMAGES["default"]}
                            alt={r.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={e => { e.target.src = CAT_IMAGES["default"]; }}
                          />
                        </div>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 leading-snug line-clamp-2 transition-colors">
                          {r.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                          <Clock size={10} /> {r.readTime || 5} min read
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools CTA Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg sticky top-20">
                <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-4 uppercase tracking-wider">
                  <Target size={10} /> Free Tools
                </div>
                <h3 className="text-lg font-black mb-2" style={{ fontFamily: "Sora" }}>Calculate Your Aggregate</h3>
                <p className="text-blue-100 text-xs mb-5 leading-relaxed">
                  See if your marks qualify for your dream university. Instantly check your merit chances.
                </p>
                <div className="flex flex-col gap-2">
                  <Link to="/merit-calculator" className="w-full bg-white text-blue-700 text-xs font-bold py-3 rounded-xl text-center hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                    <Calculator size={14} /> Merit Calculator
                  </Link>
                  <Link to="/find-university" className="w-full bg-indigo-900/40 border border-white/20 text-white text-xs font-bold py-3 rounded-xl text-center hover:bg-indigo-900/60 transition-colors flex items-center justify-center gap-2">
                    <Search size={14} /> Smart Uni Finder
                  </Link>
                </div>
              </div>

            </aside>

          </div>
        </div>
      </div>
    </>
  );
}