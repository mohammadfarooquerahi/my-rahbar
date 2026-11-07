import { getUniversities } from "@/lib/api";

export const revalidate = 3600;
export const metadata = {
  title: "Search Universities in Pakistan 2026",
  description: "Search 100+ top Pakistani universities by city, discipline, fee, and merit closing score.",
  alternates: { canonical: "https://www.rahbars.com/search" },
};

export default async function SearchPage() {
  const universities = await getUniversities();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "Sora" }}>
          Search <span className="text-blue-600">Universities</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">Find the perfect university by name, city, program, or field.</p>
      </div>

      {/* All universities listed for SEO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {universities.map((uni) => (
          <a key={uni._id || uni.slug} href={`/university/${uni.slug}`} className="group block bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-black text-xs">{(uni.shortName || uni.name).slice(0, 3).toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600">{uni.name}</h2>
                <p className="text-xs text-slate-500">{uni.city} • {uni.type}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${uni.admissionOpen ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                {uni.admissionOpen ? "● Open" : "○ Closed"}
              </span>
              {uni.departments && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-600">{uni.departments.length} programs</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
