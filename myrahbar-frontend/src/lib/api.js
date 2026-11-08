import https from "https";
import http from "http";
import { KARACHI_UNIVERSITIES } from "@/data/universities";

// Server-side API helper for fetching data from the backend
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://myrahbar-backend.onrender.com";

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const timeoutMs = options.timeout || 1500;
  const client = url.startsWith("https") ? https : http;

  return new Promise((resolve) => {
    try {
      const req = client.get(
        url,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Rahbars-SSR",
            ...(options.headers || {}),
          },
        },
        (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            res.resume();
            return resolve(null);
          }
          let raw = "";
          res.on("data", (chunk) => {
            raw += chunk;
          });
          res.on("end", () => {
            try {
              resolve(JSON.parse(raw));
            } catch {
              resolve(null);
            }
          });
        }
      );

      req.on("error", () => resolve(null));
      req.setTimeout(timeoutMs, () => {
        req.destroy();
        resolve(null);
      });
    } catch {
      resolve(null);
    }
  });
}

// Memory cache to prevent duplicate fetches during static build
let cachedUniversities = null;
let cachedBlogs = null;

// Public endpoints (no auth needed)
export async function getUniversities(limit = 200) {
  if (cachedUniversities && cachedUniversities.length > 0) return cachedUniversities;
  const data = await fetchAPI(`/api/universities?limit=${limit}`);
  const list = data?.universities || KARACHI_UNIVERSITIES || [];
  cachedUniversities = list;
  return list;
}

export async function getUniversityBySlug(slug) {
  if (cachedUniversities && cachedUniversities.length > 0) {
    const found = cachedUniversities.find((u) => u.slug === slug || u.id === slug || u._id === slug);
    if (found) return found;
  }
  const data = await fetchAPI(`/api/universities/${slug}`);
  if (data?.university) return data.university;
  if (data?._id) return data;
  const fallback = (cachedUniversities || KARACHI_UNIVERSITIES).find((u) => u.slug === slug || u.id === slug);
  return fallback || null;
}

export async function getBlogs(limit = 100) {
  if (cachedBlogs && cachedBlogs.length > 0) return cachedBlogs;
  const data = await fetchAPI(`/api/blogs?limit=${limit}`);
  const list = data?.blogs || [];
  cachedBlogs = list;
  return list;
}

export async function getBlogBySlug(slug) {
  if (cachedBlogs && cachedBlogs.length > 0) {
    const found = cachedBlogs.find((b) => b.slug === slug);
    if (found) return { blog: found, related: [] };
  }
  const data = await fetchAPI(`/api/blogs/${slug}`);
  // Handle both { blog, related } and direct blog formats
  const blog = data?.blog || (data?._id ? data : null);
  const related = data?.related || [];
  return { blog, related };
}

export async function getNews(limit = 50) {
  const data = await fetchAPI(`/api/news?limit=${limit}`);
  return data?.news || data || [];
}

export async function getHeroStudents() {
  const data = await fetchAPI("/api/hero-students");
  return data?.students || [];
}

export async function getPastPapers() {
  const data = await fetchAPI("/api/pastpapers");
  return data?.papers || data || [];
}

// Client-side API base for browser fetch calls
export function getClientAPIBase() {
  return API_BASE;
}

export function getImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/hero/")) {
    return url;
  }
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}
