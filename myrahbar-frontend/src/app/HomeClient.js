"use client";
import UniversityCard from "@/components/university/UniversityCard";
import { useState, useMemo } from "react";
import { getImageUrl } from "@/lib/api";
import { calculateAggregate } from "@/lib/merit";

const badgeColor = (color) => {
  const map = { emerald: "bg-emerald-700/90", green: "bg-emerald-700/90", purple: "bg-purple-700/90", rose: "bg-rose-700/90", amber: "bg-amber-700/90", orange: "bg-amber-700/90", sky: "bg-sky-700/90" };
  return map[color] || "bg-blue-700/90";
};

export default function HomeClient({ universities, students }) {
  const [query, setQuery] = useState("");
  const [degreeLevel, setDegreeLevel] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (degreeLevel) params.set("degreeLevel", degreeLevel);
    if (query) params.set("q", query);
    window.location.href = "/search" + (params.toString() ? "?" + params.toString() : "");
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-3 sm:py-5 lg:min-h-[calc(100vh-68px)] lg:flex lg:items-center px-4 bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* LEFT */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/90 text-blue-700 text-xs font-bold mb-2.5 shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>🎓 Pakistan&#39;s #1 Admission & Merit Intelligence Guide</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-black text-slate-900 tracking-tight leading-[1.15] mb-2.5">
                Pakistan&#39;s #1 Platform to Enter Your{" "}
                <span className="relative inline-block text-blue-600">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Dream University</span>
                </span>{" "}
                Without the Stress.
              </h1>

              <p className="text-xs sm:text-sm lg:text-base text-slate-600 font-normal leading-relaxed mb-3 max-w-xl">
                Compare cut-offs, calculate your exact aggregate score, and discover the best university programs in Pakistan with free 1:1 WhatsApp counselor support.
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} className="w-full max-w-xl mb-2.5">
                <div className="bg-white p-1.5 rounded-xl border border-slate-300 shadow-md flex flex-col sm:flex-row items-stretch gap-1.5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <div className="sm:border-r border-slate-200 sm:pr-1 shrink-0">
                    <select value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)} className="w-full sm:w-auto bg-transparent border-0 outline-none text-slate-700 text-xs sm:text-sm font-medium py-2 px-2.5 cursor-pointer">
                      <option value="">All Degree Levels</option>
                      <option value="BS">BS / Undergraduate</option>
                      <option value="MS">MS / Graduate</option>
                      <option value="PhD">PhD / Doctorate</option>
                    </select>
                  </div>
                  <div className="flex-1 flex items-center gap-2 px-2">
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search university or program (e.g. FAST, Dow, NUST)..." className="w-full bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm py-1" />
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-sm shrink-0 cursor-pointer flex items-center justify-center gap-1">
                    <span>Search</span> →
                  </button>
                </div>
              </form>

              {/* Popular tags */}
              <div className="w-full mb-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Popular:</span>
                {[{ label: "💻 CS & AI", q: "Computer Science" }, { label: "🩺 Medical / MDCAT", q: "MBBS" }, { label: "⚙️ Engineering", q: "Engineering" }, { label: "📊 Business", q: "BBA" }, { label: "⚖️ Law", q: "LLB" }].map((f) => (
                  <a key={f.label} href={`/search?q=${encodeURIComponent(f.q)}`} className="px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition">{f.label}</a>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full mb-3.5">
                <a href="/find-university" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer">
                  ✨ Smart Matcher
                </a>
                <a href="https://wa.me/923190211218?text=Assalam-o-Alaikum%20Rahbars!%20I%20need%20guidance%20for%20my%20university%20admission." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer">
                  💬 Talk to Counsellor
                </a>
              </div>

              {/* Stats */}
              <div className="w-full flex items-center flex-wrap gap-4 sm:gap-6 pt-2.5 border-t border-slate-200/70 text-xs text-slate-600">
                <div className="flex items-center gap-1.5"><span className="font-black text-slate-900 text-sm" style={{ fontFamily: "Sora" }}>100+</span><span className="text-slate-500">Universities</span></div>
                <div className="h-3 w-px bg-slate-200" />
                <div className="flex items-center gap-1.5"><span className="font-black text-blue-600 text-sm" style={{ fontFamily: "Sora" }}>500+</span><span className="text-slate-500">Programs</span></div>
                <div className="h-3 w-px bg-slate-200" />
                <div className="flex items-center gap-1.5"><span className="font-black text-emerald-600 text-sm" style={{ fontFamily: "Sora" }}>50k+</span><span className="text-slate-500">Students Guided</span></div>
                <div className="h-3 w-px bg-slate-200" />
                <div className="flex items-center gap-1"><span className="text-amber-500 font-bold">★ 4.9/5</span><span className="text-slate-400">(2,500+ Reviews)</span></div>
              </div>
            </div>

            {/* RIGHT — Student Cards */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2 px-1">
                <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-3 py-1 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <p className="text-xs font-bold text-slate-800">Fall 2026 Admissions Open</p>
                </div>
              </div>
              <div className="w-full bg-gradient-to-br from-white to-slate-100/90 p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xl shadow-blue-900/5 grid grid-cols-3 gap-2 sm:gap-2.5">
                {students.slice(0, 6).map((student, idx) => (
                  <div key={student._id || idx} className="group relative rounded-xl overflow-hidden aspect-[4/5] max-h-[140px] sm:max-h-[155px] xl:max-h-[170px] bg-slate-100 border border-slate-100 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                    <img
                      src={getImageUrl(student.imageUrl)}
                      alt={student.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading={idx < 3 ? "eager" : "lazy"}
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || "Student")}&background=0284c7&color=fff&size=400`; }}
                    />
                    <div className={`absolute top-1.5 right-1.5 ${badgeColor(student.color)} backdrop-blur-xs text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs`}>{student.tag}</div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-2 pt-4 text-white">
                      <p className="text-[11px] font-bold leading-tight truncate">{student.name}</p>
                      <p className="text-[9px] text-blue-200 leading-tight truncate">{student.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full flex items-center justify-between mt-2 px-1">
                <p className="text-[11px] font-medium text-slate-500">Verified admissions across NUST, FAST, Dow & more</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #f8faff 0%, #eef2ff 40%, #fdf4ff 70%, #f0fdf4 100%)" }} />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "Sora", color: "#0f172a" }}>
              Everything You Need to <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)" }}>Get Admitted</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base">From finding the right university to getting admitted — all tools in one place, completely free.</p>
          </div>

          {/* Hero Card */}
          <a href="/find-university" className="group block rounded-3xl p-8 md:p-10 mb-6 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1" style={{ background: "linear-gradient(135deg, #fff 0%, #eef2ff 100%)", border: "1.5px solid #c7d2fe" }}>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #3b82f6)" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-xl" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
                <span className="text-3xl text-white">🔍</span>
              </div>
              <div className="flex-1">
                <span className="text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>Most Used</span>
                <h3 className="text-2xl md:text-3xl font-black mb-2 mt-2" style={{ fontFamily: "Sora", color: "#0f172a" }}>Smart University Finder</h3>
                <p className="text-slate-500 text-base max-w-xl">Answer 10 simple questions — get matched to your perfect university with merit prediction and fee breakdown instantly.</p>
              </div>
              <div className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-2xl shrink-0 shadow-lg" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>Find University →</div>
            </div>
          </a>

          {/* 4-card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { title: "Aggregate Calculator", desc: "Enter your marks — see if you qualify instantly", to: "/merit-calculator", tag: "Tool", gradient: "linear-gradient(135deg, #10b981, #059669)", accent: "#d1fae5", border: "#6ee7b7", tagColor: "#065f46", emoji: "🧮" },
              { title: "Compare Universities", desc: "Side by side comparison of fee, merit and facilities", to: "/compare", tag: "New", gradient: "linear-gradient(135deg, #6366f1, #4f46e5)", accent: "#eef2ff", border: "#c7d2fe", tagColor: "#4338ca", emoji: "📊" },
              { title: "Past Papers", desc: "Download official papers and practice for entry tests", to: "/past-papers", tag: "Hot 🔥", gradient: "linear-gradient(135deg, #ec4899, #db2777)", accent: "#fdf2f8", border: "#fbcfe8", tagColor: "#be185d", emoji: "📝" },
              { title: "Document Compressor", desc: "Compress docs to exact university size requirements", to: "/document-tools", tag: "Tool", gradient: "linear-gradient(135deg, #f59e0b, #d97706)", accent: "#fffbeb", border: "#fde68a", tagColor: "#92400e", emoji: "📄" },
            ].map((t, i) => (
              <a key={i} href={t.to} className="group relative rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden bg-white" style={{ border: `1.5px solid ${t.border}` }}>
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: t.gradient }} />
                <div className="relative z-10 pt-2">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-md text-xl" style={{ background: t.gradient }}>{t.emoji}</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider mb-1.5 inline-block px-2 py-0.5 rounded-full" style={{ color: t.tagColor, background: t.accent, border: `1px solid ${t.border}` }}>{t.tag}</span>
                  <h3 className="font-bold text-slate-800 text-sm mb-2 leading-snug" style={{ fontFamily: "Sora" }}>{t.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">{t.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-bold" style={{ color: t.tagColor }}>Open Tool →</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-14" style={{ fontFamily: "Sora", color: "#0f172a" }}>
            How Rahbars Works — <span className="text-blue-600">4 Steps</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", emoji: "🤔", title: "You are confused — we get it", desc: "Hundreds of universities, different deadlines. Every student feels lost.", color: "#EFF6FF", border: "#BFDBFE" },
              { step: "02", emoji: "📋", title: "Answer 10 simple questions", desc: "Tell us your budget, field, marks and goals. Under 2 minutes.", color: "#F0FDF4", border: "#BBF7D0" },
              { step: "03", emoji: "🎯", title: "Get matched to your best university", desc: "Top 3 universities that fit your profile — with merit prediction.", color: "#FFF7ED", border: "#FED7AA" },
              { step: "04", emoji: "✅", title: "Apply with full confidence", desc: "Documents ready, form filled, deadline tracked. Walk in knowing what to expect.", color: "#F5F3FF", border: "#DDD6FE" },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl p-6 border" style={{ background: item.color, borderColor: item.border }}>
                <div className="text-3xl mb-3">{item.emoji}</div>
                <span className="text-xs font-black text-slate-400">STEP {item.step}</span>
                <h3 className="font-bold text-slate-800 text-base mt-1 mb-2" style={{ fontFamily: "Sora" }}>{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED UNIVERSITIES */}
      {universities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: "Sora" }}>Featured Universities</h2>
            <a href="/find-university" className="text-sm text-blue-600 hover:underline font-semibold">View All →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.slice(0, 6).map((uni) => (
              <UniversityCard key={uni._id || uni.id || uni.slug} uni={uni} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}


