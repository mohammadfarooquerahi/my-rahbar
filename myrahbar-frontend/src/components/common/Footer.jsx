import { Link } from "react-router-dom";
// import { Mail, MessageCircle, Youtube } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer style={{ background: "#0F172A" }} className="text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand â€” 2 cols */}
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
                {/* <Instagram size={15} /> */}
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                {/* <Youtube size={15} /> */}
              </a>
              <a
                href="mailto:info@myrahbar.com"
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
   
<truncated 1934 bytes>
>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:farooqrahi828@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                {/* <Mail size={13} /> */}
                farooqrahi828@gmail.com
              </a>
              <a
                href="https://wa.me/923455589079"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                {/* <MessageCircle size={13} />  */}
                +92 345 5589079
              </a>
              <p className="text-slate-600 text-xs mt-4 leading-relaxed">
                Phase 1 â€” Karachi, Pakistan
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>Â© 2026 MyRahbar.com â€” All rights reserved.</p>
          <p>Powered by MyRahbar.</p>
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
