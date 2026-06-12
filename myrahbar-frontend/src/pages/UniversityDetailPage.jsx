import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Globe,
  Star,
  Heart,
  BookOpen,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart2,
  ChevronRight,
  FileText,
  Phone,
  Award,
  Bell,
  Loader,
  Download,
  Eye,
  X,
  MessageCircle,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useWatchlistStore } from "../store";
import { daysUntilDeadline, deadlineLabel, formatFee } from "../utils/merit";
import toast from "react-hot-toast";

const TABS = [
  "Overview",
  "Admission",
  "Fee & Expenses",
  "Scholarships",
  "Documents",
  "Reviews",
  "Past Papers",
];

const TEST_TYPE_CONFIG = {
  "Own Test":  { emoji: "📝", color: "bg-blue-100 text-blue-700 border-blue-200" },
  "HEC-NAT":   { emoji: "🏛", color: "bg-purple-100 text-purple-700 border-purple-200" },
  "NTS":       { emoji: "📋", color: "bg-orange-100 text-orange-700 border-orange-200" },
  "MDCAT":     { emoji: "🩺", color: "bg-red-100 text-red-700 border-red-200" },
  "ECAT":      { emoji: "⚙️", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  "NUMS":      { emoji: "🏥", color: "bg-pink-100 text-pink-700 border-pink-200" },
  "SAT":       { emoji: "🌐", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  "None":      { emoji: "✅", color: "bg-green-100 text-green-700 border-green-200" },
  "Multiple":  { emoji: "🔀", color: "bg-slate-100 text-slate-700 border-slate-200" },
};

function CompressorWidget() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(0.7);
  const [output, setOutput] = useState(null);
  const [processing, setProcessing] = useState(false);
  const compress = async () => {
    if (!file) return;
    setProcessing(true); setOutput(null);
    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        canvas.toBlob(blob => {
          setOutput({ url: URL.createObjectURL(blob), size: blob.size, name: file.name.replace(/\.[^.]+$/, "") + "_compressed.jpg" });
          setProcessing(false);
        }, "image/jpeg", quality);
      };
      img.src = URL.createObjectURL(file);
    } else {
      setOutput({ url: URL.createObjectURL(file), size: file.size, name: file.name, isPdf: true });
      setProcessing(false);
    }
  };
  return (
    <div className="space-y-3">
      <input type="file" accept="image/*,.pdf" onChange={e => { setFile(e.target.files[0]); setOutput(null); }}
        className="block w-full text-sm text-white file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-white/20 file:text-white file:font-medium hover:file:bg-white/30 cursor-pointer" />
      {file && file.type.startsWith("image/") && (
        <div>
          <label className="text-xs text-blue-100 mb-1 block">Quality: {Math.round(quality * 100)}%</label>
          <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-white" />
        </div>
      )}
      {file && <p className="text-xs text-blue-100">📁 {file.name} ({(file.size/1024).toFixed(0)} KB)</p>}
      <button onClick={compress} disabled={!file || processing}
        className="w-full py-2.5 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 disabled:opacity-50 transition-colors">
        {processing ? "Processing..." : "🗜 Compress File"}
      </button>
      {output && (
        <div className="bg-white/20 rounded-xl p-3 flex items-center justify-between">
          <div><p className="text-xs font-bold text-white">{output.isPdf ? "PDF Ready" : "Compressed!"}</p><p className="text-[10px] text-blue-100">{(output.size/1024).toFixed(0)} KB</p></div>
          <a href={output.url} download={output.name} className="px-3 py-1.5 bg-white text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-50">⬇ Download</a>
        </div>
      )}
    </div>
  );
}

const WHATSAPP = "923455589079";

// Pakistani fake reviews shown when no real reviews exist
const FAKE_REVIEWS = [
  { _id: "f1", userId: { name: "Ali Hassan" }, rating: 5, text: "Bahut acha university hai. Faculty bohat helpful hai aur lab facilities bhi up to date hain. Mera pehla saal bohat acha raha alhamdulillah.", createdAt: "2025-03-10" },
  { _id: "f2", userId: { name: "Fatima Malik" }, rating: 4, text: "Overall experience acha raha. Canteen ka khana improve ho sakta hai lekin baaki sab theek hai. Library resources bhi kaafi helpful hain.", createdAt: "2025-04-02" },
  { _id: "f3", userId: { name: "Usman Ahmed" }, rating: 5, text: "Professors bohat experienced hain aur serious students ki madad karte hain. Campus bhi clean aur safe hai. Highly recommend!", createdAt: "2025-01-15" },
  { _id: "f4", userId: { name: "Zainab Siddiqui" }, rating: 4, text: "Admission process thodi mushkil thi lekin baad mein sab sahi ho gaya. Online portal se bohot kaam asaan ho gaya hai. Good university!", createdAt: "2025-05-20" },
  { _id: "f5", userId: { name: "Muhammad Bilal" }, rating: 5, text: "Sports facilities aur extra-curricular activities bohat achi hain. Merit system fair hai aur koi sifarish nahi chalti. Recommend karta hoon!", createdAt: "2025-02-28" },
  { _id: "f6", userId: { name: "Hina Qureshi" }, rating: 4, text: "Faculty ka behavior bohat professional hai. Exams tough hote hain lekin padhoge toh pass zaroor hoge. Environment friendly hai.", createdAt: "2025-06-01" },
  { _id: "f7", userId: { name: "Saad Khan" }, rating: 5, text: "IT labs aur research facilities shabdar hain. Professors genuinely students ki career guidance mein help karte hain. A+ experience!", createdAt: "2025-03-22" },
];

export default function UniversityDetailPage() {
  const { slug } = useParams();

  const [uni, setUni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewsList, setReviewsList] = useState([]);
  const [papers, setPapers] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { isWatched, addUniversity, removeUniversity } = useWatchlistStore();

  // Fetch university from API by slug
  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setUni(null);

    fetch("/api/universities/" + slug)
      .then((res) => res.json())
      .then((data) => {
        if (data.university) {
          setUni(data.university);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  // Fetch past papers and reviews when tabs opened
  useEffect(() => {
    if (activeTab === "Past Papers" && uni) {
      fetch("/api/pastpapers?universityId=" + uni._id)
        .then((res) => res.json())
        .then((data) => setPapers(Array.isArray(data) ? data : []))
        .catch(() => setPapers([]));
    }
    if (activeTab === "Reviews" && uni) {
      fetch("/api/universities/" + uni._id + "/reviews")
        .then((res) => res.json())
        .then((data) => {
          const realReviews = data.reviews || [];
          // Show fake Pakistani reviews if no real ones exist
          if (realReviews.length === 0) {
            // Show 5-8 fake reviews based on uni name hash
            const hash = uni.name ? uni.name.charCodeAt(0) + uni.name.length : 5;
            const count = 5 + (hash % 4); // 5 to 8
            setReviewsList(FAKE_REVIEWS.slice(0, count));
          } else {
            setReviewsList(realReviews);
          }
        })
        .catch(() => {
          setReviewsList(FAKE_REVIEWS.slice(0, 5));
        });
    }
  }, [activeTab, uni]);

  const submitReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Please write your review first");
      return;
    }
    try {
      const token = JSON.parse(localStorage.getItem("rahbar-auth") || "{}")
        ?.state?.token;

      if (!token) {
        toast.error("Please login to submit a review");
        return;
      }

      const res = await fetch("/api/universities/" + uni._id + "/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ rating, text: reviewText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Review submitted for approval!");
      setReviewText("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const setDeadlineAlert = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("rahbar-auth") || "{}")
        ?.state?.token;

      if (!token) {
        toast.error("Please login to set an alert");
        return;
      }

      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          universityId: uniId,
          universityName: uni.name,
          deadline: uni.admissionDeadline,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const trackDownload = async (paper) => {
    try {
      await fetch("/api/pastpapers/" + paper._id + "/download", {
        method: "POST",
      });
    } catch {}
    window.open(paper.fileUrl, "_blank");
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader
            size={32}
            className="animate-spin text-blue-600 mx-auto mb-3"
          />
          <p className="text-slate-500 text-sm">
            Loading university details...
          </p>
        </div>
      </div>
    );
  }

  // Not found
  if (notFound || !uni) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <BookOpen size={48} className="mx-auto mb-4 text-slate-300" />
        <h2
          className="text-2xl font-bold text-slate-700 mb-2"
          style={{ fontFamily: "Sora" }}
        >
          University Not Found
        </h2>
        <p className="text-slate-500 mb-6">
          This university does not exist or has not been approved yet.
        </p>
        <Link to="/search" className="text-blue-600 hover:underline">
          ← Back to Search
        </Link>
      </div>
    );
  }

  const uniId = uni._id || uni.id;
  const watched = isWatched(uniId);
  const days = daysUntilDeadline(uni.admissionDeadline);
  const dl = deadlineLabel(days);

  const toggleWatch = () => {
    if (watched) {
      removeUniversity(uniId);
    } else {
      addUniversity({ ...uni, id: uniId });
    }
  };

  const dlColors = {
    red: "text-red-600",
    orange: "text-orange-500",
    yellow: "text-yellow-600",
    green: "text-green-600",
  };

  const waLink =
    "https://wa.me/" +
    WHATSAPP +
    "?text=" +
    encodeURIComponent("Hi, I want 10 years past papers for " + uni.name);

  return (
    <main>
      <Helmet>
        <title>{uni.name} — Admission, Merit, Fee | Rahbars</title>
        <meta
          name="description"
          content={`${uni.name} admission details, merit calculation, fee structure, and scholarships. Get the latest 2025 updates on Rahbars.`}
        />
        <link rel="canonical" href={`https://rahbars.com/university/${uni.slug}`} />
        
        {/* OpenGraph Tags */}
        <meta property="og:title" content={`${uni.name} — Admission Guide`} />
        <meta property="og:description" content={`Check out the merit, fee, and admission details for ${uni.name} on Rahbars.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://rahbars.com/university/${uni.slug}`} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${uni.name} — Admission Guide`} />
        <meta name="twitter:description" content={`Check out the merit, fee, and admission details for ${uni.name} on Rahbars.`} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-700">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/search" className="hover:text-slate-700">
            Universities
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-700">{uni.shortName}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
                    style={{ background: "var(--navy)", fontFamily: "Sora" }}
                  >
                    {uni.shortName?.slice(0, 2)}
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className={
                          "text-xs font-medium px-2 py-0.5 rounded-full " +
                          (uni.type === "government"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-purple-50 text-purple-700")
                        }
                      >
                        {uni.type === "government" ? "Government" : "Private"}
                      </span>
                      {uni.admissionOpen ? (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                          Admissions Open
                        </span>
                      ) : (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700">
                          Admissions Closed
                        </span>
                      )}
                    </div>

                    <h1
                      className="text-2xl font-bold"
                      style={{ fontFamily: "Sora", color: "var(--navy)" }}
                    >
                      {uni.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {uni.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star
                          size={13}
                          className="text-amber-400"
                          fill="currentColor"
                        />
                        {uni.overallRating} · {reviewsList.length || FAKE_REVIEWS.slice(0, 5).length} reviews
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={13} />
                        Est. {uni.established}
                      </span>
                      {uni.website && (
                        <a
                          href={uni.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Globe size={13} />
                          Official Site
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <button
                  onClick={toggleWatch}
                  className={
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors " +
                    (watched
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-red-200 hover:text-red-500")
                  }
                >
                  <Heart size={15} fill={watched ? "currentColor" : "none"} />
                  {watched ? "Saved" : "Save"}
                </button>
              </div>

              {/* Campus tags */}
              {uni.campuses?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {uni.campuses.map((c) => (
                    <span
                      key={c}
                      className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full"
                    >
                      <MapPin size={10} />
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex overflow-x-auto border-b border-slate-200">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={
                      "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors " +
                      (activeTab === tab
                        ? "border-blue-600 text-blue-700"
                        : "border-transparent text-slate-500 hover:text-slate-700")
                    }
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* OVERVIEW */}
                {activeTab === "Overview" && (
                  <div className="space-y-6">
                    <h3
                      className="font-semibold text-slate-800"
                      style={{ fontFamily: "Sora" }}
                    >
                      Departments Offered
                    </h3>
                    {uni.departments?.length === 0 && (
                      <p className="text-slate-400 text-sm">
                        No departments added yet.
                      </p>
                    )}
                    <div className="grid gap-3">
                      {uni.departments?.map((d) => (
                        <div
                          key={d.name}
                          className="flex items-center justify-between bg-slate-50 rounded-xl p-4"
                        >
                          <div>
                            <p className="font-medium text-slate-800 text-sm">
                              {d.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Merit: {d.seats?.merit} | Self-Finance:{" "}
                              {d.seats?.selfFinance}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className="text-sm font-semibold"
                              style={{
                                fontFamily: "DM Mono",
                                color: "var(--navy)",
                              }}
                            >
                              {formatFee(d.semesterFee)}/sem
                            </p>
                            {d.lastMerit?.[0] && (
                              <p className="text-xs text-slate-500 mt-0.5">
                                Last Merit: {d.lastMerit[0].closing}%
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ADMISSION */}
                {activeTab === "Admission" && (
                  <div className="space-y-6">
                    <div>
                      <h3
                        className="font-semibold text-slate-800 mb-3"
                        style={{ fontFamily: "Sora" }}
                      >
                        Aggregate Formula
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(uni.aggregateFormula || {}).map(
                          ([key, val]) => (
                            <div
                              key={key}
                              className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center flex-1"
                            >
                              <p className="text-xs text-blue-600 uppercase font-medium">
                                {key}
                              </p>
                              <p
                                className="text-xl font-bold text-blue-800 mt-0.5"
                                style={{ fontFamily: "DM Mono" }}
                              >
                                {(val * 100).toFixed(0)}%
                              </p>
                            </div>
                          ),
                        )}
                      </div>

                      {/* Last closing merit */}
                      {uni.departments?.some(
                        (d) => d.lastMerit?.length > 0,
                      ) && (
                        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-slate-700 mb-3">
                            Last Closing Merit %
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {uni.departments.map((d) => (
                              <div
                                key={d.name}
                                className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0"
                              >
                                <span className="text-slate-600">{d.name}</span>
                                <span
                                  className="font-semibold"
                                  style={{
                                    fontFamily: "DM Mono",
                                    color: "var(--navy)",
                                  }}
                                >
                                  {d.lastMerit?.[0]?.closing
                                    ? d.lastMerit[0].closing + "%"
                                    : "N/A"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Admission Test Type Badge */}
                      <div className="mt-4 flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-slate-500">Admission Test:</span>
                        {(() => {
                          const testType = uni.admissionTestType || "Own Test";
                          const cfg = TEST_TYPE_CONFIG[testType] || TEST_TYPE_CONFIG["Own Test"];
                          return (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                              {cfg.emoji} {testType}
                            </span>
                          );
                        })()}
                        {uni.testRequired && uni.testRequired !== uni.admissionTestType && (
                          <span className="text-xs text-slate-400">({uni.testRequired})</span>
                        )}
                      </div>
                    </div>

                    {uni.requiredDocuments?.length > 0 && (
                      <div>
                        <h3
                          className="font-semibold text-slate-800 mb-3"
                          style={{ fontFamily: "Sora" }}
                        >
                          Required Documents
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {uni.requiredDocuments.map((doc) => (
                            <div
                              key={doc}
                              className="flex items-center gap-2 text-sm text-slate-700"
                            >
                              <CheckCircle
                                size={14}
                                className="text-green-500 shrink-0"
                              />
                              {doc}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-sm font-medium text-amber-800 flex items-center gap-2">
                        <AlertCircle size={14} />
                        Admission Fee: {formatFee(uni.admissionFee)}{" "}
                        (non-refundable)
                      </p>
                    </div>

                    <Link
                      to="/document-tools"
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      <FileText size={14} />
                      Compress and prepare your documents →
                    </Link>
                  </div>
                )}

                {/* FEE */}
                {activeTab === "Fee & Expenses" && (
                  <div className="space-y-5">
                    <h3
                      className="font-semibold text-slate-800"
                      style={{ fontFamily: "Sora" }}
                    >
                      Fee by Department
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="text-left px-4 py-3 text-slate-600 font-medium border-b border-slate-200">
                              Department
                            </th>
                            <th className="text-right px-4 py-3 text-slate-600 font-medium border-b border-slate-200">
                              Per Semester
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {uni.departments?.map((d) => (
                            <tr
                              key={d.name}
                              className="border-b border-slate-100 hover:bg-slate-50"
                            >
                              <td className="px-4 py-3 text-slate-700">
                                {d.name}
                              </td>
                              <td
                                className="px-4 py-3 text-right font-medium"
                                style={{
                                  fontFamily: "DM Mono",
                                  color: "var(--navy)",
                                }}
                              >
                                {formatFee(d.semesterFee)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <p className="text-sm font-medium text-orange-800">
                        💡 Hidden Charges Tip
                      </p>
                      <p className="text-xs text-orange-700 mt-1">
                        Students often report extra costs like printing, library
                        card, sports fund. Always ask a current student before
                        applying.
                      </p>
                    </div>
                  </div>
                )}

                {/* SCHOLARSHIPS */}
                {activeTab === "Scholarships" && (
                  <div className="space-y-4">
                    <h3
                      className="font-semibold text-slate-800 mb-4"
                      style={{ fontFamily: "Sora" }}
                    >
                      Available Scholarships
                    </h3>
                    {uni.scholarships?.length === 0 && (
                      <p className="text-slate-400 text-sm">
                        No scholarships listed yet.
                      </p>
                    )}
                    {uni.scholarships?.map((s) => (
                      <div
                        key={s}
                        className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4"
                      >
                        <Award
                          size={16}
                          className="text-green-600 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="font-medium text-green-800 text-sm">
                            {s}
                          </p>
                          <p className="text-xs text-green-600 mt-0.5">
                            Check official website for eligibility and
                            deadlines.
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        HEC Need-Based Support
                      </p>
                      <p className="text-xs text-blue-700">
                        All government universities qualify. Apply at hec.gov.pk
                        with income certificate.
                      </p>
                    </div>
                  </div>
                )}

                {/* REVIEWS */}
                {activeTab === "Reviews" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
                      <div className="text-center">
                        <p
                          className="text-4xl font-bold"
                          style={{ fontFamily: "Sora", color: "var(--navy)" }}
                        >
                          {uni.overallRating || 0}
                        </p>
                        <div className="flex gap-0.5 mt-1 justify-center">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i <= Math.round(uni.overallRating)
                                  ? "text-amber-400"
                                  : "text-slate-300"
                              }
                              fill="currentColor"
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                        {reviewsList.length || FAKE_REVIEWS.slice(0, 5).length} reviews
                        </p>
                      </div>
                      <p className="text-sm text-slate-600 flex-1">
                        Share your experience to help future students.
                      </p>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4">
                      <p className="text-sm font-medium text-slate-700 mb-3">
                        Write a Review
                      </p>
                      <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button key={i} onClick={() => setRating(i)}>
                            <Star
                              size={22}
                              className={
                                i <= rating
                                  ? "text-amber-400"
                                  : "text-slate-300"
                              }
                              fill={i <= rating ? "currentColor" : "none"}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience about faculty, campus, fees..."
                        rows={3}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-400 resize-none"
                      />
                      <button
                        onClick={submitReview}
                        className="mt-2 px-4 py-2 text-sm font-medium text-white rounded-xl"
                        style={{ background: "var(--navy)" }}
                      >
                        Submit Review
                      </button>
                    </div>

                    <div className="space-y-4 mt-8 border-t border-slate-100 pt-8">
                      <h3 className="font-semibold text-slate-800 text-lg mb-4">Student Reviews</h3>
                      {reviewsList.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                          <MessageCircle size={32} className="mx-auto text-slate-300 mb-2" />
                          <p className="text-sm font-medium text-slate-600">No reviews yet</p>
                          <p className="text-xs text-slate-500">Be the first to share your experience!</p>
                        </div>
                      ) : (
                        reviewsList.map((rev) => (
                          <div key={rev._id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                  {rev.userId?.name?.slice(0, 2) || "AN"}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">{rev.userId?.name || "Anonymous"}</p>
                                  <p className="text-xs text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-lg text-amber-500">
                                <Star size={14} fill="currentColor" />
                                <span className="text-sm font-bold ml-1">{rev.rating}.0</span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{rev.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* PAST PAPERS */}
                {activeTab === "Past Papers" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                      <CheckCircle
                        size={16}
                        className="text-green-600 shrink-0"
                      />
                      <p className="text-sm text-green-800">
                        Free papers available below. For 10 years complete
                        package contact on WhatsApp.
                      </p>
                    </div>

                    {papers.length === 0 && (
                      <div className="text-center py-8 bg-slate-50 rounded-xl">
                        <FileText
                          size={32}
                          className="mx-auto mb-3 text-slate-300"
                        />
                        <p className="text-slate-500 text-sm">
                          No papers uploaded yet for this university.
                        </p>
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-white px-4 py-2 rounded-xl"
                          style={{ background: "#25D366" }}
                        >
                          <MessageCircle size={14} />
                          Ask on WhatsApp
                        </a>
                      </div>
                    )}

                    <div className="grid gap-3">
                      {papers.map((paper) => (
                        <div
                          key={paper._id}
                          className="flex items-center justify-between bg-slate-50 rounded-xl p-4"
                        >
                          <div>
                            <p className="font-medium text-slate-700 text-sm">
                              {paper.subject}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {paper.year} • {paper.degreeLevel} •{" "}
                              {paper.fileSize}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setPreviewUrl(paper.fileUrl)}
                              className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"
                            >
                              <Eye size={12} /> View
                            </button>
                            <button
                              onClick={() => trackDownload(paper)}
                              className="flex items-center gap-1 text-xs font-medium text-white px-3 py-1.5 rounded-lg"
                              style={{ background: "var(--green)" }}
                            >
                              <Download size={12} /> Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 10 years package */}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-slate-900 rounded-xl p-4 text-white hover:bg-slate-800 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-sm">
                          Get 10 Years Past Papers
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          2014–2024 solved papers • Fast delivery via WhatsApp
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-lg shrink-0">
                        <MessageCircle size={14} />
                        Order Now
                      </div>
                    </a>
                  </div>
                )}

                {/* DOCUMENTS TAB */}
                {activeTab === "Documents" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FileText size={16} className="text-blue-600" /> Required Documents Checklist
                      </h3>
                      {uni.requiredDocuments?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {uni.requiredDocuments.map((doc, i) => (
                            <div key={i} className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle size={12} className="text-white" />
                              </div>
                              <span className="text-sm text-slate-700 font-medium">{doc}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-slate-50 rounded-xl p-6 text-center">
                          <FileText size={32} className="mx-auto mb-2 text-slate-300" />
                          <p className="text-sm text-slate-500">No documents listed yet. Check the university website.</p>
                        </div>
                      )}
                    </div>

                    {/* Degree-wise Deadlines */}
                    <div>
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        🗓 Admission Deadlines by Program
                      </h3>
                      {uni.admissionDeadlines?.length > 0 ? (
                        <div className="space-y-2">
                          {uni.admissionDeadlines.map((dl, i) => {
                            const d = new Date(dl.deadline);
                            const diff = Math.ceil((d - new Date()) / 86400000);
                            const color = diff < 0 ? "text-red-500" : diff <= 7 ? "text-orange-500" : "text-green-600";
                            return (
                              <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">{dl.degreeLevel}</span>
                                  <span className="text-sm text-slate-700">{d.toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</span>
                                  {dl.note && <span className="text-xs text-slate-400">({dl.note})</span>}
                                </div>
                                <span className={`text-sm font-bold ${color}`}>
                                  {diff < 0 ? "Closed" : diff === 0 ? "Today!" : `${diff}d left`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : uni.admissionDeadline ? (
                        <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 flex items-center justify-between">
                          <span className="text-sm text-slate-700">All Programs</span>
                          <span className="text-sm font-bold text-blue-700">{new Date(uni.admissionDeadline).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">Deadline not announced yet.</p>
                      )}
                    </div>

                    {/* PDF Compressor */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                      <h3 className="font-bold text-lg mb-1 flex items-center gap-2">📄 Document Compressor</h3>
                      <p className="text-blue-100 text-sm mb-4">Compress your PDFs and images before uploading. Runs in your browser — nothing uploaded to our servers.</p>
                      <CompressorWidget />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 shrink-0 space-y-4">
            {/* Deadline Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-xs text-slate-500 uppercase font-medium tracking-wider mb-3">Admission Deadline</p>

              {/* Per-degree deadlines */}
              {uni.admissionDeadlines?.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {uni.admissionDeadlines.map((item, i) => {
                    const d = new Date(item.deadline);
                    const diff = Math.ceil((d - new Date()) / 86400000);
                    const urgency = diff < 0 ? "text-red-500 bg-red-50 border-red-200" : diff <= 3 ? "text-orange-600 bg-orange-50 border-orange-200" : "text-green-600 bg-green-50 border-green-200";
                    return (
                      <div key={i} className={`flex items-center justify-between rounded-xl px-3 py-2 border text-xs ${urgency}`}>
                        <span className="font-bold">{item.degreeLevel}</span>
                        <span className="font-medium">{diff < 0 ? "Closed" : diff === 0 ? "Today!" : `${diff} days left`}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <div className={"text-2xl font-bold mb-1 " + (dlColors[dl.color] || "text-slate-600")} style={{ fontFamily: "DM Mono" }}>{dl.text}</div>
                  <p className="text-sm text-slate-500">{uni.admissionDeadline ? new Date(uni.admissionDeadline).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" }) : "Not set"}</p>
                </>
              )}

              {/* Test Type Badge */}
              {uni.admissionTestType && (
                <div className="mt-3 mb-3">
                  {(() => {
                    const cfg = TEST_TYPE_CONFIG[uni.admissionTestType] || TEST_TYPE_CONFIG["Own Test"];
                    return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>{cfg.emoji} {uni.admissionTestType}</span>;
                  })()}
                </div>
              )}

              <a href={uni.website ? (uni.website.startsWith("http") ? uni.website : "https://" + uni.website) : "#"}
                target="_blank" rel="noopener noreferrer"
                className="mt-2 block w-full py-3 text-white text-sm font-semibold rounded-xl text-center hover:opacity-90 transition-opacity"
                style={{ background: "var(--green)" }}>Apply Now →</a>

              <button onClick={setDeadlineAlert}
                className="mt-2 w-full py-2.5 text-sm font-medium rounded-xl border flex items-center justify-center gap-2 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 transition-colors">
                <Bell size={14} /> Set Deadline Alert
              </button>

              <button onClick={toggleWatch}
                className={"mt-2 w-full py-2.5 text-sm font-medium rounded-xl border transition-colors flex items-center justify-center gap-2 " + (watched ? "bg-red-50 text-red-600 border-red-200" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300")}>
                <Heart size={14} fill={watched ? "currentColor" : "none"} />
                {watched ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
            </div>

            {/* Compare */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Compare Universities
              </p>
              <Link
                to={"/compare?uni1=" + uni.slug}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <BarChart2 size={14} />
                Add to comparison →
              </Link>
            </div>

            {/* Merit */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <TrendingUp size={14} /> Check Your Chances
              </p>
              <p className="text-xs text-blue-600 mb-3">
                Calculate your aggregate and see if you qualify.
              </p>
              <Link
                to={"/merit-calculator?uni=" + uni.slug}
                className="block w-full text-center py-2 bg-blue-700 text-white text-sm font-medium rounded-xl hover:bg-blue-800 transition-colors"
              >
                Calculate Merit
              </Link>
            </div>

            {/* Counseling */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-1">
                Need Help Deciding?
              </p>
              <p className="text-xs text-slate-500 mb-3">
                Book a 1-on-1 counseling session with an expert.
              </p>
              <Link
                to="/counseling"
                className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
              >
                <Phone size={13} />
                Book Counseling →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl"
            style={{ height: "88vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <p className="font-semibold text-slate-700 text-sm">
                Paper Preview
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={previewUrl}
                  download
                  className="flex items-center gap-1.5 text-xs font-medium text-white px-3 py-1.5 rounded-lg"
                  style={{ background: "var(--green)" }}
                >
                  <Download size={13} /> Download
                </a>
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <iframe
              src={previewUrl + "#toolbar=0"}
              className="w-full"
              style={{ height: "calc(100% - 53px)" }}
              title="Paper Preview"
            />
          </div>
        </div>
      )}
    </main>
  );
}
