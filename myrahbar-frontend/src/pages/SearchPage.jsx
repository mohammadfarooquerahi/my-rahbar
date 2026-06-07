import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { KARACHI_UNIVERSITIES, CATEGORIES } from "../data/universities";
import UniversityCard from "../components/university/UniversityCard";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [openOnly, setOpenOnly] = useState(false);
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
      const q = query.toLowerCase();
      filtered = filtered.filter((uni) => {
        const nameMatch = uni.name.toLowerCase().includes(q);
        const shortMatch = uni.shortName?.toLowerCase().includes(q);
        const deptMatch = uni.departments?.some(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q),
        );
        return nameMatch || shortMatch || deptMatch;
      });
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((u) => u.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((u) =>
        u.departments?.some(
          (d) => d.category.toLowerCase() === categoryFilter.toLowerCase(),
        ),
      );
    }

    if (openOnly) {
      filtered = filtered.filter((u) => u.admissionOpen);
    }

    setResults(filtered);
  }, [query, typeFilter, categoryFilter, openOnly, allUnis]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
  };

  const clearFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("all");
    setOpenOnly(false);
  };

  const hasFilters =
    typeFilter !== "all" || categoryFilter !== "all" || openOnly;

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

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <SlidersHorizontal size={15} />
            <span>Filter:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white outline-none text-slate-700"
          >
            <option value="all">All Types</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white outline-none text-slate-700"
          >
            <option value="all">All Fields</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(e) => setOpenOnly(e.target.checked)}
              className="rounded"
            />
            Open Admissions Only
          </label>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <X size={13} /> Clear
            </button>
          )}
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
