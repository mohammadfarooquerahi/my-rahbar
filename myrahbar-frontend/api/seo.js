/**
 * Vercel Serverless Function: SEO Meta Tag Injector
 *
 * Intercepts requests to /blog/:slug and /university/:slug.
 * Fetches real data from the Railway backend API, injects
 * page-specific <title>, <meta description>, and OG tags into
 * the base index.html, then serves the enriched HTML.
 *
 * This gives every blog post and university page its own
 * unique meta tags visible to crawlers WITHOUT a full SSR migration.
 */

import { readFileSync } from "fs";
import { join } from "path";

const BACKEND_URL = "https://my-rahbar-production-45d9.up.railway.app";
const SITE_URL = "https://rahbars.com";
const DEFAULT = {
  title: "Rahbars - Find Your Dream University in Pakistan",
  description:
    "Rahbars helps students in Pakistan find the best universities, calculate merit, explore past papers, and get counseling for their careers.",
  image: `${SITE_URL}/og-image.jpg`,
};

/** Read the built index.html from the dist output directory */
function getBaseHtml() {
  try {
    const distPath = join(process.cwd(), "dist", "index.html");
    return readFileSync(distPath, "utf-8");
  } catch {
    // Fallback minimal shell if dist isn't built yet (local dev)
    return `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body><div id="root"></div></body></html>`;
  }
}

/** Inject meta tags into the base HTML string */
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
    <meta property="og:image" content="${image || DEFAULT.image}" />
    <meta property="og:site_name" content="Rahbars" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image || DEFAULT.image}" />
    ${extra}
  `.trim();

  // Replace the entire <title> and subsequent generic meta tags
  return html
    .replace(/<title>.*?<\/title>/i, "")
    .replace(/<meta name="description"[^>]*>/i, "")
    .replace(/<meta property="og:title"[^>]*>/i, "")
    .replace(/<meta property="og:description"[^>]*>/i, "")
    .replace(/<meta property="og:type"[^>]*>/i, "")
    .replace(/<meta property="og:url"[^>]*>/i, "")
    .replace(/<meta name="twitter:card"[^>]*>/i, "")
    .replace(/<meta name="twitter:title"[^>]*>/i, "")
    .replace(/<meta name="twitter:description"[^>]*>/i, "")
    .replace("</head>", `${metaBlock}\n  </head>`);
}

/** Fetch blog post data by slug */
async function fetchBlog(slug) {
  const res = await fetch(`${BACKEND_URL}/api/blogs/${slug}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.blog || data || null;
}

/** Fetch university data by slug */
async function fetchUniversity(slug) {
  const res = await fetch(`${BACKEND_URL}/api/universities/${slug}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.university || data || null;
}

export default async function handler(req, res) {
  const url = req.url || "/";
  const baseHtml = getBaseHtml();

  try {
    // ── Blog route ─────────────────────────────────────────────
    const blogMatch = url.match(/^\/blog\/([^/?#]+)/);
    if (blogMatch) {
      const slug = blogMatch[1];
      const blog = await fetchBlog(slug);

      if (blog) {
        const title = blog.seoTitle || `${blog.title} | Rahbars`;
        const description =
          blog.seoDescription ||
          blog.excerpt ||
          (blog.content ? blog.content.replace(/<[^>]+>/g, "").slice(0, 155) + "…" : DEFAULT.description);
        const image = blog.featuredImage
          ? blog.featuredImage.startsWith("http") ? blog.featuredImage : `${BACKEND_URL}${blog.featuredImage}`
          : DEFAULT.image;
        const canonical = `${SITE_URL}/blog/${slug}`;

        // JSON-LD for Article
        const jsonLd = `<script type="application/ld+json">${JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: blog.title,
          description,
          image,
          url: canonical,
          author: { "@type": "Organization", name: "Rahbars" },
          publisher: {
            "@type": "Organization",
            name: "Rahbars",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
          },
          datePublished: blog.createdAt,
          dateModified: blog.updatedAt || blog.createdAt,
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
        res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
        return res.status(200).send(enriched);
      }
    }

    // ── University route ────────────────────────────────────────
    const uniMatch = url.match(/^\/university\/([^/?#]+)/);
    if (uniMatch) {
      const slug = uniMatch[1];
      const uni = await fetchUniversity(slug);

      if (uni) {
        const title = `${uni.name} Admissions, Fee & Programs 2025 | Rahbars`;
        const city = uni.city || "Pakistan";
        const departments = (uni.departments || []).length;
        const description =
          uni.description ||
          `Explore ${uni.name} in ${city} — fee structure, admission requirements, ${departments}+ programs, merit lists, and deadlines. Apply with Rahbars.`;
        const image = uni.image || DEFAULT.image;
        const canonical = `${SITE_URL}/university/${slug}`;

        // JSON-LD for EducationalOrganization
        const jsonLd = `<script type="application/ld+json">${JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: uni.name,
          description,
          url: uni.website || canonical,
          address: {
            "@type": "PostalAddress",
            addressLocality: uni.city,
            addressRegion: uni.province,
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
        res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
        return res.status(200).send(enriched);
      }
    }

    // ── All other routes — serve base index.html ────────────────
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    return res.status(200).send(baseHtml);
  } catch (err) {
    console.error("[SEO] Error:", err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(baseHtml);
  }
}
