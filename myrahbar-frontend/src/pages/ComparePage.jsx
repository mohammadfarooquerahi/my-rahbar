import { useState, useEffect } from "react";
import { useSearchParams, Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Plus, X, BarChart2, Check, Minus } from "lucide-react";
import { formatFee } from "../utils/merit";

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const { uni1Slug, uni2Slug } = useParams();
  const navigate = useNavigate();

  const [allUniversities, setAllUniversities] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch real universities
  useEffect(() => {
    fetch("/api/universities")
      .then((r) => r.json())
      .then((data) => {
        const unis = data.universities || [];
        if (unis.length > 0) {
          const formattedUnis = unis.map((u) => ({ ...u, id: u._id || u.id }));
          setAllUniversities(formattedUnis);

          // Populate from URL
          const u1Param = uni1Slug || searchParams.get("uni1");
          const u2Param = uni2Slug || searchParams.get("uni2");
          const u3Param = searchParams.get("uni3");

          const u1 = formattedUnis.find(u => u.slug === u1Param);
          const u2 = formattedUnis.find(u => u.slug === u2Param);
          const u3 = formattedUnis.find(u => u.slug === u3Param);
          
          setSelected([u1, u2, u3].filter(Boolean));
        }
        setIsLoading(false);
        setIsInitialized(true);
      })
      .catch(() => {
        setIsLoading(false);
        setIsInitialized(true);
      });
  }, [uni1Slug, uni2Slug, searchParams]);

  // Sync URL when selection changes manually (add/remove)
  useEffect(() => {
    if (!isInitialized) return; // Wait for initial data load to complete
    
    if (selected.length === 3) {
      navigate(`/${selected[0].slug}/vs/${selected[1].slug}?uni3=${selected[2].slug}`, { replace: true });
    } else if (selected.length === 2) {
      navigate(`/${selected[0].slug}/vs/${selected[1].slug}`, { replace: true });
    } else if (selected.length === 1) {
      navigate(`/compare?uni1=${selected[0].slug}`, { replace: true });
    } else if (selected.length === 0) {
      navigate(`/compare`, { replace: true });
    }
  }, [selected, navigate, isInitialized]);

  const addUniversity = (slug) => {
    if (selected.length >= 3) return;
    const uni = allUniversities.find((u) => u.slug === slug);
    if (uni && !selected.find((s) => s.id === uni.id)) {
      setSelected([...selected, uni]);
    }
  };

  const removeUniversity = (id) => {
    setSelected(selected.filter((u) => u.id !== id));
    // When removing, we need to immediately update URL to drop the removed param
    const remaining = selected.filter((u) => u.id !== id);
    const params = new URLSearchParams();
    if (remaining[0]) params.set("uni1", remaining[0].slug);
    if (remaining[1]) params.set("uni2", remaining[1].slug);
    if (remaining[2]) params.set("uni3", remaining[2].slug);
    setSearchParams(params, { replace: true });
  };

  const available = allUniversities.filter(
    (u) => !selected.find((s) => s.id === u.id),
  );

  // Rows to compare
  const rows = [
    {
      label: "Type",
      get: (u) => (u.type === "government" ? "Government" : "Private"),
    },
    { label: "Established", get: (u) => u.established },
    { label: "City", get: (u) => u.city },
    { label: "Campuses", get: (u) => u.campuses.length },
    { label: "Departments", get: (u) => u.departments.length },
    { label: "Admissions Open", get: (u) => (u.admissionOpen ? "Yes" : "No") },
    { label: "Avg Rating", get: (u) => u.overallRating + " / 5" },
    {
      label: "Hostel",
      get: (u) => (u.hostelAvailable ? "Available" : "Not Available"),
    },
    {
      label: "Hostel Fee",
      get: (u) => (u.hostelAvailable ? formatFee(u.hostelFee) + "/mo" : "—"),
    },
    { label: "Admission Fee", get: (u) => formatFee(u.admissionFee) },
    { label: "Scholarships", get: (u) => u.scholarships.length + " available" },
    { label: "Entry Test", get: (u) => u.testRequired },
  ];

  return (
    <>
      <Helmet>
        <title>Compare Universities — Side by Side | Rahbars</title>
        <meta
          name="description"
          content="Compare up to 3 Karachi universities side by side. See fee, merit, hostel, scholarships and more at a glance."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "Sora", color: "var(--navy)" }}
          >
            Compare Universities
          </h1>
          <p className="text-slate-500">
            Select up to 3 universities and compare them side by side
          </p>
        </div>

        {/* University selector cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Already selected */}
          {selected.map((uni) => (
            <div
              key={uni.id}
              className="bg-white rounded-2xl border-2 border-blue-400 p-4 relative"
            >
              <button
                onClick={() => removeUniversity(uni.id)}
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500"
              >
                <X size={15} />
              </button>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold mb-2"
                style={{ background: "var(--navy)" }}
              >
                {uni.shortName.slice(0, 2)}
              </div>
              <p
                className="font-semibold text-sm text-slate-800 pr-4"
                style={{ fontFamily: "Sora" }}
              >
                {uni.name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{uni.city}</p>
            </div>
          ))}

          {/* Empty slots */}
          {selected.length < 3 && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-4">
              <p className="text-xs font-medium text-slate-500 mb-2">
                Add University {selected.length + 1}
              </p>
              <select
                onChange={(e) => {
                  addUniversity(e.target.value);
                  e.target.value = "";
                }}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none bg-white text-slate-700"
                defaultValue=""
              >
                <option value="" disabled>
                  — Select —
                </option>
                {available.map((u) => (
                  <option key={u.id} value={u.slug}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Placeholder if less than 2 */}
          {selected.length < 2 && (
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-4 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <Plus size={20} className="mx-auto mb-1" />
                <p className="text-xs">Add more to compare</p>
              </div>
            </div>
          )}
        </div>

        {/* Comparison table */}
        {selected.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Column headers */}
            <div
              className="grid border-b border-slate-200"
              style={{
                gridTemplateColumns:
                  "200px " + "repeat(" + selected.length + ", 1fr)",
              }}
            >
              <div className="p-4 bg-slate-50">
                <BarChart2 size={16} className="text-slate-400" />
              </div>
              {selected.map((uni) => (
                <div
                  key={uni.id}
                  className="p-4 text-center border-l border-slate-200"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm mx-auto mb-2"
                    style={{ background: "var(--navy)" }}
                  >
                    {uni.shortName.slice(0, 2)}
                  </div>
                  <p
                    className="font-semibold text-sm text-slate-800 leading-tight"
                    style={{ fontFamily: "Sora" }}
                  >
                    {uni.shortName}
                  </p>
                </div>
              ))}
            </div>

            {/* Data rows */}
            {rows.map((row, i) => (
              <div
                key={row.label}
                className={
                  "grid border-b border-slate-100 " +
                  (i % 2 === 0 ? "bg-white" : "bg-slate-50/50")
                }
                style={{
                  gridTemplateColumns:
                    "200px " + "repeat(" + selected.length + ", 1fr)",
                }}
              >
                <div className="px-4 py-3 text-sm font-medium text-slate-600">
                  {row.label}
                </div>
                {selected.map((uni) => (
                  <div
                    key={uni.id}
                    className="px-4 py-3 text-sm text-slate-700 text-center border-l border-slate-100"
                  >
                    {row.get(uni)}
                  </div>
                ))}
              </div>
            ))}

            {/* Department comparison */}
            <div
              className="grid border-b border-slate-200 bg-blue-50"
              style={{
                gridTemplateColumns:
                  "200px " + "repeat(" + selected.length + ", 1fr)",
              }}
            >
              <div className="px-4 py-3 text-sm font-semibold text-blue-800">
                Departments
              </div>
              {selected.map((uni) => (
                <div
                  key={uni.id}
                  className="px-4 py-3 border-l border-blue-100"
                >
                  {uni.departments.map((d) => (
                    <p key={d.name} className="text-xs text-blue-700 mb-0.5">
                      • {d.name}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Scholarship comparison */}
            <div
              className="grid border-b border-slate-200"
              style={{
                gridTemplateColumns:
                  "200px " + "repeat(" + selected.length + ", 1fr)",
              }}
            >
              <div className="px-4 py-3 text-sm font-semibold text-slate-600">
                Scholarships
              </div>
              {selected.map((uni) => (
                <div
                  key={uni.id}
                  className="px-4 py-3 border-l border-slate-100"
                >
                  {uni.scholarships.map((s) => (
                    <p
                      key={s}
                      className="text-xs text-slate-600 mb-0.5 flex items-start gap-1"
                    >
                      <Check
                        size={10}
                        className="text-green-500 shrink-0 mt-0.5"
                      />
                      {s}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Action row */}
            <div
              className="grid p-4"
              style={{
                gridTemplateColumns:
                  "200px " + "repeat(" + selected.length + ", 1fr)",
              }}
            >
              <div className="text-xs text-slate-400 flex items-center">
                View details
              </div>
              {selected.map((uni) => (
                <div key={uni.id} className="px-2">
                  <Link
                    to={"/university/" + uni.slug}
                    className="block text-center py-2 text-sm font-medium text-white rounded-xl"
                    style={{ background: "var(--navy)" }}
                  >
                    View {uni.shortName}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <BarChart2 size={40} className="mx-auto mb-4 opacity-40" />
            <p className="text-sm">
              Select at least one university above to start comparing
            </p>
          </div>
        )}
      </div>
    </>
  );
}
