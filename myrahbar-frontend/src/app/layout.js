import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AIChatWidget from "@/components/common/AIChatWidget";

export const metadata = {
  metadataBase: new URL("https://www.rahbars.com"),
  title: {
    default: "Rahbars | Pakistan's Smartest University Admission Platform",
    template: "%s",
  },
  description:
    "Rahbars helps Pakistani students find the best universities. Calculate merit, check fee structures, get deadline alerts, and apply smarter.",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://www.rahbars.com",
    siteName: "Rahbars",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahbars | Pakistan Admission Guide",
    description:
      "Calculate your merit and get matched to the perfect university in Pakistan instantly.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.rahbars.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Sora:wght@300;400;500;600;700;800&family=Outfit:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <AIChatWidget />
      </body>
    </html>
  );
}
