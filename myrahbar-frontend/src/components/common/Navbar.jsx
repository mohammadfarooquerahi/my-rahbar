import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  Bell,
  User,
  Heart,
  Home,
  Calculator,
  FileText,
  Headphones,
  Briefcase,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { useAuthStore, useWatchlistStore } from "../../store";
import Logo from "./Logo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearch] = useState("");
  const { isLoggedIn, user, logout } = useAuthStore();
  const { universities } = useWatchlistStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate("/search?q=" + encodeURIComponent(searchText.trim()));
      setMenuOpen(false);
    }
  };

  const links = [
    { to: "/", icon: <Home size={14} />, label: "Home" },
    { to: "/find-university", icon: <Search size={14} />, label: "Find Uni" },
    { to: "/merit-calculator", icon: <Calculator size={14} />, label: "Merit" },
    { to: "/compare", icon: <BookOpen size={14} />, label: "Compare" },
    { to: "/document-tools", icon: <FileText size={14} />, label: "Docs" },
    { to: "/counseling", icon: <Headphones size={14} />, label: "Consult" },
    { to: "/career-guide", icon: <Briefcase size={
<truncated 5030 bytes>
 />
          </form>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={
                "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium " +
                (isActive(l.to)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100")
              }
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link
                to="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2.5 text-sm font-semibold text-white rounded-xl"
                style={{ background: "var(--navy)" }}
              >
                Sign Up Free
              </Link>
            </div>
          )}
          {isLoggedIn && (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
