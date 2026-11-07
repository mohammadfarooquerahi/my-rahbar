import { getBlogs, getBlogBySlug } from "@/lib/api";
import { notFound } from "next/navigation";

export const revalidate = 1800;

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.filter((b) => b.slug).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { blog } = await getBlogBySlug(slug);
  if (!blog) return { title: "Blog Not Found" };

  const title = blog.seoTitle || blog.title;
  const description = blog.seoDescription || blog.excerpt || blog.title;

  return {
    title,
    description,
    openGraph: { title, description, url: `https://www.rahbars.com/blog/${slug}`, type: "article" },
    alternates: { canonical: `https://www.rahbars.com/blog/${slug}` },
  };
}

const CAT_IMAGES = {
  "Admission Guide": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=80&auto=format&fit=crop",
  "default": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&q=80&auto=format&fit=crop",
};

function getCoverImage(blog) {
  if (blog.featuredImage) return blog.featuredImage.startsWith("http") ? blog.featuredImage : `/${blog.featuredImage}`;
  return CAT_IMAGES[blog.category] || CAT_IMAGES["default"];
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const { blog, related } = await getBlogBySlug(slug);

  if (!blog) notFound();

  const date = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" }) : "";
  const faqs = Array.isArray(blog.faqs) ? blog.faqs : [];

  return (
    <article className="max-w-[860px] mx-auto px-4 py-8">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.seoTitle || blog.title,
            description: blog.seoDescription || blog.excerpt || "",
            url: `https://www.rahbars.com/blog/${slug}`,
            datePublished: blog.createdAt,
            dateModified: blog.updatedAt || blog.createdAt,
            author: { "@type": "Organization", name: "Rahbars Team" },
            publisher: { "@type": "Organization", name: "Rahbars" },
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/" className="text-blue-600 hover:underline">Home</a> &gt;{" "}
        <a href="/blog" className="text-blue-600 hover:underline">Blog</a> &gt;{" "}
        <span>{blog.title}</span>
      </nav>

      {/* Category + Date */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">{blog.category || "Admission Guide"}</span>
        <span className="text-slate-400 text-sm">{blog.readTime || 5} min read</span>
        {date && <span className="text-slate-400 text-sm">{date}</span>}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4" style={{ fontFamily: "Sora" }}>
        {blog.title}
      </h1>

      {/* Excerpt */}
      {blog.excerpt && (
        <p className="text-lg text-slate-500 leading-relaxed italic mb-6 border-l-4 border-blue-500 pl-4">
          {blog.excerpt}
        </p>
      )}

      {/* Cover Image */}
      <div className="rounded-2xl overflow-hidden mb-8">
        <img src={getCoverImage(blog)} alt={blog.title} className="w-full h-64 sm:h-80 object-cover" />
      </div>

      {/* Content */}
      <div
        className="prose prose-slate prose-lg max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: blog.content || "" }}
      />

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <div key={i} className="mb-4">
              <h3 className="font-bold text-slate-800 mb-1">Q: {faq.question}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </section>
      )}

      {/* CTA */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center mt-8">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Ready to apply to Pakistani universities?</h3>
        <p className="text-sm text-blue-600 mb-4">Use Rahbars to check aggregate formulas, find universities by city, and download past papers.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/find-university" className="bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-700">Explore Universities</a>
          <a href="/merit-calculator" className="bg-white text-blue-600 border border-blue-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50">Merit Calculator</a>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-5">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.slice(0, 4).map((r) => (
              <a key={r._id || r.slug} href={`/blog/${r.slug}`} className="block bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
                <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2">{r.title}</h3>
                <span className="text-xs text-slate-400">{r.category}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
