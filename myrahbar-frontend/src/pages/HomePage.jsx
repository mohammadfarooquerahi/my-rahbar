import {
  MessageCircle,
  GraduationCap,
  Sparkles, useState, useEffect, useMemo } from "react";
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
import { calculateAggregate } from "../utils/merit";
import { useWatchlistStore, useAuthStore } from "../store";
import Logo from "../components/common/Logo";

// ── Hero Merit Widget ─────────────────────────────────────────────────────────
function HeroMeritWidget({ universities }) {
  const [matric, setMatric] = useState("");
  const [fsc, setFsc] = useState("");
  const [test, setTest] = useState("");

  // Derive top 3 university matches based on marks
  const matches = useMemo(() => {
    const m = parseFloat(matric);
    const f = parseFloat(fsc);
    const t = parseFloat(test);
    const hasMarks = !isNaN(m) && m > 0 && !isNaN(f) && f > 0;
    if (!hasMarks || universities.length === 0) return [];

    const hasTest = !isNaN(t) && t > 0;

    return universities
      .map((uni) => {
        const formula = uni.aggregateFormula || { matric: 0.1, fsc: 0.4, test: 0.5 };

        // If no test score given, estimate: redistribute test weight equally to matric+fsc
        let agg;
        if (hasTest) {
          agg = calculateAggregate(m, f, t, formula);
        } else {
          // Estimate: normalise matric/fsc only by their combined weight
          const combinedWeight = (formula.matric || 0) + (formula.fsc || 0);
          if (combinedWeight === 0) return null;
          agg = ((m * (formula.matric || 0) + f * (formula.fsc || 0)) / combinedWeight) * 100;
          agg = Math.round(agg * 100) / 100;
        }

        // Find the latest merit data across all departments
        let bestDept = null;
        let closestMerit = null;
        let closestDiff = Infinity;
        (uni.departments || []).forEach((dept) => {
          const merit = (dept.lastMerit || []).find((m) => m.closing);
          if (merit) {
            const diff = Math.abs(agg - merit.closing);
            if (diff < closestDiff) {
              closestDiff = diff;
              closestMerit = merit.closing;
              bestDept = dept;
            }
          }
        });

        // Status logic
        let status, statusColor, statusBg;
        if (closestMerit !== null) {
          const diff = agg - closestMerit;
          if (diff >= 3)   { status = "Safe";       statusColor = "#3b82f6"; statusBg = "#eff6ff"; }
          else if (diff >= 0) { status = "Eligible";   statusColor = "#10b981"; statusBg = "#ecfdf5"; }
          else if (diff >= -5) { status = "Borderline"; statusColor = "#f59e0b"; statusBg = "#fffbeb"; }
          else               { status = "Below Merit"; statusColor = "#ef4444"; statusBg = "#fef2f2"; }
        } else {
          status = "No Data"; statusColor = "#94a3b8"; statusBg = "#f8fafc";
        }

        return {
          name: uni.shortName || uni.name,
          fullName: uni.name,
          slug: uni.slug,
          city: uni.city || "",
          dept: bestDept?.name || (uni.departments?.[0]?.name) || "All Programs",
          agg,
          hasTest,
          status, statusColor, statusBg,
          closestMerit,
        };
      })
      .filter(Boolean)
      // Sort: Safe → Eligible → Borderline → Below Merit → No Data
      .sort((a, b) => {
        const order = { "Safe": 0, "Eligible": 1, "Borderline": 2, "Below Merit": 3, "No Data": 4 };
        return (order[a.status] ?? 5) - (order[b.status] ?? 5);
      })
      .slice(0, 3);
  }, [matric, fsc, test, universities]);

  const hasInput = parseFloat(matric) > 0 && parseFloat(fsc) > 0;

  return (
    <div style={{ padding: "20px" }}>
      {/* Marks Input Row */}
      <p style={{ fontSize:"11px", color:"#64748b", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 10px" }}>Enter Your Marks</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px", marginBottom:"16px" }}>
        <div>
          <label style={{ fontSize:"10px", fontWeight:600, color:"#94a3b8", display:"block", marginBottom:"4px" }}>Matric %</label>
          <input
            type="number" min="0" max="100" step="0.1"
            value={matric}
            onChange={e => setMatric(e.target.value)}
            placeholder="e.g. 85"
            style={{ width:"100%", padding:"8px 10px", border:"1px solid #e2e8f0", borderRadius:"8px", fontSize:"13px", fontWeight:600, color:"#0f172a", outline:"none", boxSizing:"border-box" }}
            onFocus={e => e.target.style.borderColor = "#2563eb"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>
        <div>
          <label style={{ fontSize:"10px", fontWeight:600, color:"#94a3b8", display:"block", marginBottom:"4px" }}>FSc / A-Level %</label>
          <input
            type="number" min="0" max="100" step="0.1"
            value={fsc}
            onChange={e => setFsc(e.target.value)}
            placeholder="e.g. 78"
            style={{ width:"100%", padding:"8px 10px", border:"1px solid #e2e8f0", borderRadius:"8px", fontSize:"13px", fontWeight:600, color:"#0f172a", outline:"none", boxSizing:"border-box" }}
            onFocus={e => e.target.style.borderColor = "#2563eb"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>
        <div>
          <label style={{ fontSize:"10px", fontWeight:600, color:"#94a3b8", display:"block", marginBottom:"4px" }}>Test % <span style={{ color:"#cbd5e1", fontWeight:400 }}>(optional)</span></label>
          <input
            type="number" min="0" max="100" step="0.1"
            value={test}
            onChange={e => setTest(e.target.value)}
            placeholder="e.g. 75"
            style={{ width:"100%", padding:"8px 10px", border:"1px solid #e2e8f0", borderRadius:"8px", fontSize:"13px", fontWeight:600, color:"#0f172a", outline:"none", boxSizing:"border-box" }}
            onFocus={e => e.target.style.borderColor = "#2563eb"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>
      </div>

      {/* Results */}
      <p style={{ fontSize:"11px", color:"#64748b", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 10px", display:"flex", alignItems:"center", gap:"6px" }}>
        Top Matches for You
        {hasInput && !parseFloat(test) && (
          <span style={{ fontSize:"9px", fontWeight:600, color:"#f59e0b", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:"4px", padding:"1px 5px" }}>Estimated (no test)</span>
        )}
      </p>

      {!hasInput ? (
        // Placeholder state
        <div style={{ textAlign:"center", padding:"20px 0" }}>
          <div style={{ fontSize:"28px", marginBottom:"8px" }}>🎯</div>
          <p style={{ fontSize:"13px", color:"#94a3b8", margin:0 }}>Enter your marks above to see matching universities</p>
        </div>
      ) : matches.length === 0 ? (
        <div style={{ textAlign:"center", padding:"20px 0" }}>
          <p style={{ fontSize:"13px", color:"#94a3b8", margin:0 }}>Calculating...</p>
        </div>
      ) : (
        matches.map((item, i) => (
          <Link
            key={i}
            to={`/university/${item.slug}`}
            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", border:"1px solid #f1f5f9", borderRadius:"10px", marginBottom:"8px", background: i === 0 ? "#f8fafc" : "#ffffff", textDecoration:"none", transition:"all 0.2s" }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 15px -4px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#f1f5f9"; }}
          >
            <div style={{ display:"flex", alignItems:"center", gap:"10px", minWidth:0 }}>
              <div style={{ width:"36px", height:"36px", borderRadius:"8px", background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#334155", fontSize:"12px", flexShrink:0 }}>
                {item.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ minWidth:0 }}>
                <p style={{ fontWeight:700, color:"#0f172a", fontSize:"13px", margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.name}</p>
                <p style={{ color:"#64748b", fontSize:"11px", margin:"2px 0 0", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.city && `${item.city} • `}{item.dept}</p>
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0, marginLeft:"8px" }}>
              <p style={{ fontWeight:800, color:"#0f172a", fontSize:"14px", margin:0 }}>{item.agg.toFixed(1)}%</p>
              <span style={{ display:"inline-block", padding:"1px 7px", borderRadius:"4px", background:item.statusBg, color:item.statusColor, fontSize:"10px", fontWeight:700, marginTop:"3px" }}>
                {item.status}
              </span>
            </div>
          </Link>
        ))
      )}

      {hasInput && matches.length > 0 && (
        <Link to="/merit-calculator" style={{ display:"block", textAlign:"center", marginTop:"12px", fontSize:"12px", fontWeight:600, color:"#2563eb", textDecoration:"none" }}
          onMouseOver={e => e.currentTarget.style.textDecoration = "underline"}
          onMouseOut={e => e.currentTarget.style.textDecoration = "none"}
        >
          Full Merit Calculator →
        </Link>
      )}
    </div>
  );
}

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

      {/* -- HERO SECTION � Inspiring & Connecting (Maqsad-Inspired) -- */}
      <section 
        className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 px-4 bg-gradient-to-b from-slate-50 via-white to-blue-50/40"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Ambient subtle glow background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div 
            className="absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* -- LEFT COLUMN (7 Cols) — Engaging Copy, Filter & Action -- */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50/90 border border-blue-200/90 text-blue-700 text-xs sm:text-sm font-bold mb-5 shadow-sm">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>🎓 Pakistan's #1 Admission & Merit Intelligence Guide</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-slate-900 tracking-tight leading-[1.1] mb-5">
                Pakistan's #1 Platform to Enter Your{" "}
                <span className="relative inline-block text-blue-600">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Dream University
                  </span>
                  <svg className="absolute -bottom-1.5 left-0 w-full h-3 text-blue-400/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 6 Q 50 14 100 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="transparent"/>
                  </svg>
                </span>
                <br className="hidden sm:inline" />
                Without the Stress.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed mb-6 max-w-xl">
                Stop guessing closing merits. Calculate your exact aggregate score, explore real cut-offs for 100+ top universities in Pakistan, download verified past papers, and get free 1:1 counselor support on WhatsApp.
              </p>

              {/* Field of Study Selector (Quick Target Pills) */}
              <div className="w-full mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Popular Target Fields:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "💻 Computer Science & AI", query: "Computer Science" },
                    { label: "🩺 Medical / MDCAT", query: "MBBS" },
                    { label: "⚡ Engineering / ECAT", query: "Engineering" },
                    { label: "📊 Business & IBA", query: "BBA" },
                    { label: "⚖️ Law & Social", query: "LLB" },
                  ].map((field) => (
                    <button
                      key={field.label}
                      type="button"
                      onClick={() => navigate("/search?q=" + encodeURIComponent(field.query))}
                      className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      {field.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar Container */}
              <form onSubmit={handleSearch} className="w-full max-w-xl mb-4">
                <div className="bg-white p-2 rounded-2xl border border-slate-300 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-stretch gap-2 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <div className="sm:border-r border-slate-200 sm:pr-2 shrink-0">
                    <select
                      value={degreeLevel}
                      onChange={(e) => setDegreeLevel(e.target.value)}
                      className="w-full sm:w-auto bg-transparent border-0 outline-none text-slate-700 text-sm font-medium py-2.5 px-3 cursor-pointer"
                    >
                      <option value="">All Degree Levels</option>
                      <option value="BS">BS / Undergraduate</option>
                      <option value="MS">MS / Graduate</option>
                      <option value="PhD">PhD / Doctorate</option>
                    </select>
                  </div>
                  <div className="flex-1 flex items-center gap-2 px-2">
                    <Search size={18} className="text-slate-400 shrink-0" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search university, program (e.g. FAST, Dow, NED)..."
                      className="w-full bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base py-1"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-md shadow-blue-500/20 shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Search</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>

              {/* Action Buttons: Find Uni + WhatsApp Counselor (Like Maqsad) */}
              <div className="flex flex-wrap items-center gap-3 w-full mb-8">
                <Link
                  to="/find-university"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Sparkles size={16} className="text-yellow-400" />
                  <span>Smart University Matcher</span>
                </Link>

                <a
                  href="https://wa.me/923190211218?text=Assalam-o-Alaikum%20Rahbars!%20I%20need%20guidance%20for%20my%20university%20admission."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <MessageCircle size={17} />
                  <span>Talk to Counsellor</span>
                </a>
              </div>

              {/* Social Proof Stats Strip */}
              <div className="w-full grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-slate-200/80">
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: "Sora" }}>100+</p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Universities</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-xl sm:text-2xl font-black text-blue-600" style={{ fontFamily: "Sora" }}>500+</p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Programs</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-xl sm:text-2xl font-black text-emerald-600" style={{ fontFamily: "Sora" }}>50k+</p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Students Guided</p>
                </div>
              </div>

            </div>

            {/* -- RIGHT COLUMN (5 Cols) — The Real & Connecting Student Wall (Maqsad-Style) -- */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              
              {/* Floating Live Badge Top */}
              <div className="absolute -top-4 -left-3 sm:-left-6 z-20 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-2.5 px-4 shadow-xl shadow-slate-900/5 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-none">Fall 2026 Admissions Open</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Track closing dates across 100+ unis</p>
                </div>
              </div>

              {/* The Student Photo Cards Grid (3 Columns x 2 Rows) */}
              <div className="bg-gradient-to-br from-white to-slate-100/80 p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-2xl shadow-blue-900/10 grid grid-cols-2 sm:grid-cols-3 gap-3">
                
                {/* Student 1: NUST */}
                <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-blue-50 to-indigo-100 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80" 
                    alt="Student admitted to NUST"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width="400"
                    height="500"
                    loading="eager"
                    fetchpriority="high"
                  />
                  <div className="absolute top-2 right-2 bg-blue-700/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                    NUST
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-2.5 pt-6 text-white">
                    <p className="text-xs font-bold leading-tight">Ammar K.</p>
                    <p className="text-[10px] text-blue-200 leading-tight">BS CS • NUST</p>
                  </div>
                </div>

                {/* Student 2: Dow Medical */}
                <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-emerald-50 to-teal-100 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" 
                    alt="Student admitted to Dow Medical College"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width="400"
                    height="500"
                    loading="eager"
                    fetchpriority="high"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-700/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                    DOW
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-2.5 pt-6 text-white">
                    <p className="text-xs font-bold leading-tight">Zainab F.</p>
                    <p className="text-[10px] text-emerald-200 leading-tight">MBBS • DUHS</p>
                  </div>
                </div>

                {/* Student 3: FAST-NUCES */}
                <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-purple-50 to-pink-100 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" 
                    alt="Student admitted to FAST"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width="400"
                    height="500"
                    loading="eager"
                  />
                  <div className="absolute top-2 right-2 bg-purple-700/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                    FAST
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-2.5 pt-6 text-white">
                    <p className="text-xs font-bold leading-tight">Bilal T.</p>
                    <p className="text-[10px] text-purple-200 leading-tight">Software Engg</p>
                  </div>
                </div>

                {/* Student 4: NED University */}
                <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-rose-50 to-orange-100 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" 
                    alt="Student admitted to NED University"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width="400"
                    height="500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-rose-700/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                    NED
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-2.5 pt-6 text-white">
                    <p className="text-xs font-bold leading-tight">Hamza S.</p>
                    <p className="text-[10px] text-rose-200 leading-tight">Mechanical Engg</p>
                  </div>
                </div>

                {/* Student 5: IBA Karachi */}
                <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-amber-50 to-yellow-100 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
                    alt="Student admitted to IBA"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width="400"
                    height="500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-amber-700/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                    IBA
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-2.5 pt-6 text-white">
                    <p className="text-xs font-bold leading-tight">Hania M.</p>
                    <p className="text-[10px] text-amber-200 leading-tight">BBA • IBA Karachi</p>
                  </div>
                </div>

                {/* Student 6: University of Karachi (UoK) */}
                <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-sky-50 to-cyan-100 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <img 
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" 
                    alt="Student admitted to University of Karachi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width="400"
                    height="500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-sky-700/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                    UoK
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-2.5 pt-6 text-white">
                    <p className="text-xs font-bold leading-tight">Sara R.</p>
                    <p className="text-[10px] text-sky-200 leading-tight">Pharm-D • Karachi Uni</p>
                  </div>
                </div>

              </div>

              {/* Floating Social Proof Bottom */}
              <div className="absolute -bottom-5 -right-2 sm:-right-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3 px-4 shadow-xl shadow-slate-900/10 flex items-center gap-3">
                <div className="flex -space-x-2 shrink-0">
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow">AK</span>
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow">ZF</span>
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-purple-600 text-white text-[10px] font-black flex items-center justify-center shadow">BT</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500 text-xs">★★★★★</span>
                    <span className="text-xs font-black text-slate-800">4.9/5</span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500">2,500+ Admissions Secured</p>
                </div>
              </div>

            </div>

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
          <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full">
            {savedFull.slice(0, 4).map((uni) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))}
          </div>
        </section>
      )}

      {/* ── TOOLS & FEATURES ── Premium Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Premium background: soft white with radial gradient orbs */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #f8faff 0%, #eef2ff 40%, #fdf4ff 70%, #f0fdf4 100%)" }} />
        {/* Decorative blurred orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 relative z-10">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 border text-xs font-bold px-4 py-2 rounded-full mb-5" style={{ background: "linear-gradient(135deg, #eef2ff, #fdf4ff)", borderColor: "#c7d2fe", color: "#6366f1" }}>
              <Target size={12} />
              TOOLS &amp; FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "Sora", color: "#0f172a" }}>
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)" }}>
                Get Admitted
              </span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">
              From finding the right university to getting admitted — all tools in one place, completely free.
            </p>
          </div>

          {/* Big Hero Card (Smart Uni Finder) */}
          <Link to="/find-university"
            className="group block rounded-3xl p-8 md:p-10 mb-6 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            style={{ background: "linear-gradient(135deg, #fff 0%, #eef2ff 100%)", border: "1.5px solid #c7d2fe", boxShadow: "0 4px 32px 0 rgba(99,102,241,0.08)" }}>
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #3b82f6)" }} />
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ background: "linear-gradient(135deg, #eef2ff80, #fdf4ff80)" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-300" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
                <Search size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>Most Used</span>
                  <span className="text-indigo-500 text-xs font-semibold">⭐ #1 Tool</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-2" style={{ fontFamily: "Sora", color: "#0f172a" }}>Smart University Finder</h3>
                <p className="text-slate-500 text-base max-w-xl">Answer 10 simple questions — get matched to your perfect university with merit prediction and fee breakdown instantly.</p>
              </div>
              <div className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-2xl transition-all shrink-0 group-hover:translate-x-1 duration-300 shadow-lg group-hover:shadow-indigo-300/50" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
                Find University <ChevronRight size={18} />
              </div>
            </div>
          </Link>

          {/* 4-card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { icon: <Calculator size={22} className="text-white" />, title: "Aggregate Calculator", desc: "Enter your marks — see if you qualify instantly", to: "/merit-calculator", tag: "Tool", gradient: "linear-gradient(135deg, #10b981, #059669)", accent: "#d1fae5", border: "#6ee7b7", tagColor: "#065f46" },
              { icon: <BookOpen size={22} className="text-white" />, title: "Compare Universities", desc: "Side by side comparison of fee, merit and facilities", to: "/compare", tag: "New", gradient: "linear-gradient(135deg, #6366f1, #4f46e5)", accent: "#eef2ff", border: "#c7d2fe", tagColor: "#4338ca" },
              { icon: <FileText size={22} className="text-white" />, title: "Past Papers", desc: "Download official papers and practice for entry tests", to: "/past-papers", tag: "Hot 🔥", gradient: "linear-gradient(135deg, #ec4899, #db2777)", accent: "#fdf2f8", border: "#fbcfe8", tagColor: "#be185d" },
              { icon: <FileText size={22} className="text-white" />, title: "Document Compressor", desc: "Compress docs to exact university size requirements", to: "/document-tools", tag: "Tool", gradient: "linear-gradient(135deg, #f59e0b, #d97706)", accent: "#fffbeb", border: "#fde68a", tagColor: "#92400e" },
            ].map((t, i) => (
              <Link key={i} to={t.to}
                className="group relative rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden bg-white"
                style={{ border: `1.5px solid ${t.border}`, boxShadow: "0 2px 16px 0 rgba(0,0,0,0.05)" }}>
                {/* Top color accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: t.gradient }} />
                {/* Subtle bg tint on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ background: t.accent }} />
                <div className="relative z-10 pt-2">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300" style={{ background: t.gradient }}>
                    {t.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider mb-1.5 inline-block px-2 py-0.5 rounded-full" style={{ color: t.tagColor, background: t.accent, border: `1px solid ${t.border}` }}>{t.tag}</span>
                  <h3 className="font-bold text-slate-800 text-sm mb-2 leading-snug" style={{ fontFamily: "Sora" }}>{t.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">{t.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all" style={{ color: t.tagColor }}>
                    Open Tool <ChevronRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom row: Counseling full-width card */}
          <Link to="/counseling"
            className="group block rounded-3xl p-7 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            style={{ background: "linear-gradient(135deg, #fdf4ff 0%, #f5f3ff 100%)", border: "1.5px solid #e9d5ff", boxShadow: "0 4px 32px 0 rgba(139,92,246,0.08)" }}>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: "linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b)" }} />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-300" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>
                <Headphones size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide mb-2 inline-block" style={{ background: "#ede9fe", color: "#6d28d9", border: "1px solid #c4b5fd" }}>Expert Help</span>
                <h3 className="text-xl font-black" style={{ fontFamily: "Sora", color: "#0f172a" }}>1-on-1 Expert Counseling</h3>
                <p className="text-slate-500 text-sm mt-1">Get personalized admission advice from a real expert — tailored for your marks, budget &amp; goals.</p>
              </div>
              <div className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-2xl transition-all shrink-0 shadow-lg group-hover:shadow-purple-300/50" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>
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
          <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full">
            {featured.slice(0, 4).map((uni) => (
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
