import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, Calendar, Eye, Clock, Tag, Share2,
  ChevronRight, BookOpen, MessageCircle
} from "lucide-react";

// Inline Facebook SVG to avoid lucide-react build issues
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);


const CAT_COLORS = {
  "Admission Guide":  { bg: "bg-blue-50",   text: "text-blue-700"   },
  "Merit & Aggregate":{ bg: "bg-indigo-50", text: "text-indigo-700" },
  "Entry Tests":      { bg: "bg-red-50",    text: "text-red-700"    },
  "Scholarships":     { bg: "bg-yellow-50", text: "text-yellow-700" },
  "University Reviews":{ bg: "bg-green-50", text: "text-green-700"  },
  "Career Guide":     { bg: "bg-purple-50", text: "text-purple-700" },
};

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/blogs/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.blog) {
          setBlog(data.blog);
          setRelated(data.related || []);
        } else if (data._id) {
          setBlog(data);
        } else {
          setError("Blog post not found.");
        }
        setLoading(false);
      })
      .catch(() => { setError("Could not load this article."); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-slate-400 text-sm">Loading article...</p>
    </div>
  );

  if (error || !blog) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
      <h1 className="text-xl font-bold text-slate-700 mb-2">Article Not Found</h1>
      <p className="text-slate-400 text-sm mb-6">{error}</p>
      <Link to="/blog" className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">← Back to Blog</Link>
    </div>
  );

  const cat = CAT_COLORS[blog.category] || { bg: "bg-slate-50", text: "text-slate-700" };
  const dateStr = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const pageUrl = `https://rahbars.com/blog/${blog.slug}`;
  const seoTitle = blog.seoTitle || blog.title + " | Rahbars Blog";
  const seoDesc = blog.seoDescription || blog.excerpt || blog.content?.replace(/<[^>]+>/g, "").slice(0, 155);
  const keywords = (blog.keywords || blog.tags || []).join(", ");
  const plainText = blog.content?.replace(/<[^>]+>/g, "") || "";
  const wordCount = plainText.split(" ").length;
  const readTime = blog.readTime || Math.max(1, Math.ceil(wordCount / 200));

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
    "publisher": {
      "@type": "Organization",
      "name": "Rahbars",
      "url": "https://rahbars.com",
      "logo": { "@type": "ImageObject", "url": "https://rahbars.com/logo-full.png" }
    },
    "articleSection": blog.category,
    "keywords": keywords,
    "inLanguage": "en-PK",
    "about": { "@type": "Thing", "name": "University Admissions in Pakistan" },
    "educationalLevel": "High School",
    "audience": { "@type": "EducationalAudience", "educationalRole": "student" }
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="author" content={blog.author?.name || "Rahbars Editorial Team"} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
        {/* Open Graph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Rahbars" />
        <meta property="article:section" content={blog.category} />
        <meta property="article:published_time" content={blog.createdAt} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        {/* Breadcrumb JSON-LD */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rahbars.com" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://rahbars.com/blog" },
            { "@type": "ListItem", "position": 3, "name": blog.title, "item": pageUrl }
          ]
        })}</script>
      </Helmet>

      <div className="bg-slate-50 min-h-screen pb-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <ChevronRight size={12} />
            <span className="text-slate-700 font-medium truncate max-w-[200px]">{blog.title}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Main Article */}
            <div className="flex-1 min-w-0">
              {/* Category + Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${cat.bg} ${cat.text}`}>
                  <Tag size={10} /> {blog.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={11} /> {dateStr}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={11} /> {readTime} min read</span>
                {blog.views > 0 && <span className="text-xs text-slate-400 flex items-center gap-1"><Eye size={11} /> {blog.views} views</span>}
                <span className="text-xs text-slate-400">By {blog.author?.name || "Rahbars Team"}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 leading-tight" style={{ fontFamily: "Sora" }}>
                {blog.title}
              </h1>

              {/* Excerpt (intro) */}
              {blog.excerpt && (
                <p className="text-base text-slate-600 leading-relaxed mb-8 border-l-4 border-blue-500 pl-4 bg-blue-50 py-3 pr-3 rounded-r-xl italic">
                  {blog.excerpt}
                </p>
              )}

              {/* Content */}
              <article
                className="blog-content prose prose-slate max-w-none"
                style={{ fontFamily: "Inter" }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200">
                  {blog.tags.map(t => (
                    <Link key={t} to={`/blog?q=${encodeURIComponent(t)}`}
                      className="text-xs font-medium bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-200 transition-all">
                      #{t}
                    </Link>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Share2 size={15} /> Share this article</p>
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

            {/* Sidebar */}
            <aside className="w-72 hidden lg:block shrink-0">
              {/* Related Articles */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 sticky top-20">
                  <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                    <BookOpen size={14} /> Related Articles
                  </h3>
                  <div className="space-y-4">
                    {related.map(r => (
                      <Link key={r._id} to={`/blog/${r.slug}`} className="block group">
                        <div className="h-20 rounded-xl mb-2 flex items-center justify-center" style={{ background: r.coverColor || "#EFF6FF" }}>
                          <BookOpen size={24} className="opacity-20 text-slate-600" />
                        </div>
                        <p className="text-xs font-bold text-slate-700 group-hover:text-blue-600 leading-snug line-clamp-2 transition-colors">
                          {r.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">{r.readTime || 5} min read</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Box */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
                <p className="text-base font-black mb-2">Calculate Your Aggregate</p>
                <p className="text-blue-200 text-xs mb-4 leading-relaxed">See if your marks qualify for your dream university — instantly, for free.</p>
                <Link to="/merit-calculator"
                  className="block w-full text-center bg-white text-blue-700 font-bold text-xs py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
                  Try Free Calculator
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}