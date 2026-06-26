import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { KARACHI_UNIVERSITIES } from "../data/universities";
import {
  Search,
  ArrowRight,
  Zap,
  Calculator,
  FileText,
  Headphones,
  Briefcase,
  Star,
  Clock,
  ChevronRight,
  BookOpen,
  Bell,
  Users,
  TrendingUp,
  Shield,
  Heart,
  Sparkles,
  Target,
  CheckCircle,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
// import removed
import UniversityCard from "../components/university/UniversityCard";
import { deadlineLabel, daysUntilDeadline } from "../utils/merit";
import { useWatchlistStore, useAuthStore } from "../store";
import Logo from "../components/common/Logo";

export default function HomePage() {
  const [degreeLevel, setDegreeLevel] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { universities: savedUnis } = useWatchlistStore();
  const { isLoggedIn, user } = useAuthStore();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (degreeLevel) params.set("degreeLevel", degreeLevel);
    if (query) params.set("q", query);
    if (params.toString()) navigate("/search?" + params.toString());
    else navigate("/search");
  };

  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inside HomePage component, replace the useEffect:
  useEffect(() => {
    setLoading(true);
    fetch("/api/universities")
      .then((res) => res.json())
      .then((data) => {
        const unis = data.universities || [];
        if (unis.length > 0) {
          // Normalize MongoDB '_id' onto 'id' property so the frontend maps cleanly
          const normalizedUnis = unis.map((u) => ({ ...u, id: u._id || u.id }));
          setUniversities(normalizedUnis);
        } else {
          setUniversities(KARACHI_UNIVERSITIES);
        }
        setLoading(false);
      })
      .catch(() => {
        setUniversities(KARACHI_UNIVERSITIES);
        setLoading(false);
      });
  }, []);

  const openUnis = universities.filter((u) => u.admissionOpen);
  const featured = universities.slice(0, 6);
  const savedFull = universities.filter((u) =>
    savedUnis.some((s) => s.id === u._id || s.id === u.id),
  );

  const stats = [
    { label: "Universities", value: "100+", icon: <BookOpen size={18} /> },
    { label: "Students Helped", value: "5,000+", icon: <Users size={18} /> },
    { label: "Departments", value: "150+", icon: <TrendingUp size={18} /> },
    { label: "Scholarships", value: "80+", icon: <Shield size={18} /> },
  ];

  const tools = [
    {
      icon: <Search size={20} />,
      title: "Smart Uni Finder",
      desc: "10 questions — get matched to your perfect university",
      to: "/find-university",
      color: "var(--blue)",
      bg: "#EFF6FF",
      tag: "Most Used",
      cta: "Find University",
    },
    {
      icon: <Calculator size={20} />,
      title: "Aggregate Calculator",
      desc: "Enter your marks — see if you qualify instantly",
      to: "/merit-calculator",
      color: "var(--green)",
      bg: "#F0FDF4",
      tag: "Tool",
      cta: "Calculate Aggregate",
    },
    {
      icon: <FileText size={20} />,
      title: "Document Compressor",
      desc: "Compress documents to exact university size requirements",
      to: "/document-tools",
      color: "var(--orange)",
      bg: "#FFF7ED",
      tag: "Tool",
      cta: "Compress Now",
    },
    {
      icon: <Headphones size={20} />,
      title: "1-on-1 Counseling",
      desc: "Talk to an expert — get clear answers about your admission",
      to: "/counseling",
      color: "#8B5CF6",
      bg: "#F5F3FF",
      tag: "Expert Help",
      cta: "Book Now",
    },
    {
      icon: <BookOpen size={20} />,
      title: "Compare Universities",
      desc: "Side by side comparison of fee, merit and facilities",
      to: "/compare",
      color: "var(--navy)",
      bg: "#F0F4FF",
      tag: "New",
      cta: "Compare University",
    },
    {
      icon: <FileText size={20} />,
      title: "Past Papers",
      desc: "Download official past papers and practice for entry tests",
      to: "/past-papers",
      color: "#EC4899",
      bg: "#FDF2F8",
      tag: "Hot",
      cta: "Check Now",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      emoji: "🤔",
      title: "You are confused — we get it",
      desc: "Hundreds of universities, different deadlines, different formulas. Every student feels lost at this stage. You are not alone.",
      color: "#EFF6FF",
      border: "#BFDBFE",
    },
    {
      step: "02",
      emoji: "📋",
      title: "Answer 10 simple questions",
      desc: "Tell us your budget, field, marks and goals. No complicated forms — just honest answers in under 2 minutes.",
      color: "#F0FDF4",
      border: "#BBF7D0",
    },
    {
      step: "03",
      emoji: "🎯",
      title: "Get matched to your best university",
      desc: "We show you the top 3 universities that actually fit your profile — with merit prediction and fee breakdown.",
      color: "#FFF7ED",
      border: "#FED7AA",
    },
    {
      step: "04",
      emoji: "✅",
      title: "Apply with full confidence",
      desc: "Documents ready, form filled, deadline set on WhatsApp. Walk into your admission knowing exactly what to expect.",
      color: "#F5F3FF",
      border: "#DDD6FE",
    },
  ];

  return (
    <main>
      <Helmet>
        <title>
          Rahbars | Pakistan's Smartest University Admission Platform
        </title>
        <meta
          name="description"
          content="Rahbars helps Pakistani students find the best universities in Karachi. Calculate merit, check fee structures, get deadline alerts, and apply smarter."
        />
        <link rel="canonical" href="https://rahbars.com/" />

        {/* OpenGraph Tags */}
        <meta property="og:title" content="Rahbars | Find Your University" />
        <meta
          property="og:description"
          content="Calculate your merit and get matched to the perfect university in Karachi instantly."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rahbars.com/" />
        <meta property="og:image" content="https://rahbars.com/og-image.jpg" />
        <meta property="og:site_name" content="Rahbars" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Rahbars | Pakistan Admission Guide"
        />
        <meta
          name="twitter:description"
          content="Calculate your merit and get matched to the perfect university in Karachi instantly."
        />
        <meta name="twitter:image" content="https://rahbars.com/og-image.jpg" />
      </Helmet>

      {/* Ticker - deadline & features bar */}
      <div
        className="text-blue-800 text-xs py-2 overflow-hidden border-b border-blue-100"
        style={{ background: "#EFF6FF" }}
      >
        <div className="ticker-wrap">
          <div className="ticker">
            {/* Features */}
            {[
              {
                icon: "🎯",
                text: "Smart University Finder — Answer 10 questions, get matched instantly",
              },
              {
                icon: "📊",
                text: "Live Merit Calculator — Know your chances before applying",
              },
              {
                icon: "📄",
                text: "Document Compressor — Compress to any university size requirement",
              },
              {
                icon: "🤖",
                text: "AI Career Counselor — Ask anything about careers in Pakistan",
              },
              {
                icon: "🔔",
                text: "WhatsApp Deadline Alerts — Never miss an admission deadline",
              },
              ...openUnis.map((u) => ({
                icon: "⏰",
                text:
                  u.shortName +
                  " — " +
                  deadlineLabel(daysUntilDeadline(u.admissionDeadline)).text,
              })),
            ].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 mr-12 text-blue-700"
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.text}</span>
                <span className="text-blue-300 ml-4">•</span>
              </span>
            ))}
            {/* Repeat for seamless loop */}
            {[
              {
                icon: "🎯",
                text: "Smart University Finder — Answer 10 questions, get matched instantly",
              },
              {
                icon: "📊",
                text: "Live Merit Calculator — Know your chances before applying",
              },
              {
                icon: "📄",
                text: "Document Compressor — Compress to any university size requirement",
              },
              {
                icon: "🤖",
                text: "AI Career Counselor — Ask anything about careers in Pakistan",
              },
              {
                icon: "🔔",
                text: "WhatsApp Deadline Alerts — Never miss an admission deadline",
              },
            ].map((item, i) => (
              <span
                key={"r" + i}
                className="inline-flex items-center gap-2 mr-12 text-blue-700"
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.text}</span>
                <span className="text-blue-300 ml-4">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Hero Section */}
      <section
        className="relative overflow-hidden pt-4 pb-10 md:pt-8 md:pb-16 hero-gradient-bg"
        style={{
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Subtle mesh gradient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px] bg-blue-500" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full opacity-10 blur-[120px] bg-purple-600" />
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full opacity-10 blur-[100px] bg-emerald-500" />
          
          {/* Light mode grid */}
          <div
            className="absolute inset-0 opacity-100"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-full mb-4 fade-up shadow-lg shadow-violet-200/60">
            <span className="text-base">⚡</span>
            Next-Gen Admission Platform — 100% Free for Every Student
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-5 fade-up-1 leading-[1.08] tracking-tight">
            Your Gateway to the
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600">
              Right University.
            </span>
          </h1>

          <p className="text-slate-700 text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto fade-up-2 leading-relaxed">
            Rahbars helps Pakistani students find, compare, and get admitted to their ideal university.
            Calculate your aggregate, check merit lists, download past papers, and get
            expert counseling — all in one place, completely free.
          </p>

          {/* Search Bar - 2 Step Glassmorphism (Compact Size) */}
          <form
            onSubmit={handleSearch}
            className="fade-up-3 max-w-2xl mx-auto mb-8 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex flex-col sm:flex-row items-center bg-white backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl p-1.5 gap-1.5 transition-all">
              <div className="flex-1 w-full flex items-center border-b sm:border-b-0 sm:border-r border-slate-200 px-3 py-1.5 sm:py-0">
                <select 
                  value={degreeLevel} 
                  onChange={(e) => setDegreeLevel(e.target.value)} 
                  className="w-full py-1.5 bg-transparent text-slate-900 outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="" disabled>Select Degree Level</option>
                  <option value="BS">BS / Undergraduate</option>
                  <option value="MS">MS / MPhil</option>
                  <option value="PhD">PhD / Doctorate</option>
                  <option value="Other">Other (Diplomas/Certificates)</option>
                </select>
              </div>
              <div className="flex-1 w-full flex items-center px-3 py-1.5 sm:py-0">
                <Search size={16} className="text-blue-600 mr-2 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search university name, program, city..."
                  className="w-full py-1.5 bg-transparent text-slate-900 outline-none text-sm font-medium placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-white text-sm font-bold btn-press shrink-0 bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25"
              >
                Find Universities
              </button>
            </div>
          </form>

          {/* Quick tags */}
          <div className="fade-up-4 flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-12">
            {[
              "MBBS",
              "BDS",
              "CA",
              "Software Engineering",
              "DPT",
              "Pharm-D",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate("/search?q=" + tag)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-full transition-all hover:scale-105 shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats — Colorful Glass Boxes */}
          <div className="fade-up-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-slate-200">
            {stats.map((s, i) => {
              const colors = [
                {
                  bg: "bg-blue-50/50",
                  border: "border-blue-100",
                  text: "from-blue-600 to-indigo-600",
                },
                {
                  bg: "bg-purple-50/50",
                  border: "border-purple-100",
                  text: "from-purple-600 to-pink-600",
                },
                {
                  bg: "bg-emerald-50/50",
                  border: "border-emerald-100",
                  text: "from-emerald-600 to-teal-600",
                },
                {
                  bg: "bg-orange-50/50",
                  border: "border-orange-100",
                  text: "from-orange-600 to-red-600",
                },
              ];
              const c = colors[i % 4];
              return (
                <div
                  key={i}
                  className={`group ${c.bg} backdrop-blur-md rounded-2xl p-4 sm:p-6 border ${c.border} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
                >
                  <p
                    className={`text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br ${c.text} transition-all duration-300`}
                  >
                    {s.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5 font-bold tracking-wide uppercase">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Saved universities — show when logged in and has saved */}
      {isLoggedIn && savedFull.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10 bg-white">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-red-500" fill="currentColor" />
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "Sora", color: "var(--navy)" }}
              >
                Your Saved Universities
              </h2>
            </div>
            <Link
              to="/watchlist"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedFull.slice(0, 3).map((uni) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))}
          </div>
        </section>
      )}

      {/* ── TOOLS & FEATURES ── Premium Section */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #0f1f5c 50%, #0a0f2e 100%)" }}>
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        <div className="max-w-7xl mx-auto px-4 relative z-10">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-300 text-xs font-bold px-4 py-2 rounded-full mb-5 backdrop-blur-sm">
              <Target size={12} />
              TOOLS &amp; FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "Sora" }}>
              Everything You Need to<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #60a5fa, #a78bfa)" }}>
                Get Admitted
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              From finding the right university to getting admitted — all tools in one place, completely free.
            </p>
          </div>

          {/* Big Hero Card (Smart Uni Finder) */}
          <Link to="/find-university"
            className="group block rounded-3xl p-8 md:p-10 mb-6 relative overflow-hidden border border-white/10 hover:border-blue-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20"
            style={{ background: "linear-gradient(135deg, #1e3a8a22, #1e40af44)" }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ background: "linear-gradient(135deg, #1d4ed820, #7c3aed20)" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-300" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
                <Search size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Most Used</span>
                  <span className="text-blue-400 text-xs">⭐ #1 Tool</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2" style={{ fontFamily: "Sora" }}>Smart University Finder</h3>
                <p className="text-slate-400 text-base max-w-xl">Answer 10 simple questions — get matched to your perfect university with merit prediction and fee breakdown instantly.</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-colors shrink-0 group-hover:translate-x-1 duration-300">
                Find University <ChevronRight size={18} />
              </div>
            </div>
          </Link>

          {/* 4-card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { icon: <Calculator size={22} className="text-white" />, title: "Aggregate Calculator", desc: "Enter your marks — see if you qualify instantly", to: "/merit-calculator", tag: "Tool", gradient: "linear-gradient(135deg, #10b981, #059669)" },
              { icon: <BookOpen size={22} className="text-white" />, title: "Compare Universities", desc: "Side by side comparison of fee, merit and facilities", to: "/compare", tag: "New", gradient: "linear-gradient(135deg, #6366f1, #4f46e5)" },
              { icon: <FileText size={22} className="text-white" />, title: "Past Papers", desc: "Download official papers and practice for entry tests", to: "/past-papers", tag: "Hot", gradient: "linear-gradient(135deg, #ec4899, #db2777)" },
              { icon: <FileText size={22} className="text-white" />, title: "Document Compressor", desc: "Compress docs to exact university size requirements", to: "/document-tools", tag: "Tool", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
            ].map((t, i) => (
              <Link key={i} to={t.to}
                className="group relative rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(255,255,255,0.03)" }} />
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: t.gradient }}>
                    {t.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">{t.tag}</span>
                  <h3 className="font-bold text-white text-sm mb-2 leading-snug" style={{ fontFamily: "Sora" }}>{t.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{t.desc}</p>
                  <div className="flex items-center gap-1 text-blue-400 text-xs font-semibold group-hover:gap-2 transition-all">
                    Open Tool <ChevronRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom row: Counseling full-width card */}
          <Link to="/counseling"
            className="group block rounded-3xl p-7 relative overflow-hidden border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
            style={{ background: "linear-gradient(135deg, #4c1d9520, #7c3aed30)" }}>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-300" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>
                <Headphones size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <span className="bg-purple-500/30 border border-purple-400/30 text-purple-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide mb-2 inline-block">Expert Help</span>
                <h3 className="text-xl font-black text-white" style={{ fontFamily: "Sora" }}>1-on-1 Expert Counseling</h3>
                <p className="text-slate-400 text-sm mt-1">Get personalized admission advice from a real expert — tailored for your marks, budget & goals.</p>
              </div>
              <div className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-2xl transition-colors shrink-0">
                Book Session <ChevronRight size={16} />
              </div>
            </div>
          </Link>

        </div>
      </section>


      {/* Featured universities */}
      <section className="bg-white dark:bg-card py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                <MapPin size={12} />
                PAKISTANI UNIVERSITIES
              </div>
              <h2
                className="text-4xl font-black"
                style={{ fontFamily: "Sora", color: "var(--navy)" }}
              >
                All Pakistani Universities
              </h2>
              <p className="text-slate-500 mt-1 max-w-lg">
                All fields and departments from different Universities in
                Pakistan
              </p>
            </div>
            <Link
              to="/search"
              className="hidden md:flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition-colors shadow-md"
            >
              See All Universities <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((uni) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-md"
            >
              See All Universities <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works — emotional */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={12} />
            HOW IT WORKS
          </div>
          <h2
            className="text-4xl font-black mb-3"
            style={{ fontFamily: "Sora", color: "var(--navy)" }}
          >
            From Confused to Admitted
          </h2>
          <p className="text-slate-500">
            We have helped 5,000+ students go from totally lost to fully
            admitted. Here is how.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {howItWorks.map((s, i) => (
            <div
              key={i}
              className="card-hover rounded-2xl p-6 border-2"
              style={{ background: s.color, borderColor: s.border }}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl shrink-0">{s.emoji}</div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-black text-slate-400"
                      style={{ fontFamily: "DM Mono" }}
                    >
                      STEP {s.step}
                    </span>
                  </div>
                  <h3
                    className="font-bold text-slate-800 mb-2"
                    style={{ fontFamily: "Sora" }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/find-university"
            className="inline-flex items-center gap-3 text-white font-bold px-8 py-4 rounded-2xl text-base btn-press shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--navy), var(--blue))",
            }}
          >
            <Target size={18} />
            Find My University Now
            <ArrowRight size={18} />
          </Link>
          <p className="text-slate-400 text-sm mt-3">
            Takes 2 minutes • No account needed
          </p>
        </div>
      </section>

      {/* Alert CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div
          className="rounded-3xl p-10 text-white relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0F172A 0%, #1A2E4A 50%, #1E40AF 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className="text-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
                  Never Miss a Deadline
                </span>
              </div>
              <h3
                className="text-3xl font-black mb-3"
                style={{ fontFamily: "Sora" }}
              >
                Get WhatsApp Alerts Before Deadlines
              </h3>
              <p className="text-blue-200 max-w-lg">
                Save any university to your watchlist. We send you a WhatsApp
                message 7 days and 1 day before the deadline. Free, no spam.
              </p>
              <div className="flex flex-wrap gap-4 mt-5">
                {[
                  "7 days before deadline",
                  "1 day before deadline",
                  "When deadline extended",
                ].map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1.5 text-sm text-blue-200"
                  >
                    <CheckCircle size={14} className="text-green-400" /> {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0">
              <Link
                to="/auth/register"
                className="flex items-center gap-2 bg-yellow-400 text-slate-900 font-bold px-8 py-4 rounded-2xl text-sm hover:bg-yellow-300 transition-colors btn-press"
              >
                <Bell size={16} />
                Enable Free Alerts
              </Link>
              <p className="text-xs text-center text-blue-400 mt-2">
                No spam — unsubscribe anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-black mb-4"
            style={{ fontFamily: "Sora", color: "var(--navy)" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500">
            Everything you need to know about university admissions in Pakistan.
          </p>
        </div>
        <div className="space-y-4">
          {[
            {
              q: "How does the Merit Calculator work?",
              a: "Our Merit Calculator uses the exact aggregate formulas provided by official university guidelines. You simply enter your Matric/O-Levels and Inter/A-Levels marks, along with any entry test scores, and we calculate your exact aggregate percentage instantly.",
            },
            {
              q: "Are the university deadlines accurate?",
              a: "Yes! We constantly monitor official university websites, newspaper ads, and official social media channels to ensure our deadline alerts are 100% accurate and up-to-date.",
            },
            {
              q: "How do I get WhatsApp deadline alerts?",
              a: "Simply create a free account, save your target universities to your Watchlist, and enable WhatsApp alerts in your profile. We'll send you a reminder 7 days and 1 day before the deadline.",
            },
            {
              q: "Is the AI Career Counselor free?",
              a: "Yes, our AI counselor is completely free. It is trained on extensive data regarding Pakistani universities, career scopes, and market trends to help you make informed decisions.",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 outline-none select-none">
                {faq.q}
                <ChevronDown
                  className="shrink-0 transition duration-300 group-open:-rotate-180 text-blue-600"
                  size={20}
                />
              </summary>
              <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
