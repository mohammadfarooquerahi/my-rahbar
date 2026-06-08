import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, User, ArrowRight, Rss, AlertCircle } from "lucide-react";

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 bg-slate-200 w-full" />
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          <div className="h-4 w-20 bg-slate-100 rounded" />
          <div className="h-4 w-20 bg-slate-100 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-slate-200 rounded mb-4" />
        <div className="h-4 w-full bg-slate-100 rounded mb-2" />
        <div className="h-4 w-5/6 bg-slate-100 rounded mb-4" />
        <div className="h-10 w-32 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load blogs");
        return res.json();
      })
      .then((data) => {
        setBlogs(data.blogs || data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Helmet>
        <title>Blog & Insights | Rahbars.com</title>
        <meta
          name="description"
          content="Read the latest articles, admission tips, and career guidance on the Rahbars.com blog."
        />
      </Helmet>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-6">
            <Rss size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Our <span className="text-green-600">Blog</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Expert advice, admission updates, and student stories to help you navigate your academic journey in Pakistan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto text-center py-16 px-4 bg-white rounded-2xl border border-red-100 shadow-sm">
            <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-slate-500 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-medium hover:bg-red-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
            <Rss size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Articles Yet</h3>
            <p className="text-slate-500">We are working on bringing you the best content. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article 
                key={blog._id || blog.id}
                className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-border overflow-hidden hover:shadow-xl dark:box-premium dark:box-glow transition-all duration-300 hover:-translate-y-1 group flex flex-col"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  {blog.featuredImage ? (
                    <img 
                      src={blog.featuredImage.startsWith('/') ? blog.featuredImage : `/${blog.featuredImage}`} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=Blog+Image" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <Rss size={48} />
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                    {blog.author && (
                      <span className="flex items-center gap-1.5">
                        <User size={14} />
                        {blog.author.name || "Admin"}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors leading-tight">
                    {blog.title}
                  </h2>
                  
                  <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                    {blog.excerpt || blog.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."}
                  </p>
                  
                  <Link 
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-green-50 text-slate-700 hover:text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors mt-auto border border-slate-100 hover:border-green-200 w-full sm:w-auto"
                  >
                    Read Article
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}