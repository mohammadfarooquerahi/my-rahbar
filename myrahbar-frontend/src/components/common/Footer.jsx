"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide marketing footer on full-screen AI chat page and admin dashboard
  if (pathname === "/career-match" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer style={{ background: "#0F172A" }} className="text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <a href="/" className="inline-flex items-center gap-2">
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
              <a href="mailto:farooqrahi828@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">✉️ farooqrahi828@gmail.com</a>
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
