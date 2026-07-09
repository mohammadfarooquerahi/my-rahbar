const express = require("express");
const router = express.Router();
const University = require("../models/University");
const Blog = require("../models/Blog");

// Use www.rahbars.com to match Google Search Console property
let BASE_URL = process.env.CLIENT_URL || "https://www.rahbars.com";
if (BASE_URL === "https://rahbars.com") {
  BASE_URL = "https://www.rahbars.com";
}

// Helper — build a <url> block
const urlEntry = (loc, lastmod, changefreq, priority) =>
  `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;

// ── GET /api/sitemap.xml (index) ─────────────────────────────────────────────
// Only references sitemap-main.xml — the one Google already confirmed works
router.get("/", async (req, res) => {
  try {
    const now = new Date().toISOString().split("T")[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-main.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
    xml += `</sitemapindex>`;
    res.header("Content-Type", "application/xml");
    res.header("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    console.error("Sitemap Index Error:", err);
    res.status(500).end();
  }
});

// ── GET /api/sitemap.xml/main ────────────────────────────────────────────────
// ONE combined sitemap: static pages + all published blogs + all universities
// Google already confirmed this URL works — never split again
router.get("/main", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 1. Static core pages
    const coreRoutes = [
      { url: "/",                changefreq: "daily",   priority: "1.0" },
      { url: "/search",          changefreq: "daily",   priority: "0.9" },
      { url: "/blog",            changefreq: "daily",   priority: "0.9" },
      { url: "/news",            changefreq: "daily",   priority: "0.9" },
      { url: "/merit-calculator",changefreq: "monthly", priority: "0.8" },
      { url: "/compare",         changefreq: "monthly", priority: "0.8" },
      { url: "/find-university", changefreq: "monthly", priority: "0.8" },
      { url: "/career-match",    changefreq: "monthly", priority: "0.8" },
      { url: "/past-papers",     changefreq: "weekly",  priority: "0.8" },
      { url: "/document-tools",  changefreq: "monthly", priority: "0.7" },
      { url: "/counseling",      changefreq: "monthly", priority: "0.7" },
      { url: "/about",           changefreq: "monthly", priority: "0.6" },
      { url: "/contact",         changefreq: "monthly", priority: "0.6" },
      { url: "/privacy",         changefreq: "yearly",  priority: "0.4" },
      { url: "/terms",           changefreq: "yearly",  priority: "0.4" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add static pages
    for (const route of coreRoutes) {
      xml += urlEntry(`${BASE_URL}${route.url}`, today, route.changefreq, route.priority);
    }

    // 2. Published blog posts from DB (with timeout protection)
    try {
      const blogs = await Promise.race([
        Blog.find(
          { status: "published", noIndex: { $ne: true } },
          { slug: 1, updatedAt: 1, createdAt: 1 }
        ).lean(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Blog DB timeout")), 8000)
        ),
      ]);

      for (const blog of blogs) {
        const lastMod = blog.updatedAt
          ? new Date(blog.updatedAt).toISOString().split("T")[0]
          : new Date(blog.createdAt).toISOString().split("T")[0];
        const slug = (blog.slug || "").trim();
        if (!slug) continue;
        xml += urlEntry(`${BASE_URL}/blog/${slug}`, lastMod, "monthly", "0.8");
      }
    } catch (blogErr) {
      console.error("Sitemap: blog fetch failed, skipping:", blogErr.message);
    }

    // 3. Universities from DB (with timeout protection)
    try {
      const universities = await Promise.race([
        University.find(
          { status: "approved", noIndex: { $ne: true } },
          { slug: 1, updatedAt: 1 }
        ).lean(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("University DB timeout")), 8000)
        ),
      ]);

      for (const uni of universities) {
        const lastMod = uni.updatedAt
          ? new Date(uni.updatedAt).toISOString().split("T")[0]
          : today;
        const slug = (uni.slug || "").trim();
        if (!slug) continue;
        xml += urlEntry(`${BASE_URL}/university/${slug}`, lastMod, "weekly", "0.9");
      }
    } catch (uniErr) {
      console.error("Sitemap: university fetch failed, skipping:", uniErr.message);
    }

    xml += `</urlset>`;
    res.header("Content-Type", "application/xml");
    res.header("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap Main Error:", error);
    res.status(500).end();
  }
});

// ── Legacy sub-sitemap routes — redirect to main so Google follows correctly
router.get("/blogs", (req, res) => {
  res.redirect(301, `${BASE_URL}/sitemap-main.xml`);
});
router.get("/universities", (req, res) => {
  res.redirect(301, `${BASE_URL}/sitemap-main.xml`);
});

module.exports = router;
