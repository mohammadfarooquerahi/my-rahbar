export const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_BASE || "https://myrahbar-backend.onrender.com")
    : (process.env.API_BASE || "https://myrahbar-backend.onrender.com");

export const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  // Local static hero images bundled in public/hero/ are served directly from the frontend CDN
  if (url.startsWith("/hero/")) {
    return url;
  }
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};
