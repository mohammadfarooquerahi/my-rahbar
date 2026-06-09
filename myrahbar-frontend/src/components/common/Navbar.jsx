import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  User,
  Heart,
  Home,
  Calculator,
  FileText,
  Headphones,
  Sparkles,
  Newspaper,
  Rss,
  ChevronDown,
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

  useEffect(() => {
    // Force light mode by default as requested "white theme all"
    const root = window.document.documentElement;
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");

    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate("/search?q=" + encodeURIComponent(searchText.trim()));
      setMenuOpen(false);
    }
  };

  const mainLinks = [
    { to: "/", icon: <Home size={14} />, label: "Home" },
    { to: "/find-university", icon: <Search size={14} />, label: "Find Uni" },
    { to: "/merit-calculator", icon: <Calculator size={14} />, label: "Merit" },
    { to: "/past-papers", icon: <FileText size={14} />, label: "Papers" },
    { to: "/career-match", icon: <Sparkles size={14} />, label: "AI Chat" },
    { to: "/document-tools", icon: <FileText size={14} />, label: "Docs" },
  ];

  const moreLinks = [
    { to: "/counseling", icon: <Headphones size={14} />, label: "Consult" },
    { to: "/blog", icon: <Rss size={14} />, label: "Blog" },
    { to: "/news", icon: <Newspaper size={14} />, label: "News" },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <nav className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-slate-200 shadow-sm text-slate-900">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Logo size="md" />

        {/* Search - desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-sm items-center bg-slate-100 hover:bg-slate-200 rounded-xl px-3 gap-2 transition-colors"
        >
          <Search size={14} className="text-slate-500 shrink-0" />
          <input
            value={searchText}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search university or department..."
            className="flex-1 bg-transparent py-2 text-sm outline-none text-slate-800 placeholder:text-slate-500"
          />
        </form>

        {/* Nav links - desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {mainLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all " +
                (isActive(l.to)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:text-black hover:bg-slate-100")
              }
            >
              {l.icon}
              {l.label}
            </Link>
          ))}

          {/* More Dropdown */}
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                moreOpen || moreLinks.some(l => isActive(l.to))
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:text-black hover:bg-slate-100"
              }`}
            >
              More <ChevronDown size={14} className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>

            {moreOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-200 shadow-xl rounded-xl py-2 flex flex-col z-50">
                {moreLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMoreOpen(false)}
                    className={
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors " +
                      (isActive(l.to) ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100 hover:text-black")
                    }
                  >
                    {l.icon}
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* AI Chat Mobile Icon */}
          <Link
            to="/career-match"
            className="lg:hidden p-2 text-blue-600 hover:text-blue-800 transition-colors"
            title="AI Chat"
          >
            <Sparkles size={20} />
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/watchlist"
                className="relative p-2 text-slate-500 hover:text-red-500 transition-colors hidden sm:block"
                title="Watchlist"
              >
                <Heart size={20} />
                {universities.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {universities.length}
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-2 py-1 md:px-3 md:py-1.5 rounded-xl transition-colors"
                title="Profile"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "var(--navy)" }}
                >
                  {user?.fullName?.slice(0, 1).toUpperCase() || user?.name?.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-800 hidden md:block max-w-[100px] truncate">
                  {(user?.fullName || user?.name || "User").split(" ")[0]}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="text-sm font-semibold text-slate-700 hover:text-black px-2 py-1.5 hidden md:block"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="text-xs md:text-sm font-bold text-white px-3 py-2 rounded-xl btn-press transition-all shadow-md"
                style={{
                  background: "linear-gradient(135deg, var(--navy), var(--blue))",
                }}
              >
                Sign Up
              </Link>
            </>
          )}

          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-1.5 md:p-2 text-slate-700 hover:bg-slate-100 rounded-lg ml-1"
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Side Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <Logo size="sm" />
          <button onClick={() => setMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-slate-100 rounded-xl px-3 gap-2 mb-4"
          >
            <Search size={16} className="text-slate-500" />
            <input
              value={searchText}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent py-3 text-sm font-medium outline-none text-slate-800"
            />
          </form>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4 px-2">Main Menu</p>
          {mainLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors " +
                (isActive(l.to)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-50 hover:text-black")
              }
            >
              {l.icon}
              {l.label}
            </Link>
          ))}

          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Explore</p>
          {moreLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors " +
                (isActive(l.to)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-50 hover:text-black")
              }
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>

        {!isLoggedIn ? (
          <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50">
            <Link
              to="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center py-3 text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center py-3 text-sm font-bold text-white rounded-xl shadow-md"
              style={{ background: "linear-gradient(135deg, var(--navy), var(--blue))" }}
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-100 bg-slate-50">
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
    </nav>
  );
}
