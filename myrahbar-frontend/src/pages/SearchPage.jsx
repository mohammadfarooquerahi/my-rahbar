import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { KARACHI_UNIVERSITIES, CATEGORIES } from "../data/universities";
import UniversityCard from "../components/university/UniversityCard";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all");
  const [openOnly, setOpenOnly] = useState(searchParams.get("openOnly") === "true");
  
  // New Advanced Filters
  const [degreeLevel, setDegreeLevel] = useState(searchParams.get("degreeLevel") || "all");
  const [department, setDepartment] = useState(searchParams.get("dept") || "");
  const [cityFilter, setCityFilter] = useState(searchParams.get("city") || "all");
  const [maxFee, setMaxFee] = useState(searchParams.get("maxFee") || "");
  const [maxMerit, setMaxMerit] = useState(searchParams.get("maxMerit") || "");

  const [allUnis, setAllUnis] = useState([]);
  const [results, setResults] = useState([]);
  const [loadingUnis, setLoadingUnis] = useState(true);

  // Load all universities from API first
  useEffect(() => {
    fetch("/api/universities")
      .then((res) => res.json())
      .then((data) => {
        const unis = data.universities || [];
        // Use API data if available, else fallback to local
        const source = unis.length > 0 ? unis : KARACHI_UNIVERSITIES;
        setAllUnis(source);
        setResults(source);
        setLoadingUnis(false);
      })
      .catch(() => {
        setAllUnis(KARACHI_UNIVERSITIES);
        setResults(KARACHI_UNIVERSITIES);
        setLoadingUnis(false);
      });
  }, []);

  // Filter whenever query or filters change
  useEffect(() => {
    if (allUnis.length === 0) return;

    let filtered = allUnis;

    if (query.trim()) {
      const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);
      filtered = filtered.filter((uni) => {
        const uniText = [
          uni.name,
          uni.shortName,
          uni.city,
          uni.type,
          ...(uni.departments?.map(d => `${d.name} ${d.category}`) || [])
        ].filter(Boolean).join(" ").toLowerCase();

        // Every keyword must be found somewhere in the university text (multi-word similarity)
        return keywords.every(kw => uniText.includes(kw));
      });
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((uni) => uni.type === typeFilter);
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter((uni) =>
        uni.departments?.some((d) => d.category === categoryFilter)
      );
    }
    
    if (openOnly) {
      filtered = filtered.filter((uni) => {
        if (uni.admissionOpen) return true;
        
        const now = new Date();
        const checkDate = (dStr) => {
          if (!dStr) return false;
          const d = new Date(dStr);
          return !isNaN(d.getTime()) && Math.ceil((d - now) / 86400000) >= 0;
        };

        if (checkDate(uni.admissionDeadline)) return true;
        if (uni.admissionDeadlines?.some(dl => checkDate(dl.deadline))) return true;

        return false;
      });
    }
    
    if (degreeLevel !== "all") {
      const level = degreeLevel.toLowerCase();
      filtered = filtered.filter((uni) => 
        uni.admissionDeadlines?.some(dl => dl.degreeLevel?.toLowerCase().includes(level)) ||
        uni.departments?.some(d => d.name.toLowerCase().includes(level))
      );
    }
    
    if (department.trim()) {
      const q = department.toLowerCase();
      filtered = filtered.filter((uni) =>
        uni.departments?.some((d) => d.name.toLowerCase().includes(q) || d.category?.toLowerCase().includes(q))
      );
    }
    
    if (cityFilter !== "all") {
      filtered = filtered.filter((uni) => 
        uni.city?.toLowerCase() === cityFilter.toLowerCase() ||
        uni.admissionDeadlines?.some(dl => dl.testCities?.some(c => c.toLowerCase().includes(cityFilter.toLowerCase())))
      );
    }
    
    if (maxFee) {
      filtered = filtered.filter((uni) =>
        uni.departments?.some((d) => d.semesterFee && d.semesterFee <= Number(maxFee))
      );
    }
    
    if (maxMerit) {
      filtered = filtered.filter((uni) =>
        uni.departments?.some((d) => {
          const closing = d.lastMerit?.[0]?.closing;
          return closing !== undefined && closing <= Number(maxMerit);
        })
      );
    }

    setResults(filtered);
  }, [query, typeFilter, categoryFilter, openOnly, degreeLevel, department, cityFilter, maxFee, maxMerit, allUnis]);

  // Sync URL Params
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (openOnly) params.set("openOnly", "true");
    if (degreeLevel !== "all") params.set("degreeLevel", degreeLevel);
    if (department) params.set("dept", department);
    if (cityFilter !== "all") params.set("city", cityFilter);
    if (maxFee) params.set("maxFee", maxFee);
    if (maxMerit) params.set("maxMerit", maxMerit);
    setSearchParams(params, { replace: true });
  }, [query, typeFilter, categoryFilter, openOnly, degreeLevel, department, cityFilter, maxFee, maxMerit, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The useEffect hooks above handle everything locally since we fetched all unis!
  };

  const clearFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("all");
    setOpenOnly(false);
    setDegreeLevel("all");
    setDepartment("");
    setCityFilter("all");
    setMaxFee("");
    setMaxMerit("");
  };

  const hasFilters =
    typeFilter !== "all" || categoryFilter !== "all" || openOnly || degreeLevel !== "all" || department !== "" || cityFilter !== "all" || maxFee !== "" || maxMerit !== "";

  return (
    <main>
      <Helmet>
        <title>{query ? query + " — Search Results" : "All Universities"} | Rahbars</title>
        <meta
          name="description"
          content="Search all Karachi universities by name, department, or field to find the perfect fit for your higher education."
        />
        <link rel="canonical" href="https://rahbars.com/search" />
        
        <meta property="og:title" content="Search Universities | Rahbars" />
        <meta property="og:description" content="Search all Karachi universities by name, department, or field to find the perfect fit for your higher education." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rahbars.com/search" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Search Universities | Rahbars" />
        <meta name="twitter:description" content="Search all Karachi universities by name, department, or field to find the perfect fit for your higher education." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex items-center bg-white rounded-2xl border border-slate-200 shadow-sm px-4 gap-3">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search university name or department (MBBS, NED, BBA)..."
              className="flex-1 py-3.5 text-sm outline-none text-slate-700 placeholder:text-slate-400 bg-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded-xl shrink-0"
              style={{ background: "var(--navy)" }}
            >
              Search
            </button>
          </div>
        </form>

          <div className="grid grid-cols-2 sm:flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 w-full sm:w-auto col-span-2">
              <SlidersHorizontal size={15} />
              <span>Basic Filters:</span>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white outline-none text-slate-700 w-full sm:w-auto"
            >
              <option value="all">All Types</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white outline-none text-slate-700 w-full sm:w-auto"
            >
              <option value="all">All Fields</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer w-full sm:w-auto bg-white px-3 py-1.5 border border-slate-200 rounded-xl">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(e) => setOpenOnly(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              Admissions Open
            </label>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-red-500 hover:text-red-600 w-full sm:w-auto"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-slate-100">
             <div className="flex items-center gap-2 text-sm text-slate-500 w-full sm:w-auto col-span-2">
              <span>Advanced Filters:</span>
            </div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white outline-none text-slate-700 w-full sm:w-auto"
            >
              <option value="all">All Cities</option>
              {Array.from(new Set(allUnis.map(u => u.city).filter(Boolean))).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <select
              value={degreeLevel}
              onChange={(e) => setDegreeLevel(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white outline-none text-slate-700 w-full sm:w-auto"
            >
              <option value="all">All Degrees</option>
              <option value="BS">BS / Undergraduate</option>
              <option value="MS">MS / MPhil</option>
              <option value="PhD">PhD / Doctorate</option>
            </select>
            <input
              type="text"
              placeholder="Department (e.g. CS)"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white outline-none text-slate-700 w-full sm:w-auto"
            />
            <input
              type="number"
              placeholder="Max Fee/Sem (PKR)"
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white outline-none text-slate-700 w-full sm:w-auto"
            />
            <input
              type="number"
              placeholder="Max Merit %"
              value={maxMerit}
              onChange={(e) => setMaxMerit(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white outline-none text-slate-700 w-full sm:w-auto"
            />
          </div>


        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">
              {results.length}
            </span>{" "}
            {results.length === 1 ? "university" : "universities"} found
            {query && (
              <span>
                {" "}
                for "<span className="text-slate-700">{query}</span>"
              </span>
            )}
          </p>
        </div>

        {loadingUnis && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-56 rounded-2xl" />
            ))}
          </div>
        )}

        {!loadingUnis && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((uni) => (
              <UniversityCard key={uni._id || uni.id} uni={uni} />
            ))}
          </div>
        )}

        {!loadingUnis && results.length === 0 && (
          <div className="text-center py-20">
            <Search size={40} className="mx-auto mb-4 text-slate-300" />
            <h3
              className="text-xl font-bold text-slate-600 mb-2"
              style={{ fontFamily: "Sora" }}
            >
              No results found
            </h3>
            <p className="text-slate-400 mb-4">
              Try a different name or department
            </p>
            <button
              onClick={() => {
                setQuery("");
                clearFilters();
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear and show all
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
