"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { KARACHI_UNIVERSITIES, CATEGORIES } from "@/data/universities";
import UniversityCard from "@/components/university/UniversityCard";

export default function SearchClient({ initialUnis = [] }) {
  const searchParams = useSearchParams();

  const urlQ = searchParams.get("q") || "";
  const urlType = searchParams.get("type") || "all";
  const urlCategory = searchParams.get("category") || "all";
  const urlOpen = searchParams.get("openOnly") === "true";
  const urlDegree = searchParams.get("degreeLevel") || "all";
  const urlDept = searchParams.get("dept") || "";
  const urlCity = searchParams.get("city") || "all";
  const urlMaxFee = searchParams.get("maxFee") || "";
  const urlMaxMerit = searchParams.get("maxMerit") || "";

  const [query, setQuery] = useState(urlQ);
  const [typeFilter, setTypeFilter] = useState(urlType);
  const [categoryFilter, setCategoryFilter] = useState(urlCategory);
  const [openOnly, setOpenOnly] = useState(urlOpen);
  const [degreeLevel, setDegreeLevel] = useState(urlDegree);
  const [department, setDepartment] = useState(urlDept);
  const [cityFilter, setCityFilter] = useState(urlCity);
  const [maxFee, setMaxFee] = useState(urlMaxFee);
  const [maxMerit, setMaxMerit] = useState(urlMaxMerit);

  const [allUnis, setAllUnis] = useState(() => {
    return initialUnis.length > 0 ? initialUnis : KARACHI_UNIVERSITIES;
  });
  const [loadingUnis, setLoadingUnis] = useState(() => initialUnis.length === 0);

  // Sync state if URL query param changes
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null && q !== query) {
      setQuery(q);
    }
  }, [searchParams]);

  // Load latest universities from API if not preloaded
  useEffect(() => {
    if (initialUnis.length === 0) {
      fetch("/api/universities")
        .then((res) => res.json())
        .then((data) => {
          const unis = data.universities || [];
          const source = unis.length > 0 ? unis : KARACHI_UNIVERSITIES;
          setAllUnis(source);
          setLoadingUnis(false);
        })
        .catch(() => {
          setAllUnis(KARACHI_UNIVERSITIES);
          setLoadingUnis(false);
        });
    }
  }, [initialUnis]);

  // Sync state to URL without reloading page
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (openOnly) params.set("openOnly", "true");
    if (degreeLevel !== "all") params.set("degreeLevel", degreeLevel);
    if (department.trim()) params.set("dept", department.trim());
    if (cityFilter !== "all") params.set("city", cityFilter);
    if (maxFee) params.set("maxFee", maxFee);
    if (maxMerit) params.set("maxMerit", maxMerit);

    const queryString = params.toString();
    const newUrl = queryString ? `/search?${queryString}` : "/search";
    window.history.replaceState(null, "", newUrl);
  }, [query, typeFilter, categoryFilter, openOnly, degreeLevel, department, cityFilter, maxFee, maxMerit]);

  // Filter universities
  const results = useMemo(() => {
    if (!allUnis || allUnis.length === 0) return [];
    let filtered = allUnis;

    if (query.trim()) {
      const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);
      filtered = filtered.filter((uni) => {
        let uniText = [
          uni.name,
          uni.shortName,
          uni.city,
          uni.type,
          ...(uni.departments?.map((d) => `${d.name} ${d.category}`) || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        // Intelligent Synonym Expansion
        if (/\bcs\b/.test(uniText) || uniText.includes("computer science") || uniText.includes("computing"))
          uniText += " cs computer science software it";
        if (/\beng\b/.test(uniText) || uniText.includes("engineering"))
          uniText += " eng engineering engineer";
        if (/\bbba\b/.test(uniText) || uniText.includes("business") || uniText.includes("management"))
          uniText += " bba mba business management";
        if (
          /\bmed\b/.test(uniText) ||
          /\bmbbs\b/.test(uniText) ||
          /\bbds\b/.test(uniText) ||
          uniText.includes("medical") ||
          uniText.includes("medicine")
        )
          uniText += " med medical medicine mbbs bds doctor";
        if (/\bit\b/.test(uniText) || uniText.includes("information technology"))
          uniText += " it information technology cs";
        if (/\bai\b/.test(uniText) || uniText.includes("artificial intelligence"))
          uniText += " ai artificial intelligence";
        if (/\bds\b/.test(uniText) || uniText.includes("data science"))
          uniText += " ds data science";

        return keywords.every((kw) => uniText.includes(kw));
      });
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((uni) => (uni.type || "").toLowerCase() === typeFilter.toLowerCase());
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
        if (uni.admissionDeadlines?.some((dl) => checkDate(dl.deadline))) return true;
        return false;
      });
    }

    if (degreeLevel !== "all") {
      const level = degreeLevel.toLowerCase();
      filtered = filtered.filter(
        (uni) =>
          uni.admissionDeadlines?.some((dl) => dl.degreeLevel?.toLowerCase().includes(level)) ||
          uni.departments?.some((d) => d.name.toLowerCase().includes(level))
      );
    }

    if (department.trim()) {
      const q = department.toLowerCase();
      filtered = filtered.filter((uni) =>
        uni.departments?.some(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.category?.toLowerCase().includes(q)
        )
      );
    }

    if (cityFilter !== "all") {
      filtered = filtered.filter(
        (uni) =>
          (uni.city || "").toLowerCase() === cityFilter.toLowerCase() ||
          uni.admissionDeadlines?.some((dl) =>
            dl.testCities?.some((c) => c.toLowerCase().includes(cityFilter.toLowerCase()))
          )
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

    return filtered;
  }, [allUnis, query, typeFilter, categoryFilter, openOnly, degreeLevel, department, cityFilter, maxFee, maxMerit]);

  const handleSearch = (e) => {
    e.preventDefault();
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
    typeFilter !== "all" ||
    categoryFilter !== "all" ||
    openOnly ||
    degreeLevel !== "all" ||
    department !== "" ||
    cityFilter !== "all" ||
    maxFee !== "" ||
    maxMerit !== "";

  const availableCities = Array.from(new Set(allUnis.map((u) => u.city).filter(Boolean)));

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex items-center bg-white rounded-2xl border border-slate-200 shadow-sm px-4 gap-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={20} className="text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search universities by name, city, or discipline (e.g. Karachi, CS, NED, Medical)..."
              className="flex-1 py-4 text-sm md:text-base outline-none text-slate-700 placeholder:text-slate-400 bg-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white rounded-xl shrink-0 transition-transform active:scale-95 shadow-sm"
              style={{ background: "#0F172A" }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Basic Filters */}
        <div className="grid grid-cols-2 sm:flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 w-full sm:w-auto col-span-2">
            <SlidersHorizontal size={15} />
            <span className="font-semibold">Filters:</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white outline-none text-slate-700 w-full sm:w-auto font-medium"
          >
            <option value="all">All Sectors</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white outline-none text-slate-700 w-full sm:w-auto font-medium"
          >
            <option value="all">All Fields</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white outline-none text-slate-700 w-full sm:w-auto font-medium"
          >
            <option value="all">All Cities</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer w-full sm:w-auto bg-white px-3 py-2 border border-slate-200 rounded-xl font-medium">
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(e) => setOpenOnly(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            Admissions Open
          </label>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-red-600 hover:text-red-700 px-3 py-2"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Count Header */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <p className="text-sm text-slate-600">
            Found <span className="font-bold text-slate-900">{results.length}</span>{" "}
            {results.length === 1 ? "university" : "universities"}
            {query && (
              <span>
                {" "}
                for &quot;<span className="font-semibold text-blue-600">{query}</span>&quot;
              </span>
            )}
          </p>
        </div>

        {/* Loading state */}
        {loadingUnis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 h-64 animate-pulse" />
            ))}
          </div>
        )}

        {/* Universities Grid */}
        {!loadingUnis && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((uni) => (
              <UniversityCard key={uni._id || uni.id || uni.slug} uni={uni} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingUnis && results.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
            <Search size={48} className="mx-auto mb-4 text-slate-300" />
            <h3
              className="text-xl font-bold text-slate-800 mb-2"
              style={{ fontFamily: "Sora" }}
            >
              No universities found
            </h3>
            <p className="text-slate-500 mb-5 max-w-sm mx-auto">
              We couldn&apos;t find any university matching your search &quot;{query}&quot;. Try searching for another city, short name (e.g. NED, NUST, FAST), or field.
            </p>
            <button
              onClick={() => {
                setQuery("");
                clearFilters();
              }}
              className="px-5 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800"
            >
              Clear Search and Show All
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
