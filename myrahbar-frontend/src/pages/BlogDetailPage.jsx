import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Calendar, Tag, Eye } from "lucide-react";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Try to fetch by slug first, then by id
    const fetchBlog = async () => {
      setLoading(true);
      try {
        // Try slug endpoint
        const res = await fetch(`/api/blogs/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setBlog(data.blog || data);
      } catch {
        setError("Blog post not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-700 mb-3">Article Not Found</h1>
        <p className="text-slate-400 mb-6">{error}</p>
        <Link to="/blog" className="text-blue-600 hover:underline text-sm">← Back to Blog</Link>
      </div>
    );
  }

  const dateStr = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-PK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <Helmet>
        <title>{blog.title} | MyRahbar Blog</title>
        <meta name="description" content={blog.content?.replace(/<[^>]+>/g, "").slice(0, 150)} />
      </Helmet>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Blog
        </Link>

        {/* Featured image */}
        {blog.featuredImage && (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-2xl mb-8"
          />
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {blog.category && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
              <Tag size={11} />
              {blog.category}
            </span>
          )}
          {dateStr && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Calendar size={11} />
              {dateStr}
            </span>
          )}
          {blog.views !== undefined && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Eye size={11} />
              {blog.views} views
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight"
          style={{ fontFamily: "Sora" }}
        >
          {blog.title}
        </h1>

        {/* Content — renders plain text or full HTML safely */}
        <article
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
          style={{ fontFamily: "Inter", fontSize: "1rem", lineHeight: "1.75" }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Back to blog */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
          >
            <ArrowLeft size={14} />
            Browse more articles
          </Link>
        </div>
      </main>
    </>
  );
}