export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth/", "/profile", "/watchlist", "/admin"],
      },
    ],
    sitemap: "https://www.rahbars.com/sitemap.xml",
  };
}
