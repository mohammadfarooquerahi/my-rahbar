const express = require("express");
const router = express.Router();
const University = require("../models/University");
const Blog = require("../models/Blog");

router.get("/", async (req, res) => {
  try {
    // Fetch all university slugs
    const universities = await University.find({}, { slug: 1, updatedAt: 1 }).lean();
    
    // Fetch all blog slugs
    const blogs = await Blog.find({}, { slug: 1, updatedAt: 1 }).lean();

    const baseUrl = process.env.CLIENT_URL || "https://rahbars.com";

    // Core static routes
    const coreRoutes = [
      { url: "/", changefreq: "daily", priority: "1.0" },
      { url: "/search", changefreq: "daily", priority: "0.9" },
      { url: "/find-university", changefreq: "monthly", priority: "0.8" },
      { url: "/merit-calculator", changefreq: "monthly", priority: "0.8" },
      { url: "/compare", changefreq: "monthly", priority: "0.8" },
      { url: "/blog", changefreq: "daily", priority: "0.9" },
      { url: "/career-match", changefreq: "monthly", priority: "0.8" },
      { url: "/past-papers", changefreq: "weekly", priority: "0.8" },
      { url: "/document-tools", changefreq: "monthly", priority: "0.8" },
      { url: "/counseling", changefreq: "monthly", priority: "0.7" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add core routes
    for (const route of coreRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route.url}</loc>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Add university dynamic routes
    for (const uni of universities) {
      const lastMod = uni.updatedAt ? new Date(uni.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/university/${uni.slug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    }

    // Add blog dynamic routes
    for (const blog of blogs) {
      const lastMod = blog.updatedAt ? new Date(blog.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${blog.slug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    res.status(500).end();
  }
});

module.exports = router;
