import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

async function syncSitemaps() {
  console.log("[build-sitemap] Checking sitemaps in public directory...");

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapXmlPath = path.join(publicDir, "sitemap.xml");
  const sitemapMainXmlPath = path.join(publicDir, "sitemap-main.xml");

  // Attempt to fetch latest from backend with 5s timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const mainRes = await fetch("https://myrahbar-backend.onrender.com/api/sitemap.xml/main", {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (mainRes.ok) {
      const mainXml = await mainRes.text();
      if (mainXml && mainXml.includes("<urlset")) {
        fs.writeFileSync(sitemapMainXmlPath, mainXml.trim(), "utf-8");
        console.log("[build-sitemap] Successfully updated sitemap-main.xml from backend!");
      }
    }
  } catch (err) {
    console.log("[build-sitemap] Backend fetch skipped (" + err.message + "). Using existing sitemap-main.xml.");
  }

  // Ensure sitemap.xml exists and points to sitemap-main.xml
  const today = new Date().toISOString().split("T")[0];
  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.rahbars.com/sitemap-main.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;
  fs.writeFileSync(sitemapXmlPath, indexXml, "utf-8");
  console.log("[build-sitemap] sitemap.xml verified and ready.");
}

syncSitemaps();
