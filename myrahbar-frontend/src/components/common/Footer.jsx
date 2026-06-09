import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import Logo from "./Logo";

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-600 mt-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Logo size="lg" />
            <p className="text-sm text-slate-500 leading-relaxed mt-4 max-w-xs">
              Pakistan's smartest university admission platform. Helping Karachi
              students find their perfect university with AI, merit tools and
              real data.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="p-2.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1" title="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="p-2.5 bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1" title="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                className="p-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1" title="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="mailto:rahbarsofficial@gmail.com"
                className="p-2.5 bg-slate-100 hover:bg-slate-800 text-slate-600 hover:text-white rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1" title="Email">
                <Mail size={18} />
              </a>
              <a href="https://wa.me/923455589079" target="_blank" rel="noreferrer"
                className="p-2.5 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1" title="WhatsApp">
                <MessageCircle size={18} />
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
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-blue-600 transition-colors">{label}</Link>
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
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-blue-600 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4 text-sm">Contact</h4>
            <div className="space-y-3 text-sm font-medium">
              <a href="mailto:rahbarsofficial@gmail.com"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Mail size={14} /> rahbarsofficial@gmail.com
              </a>
              <a href="https://wa.me/923455589079"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <MessageCircle size={14} /> +92 345 5589079
              </a>
              <p className="text-slate-500 text-xs mt-4">Karachi, Pakistan</p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-5 bg-blue-50/50 rounded-2xl text-center text-xs text-slate-500 border border-blue-100">
          <strong className="text-slate-700">Disclaimer:</strong> All information is gathered from official university sources. Admission policies, fees, and deadlines are subject to change. Rahbars is independent and not officially affiliated with these universities.
        </div>

        <div className="border-t border-slate-200 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© 2026 Rahbars.com — All rights reserved.</p>
          <p>Made with ❤️ in Karachi, Pakistan</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms of Use</Link>
            <Link to="/about" className="hover:text-slate-900 transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
