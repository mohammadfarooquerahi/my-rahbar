import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-600 mt-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand — 2 cols */}
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="text-sm text-slate-500 leading-relaxed mt-4 max-w-xs">
              Pakistan's smartest university admission platform. Helping Karachi
              students find their perfect university with AI, merit tools and
              real data.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl shadow-sm border border-slate-200 transition-colors"
              >
                <span className="font-bold text-[10px]">IG</span>
              </a>
              <a
                href="#"
                className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl shadow-sm border border-slate-200 transition-colors"
              >
                <span className="font-bold text-[10px]">YT</span>
              </a>
              <a
                href="mailto:rahbarsofficial@gmail.com"
                className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl shadow-sm border border-slate-200 transition-colors"
              >
                <Mail size={15} />
              </a>
              <a
                href="https://wa.me/923455589079"
                className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl shadow-sm border border-slate-200 transition-colors"
              >
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4 text-sm">Platform</h4>
            <ul className="space-y-3 text-sm font-medium">
              {[
                ["Find University", "/find-university"],
                ["Merit Calculator", "/merit-calculator"],
                ["Compare Unis", "/compare"],
                ["Document Tools", "/document-tools"],
                ["Past Papers", "/past-papers"],
              ].map(([l, t]) => (
                <li key={t}>
                  <Link to={t} className="hover:text-blue-600 transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4 text-sm">Support</h4>
            <ul className="space-y-3 text-sm font-medium">
              {[
                ["Personal Counseling", "/counseling"],
                ["AI Chat", "/career-match"],
                ["Blog & Articles", "/blog"],
                ["About Rahbars", "/about"],
                ["Contact Us", "/contact"],
              ].map(([l, t]) => (
                <li key={t}>
                  <Link to={t} className="hover:text-blue-600 transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4 text-sm">Contact</h4>
            <div className="space-y-3 text-sm font-medium">
              <a
                href="mailto:rahbarsofficial@gmail.com"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Mail size={14} />
                rahbarsofficial@gmail.com
              </a>
              <a
                href="https://wa.me/923455589079"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <MessageCircle size={14} />
                +92 345 5589079
              </a>
              <p className="text-slate-500 text-xs mt-4 leading-relaxed">
                Karachi, Pakistan
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-5 bg-blue-50/50 rounded-2xl text-center text-xs text-slate-500 border border-blue-100">
          <strong className="text-slate-700">Disclaimer:</strong> All information is gathered from official university sources, prospectus, and public advertisements. However, admission policies, fees, and deadlines are subject to change. Rahbars is an independent platform and not officially affiliated with these universities. Always verify critical information from the official university website.
        </div>

        <div className="border-t border-slate-200 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© 2026 Rahbars.com — All rights reserved.</p>
          <p>Powered by Rahbars.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-900 transition-colors">
              Terms of Use
            </Link>
            <Link to="/about" className="hover:text-slate-900 transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
