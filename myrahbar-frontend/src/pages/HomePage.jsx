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
} from "lucide-react";
import { Helmet } from "react-helmet-async";
// import removed
import UniversityCard from "../components/university/UniversityCard";
import { deadlineLabel, daysUntilDeadline } from "../utils/merit";
import { useWatchlistStore, useAuthStore } from "../store";
import Logo from "../components/common/Logo";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { universities: savedUnis } = useWatchlistStore();
  const { isLoggedIn, user } = useAuthStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate("/search?q=" + encodeURIComponent(query.trim()));
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
    { label: "Universities", value: "30+", icon: <BookOpen size={18} /> },
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
    },
    {
      icon: <Calculator size={20} />,
      title: "Merit Calculator",
      desc: "Enter your marks — see if you qualify instantly",
      to: "/merit-calculator",
      color: "var(--green)",
      bg: "#F0FDF4",
      tag: "Free Tool",
    },
    {
      icon: <FileText size={20} />,
      title: "Document Tools",
      desc: "Compress documents to exact university size requirements",
      to: "/document-tools",
      color: "var(--orange)",
      bg: "#FFF7ED",
      tag: "Free Tool",
    },
    {
      icon: <Headphones size={20} />,
      title: "1-on-1 Counseling",
      desc: "Talk to an expert — get clear answers about your admission",
      to: "/counseling",
      color: "#8B5CF6",
      bg: "#F5F3FF",
      tag: "Expert Help",
    },
    {
      icon: <BookOpen size={20} />,
      title: "Compare Unis",
      desc: "Side by side comparison of fee, merit and facilities",
      to: "/compare",
      color: "var(--navy)",
      bg: "#F0F4FF",
      tag: "New",
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
    <>
      <Helmet>
        <title>
          MyRahbar — Find Your University in Karachi | Pakistan Admission Guide
        </title>
        <meta
          name="description"
          content="MyRahbar helps Pakistani students find the best universities in Karachi. Check merit, fees, scholarships, deadlines and apply smarter."
        />
      </Helmet>

      {/* Ticker - slow, shows features */}
      <div
        className="text-white text-xs py-2.5 overflow-hidden"
        style={{ background: "var(--navy)" }}
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
                className="inline-flex items-center gap-2 mr-12 text-slate-200"
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
                <span className="text-slate-500 ml-4">•</span>
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
                className="inline-flex items-center gap-2 mr-12 text-slate-200"
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
                <span className="text-slate-500 ml-4">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0F172A 0%, #1A2E4A 40%, #1E40AF 100%)",
        }}
      >
        {/* Background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #F59E0B, transparent)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #3B82F6, transparent)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full mb-8 fade-up">
            <Sparkles size={12} className="text-yellow-400" />
            Pakistan's Smartest Admission Platform — Karachi Phase 1
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 fade-up-1 leading-tight"
            style={{ fontFamily: "Sora" }}
          >
            Stop Guessing.
            <span className="block" style={{ color: "#FCD34D" }}>
              Start Applying Smart.
            </span>
          </h1>

          <p className="text-blue-200 text-xl mb-10 max-w-2xl mx-auto fade-up-2 leading-relaxed">
            Merit calculator, deadline alerts, AI counselor, scholarship finder
            — everything a Pakistani student needs in one place.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="fade-up-3 max-w-2xl mx-auto mb-6"
          >
            <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden p-2 gap-2">
              <Search size={18} className="text-slate-400 ml-2 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search university or department (MBBS, NED, BBA, Engineering...)"
                className="flex-1 py-3 px-2 text-slate-800 outline-none text-sm bg-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-white text-sm font-bold btn-press shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, var(--navy), var(--blue))",
                }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick tags */}
          <div className="fade-up-4 flex flex-wrap justify-center gap-2 mb-10">
            {[
              "MBBS",
              "Computer Science",
              "BBA",
              "Engineering",
              "Architecture",
              "Pharm-D",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate("/search?q=" + tag)}
                className="text-xs text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 rounded-full transition-all"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Mini stats */}
          <div className="fade-up-5 flex flex-wrap justify-center gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i} className="text-white">
                <p
                  className="text-2xl font-black"
                  style={{ fontFamily: "Sora", color: "#FCD34D" }}
                >
                  {s.value}
                </p>
                <p className="text-xs text-blue-300 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Saved universities — show when logged in and has saved */}
      {isLoggedIn && savedFull.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
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
            {/* {savedFull.slice(0, 3).map((uni) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))} */}
            {featured.map((uni) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))}
          </div>
        </section>
      )}

      {/* Tools grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Target size={12} />
            TOOLS & FEATURES
          </div>
          <h2
            className="text-4xl font-black mb-3"
            style={{ fontFamily: "Sora", color: "var(--navy)" }}
          >
            Everything You Need
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            From finding the right university to getting admitted — all tools in
            one place, completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((t, i) => (
            <Link
              key={i}
              to={t.to}
              className="card-hover group relative bg-white rounded-2xl p-6 border border-slate-200 overflow-hidden"
            >
              {/* Tag */}
              <span
                className="absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: t.bg, color: t.color }}
              >
                {t.tag}
              </span>

              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: t.bg, color: t.color }}
              >
                {t.icon}
              </div>
              <h3
                className="font-bold text-slate-800 mb-2"
                style={{ fontFamily: "Sora" }}
              >
                {t.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{t.desc}</p>
              <div
                className="flex items-center gap-1 mt-4 text-xs font-medium"
                style={{ color: t.color }}
              >
                Try it free <ChevronRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured universities */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                <MapPin size={12} />
                KARACHI UNIVERSITIES
              </div>
              <h2
                className="text-4xl font-black"
                style={{ fontFamily: "Sora", color: "var(--navy)" }}
              >
                30 Universities Covered
              </h2>
              <p className="text-slate-500 mt-1">
                Government and private — all in one place
              </p>
            </div>
            <Link
              to="/search"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((uni) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))}
          </div>
          <div className="text-center mt-6 md:hidden">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
            >
              See all 30 universities <ArrowRight size={14} />
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
            Find My University Now — Free
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
    </>
  );
}
