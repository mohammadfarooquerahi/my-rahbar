import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  Heart,
  Home,
  Calculator,
  FileText,
  Headphones,
  Sparkles,
  Newspaper,
  Rss,
  ChevronDown,
  User,
  BarChart2,
  BookOpen,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useAuthStore, useWatchlistStore } from "../../store";
import Logo from "./Logo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchText, setSearch] = useState("");
  const { isLoggedIn, user, logout } = useAuthStore();
  const { universities } = useWatchlistStore();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Force light mode
    const root = window.document.documentElement;
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");

    // Prevent body scroll when mobile menu is open
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate("/search?q=" + encodeURIComponent(searchText.trim()));
      setMenuOpen(false);
    }
  };

  const mainLinks = [
    { to: "/", icon: <Home size={18} />, label: "Home" },
    { to: "/find-university", icon: <Search size={18} />, label: "Find University" },
    { to: "/merit-calculator", icon: <Calculator size={18} />, label: "Aggregate Calculator" },
    { to: "/past-papers", icon: <FileText size={18} />, label: "Past Papers" },
    { to: "/career-match", icon: <Sparkles size={18} />, label: "AI Chat" },
    { to: "/document-tools", icon: <FileText size={18} />, label: "Document Tools" },
  ];

  const moreLinks = [
    { to: "/compare", icon: <BarChart2 size={18} />, label: "Compare Universities" },
    { to: "/counseling", icon: <Headphones size={18} />, label: "Consult Expert" },
    { to: "/blog", icon: <BookOpen size={18} />, label: "Blog & Articles" },
    { to: "/news", icon: <Bell size={18} />, label: "Admission News" },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white text-slate-900 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          
          {/* Logo & Main Links Group */}
          <div className="flex items-center gap-8 lg:gap-12">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop nav links — Zipper minimal style */}
            <div className="hidden lg:flex items-center gap-6">
              {mainLinks.slice(1, 5).map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={
                    "text-[14px] font-semibold transition-colors " +
                    (isActive(l.to)
                      ? "text-black"
                      : "text-slate-600 hover:text-black")
                  }
                >
                  {l.label}
                </Link>
              ))}

              {/* More Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`flex items-center gap-1 text-[14px] font-semibold transition-colors ${
                    moreOpen || moreLinks.some((l) => isActive(l.to))
                      ? "text-black"
                      : "text-slate-600 hover:text-black"
                  }`}
                >
                  Resources
                  <ChevronDown
                    size={14}
                    className={`transition-transform text-slate-400 ml-0.5 ${moreOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {moreOpen && (
                  <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-slate-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] rounded-2xl py-2 flex flex-col z-50">
                    {moreLinks.map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={() => setMoreOpen(false)}
                        className={
                          "flex items-center gap-2.5 px-5 py-2.5 text-[14px] font-medium transition-colors " +
                          (isActive(l.to)
                            ? "bg-slate-50 text-black"
                            : "text-slate-600 hover:bg-slate-50 hover:text-black")
                        }
                      >
                        <span className="text-slate-400">{l.icon}</span>
                        {l.label}
                      </Link>
                    ))}
                    <Link
                        to="/document-tools"
                        onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-[14px] font-medium transition-colors text-slate-600 hover:bg-slate-50 hover:text-black"
                    >
                      <span className="text-slate-400"><FileText size={18} /></span>
                      Document Tools
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* AI Chat icon — mobile only */}
            <Link
              to="/career-match"
              className="lg:hidden relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
              title="AI Career Chat"
            >
              <MessageSquare size={18} strokeWidth={2} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/watchlist"
                  className="relative hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:text-black hover:bg-slate-100 transition-colors"
                  title="Watchlist"
                >
                  <Heart size={18} />
                  {universities.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {universities.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-full transition-all"
                  title="Profile"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                    style={{ background: "#0f172a" }}
                  >
                    {(user?.fullName || user?.name || "U").slice(0, 1).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-semibold text-slate-800 hidden md:block max-w-[80px] truncate">
                    {(user?.fullName || user?.name || "User").split(" ")[0]}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-[14px] font-semibold text-slate-600 hover:text-black px-2 hidden md:block"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="hidden sm:flex items-center justify-center text-[14px] font-bold text-white bg-slate-900 hover:bg-slate-800 px-6 py-2.5 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Hamburger — always visible on mobile */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all ml-1"
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer Overlay ── */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] lg:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Mobile Side Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[70] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <Logo size="sm" />
          <button
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search in drawer */}
        <div className="px-4 py-3 border-b border-slate-50 shrink-0">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-slate-100 rounded-xl px-3 gap-2"
          >
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              value={searchText}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="FAST, NED, Karachi Uni..."
              className="flex-1 bg-transparent py-2.5 text-sm outline-none text-slate-800 placeholder:text-slate-400"
            />
          </form>
        </div>

        {/* Drawer links */}
        <div className="flex-1 overflow-y-auto py-3 px-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-2">
            Main Menu
          </p>
          <div className="space-y-0.5">
            {mainLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors " +
                  (isActive(l.to)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-700")
                }
              >
                <span className={isActive(l.to) ? "text-blue-600" : "text-slate-400"}>
                  {l.icon}
                </span>
                {l.label}
              </Link>
            ))}
          </div>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-5 mb-1 px-2">
            Explore
          </p>
          <div className="space-y-0.5">
            {moreLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors " +
                  (isActive(l.to)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-700")
                }
              >
                <span className={isActive(l.to) ? "text-blue-600" : "text-slate-400"}>
                  {l.icon}
                </span>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Drawer Footer */}
        {!isLoggedIn ? (
          <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50 shrink-0">
            <Link
              to="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center py-3 text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center py-3 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all hover:shadow-lg"
            >
              Sign Up — It's Free
            </Link>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2 shrink-0">
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background: "var(--navy)" }}
              >
                {(user?.fullName || user?.name || "U").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {user?.fullName || user?.name || "User"}
                </p>
                <p className="text-xs text-slate-400">View Profile</p>
              </div>
            </Link>
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="w-full text-center py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
