/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "myrahbar-backend.onrender.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://myrahbar-backend.onrender.com/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "https://myrahbar-backend.onrender.com/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
