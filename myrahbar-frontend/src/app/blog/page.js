import { getBlogs } from "@/lib/api";

export const revalidate = 3600;

export const metadata = {
  title: "Pakistani University Admissions & Career Guides 2026",
  description: "Read expert admission guides, aggregate formulas, entry test tips, and university reviews in Pakistan.",
  alternates: { canonical: "https://www.rahbars.com/blog" },
};

const CAT_COLORS = {
  "Admission Guide": "bg-blue-50 text-blue-700 border-blue-200",
  "Merit & Aggregate": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Entry Tests": "bg-red-50 text-red-700 border-red-200",
  "Scholarships": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "University Reviews": "bg-green-50 text-green-700 border-green-200",
  "Career Guide": "bg-purple-50 text-purple-700 border-purple-200",
};

const CAT_IMAGES = {
  "Admission Guide": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80&auto=format&fit=crop",
  "Merit & Aggregate": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80&auto=format&fit=crop",
  "Entry Tests": "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80&auto=format&fit=crop",
  "Scholarships": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80&auto=format&fit=crop",
  "University Reviews": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80&auto=format&fit=crop",
  "Career Guide": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80&auto=format&fit=crop",
  "default": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80&auto=format&fit=crop",
};

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
}

function getCoverImage(blog) {
  if (blog.featuredImage) return blog.featuredImage.startsWith("http") ? blog.featuredImage : `/${blog.featuredImage}`;
  return CAT_IMAGES[blog.category] || CAT_IMAGES["default"];
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4" style={{ fontFamily: "Sora" }}>
          Guides & <span className="text-blue-600">Articles</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto">Expert admission guides, aggregate formulas, entry test tips, and university reviews for Pakistani students.</p>
      </div>

      {blogs.length === 0 ? (
        <p className="text-center text-slate-400 py-20">No articles published yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const cat = CAT_COLORS[blog.category] || "bg-slate-50 text-slate-700 border-slate-200";
            const excerpt = stripHtml(blog.excerpt || blog.content || "").substring(0, 120);
            const date = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "";

            return (
              <a key={blog._id || blog.slug} href={`/blog/${blog.slug}`} className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img src={getCoverImage(blog)} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${cat}`}>{blog.category || "Guide"}</span>
                    {date && <span className="text-xs text-slate-400">{date}</span>}
                  </div>
                  <h2 className="font-bold text-slate-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{blog.title}</h2>
                  <p className="text-sm text-slate-500 line-clamp-2">{excerpt}</p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
