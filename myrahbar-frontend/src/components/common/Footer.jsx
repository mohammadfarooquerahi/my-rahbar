import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer style={{ background: "#0F172A" }} className="text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand — 2 cols */}
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="text-sm text-slate-400 leading-relaxed mt-4 max-w-xs">
              Pakistan's smartest university admission platform. Helping Karachi
              students find their perfect university with AI, merit tools and
              real data.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <span className="font-bold text-[10px]">IG</span>
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <span className="font-bold text-[10px]">YT</span>
              </a>
              <a
                href="mailto:rahbarsofficial@gmail.com"
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <Mail size={15} />
              </a>
              <a
                href="https://wa.me/923455589079"
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
            <ul className="space-y-3 text-sm">
              {[
                ["Find University", "/find-university"],
                ["Merit Calculator", "/merit-calculator"],
                ["Compare Unis", "/compare"],
                ["Document Tools", "/document-tools"],
                ["Past Papers", "/past-papers"],
              ].map(([l, t]) => (
                <li key={t}>
                  <Link to={t} className="hover:text-white transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-3 text-sm">
              {[
                ["Personal Counseling", "/counseling"],
                ["AI Chat", "/career-match"],
                ["Blog & Articles", "/blog"],
                ["About Rahbars", "/about"],
                ["Contact Us", "/contact"],
              ].map(([l, t]) => (
                <li key={t}>
                  <Link to={t} className="hover:text-white transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:rahbarsofficial@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail size={13} />
                rahbarsofficial@gmail.com
              </a>
              <a
                href="https://wa.me/923455589079"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <MessageCircle size={13} />
                +92 345 5589079
              </a>
              <p className="text-slate-600 text-xs mt-4 leading-relaxed">
                Phase 1 — Karachi, Pakistan
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-4 bg-white/5 rounded-2xl text-center text-xs text-slate-500">
          <strong>Disclaimer:</strong> All information is gathered from official university sources, prospectus, and public advertisements. However, admission policies, fees, and deadlines are subject to change. Rahbars is an independent platform and not officially affiliated with these universities. Always verify critical information from the official university website.
        </div>

        <div className="border-t border-white/5 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© 2026 Rahbars.com — All rights reserved.</p>
          <p>Powered by Rahbars.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link to="/about" className="hover:text-white transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
