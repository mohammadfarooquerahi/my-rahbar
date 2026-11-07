import { getUniversities, getBlogs } from "@/lib/api";

export default async function sitemap() {
  const [universities, blogs] = await Promise.all([getUniversities(), getBlogs()]);

  const staticRoutes = [
    { url: "https://www.rahbars.com", lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: "https://www.rahbars.com/find-university", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://www.rahbars.com/merit-calculator", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://www.rahbars.com/search", lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: "https://www.rahbars.com/compare", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://www.rahbars.com/blog", lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: "https://www.rahbars.com/news", lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: "https://www.rahbars.com/past-papers", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://www.rahbars.com/document-tools", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://www.rahbars.com/counseling", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://www.rahbars.com/career-match", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://www.rahbars.com/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://www.rahbars.com/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://www.rahbars.com/privacy", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: "https://www.rahbars.com/terms", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const uniRoutes = universities
    .filter((u) => u.slug)
    .map((u) => ({
      url: `https://www.rahbars.com/university/${u.slug}`,
      lastModified: u.updatedAt ? new Date(u.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  const blogRoutes = blogs
    .filter((b) => b.slug)
    .map((b) => ({
      url: `https://www.rahbars.com/blog/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...uniRoutes, ...blogRoutes];
}
