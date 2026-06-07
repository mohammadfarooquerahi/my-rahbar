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
  Sparkles,
  Moon,
  Sun,
  Newspaper,
  Rss,
} from "lucide-react";
import { useEffect } from "react";
import { useAuthStore, useWatchlistStore } from "../../store";
import Logo from "./Logo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearch] = useState("");
  const [isDark, setIsDark] = useState(false);
  const { isLoggedIn, user, logout } = useAuthStore();
  const { universities } = useWatchlistStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = localStorage.getItem("theme");
    if (initialTheme === "dark") {
      setIsDark(true);
      root.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

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
    { to: "/past-papers", icon: <FileText size={14} />, label: "Papers" },
    { to: "/career-match", icon: <Sparkles size={14} />, label: "AI Chat" },
    { to: "/document-tools", icon: <FileText size={14} />, label: "Docs" },
    { to: "/counseling", icon: <Headphones size={14} />, label: "Consult" },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Logo size="md" />

        {/* Search - desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-sm items-center bg-slate-100 hover:bg-slate-200 rounded-xl px-3 gap-2 transition-colors"
        >
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            value={searchText}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search university or department..."
            className="flex-1 bg-transparent py-2 text-sm outline-none text-slate-700 placeholder:text-slate-400"
          />
        </form>

        {/* Nav links - desktop */}
        <div className="hidden lg:flex items-center gap-0.5">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all " +
                (isActive(l.to)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100")
              }
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
            title="Toggle Dark Mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isLoggedIn ? (
            <>
              <Link
                to="/news"
                className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                title="News"
              >
                <Newspaper size={18} />
              </Link>
              <Link
                to="/blog"
                className="p-2 text-slate-400 hover:text-green-500 transition-colors"
                title="Blog"
              >
                <Rss size={18} />
              </Link>
              <Link
                to="/watchlist"
                className="relative p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Watchlist"
              >
                <Heart size={18} />
                {universities.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {universities.length}
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "var(--navy)" }}
                >
                  {user?.fullName?.slice(0, 1).toUpperCase() || user?.name?.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden md:block max-w-[100px] truncate">
                  {(user?.fullName || user?.name || "User").split(" ")[0]}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 hidden md:block"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="text-sm font-semibold text-white px-4 py-2 rounded-xl btn-press transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, var(--navy), var(--blue))",
                }}
              >
                Sign Up
              </Link>
            </>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-1 shadow-lg">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-slate-100 rounded-xl px-3 gap-2 mb-3"
          >
            <Search size={14} className="text-slate-400" />
            <input
              value={searchText}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search university or department..."
              className="flex-1 bg-transparent py-2.5 text-sm outline-none"
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
                Sign Up
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
