import { useState, useEffect } from "react";
import { useSearchParams, Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Calculator,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { calculateAggregate, getMeritStatus } from "../utils/merit";

export default function MeritCalculatorPage() {
  const [searchParams] = useSearchParams();
  const { uniSlug } = useParams();
  const navigate = useNavigate();

  // Live universities from API (No Dummy Fallback)
  const [allUniversities, setAllUniversities] = useState([]);
  
  useEffect(() => {
    fetch("/api/universities")
      .then((r) => r.json())
      .then((data) => {
        const unis = data.universities || [];
        if (unis.length > 0) {
          setAllUniversities(unis.map((u) => ({ ...u, id: u._id || u.id })));
        }
      })
      .catch(() => {});
  }, []);

  const [selectedUniSlug, setSelectedUniSlug] = useState(
    uniSlug || searchParams.get("uni") || "",
  );

  // Sync state if URL changes
  useEffect(() => {
    if (uniSlug) {
      setSelectedUniSlug(uniSlug);
    }
  }, [uniSlug]);

  const [selectedDeptName, setSelectedDeptName] = useState("");
  const [matric, setMatric] = useState("");
  const [fsc, setFsc] = useState("");
  const [testScore, setTest] = useState("");
  const [aggregate, setAggregate] = useState(null);
  const [status, setStatus] = useState(null);

  // Mode: 'percent' = enter % directly, 'marks' = enter obtained/total
  const [inputMode, setInputMode] = useState("percent");
  const [matricObt, setMatricObt] = useState("");
  const [matricTotal, setMatricTotal] = useState("1100");
  const [fscObt, setFscObt] = useState("");
  const [fscTotal, setFscTotal] = useState("1100");
  const [testObt, setTestObt] = useState("");
  const [testTotalMarks, setTestTotalMarks] = useState("100");

  // Compute percentages from obtained/total when in marks mode
  const calcPercent = (obtained, total) => {
    const o = parseFloat(obtained);
    const t = parseFloat(total);
    if (!o || !t || t === 0) return "";
    return ((o / t) * 100).toFixed(2);
  };

  const selectedUni = allUniversities.find(
    (u) => u.slug === selectedUniSlug,
  );

  const selectedDept = selectedUni?.departments?.find(
    (d) => d.name === selectedDeptName,
  );

  // Auto calculate whenever inputs change
  useEffect(() => {
    // Resolve actual percent values based on mode
    const effectiveMatric = inputMode === "marks" ? calcPercent(matricObt, matricTotal) : matric;
    const effectiveFsc = inputMode === "marks" ? calcPercent(fscObt, fscTotal) : fsc;
    const effectiveTest = inputMode === "marks" ? calcPercent(testObt, testTotalMarks) : testScore;

    if (!selectedUni || !effectiveMatric || !effectiveFsc) {
      setAggregate(null);
      setStatus(null);
      return;
    }

    const formula = selectedUni.aggregateFormula;
    const agg = calculateAggregate(effectiveMatric, effectiveFsc, effectiveTest, formula);
    setAggregate(agg);

    if (selectedDept?.lastMerit?.length > 0) {
      const s = getMeritStatus(agg, selectedDept.lastMerit);
      setStatus(s);
    } else {
      setStatus(null);
    }
  }, [
    selectedUniSlug,
    selectedDeptName,
    matric, fsc, testScore,
    matricObt, matricTotal, fscObt, fscTotal, testObt, testTotalMarks,
    inputMode,
    selectedUni,
    selectedDept,
  ]);

  const statusStyles = {
    likely: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: <CheckCircle size={20} className="text-green-600" />,
    },
    borderline: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      icon: <AlertCircle size={20} className="text-orange-500" />,
    },
    unlikely: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: <AlertCircle size={20} className="text-red-500" />,
    },
    unknown: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-600",
      icon: <Info size={20} className="text-slate-400" />,
    },
  };

  return (
    <main>
      <Helmet>
        <title>Merit Calculator — Check Your Admission Chances | Rahbars</title>
        <meta
          name="description"
          content="Calculate your aggregate percentage for any Karachi university. See if you meet the last closing merit and predict your admission chances."
        />
        <link rel="canonical" href="https://rahbars.com/merit-calculator" />
        
        <meta property="og:title" content="University Merit Calculator | Rahbars" />
        <meta property="og:description" content="Calculate your aggregate percentage and predict your admission chances for top universities in Karachi." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rahbars.com/merit-calculator" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="University Merit Calculator" />
        <meta name="twitter:description" content="Calculate your aggregate percentage and predict your admission chances for top universities in Karachi." />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#EFF6FF" }}
          >
            <Calculator size={26} style={{ color: "var(--navy)" }} />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "Sora", color: "var(--navy)" }}
          >
            Aggregate Calculator
          </h1>
          <p className="text-slate-500">
            Enter your results — see your aggregate and admission chances
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
          {/* Step 1 — Select university */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              1. Select University
            </label>
            <select
              value={selectedUniSlug}
              onChange={(e) => {
                const newSlug = e.target.value;
                setSelectedUniSlug(newSlug);
                setSelectedDeptName("");
                if (newSlug) {
                  navigate(`/${newSlug}/merit-cal`);
                } else {
                  navigate(`/merit-calculator`);
                }
              }}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-white text-slate-700 focus:border-blue-400"
            >
              <option value="">— University chunein —</option>
              {allUniversities.map((u) => (
                <option key={u.id || u._id || u.slug} value={u.slug}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2 — Select department */}
          {selectedUni && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                2. Select Department
              </label>
              <select
                value={selectedDeptName}
                onChange={(e) => setSelectedDeptName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-white text-slate-700 focus:border-blue-400"
              >
                <option value="">— Choose a department —</option>
                {selectedUni.departments.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Show formula */}
          {selectedUni && (
            <div className="mb-6 bg-blue-50 rounded-xl p-4">
              <p className="text-xs font-medium text-blue-700 mb-2 uppercase tracking-wide">
                Aggregate Formula for {selectedUni.shortName}
              </p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(selectedUni.aggregateFormula).map(
                  ([key, val]) => (
                    <span
                      key={key}
                      className="text-sm font-medium text-blue-800"
                      style={{ fontFamily: "DM Mono" }}
                    >
                      {key.toUpperCase()} × {(val * 100).toFixed(0)}%
                    </span>
                  ),
                )}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Test required: {selectedUni.testRequired}
              </p>
            </div>
          )}

          {/* Step 3 — Enter marks */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-slate-700">
                3. Enter Your Marks
              </label>
              {/* Mode toggle */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setInputMode("percent")}
                  className={"px-3 py-1 text-xs font-semibold rounded-lg transition-all " + (inputMode === "percent" ? "bg-white text-blue-700 shadow" : "text-slate-500")}
                >
                  Enter %
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("marks")}
                  className={"px-3 py-1 text-xs font-semibold rounded-lg transition-all " + (inputMode === "marks" ? "bg-white text-blue-700 shadow" : "text-slate-500")}
                >
                  Obtained / Total
                </button>
              </div>
            </div>

            {inputMode === "percent" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Matric %</label>
                  <input type="number" min="0" max="100" value={matric} onChange={(e) => setMatric(e.target.value)} placeholder="e.g. 85" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">FSc / Intermediate %</label>
                  <input type="number" min="0" max="100" value={fsc} onChange={(e) => setFsc(e.target.value)} placeholder="e.g. 78" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Entry Test % (if required)</label>
                  <input type="number" min="0" max="100" value={testScore} onChange={(e) => setTest(e.target.value)} placeholder="e.g. 72" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Matric row */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-600 mb-3">Matric / O-Levels</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Obtained Marks</label>
                      <input type="number" value={matricObt} onChange={(e) => setMatricObt(e.target.value)} placeholder="e.g. 900" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Total Marks</label>
                      <input type="number" value={matricTotal} onChange={(e) => setMatricTotal(e.target.value)} placeholder="e.g. 1100" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Calculated %</label>
                      <div className="border border-blue-200 bg-blue-50 rounded-xl px-3 py-2.5 text-sm font-bold text-blue-700">{calcPercent(matricObt, matricTotal) || "—"}{calcPercent(matricObt, matricTotal) ? "%" : ""}</div>
                    </div>
                  </div>
                </div>
                {/* FSc row */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-600 mb-3">Intermediate / FSc / A-Levels</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Obtained Marks</label>
                      <input type="number" value={fscObt} onChange={(e) => setFscObt(e.target.value)} placeholder="e.g. 950" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Total Marks</label>
                      <input type="number" value={fscTotal} onChange={(e) => setFscTotal(e.target.value)} placeholder="e.g. 1100" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Calculated %</label>
                      <div className="border border-blue-200 bg-blue-50 rounded-xl px-3 py-2.5 text-sm font-bold text-blue-700">{calcPercent(fscObt, fscTotal) || "—"}{calcPercent(fscObt, fscTotal) ? "%" : ""}</div>
                    </div>
                  </div>
                </div>
                {/* Test row */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-600 mb-3">Entry Test (if applicable)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Obtained Marks</label>
                      <input type="number" value={testObt} onChange={(e) => setTestObt(e.target.value)} placeholder="e.g. 72" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Total Marks</label>
                      <input type="number" value={testTotalMarks} onChange={(e) => setTestTotalMarks(e.target.value)} placeholder="e.g. 100" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Calculated %</label>
                      <div className="border border-blue-200 bg-blue-50 rounded-xl px-3 py-2.5 text-sm font-bold text-blue-700">{calcPercent(testObt, testTotalMarks) || "—"}{calcPercent(testObt, testTotalMarks) ? "%" : ""}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Result box */}
          {aggregate !== null && (
            <div className="space-y-4">
              {/* Aggregate display */}
              <div
                className="rounded-2xl p-6 text-center text-white"
                style={{
                  background:
                    "linear-gradient(135deg, var(--navy), var(--blue))",
                }}
              >
                <p className="text-sm text-blue-200 mb-1 uppercase tracking-wider">
                  Your Aggregate
                </p>
                <p
                  className="text-5xl font-bold"
                  style={{ fontFamily: "DM Mono" }}
                >
                  {aggregate}%
                </p>
                {selectedUni && (
                  <p className="text-blue-200 text-sm mt-2">
                    For {selectedUni.shortName}
                    {selectedDept ? " — " + selectedDept.name : ""}
                  </p>
                )}
              </div>

              {/* Merit status */}
              {status && status.status !== "unknown" && (
                <div
                  className={
                    "rounded-xl border p-4 flex items-start gap-3 " +
                    statusStyles[status.status].bg +
                    " " +
                    statusStyles[status.status].border
                  }
                >
                  {statusStyles[status.status].icon}
                  <div>
                    <p
                      className={
                        "font-semibold " + statusStyles[status.status].text
                      }
                      style={{ fontFamily: "Sora" }}
                    >
                      {status.label}
                    </p>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Last year closing merit was{" "}
                      <span className="font-medium">
                        {selectedDept.lastMerit[0].closing}%
                      </span>
                      {status.diff !== undefined && (
                        <span>
                          {" "}
                          — you are{" "}
                          <span className="font-medium">
                            {Math.abs(status.diff.toFixed(1))}%
                          </span>{" "}
                          {status.diff >= 0 ? "above" : "below"} closing merit
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Last merit history */}
              {selectedDept?.lastMerit?.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                    Closing Merit History
                  </p>
                  <div className="flex gap-4">
                    {selectedDept.lastMerit.map((m) => (
                      <div key={m.year} className="text-center">
                        <p
                          className="text-xl font-bold"
                          style={{
                            fontFamily: "DM Mono",
                            color: "var(--navy)",
                          }}
                        >
                          {m.closing}%
                        </p>
                        <p className="text-xs text-slate-500">{m.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to action */}
              <div className="flex gap-3 pt-2">
                <Link
                  to={
                    selectedUni ? "/university/" + selectedUni.slug : "/search"
                  }
                  className="flex-1 text-center py-2.5 text-sm font-medium text-white rounded-xl"
                  style={{ background: "var(--navy)" }}
                >
                  View University Details
                </Link>
                <Link
                  to="/compare"
                  className="flex-1 text-center py-2.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100"
                >
                  Compare Universities
                </Link>
              </div>
            </div>
          )}

          {/* Empty state hint */}
          {!selectedUni && (
            <div className="text-center py-8 text-slate-400">
              <TrendingUp size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">
                Select a university above to start calculating
              </p>
            </div>
          )}
        </div>

        {/* Info note */}
        <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 px-1">
          <Info size={13} className="shrink-0 mt-0.5" />
          <p>
            Merit data is based on last available year. Actual closing merit
            changes every year. Always verify on the official university
            website.
          </p>
        </div>
      </div>
    
        {/* SEO Content */}
        <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 text-slate-600 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">University Merit Calculator Pakistan</h2>
          <p className="text-sm leading-relaxed">
            Calculating your university aggregate can be complex, especially with different formulas for NED, KU, FAST, NUST and Medical colleges. Our <strong>Merit Calculator</strong> simplifies this by automatically applying the exact weightage for Matric, FSc, and Entry Tests (MDCAT, ECAT, NTS, NAT) required by top universities in Pakistan.
          </p>
          <h3 className="text-lg font-semibold text-slate-800 mt-4">How to calculate your aggregate merit?</h3>
          <p className="text-sm leading-relaxed">
            Simply enter your academic scores above. The tool uses official university formulas to calculate your exact aggregate percentage. This helps you predict your admission chances before the closing merit lists are announced. Whether you are applying for BS Computer Science, Engineering, or Medical (MBBS/BDS), knowing your aggregate is the first step to securing admission.
          </p>
        </div>
      </div>
    </main>

  );
}
