import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.rahbars.com"),
  title: {
    default: "Rahbars | Pakistan's Smartest University Admission Platform",
    template: "%s | Rahbars",
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Sora:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// ─── NAVBAR (Server Component) ─────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white text-slate-900 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8 lg:gap-12">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">R</div>
            <div>
              <span className="text-lg font-black text-slate-900" style={{ fontFamily: "Sora" }}>Rahbars.</span>
              <p className="text-[8px] font-bold text-emerald-600 tracking-wider -mt-0.5">LEARN. GROW. SUCCEED.</p>
            </div>
          </a>
          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="/find-university" className="text-[14px] font-semibold text-slate-600 hover:text-black transition-colors">Find University</a>
            <a href="/merit-calculator" className="text-[14px] font-semibold text-slate-600 hover:text-black transition-colors">Aggregate Calculator</a>
            <a href="/past-papers" className="text-[14px] font-semibold text-slate-600 hover:text-black transition-colors">Past Papers</a>
            <a href="/career-match" className="text-[14px] font-semibold text-slate-600 hover:text-black transition-colors">AI Chat</a>
            <div className="relative group">
              <button className="flex items-center gap-1 text-[14px] font-semibold text-slate-600 hover:text-black transition-colors">
                Resources
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 ml-0.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-slate-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] rounded-2xl py-2 flex-col z-50 hidden group-hover:flex">
                <a href="/compare" className="flex items-center gap-2.5 px-5 py-2.5 text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-black">Compare Universities</a>
                <a href="/counseling" className="flex items-center gap-2.5 px-5 py-2.5 text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-black">Consult Expert</a>
                <a href="/blog" className="flex items-center gap-2.5 px-5 py-2.5 text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-black">Blog & Articles</a>
                <a href="/news" className="flex items-center gap-2.5 px-5 py-2.5 text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-black">Admission News</a>
                <a href="/document-tools" className="flex items-center gap-2.5 px-5 py-2.5 text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-black">Document Tools</a>
              </div>
            </div>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4">
          <a href="/auth/login" className="text-[14px] font-semibold text-slate-600 hover:text-black px-2 hidden md:block">Login</a>
          <a href="/auth/register" className="hidden sm:flex items-center justify-center text-[14px] font-bold text-white bg-slate-900 hover:bg-slate-800 px-6 py-2.5 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-sm">Sign Up</a>
        </div>
      </div>
    </nav>
  );
}

// ─── FOOTER (Server Component) ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#0F172A" }} className="text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">R</div>
              <span className="text-lg font-black text-white" style={{ fontFamily: "Sora" }}>Rahbars.</span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed mt-4 max-w-xs">
              Pakistan&apos;s smartest university admission platform. Helping students find their perfect university with AI, merit tools and real data.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
            <ul className="space-y-3 text-sm">
              {[["Find University", "/find-university"], ["Merit Calculator", "/merit-calculator"], ["Compare Unis", "/compare"], ["Document Tools", "/document-tools"], ["Past Papers", "/past-papers"]].map(([l, t]) => (
                <li key={t}><a href={t} className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-3 text-sm">
              {[["Personal Counseling", "/counseling"], ["AI Chat", "/career-match"], ["Blog & Articles", "/blog"], ["About Rahbars", "/about"], ["Contact Us", "/contact"]].map(([l, t]) => (
                <li key={t}><a href={t} className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <div className="space-y-3 text-sm">
              <a href="mailto:farooqrahi828@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">📧 farooqrahi828@gmail.com</a>
              <a href="https://wa.me/923190211218" className="flex items-center gap-2 hover:text-white transition-colors">💬 +92 319 0211218</a>
              <p className="text-slate-600 text-xs mt-4 leading-relaxed">Hyderabad, Pakistan</p>
            </div>
          </div>
        </div>
        <div className="mt-12 p-4 bg-white/5 rounded-2xl text-center text-xs text-slate-500">
          <strong>Disclaimer:</strong> All information is gathered from official university sources. Admission policies are subject to change. Always verify from official university websites.
        </div>
        <div className="border-t border-white/5 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© 2026 Rahbars.com — All rights reserved.</p>
          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="/about" className="hover:text-white transition-colors">About</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
