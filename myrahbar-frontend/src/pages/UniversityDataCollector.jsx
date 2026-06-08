import { useState } from "react";

const CATEGORIES = [
  "CS",
  "Engineering",
  "Medical",
  "Business",
  "Arts",
  "Law",
  "Social Sciences",
  "Education",
  "Agriculture",
  "Sciences",
];
const UNI_TYPES = ["Government", "Private", "Semi-Government", "Foreign"];

const initialDept = {
  name: "",
  category: "CS",
  semesterFee: "",
  lastMerit: "",
  meritSeats: 0,
  selfFinanceSeats: 0,
};

export default function UniversityDataCollector() {
  const [step, setStep] = useState("search"); // search | loading | review | submitting | done
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

  const LOADING_STEPS = [
    "🔍 Searching HEC database...",
    "🌐 Fetching official university website...",
    "📋 Reading latest prospectus data...",
    "🎓 Extracting departments & merit lists...",
    "💰 Collecting fee structures...",
    "📄 Gathering required documents...",
    "✅ Compiling & verifying data...",
  ];

  const collectData = async () => {
    if (!searchQuery.trim()) return;
    setStep("loading");
    setError("");
    loadingStep && setLoadingStep(0);

    // Animate loading steps
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingMsg(LOADING_STEPS[i]);
      setLoadingStep(i + 1);
      await new Promise((r) => setTimeout(r, 600));
    }

    try {
      // 🌟 FIXED: Path changed to /api/ai-collect/collect-university to match backend config
      const res = await fetch("/api/ai-collect/collect-university", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ universityName: searchQuery }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch from server");
      }

      const parsed = await res.json();

      // Normalize fields if missing
      parsed.departments = (parsed.departments || []).map((d) => ({
        name: d.name || "",
        category: d.category || "CS",
        semesterFee: d.semesterFee || "",
        lastMerit: d.lastMerit || "",
        meritSeats: d.meritSeats || 0,
        selfFinanceSeats: d.selfFinanceSeats || 0,
      }));

      setFormData(parsed);
      setStep("review");
    } catch (e) {
      console.error("Frontend Collection Error:", e);
      setError("Failed to collect data. Try a more specific university name.");
      setStep("search");
    }
  };

  const updateField = (key, val) => setFormData((p) => ({ ...p, [key]: val }));

  const updateDept = (i, key, val) => {
    const deps = [...formData.departments];
    deps[i] = { ...deps[i], [key]: val };
    setFormData((p) => ({ ...p, departments: deps }));
  };

  const addDept = () =>
    setFormData((p) => ({
      ...p,
      departments: [...p.departments, { ...initialDept }],
    }));

  const removeDept = (i) =>
    setFormData((p) => ({
      ...p,
      departments: p.departments.filter((_, idx) => idx !== i),
    }));

  const submitToBackend = async () => {
    setStep("submitting");
    try {
      // Map AI flat format to backend University model format
      const payload = {
        name: formData.name,
        slug: formData.slug,
        shortName: formData.shortName,
        type: (formData.type || "government").toLowerCase(),
        city: formData.city || "Karachi",
        established: formData.establishedYear || null,
        website: formData.officialWebsite || "",
        testRequired: formData.entryTest || "Own Entry Test",
        admissionFee: Number(formData.admissionFee) || 0,
        admissionOpen: !!formData.admissionOpen,
        admissionDeadline: formData.admissionDeadline || null,
        hostelAvailable: !!formData.hostelAvailable,
        aggregateFormula: {
          matric: Number(formData.matricWeight) || 0.1,
          fsc: Number(formData.fscWeight) || 0.4,
          test: Number(formData.testWeight) || 0.5,
        },
        scholarships: Array.isArray(formData.scholarships) ? formData.scholarships : [],
        requiredDocuments: Array.isArray(formData.requiredDocuments) ? formData.requiredDocuments : [],
        departments: (formData.departments || []).map((d) => ({
          name: d.name,
          category: d.category || "CS",
          semesterFee: Number(d.semesterFee) || 0,
          seats: {
            merit: Number(d.meritSeats) || 0,
            selfFinance: Number(d.selfFinanceSeats) || 0,
            other: 0,
          },
          lastMerit: d.lastMerit
            ? [{ year: 2024, closingPercentage: Number(d.lastMerit), quota: "merit" }]
            : [],
        })),
        status: "pending",
      };

      const res = await fetch("/api/universities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Submit failed");
      }
      setStep("done");
    } catch (e) {
      setSubmitStatus("❌ " + (e.message || "Failed to submit. Check your connection or login."));
      setStep("review");
    }
  };

  const totalWeight = (
    (+formData?.matricWeight || 0) +
    (+formData?.fscWeight || 0) +
    (+formData?.testWeight || 0)
  ).toFixed(2);

  // ── STYLES ────────────────────────────────────────────────────
  const s = {
    wrap: {
      fontFamily: "'DM Sans', sans-serif",
      background: "#f8fafc",
      minHeight: "100vh",
      padding: "24px 16px",
    },
    card: {
      background: "#fff",
      borderRadius: 16,
      border: "1px solid #e2e8f0",
      padding: 28,
      maxWidth: 900,
      margin: "0 auto",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
    h1: { fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" },
    sub: { fontSize: 13, color: "#64748b", margin: "0 0 24px" },
    label: {
      display: "block",
      fontSize: 12,
      fontWeight: 600,
      color: "#374151",
      marginBottom: 5,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      border: "1.5px solid #e2e8f0",
      borderRadius: 8,
      fontSize: 14,
      color: "#1e293b",
      background: "#fff",
      outline: "none",
      boxSizing: "border-box",
      transition: "border 0.2s",
    },
    select: {
      width: "100%",
      padding: "10px 12px",
      border: "1.5px solid #e2e8f0",
      borderRadius: 8,
      fontSize: 14,
      color: "#1e293b",
      background: "#fff",
      outline: "none",
      boxSizing: "border-box",
    },
    btn: {
      padding: "11px 22px",
      borderRadius: 9,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      border: "none",
      transition: "all 0.2s",
    },
    btnPrimary: { background: "#1d4ed8", color: "#fff" },
    btnGreen: { background: "#16a34a", color: "#fff" },
    btnGray: { background: "#f1f5f9", color: "#475569" },
    btnRed: {
      background: "#fee2e2",
      color: "#dc2626",
      padding: "6px 12px",
      borderRadius: 7,
      fontSize: 12,
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
    },
    row2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16,
      marginBottom: 16,
    },
    row3: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 700,
      color: "#1e293b",
      borderBottom: "2px solid #e2e8f0",
      paddingBottom: 8,
      marginBottom: 16,
    },
    badge: {
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
    },
    deptCard: {
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
    },
    searchBox: { display: "flex", gap: 12, marginBottom: 8 },
    searchInput: {
      flex: 1,
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: 10,
      fontSize: 15,
      outline: "none",
    },
    loadWrap: { textAlign: "center", padding: "60px 20px" },
    progressBar: {
      background: "#e2e8f0",
      borderRadius: 99,
      height: 6,
      margin: "16px 0",
      overflow: "hidden",
    },
    progressFill: {
      background: "#1d4ed8",
      height: "100%",
      borderRadius: 99,
      transition: "width 0.5s ease",
    },
  };

  // ── SEARCH SCREEN ─────────────────────────────────────────────
  if (step === "search")
    return (
      <div style={s.wrap}>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <div style={s.card}>
          <h1 style={s.h1}>🎓 University Data Collector</h1>
          <p style={s.sub}>
            AI-powered tool — searches HEC, official websites & prospectus to
            auto-fill university data
          </p>

          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: 13,
              color: "#1e40af",
            }}
          >
            <strong>How it works:</strong> Enter a university name → AI searches
            official sources → Reviews pre-filled data → Submit to pending queue
            → Approve in admin panel
          </div>

          <label style={s.label}>University Name</label>
          <div style={s.searchBox}>
            <input
              style={s.searchInput}
              placeholder="e.g. University of Karachi, NED University, MUET Jamshoro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && collectData()}
            />
            <button style={{ ...s.btn, ...s.btnPrimary }} onClick={collectData}>
              🔍 Collect Data
            </button>
          </div>
          {error && (
            <p style={{ color: "#dc2626", fontSize: 13, marginTop: 8 }}>
              {error}
            </p>
          )}

          <div style={{ marginTop: 24 }}>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>
              Quick search:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                "University of Karachi",
                "NED University",
                "MUET Jamshoro",
                "Dow University",
                "IBA Karachi",
                "University of Sindh",
              ].map((u) => (
                <button
                  key={u}
                  onClick={() => setSearchQuery(u)}
                  style={{
                    ...s.btn,
                    ...s.btnGray,
                    padding: "6px 14px",
                    fontSize: 12,
                  }}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  // ── LOADING SCREEN ────────────────────────────────────────────
  if (step === "loading")
    return (
      <div style={s.wrap}>
        <div style={{ ...s.card, ...s.loadWrap }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔎</div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 8,
            }}
          >
            Collecting Data...
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
            {loadingMsg}
          </p>
          <div style={s.progressBar}>
            <div
              style={{
                ...s.progressFill,
                width: `${(loadingStep / LOADING_STEPS.length) * 100}%`,
              }}
            />
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>
            {loadingStep} of {LOADING_STEPS.length} steps complete
          </p>
        </div>
      </div>
    );

  // ── DONE SCREEN ───────────────────────────────────────────────
  if (step === "done")
    return (
      <div style={s.wrap}>
        <div style={{ ...s.card, textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
            Submitted for Review!
          </h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>
            University data added to pending queue. Go approve it in your admin
            panel.
          </p>
          <button
            style={{ ...s.btn, ...s.btnPrimary }}
            onClick={() => {
              setStep("search");
              setSearchQuery("");
              setFormData(null);
            }}
          >
            + Add Another University
          </button>
        </div>
      </div>
    );

  // ── SUBMITTING ────────────────────────────────────────────────
  if (step === "submitting")
    return (
      <div style={s.wrap}>
        <div style={{ ...s.card, ...s.loadWrap }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💾</div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>
            Saving to Database...
          </h2>
        </div>
      </div>
    );

  // ── REVIEW FORM ───────────────────────────────────────────────
  return (
    <div style={s.wrap}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h1 style={{ ...s.h1, marginBottom: 2 }}>Review & Edit Data</h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              AI collected this data — verify and correct before submitting
            </p>
          </div>
          <button
            style={{ ...s.btn, ...s.btnGray }}
            onClick={() => setStep("search")}
          >
            ← Back
          </button>
        </div>

        {submitStatus && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              color: "#dc2626",
              fontSize: 13,
            }}
          >
            {submitStatus}
          </div>
        )}

        {/* Basic Info */}
        <div style={s.card}>
          <div style={s.sectionTitle}>📋 Basic Information</div>
          <div style={s.row2}>
            <div>
              <label style={s.label}>University Full Name *</label>
              <input
                style={s.input}
                value={formData.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
            <div>
              <label style={s.label}>Short Name *</label>
              <input
                style={s.input}
                value={formData.shortName || ""}
                onChange={(e) => updateField("shortName", e.target.value)}
              />
            </div>
          </div>
          <div style={s.row2}>
            <div>
              <label style={s.label}>URL Slug *</label>
              <input
                style={s.input}
                value={formData.slug || ""}
                onChange={(e) => updateField("slug", e.target.value)}
              />
            </div>
            <div>
              <label style={s.label}>Type</label>
              <select
                style={s.select}
                value={formData.type || "Government"}
                onChange={(e) => updateField("type", e.target.value)}
              >
                {UNI_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={s.row2}>
            <div>
              <label style={s.label}>City</label>
              <input
                style={s.input}
                value={formData.city || ""}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </div>
            <div>
              <label style={s.label}>Established Year</label>
              <input
                style={s.input}
                type="number"
                value={formData.establishedYear || ""}
                onChange={(e) => updateField("establishedYear", e.target.value)}
              />
            </div>
          </div>
          <div style={s.row2}>
            <div>
              <label style={s.label}>Official Website</label>
              <input
                style={s.input}
                value={formData.officialWebsite || ""}
                onChange={(e) => updateField("officialWebsite", e.target.value)}
              />
            </div>
            <div>
              <label style={s.label}>Entry Test Required</label>
              <input
                style={s.input}
                value={formData.entryTest || ""}
                onChange={(e) => updateField("entryTest", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label style={s.label}>Description</label>
            <textarea
              style={{ ...s.input, minHeight: 70, resize: "vertical" }}
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>
        </div>

        {/* Admission Details */}
        <div style={{ ...s.card, marginTop: 16 }}>
          <div style={s.sectionTitle}>📅 Admission Details</div>
          <div style={s.row2}>
            <div>
              <label style={s.label}>Admission Fee (PKR)</label>
              <input
                style={s.input}
                type="number"
                value={formData.admissionFee || ""}
                onChange={(e) => updateField("admissionFee", e.target.value)}
              />
            </div>
            <div>
              <label style={s.label}>Admission Deadline</label>
              <input
                style={s.input}
                type="date"
                value={formData.admissionDeadline || ""}
                onChange={(e) =>
                  updateField("admissionDeadline", e.target.value)
                }
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "#374151",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={!!formData.admissionOpen}
                onChange={(e) => updateField("admissionOpen", e.target.checked)}
              />
              Admission Currently Open
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "#374151",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={!!formData.hostelAvailable}
                onChange={(e) =>
                  updateField("hostelAvailable", e.target.checked)
                }
              />
              Hostel Available
            </label>
          </div>

          <div style={s.sectionTitle}>⚖️ Aggregate Formula</div>
          <div style={s.row3}>
            <div>
              <label style={s.label}>Matric Weight</label>
              <input
                style={s.input}
                type="number"
                step="0.01"
                value={formData.matricWeight || ""}
                onChange={(e) =>
                  updateField("matricWeight", parseFloat(e.target.value))
                }
              />
            </div>
            <div>
              <label style={s.label}>FSc Weight</label>
              <input
                style={s.input}
                type="number"
                step="0.01"
                value={formData.fscWeight || ""}
                onChange={(e) =>
                  updateField("fscWeight", parseFloat(e.target.value))
                }
              />
            </div>
            <div>
              <label style={s.label}>Test Weight</label>
              <input
                style={s.input}
                type="number"
                step="0.01"
                value={formData.testWeight || ""}
                onChange={(e) =>
                  updateField("testWeight", parseFloat(e.target.value))
                }
              />
            </div>
          </div>
          <p
            style={{
              fontSize: 12,
              color: totalWeight === "1.00" ? "#16a34a" : "#dc2626",
              fontWeight: 600,
            }}
          >
            Total: {totalWeight}{" "}
            {totalWeight === "1.00" ? "✅ (correct)" : "⚠️ (must equal 1.00)"}
          </p>
        </div>

        {/* Scholarships & Documents */}
        <div style={{ ...s.card, marginTop: 16 }}>
          <div style={s.sectionTitle}>📄 Scholarships & Documents</div>
          <div style={{ marginBottom: 16 }}>
            <label style={s.label}>Scholarships (comma separated)</label>
            <input
              style={s.input}
              value={(formData.scholarships || []).join(", ")}
              onChange={(e) =>
                updateField(
                  "scholarships",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
            />
          </div>
          <div>
            <label style={s.label}>Required Documents (comma separated)</label>
            <input
              style={s.input}
              value={(formData.requiredDocuments || []).join(", ")}
              onChange={(e) =>
                updateField(
                  "requiredDocuments",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
            />
          </div>
        </div>

        {/* Departments */}
        <div style={{ ...s.card, marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div style={s.sectionTitle}>
              🏛️ Departments ({formData.departments?.length || 0})
            </div>
            <button
              style={{
                ...s.btn,
                ...s.btnPrimary,
                padding: "8px 16px",
                fontSize: 13,
              }}
              onClick={addDept}
            >
              + Add Department
            </button>
          </div>

          {(formData.departments || []).map((dept, i) => (
            <div key={i} style={s.deptCard}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}
                >
                  Department {i + 1}
                </span>
                <button style={s.btnRed} onClick={() => removeDept(i)}>
                  ✕ Remove
                </button>
              </div>
              <div style={s.row2}>
                <div>
                  <label style={s.label}>Department Name *</label>
                  <input
                    style={s.input}
                    value={dept.name}
                    onChange={(e) => updateDept(i, "name", e.target.value)}
                    placeholder="e.g. BS Computer Science"
                  />
                </div>
                <div>
                  <label style={s.label}>Category</label>
                  <select
                    style={s.select}
                    value={dept.category}
                    onChange={(e) => updateDept(i, "category", e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label style={s.label}>Semester Fee (PKR)</label>
                  <input
                    style={s.input}
                    type="number"
                    value={dept.semesterFee}
                    onChange={(e) =>
                      updateDept(i, "semesterFee", e.target.value)
                    }
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label style={s.label}>Last Closing Merit %</label>
                  <input
                    style={s.input}
                    type="number"
                    step="0.1"
                    value={dept.lastMerit}
                    onChange={(e) => updateDept(i, "lastMerit", e.target.value)}
                    placeholder="75.5"
                  />
                </div>
                <div>
                  <label style={s.label}>Merit Seats</label>
                  <input
                    style={s.input}
                    type="number"
                    value={dept.meritSeats}
                    onChange={(e) =>
                      updateDept(i, "meritSeats", +e.target.value)
                    }
                  />
                </div>
                <div>
                  <label style={s.label}>Self-Finance Seats</label>
                  <input
                    style={s.input}
                    type="number"
                    value={dept.selfFinanceSeats}
                    onChange={(e) =>
                      updateDept(i, "selfFinanceSeats", +e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div
          style={{
            ...s.card,
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
              {formData.departments?.length || 0} departments · Status:{" "}
              <strong style={{ color: "#d97706" }}>Pending Approval</strong>
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>
              Will be visible on site after admin approves
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{ ...s.btn, ...s.btnGray }}
              onClick={() => setStep("search")}
            >
              Cancel
            </button>
            <button
              style={{ ...s.btn, ...s.btnGreen }}
              onClick={submitToBackend}
              disabled={totalWeight !== "1.00"}
            >
              ✅ Submit for Approval
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
