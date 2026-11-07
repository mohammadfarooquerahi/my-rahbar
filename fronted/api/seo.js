/**
 * Vercel Serverless Function: SEO Meta Tag & OpenGraph Injector
 *
 * Intercepts requests to /university/:slug and /blog/:slug.
 * Fetches real data from the Render backend API, injects
 * page-specific <title>, <meta description>, canonical link,
 * and Schema.org JSON-LD tags into the base index.html, then
 * serves the enriched HTML directly to crawlers and users.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

const BACKEND_URL = "https://myrahbar-backend.onrender.com";
const SITE_URL = "https://www.rahbars.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const TIMEOUT_MS = 3500;
const GA_ID = "G-B2Z633E4JY";

let cachedBaseHtml = null;

function formatSlugToTitle(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Read base index.html: try local dist first, then fetch live shell, then fallback */
async function getBaseHtml() {
  if (cachedBaseHtml) return cachedBaseHtml;

  const candidatePaths = [
    join(process.cwd(), "dist", "index.html"),
    join(process.cwd(), "index.html"),
  ];

  for (const p of candidatePaths) {
    try {
      if (existsSync(p)) {
        cachedBaseHtml = readFileSync(p, "utf-8");
        return cachedBaseHtml;
      }
    } catch {}
  }

  try {
    const res = await fetch(`${SITE_URL}/`, {
      headers: { "Accept": "text/html" },
    });
    if (res.ok) {
      cachedBaseHtml = await res.text();
      return cachedBaseHtml;
    }
  } catch {}

  // Emergency fallback shell with GA4
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});</script>
  </head><body><div id="root"></div></body></html>`;
}

/** Fetch with timeout to prevent hanging on backend sleep */
async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/** Inject SEO and Canonical tags into base HTML */
function injectMeta(html, { title, description, url, image, type = "website", extra = "" }) {
  const canonical = url || SITE_URL;
  const metaBlock = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${image || DEFAULT_IMAGE}" />
    <meta property="og:site_name" content="Rahbars" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image || DEFAULT_IMAGE}" />
    ${extra}
  `.trim();

  return html
    .replace(/<title>.*?<\/title>/i, "")
    .replace(/<meta name="description"[^>]*>/i, "")
    .replace(/<link rel="canonical"[^>]*>/i, "")
    .replace(/<meta property="og:title"[^>]*>/i, "")
    .replace(/<meta property="og:description"[^>]*>/i, "")
    .replace(/<meta property="og:type"[^>]*>/i, "")
    .replace(/<meta property="og:url"[^>]*>/i, "")
    .replace(/<meta property="og:image"[^>]*>/i, "")
    .replace(/<meta name="twitter:card"[^>]*>/i, "")
    .replace(/<meta name="twitter:title"[^>]*>/i, "")
    .replace(/<meta name="twitter:description"[^>]*>/i, "")
    .replace(/<meta name="twitter:image"[^>]*>/i, "")
    .replace("</head>", `${metaBlock}\n  </head>`);
}

export default async function handler(req, res) {
  const url = req.url || "/";
  const parsedUrl = new URL(url, SITE_URL);
  const baseHtml = await getBaseHtml();

  const queryType = req.query?.type || parsedUrl.searchParams.get("type");
  const querySlug = req.query?.slug || parsedUrl.searchParams.get("slug");

  // Determine route and slug
  let routeType = queryType || "";
  let slug = querySlug || "";

  if (!routeType || !slug) {
    const uniMatch = url.match(/\/university\/([^/?#]+)/);
    if (uniMatch) {
      routeType = "university";
      slug = uniMatch[1];
    } else {
      const blogMatch = url.match(/\/blog\/([^/?#]+)/);
      if (blogMatch) {
        routeType = "blog";
        slug = blogMatch[1];
      }
    }
  }

  try {
    // 1. University Route
    if (routeType === "university" && slug) {
      const fallbackTitleName = formatSlugToTitle(slug);
      let uni = null;

      const data = await fetchWithTimeout(`${BACKEND_URL}/api/universities/${slug}`);
      if (data) uni = data.university || data;

      const title = uni?.seoTitle || (uni?.name ? `${uni.name} Admission, Fee & Programs 2026 | Rahbars` : `${fallbackTitleName} - Admissions, Fee Structure & Merit 2026 | Rahbars`);
      const city = uni?.city || "Pakistan";
      const description = uni?.seoDescription || (uni?.name
        ? `Explore ${uni.name} in ${city} - fee structure, admission criteria, programs, closing merit, and deadlines. Apply smarter with Rahbars.`
        : `Check ${fallbackTitleName} admission requirements, fee structure, programs, and deadlines on Rahbars. Pakistan's #1 admission platform.`);
      const image = uni?.image || uni?.logo || DEFAULT_IMAGE;
      const canonical = `${SITE_URL}/university/${slug}`;

      const jsonLd = `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: uni?.name || fallbackTitleName,
        description,
        url: canonical,
        address: {
          "@type": "PostalAddress",
          addressLocality: city,
          addressCountry: "PK",
        },
        image,
      })}</script>`;

      const enriched = injectMeta(baseHtml, {
        title,
        description,
        url: canonical,
        image,
        type: "website",
        extra: jsonLd,
      });

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
      return res.status(200).send(enriched);
    }

    // 2. Blog Route
    if (routeType === "blog" && slug) {
      const fallbackBlogTitle = formatSlugToTitle(slug);
      let blog = null;

      const data = await fetchWithTimeout(`${BACKEND_URL}/api/blogs/${slug}`);
      if (data) blog = data.blog || data;

      const title = blog?.seoTitle || (blog?.title ? `${blog.title} | Rahbars Blog` : `${fallbackBlogTitle} | Rahbars Blog`);
      const description = blog?.seoDescription || blog?.excerpt || `Read ${fallbackBlogTitle} on Rahbars. Expert admissions advice, past papers, and university guides for Pakistani students.`;
      const image = blog?.featuredImage
        ? blog.featuredImage.startsWith("http") ? blog.featuredImage : `${BACKEND_URL}${blog.featuredImage}`
        : DEFAULT_IMAGE;
      const canonical = `${SITE_URL}/blog/${slug}`;

      const jsonLd = `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog?.title || fallbackBlogTitle,
        description,
        image,
        url: canonical,
        author: { "@type": "Organization", name: "Rahbars" },
        publisher: {
          "@type": "Organization",
          name: "Rahbars",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
        },
        datePublished: blog?.createdAt || "2026-01-01",
      })}</script>`;

      const enriched = injectMeta(baseHtml, {
        title,
        description,
        url: canonical,
        image,
        type: "article",
        extra: jsonLd,
      });

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
      return res.status(200).send(enriched);
    }

    // Default base HTML
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    return res.status(200).send(baseHtml);
  } catch (err) {
    console.error("[SEO] Error:", err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(baseHtml);
  }
}
