const express = require("express");
const router = express.Router();
const University = require("../models/University");
const Blog = require("../models/Blog");

// Use www.rahbars.com to match Google Search Console property
let BASE_URL = process.env.CLIENT_URL || "https://www.rahbars.com";
if (BASE_URL === "https://rahbars.com") {
  BASE_URL = "https://www.rahbars.com";
}

// ── GET /api/sitemap.xml ─────────────────────────────────────────────────────
// Main sitemap index — references sub-sitemaps
router.get("/", async (req, res) => {
  try {
    const now = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    xml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-main.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
    xml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-blogs.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
    xml += `  <sitemap>\n    <loc>${BASE_URL}/sitemap-universities.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;

    xml += `</sitemapindex>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap Index Error:", error);
    res.status(500).end();
  }
});

// ── GET /api/sitemap-main.xml ────────────────────────────────────────────────
// Static core pages only (universities moved to dedicated sitemap)
router.get("/main", async (req, res) => {
  try {
    const coreRoutes = [
      { url: "/",               changefreq: "daily",   priority: "1.0" },
      { url: "/search",         changefreq: "daily",   priority: "0.9" },
      { url: "/find-university",changefreq: "monthly", priority: "0.8" },
      { url: "/merit-calculator",changefreq: "monthly",priority: "0.8" },
      { url: "/compare",        changefreq: "monthly", priority: "0.8" },
      { url: "/blog",           changefreq: "daily",   priority: "0.9" },
      { url: "/news",           changefreq: "daily",   priority: "0.9" },
      { url: "/career-match",   changefreq: "monthly", priority: "0.8" },
      { url: "/past-papers",    changefreq: "weekly",  priority: "0.8" },
      { url: "/document-tools", changefreq: "monthly", priority: "0.8" },
      { url: "/counseling",     changefreq: "monthly", priority: "0.7" },
      { url: "/about",          changefreq: "monthly", priority: "0.6" },
      { url: "/contact",        changefreq: "monthly", priority: "0.6" },
      { url: "/privacy",        changefreq: "yearly",  priority: "0.4" },
      { url: "/terms",          changefreq: "yearly",  priority: "0.4" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    const today = new Date().toISOString().split("T")[0];

    for (const route of coreRoutes) {
      xml += `  <url>\n    <loc>${BASE_URL}${route.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;
    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap Main Error:", error);
    res.status(500).end();
  }
});

// ── GET /api/sitemap-blogs.xml ───────────────────────────────────────────────
// Only published blog posts — DB-driven, always live
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find(
      { status: "published", noIndex: { $ne: true } },
      { slug: 1, createdAt: 1, updatedAt: 1 }
    ).lean();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const blog of blogs) {
      const lastMod = blog.updatedAt
        ? new Date(blog.updatedAt).toISOString().split("T")[0]
        : new Date(blog.createdAt).toISOString().split("T")[0];
      xml += `  <url>\n    <loc>${BASE_URL}/blog/${blog.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;
    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap Blogs Error:", error);
    res.status(500).end();
  }
});

// ── GET /api/sitemap-universities.xml ───────────────────────────────────────
// All approved universities — DB-driven, always live
router.get("/universities", async (req, res) => {
  try {
    const universities = await University.find(
      { status: "approved", noIndex: { $ne: true } },
      { slug: 1, updatedAt: 1 }
    ).lean();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const uni of universities) {
      const lastMod = uni.updatedAt
        ? new Date(uni.updatedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      // Main university page
      xml += `  <url>\n    <loc>${BASE_URL}/university/${uni.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

      // Merit calculator sub-page
      xml += `  <url>\n    <loc>${BASE_URL}/${uni.slug}/merit-cal</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;
    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap Universities Error:", error);
    res.status(500).end();
  }
});

module.exports = router;
