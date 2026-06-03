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
  const [results, setResults] = useState(KARACHI_UNIVERSITIES);

  // Run search whenever filters change
  useEffect(() => {
    let filtered = KARACHI_UNIVERSITIES;

    // Text search â€” match name, shortName, or department name
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter((uni) => {
        const nameMatch = uni.name.toLowerCase().includes(q);
        const shortMatch = uni.shortName.toLowerCase().includes(q);
        const deptMatch = uni.departments.some(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q),
        );
        return nameMatch || shortMatch || deptMatch;
      });
    }

    // Type filter
    i
<truncated 4948 bytes>
ilters
            </button>
          )}
        </div>

        {/* Results header */}
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

        {/* Results grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((uni) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search size={40} className="mx-auto mb-4 text-slate-300" />
            <h3
              className="text-xl font-bold text-slate-600 mb-2"
              style={{ fontFamily: "Sora" }}
            >
              No results found
            </h3>
            <p className="text-slate-400 mb-4">
              Try searching a different name or department
            </p>
            <button
              onClick={() => {
                setQuery("");
                clearFilters();
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear search and show all
            </button>
          </div>
        )}
      </div>
    </>
  );
}
