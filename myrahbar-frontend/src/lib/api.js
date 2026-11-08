import { KARACHI_UNIVERSITIES } from "@/data/universities";
// Server-side API helper for fetching data from the backend
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://myrahbar-backend.onrender.com";

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        "User-Agent": "Rahbars-SSR",
        ...(options.headers || {}),
      },
      signal: AbortSignal.timeout(options.timeout || 2000),
      next: options.next || { revalidate: 1800 },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[fetchAPI] ${endpoint} fallback:`, err.message);
    return null;
  }
}

// Public endpoints (no auth needed)
export async function getUniversities(limit = 200) {
  const data = await fetchAPI(`/api/universities?limit=${limit}`);
  return data?.universities || KARACHI_UNIVERSITIES || [];
}

export async function getUniversityBySlug(slug) {
  const data = await fetchAPI(`/api/universities/${slug}`);
  if (data?.university) return data.university;
  if (data?._id) return data;
  const fallback = KARACHI_UNIVERSITIES.find((u) => u.slug === slug || u.id === slug);
  return fallback || null;
}

export async function getBlogs(limit = 100) {
  const data = await fetchAPI(`/api/blogs?limit=${limit}`);
  return data?.blogs || [];
}

export async function getBlogBySlug(slug) {
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
