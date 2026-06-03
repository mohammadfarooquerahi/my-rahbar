import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  MapPin,
  Globe,
  Clock,
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
  Download,
  Eye,
  X,
  MessageCircle,
  Loader,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useWatchlistStore } from "../../store/index";
import { daysUntilDeadline, deadlineLabel, formatFee } from "../../utils/merit";
// import { daysUntilDeadline, deadlineLabel, formatFee } from "../utils/merit";

const TABS = [
  "Overview",
  "Admission",
  "Fee & Expenses",
  "Scholarships",
  "Reviews",
  "Past Papers",
];
const WHATSAPP = "923455589079";

export default function UniversityDetailPage() {
  const { slug } = useParams();
  const [uni, setUni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [papers, setPapers] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { isWatched, addUniversity, removeUniversity } = useWatchlistStore();

  // Fetch university from API
  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    fetch("/api/universities/" + slug)
      .then((res) => {
        if (!res.ok) throw new Error("not a found");
        return res.json();
      })
      .then((data) => {
        setUni(data.university);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  // Fetch past papers when Past Papers tab opened
  useEffect(() => {
    if (activeTab === "Past Papers" && uni) {
      fetch("/api/pastpapers?universityId=" + uni._id)
        .then((res) => res.json())
        .then((data) => setPapers(Array.isArray(data) ? data : []))
        .catch(() => setPapers([]));
    }
  }, [activeTab, uni]);

  // Submit review
  const submitReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Please write something in your review");
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
        body: JSON.stringify({ rating, text: reviewText, category: "overall" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Review submitted for approval!");
      setReviewText("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Set deadline alert
  const setAlert = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("rahbar-auth") || "{}")
        ?.state?.token;
      if (!token) {
        toast.error("Please login to set alerts");
        return;
      }
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          universityId: uni._id,
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

  // Download paper
  const handleDownload = async (paper) => {
    try {
      await fetch("/api/pastpapers/" + paper._id + "/download", {
        method: "POST",
      });
    } catch {}
    window.open(paper.fileUrl, "_blank");
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="skeleton h-48 rounded-2xl" />
            <div className="skeleton h-96 rounded-2xl" />
          </div>
          <div className="lg:w-72 space-y-4">
            <div className="skeleton h-48 rounded-2xl" />
            <div className="skeleton h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Not found state
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
          This university is not in our database yet or may not be approved.
        </p>
        <Link to="/search" className="text-blue-600 hover:underline">
          ← Back to Search
        </Link>
      </div>
    );
  }

  const uniId = uni._id;
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

  const dlColorClass = {
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
    <>
      <Helmet>
        <title>{uni.name} — Admission, Merit, Fee | MyRahbar</title>
        <meta
          name="description"
          content={
            uni.name +
            " admission details, merit, fee structure, scholarships and required documents."
          }
        />
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
                        {uni.overallRating || "—"} ({uni.reviewCount || 0}{" "}
                        reviews)
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

            {/* Tabs Navigation */}
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
                {/* OVERVIEW TAB */}
                {activeTab === "Overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3
                        className="font-semibold text-slate-800 mb-4"
                        style={{ fontFamily: "Sora" }}
                      >
                        Departments Offered
                      </h3>
                      {(!uni.departments || uni.departments.length === 0) && (
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
                                Merit: {d.seats?.merit || 0} | Self-Finance:{" "}
                                {d.seats?.selfFinance || 0}
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
                  </div>
                )}

                {/* ADMISSION TAB */}
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

                      {uni.departments?.some(
                        (d) => d.lastMerit?.length > 0,
                      ) && (
                        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-slate-800 mb-3">
                            Last Closing Merit
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {uni.departments.map((d) => (
                              <div
                                key={d.name}
                                className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0"
                              >
                                <span className="text-slate-600 truncate">
                                  {d.name}
                                </span>
                                <span
                                  className="font-medium text-slate-800 ml-2"
                                  style={{ fontFamily: "DM Mono" }}
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

                      <p className="text-sm text-slate-500 mt-3">
                        Test Required:{" "}
                        <span className="font-medium text-slate-700">
                          {uni.testRequired || "N/A"}
                        </span>
                      </p>
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

                {/* FEE & EXPENSES TAB */}
                {activeTab === "Fee & Expenses" && (
                  <div className="space-y-5">
                    <h3
                      className="font-semibold text-slate-800"
                      style={{ fontFamily: "Sora" }}
                    >
                      Fee by Department
                    </h3>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 text-slate-600 font-medium">
                              Department
                            </th>
                            <th className="text-right px-4 py-3 text-slate-600 font-medium">
                              Per Semester Fee
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {uni.departments?.map((d) => (
                            <tr key={d.name} className="hover:bg-slate-50/50">
                              <td className="px-4 py-3 text-slate-700 font-medium">
                                {d.name}
                              </td>
                              <td
                                className="px-4 py-3 text-right font-semibold text-slate-900"
                                style={{ fontFamily: "DM Mono" }}
                              >
                                {formatFee(d.semesterFee)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {uni.hostelAvailable && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4">
                        <p className="text-sm text-blue-800 font-medium">
                          🏡 Hostel Facility is available. Estimated charges:{" "}
                          <span className="font-bold">
                            {formatFee(uni.hostelFee)}/month
                          </span>
                          .
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* SCHOLARSHIPS TAB */}
                {activeTab === "Scholarships" && (
                  <div className="space-y-4">
                    <h3
                      className="font-semibold text-slate-800"
                      style={{ fontFamily: "Sora" }}
                    >
                      Available Scholarships
                    </h3>
                    {uni.scholarships?.length > 0 ? (
                      <div className="grid gap-3">
                        {uni.scholarships.map((s, idx) => (
                          <div
                            key={idx}
                            className="border border-slate-200 rounded-xl p-4 bg-slate-50/50"
                          >
                            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                              <Award size={16} className="text-amber-500" />{" "}
                              {s.name}
                            </h4>
                            <p className="text-sm text-slate-600 mt-1">
                              {s.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">
                        HEC Need-based and Merit-based scholarships are
                        generally applicable. Contact admission office for
                        specific details.
                      </p>
                    )}
                  </div>
                )}

                {/* REVIEWS TAB */}
                {activeTab === "Reviews" && (
                  <div className="space-y-6">
                    <h3
                      className="font-semibold text-slate-800"
                      style={{ fontFamily: "Sora" }}
                    >
                      Student Reviews
                    </h3>

                    {/* Add Review Form */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">
                        Write a Review
                      </h4>
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button key={num} onClick={() => setRating(num)}>
                            <Star
                              size={18}
                              className={
                                num <= rating
                                  ? "text-amber-400"
                                  : "text-slate-300"
                              }
                              fill={num <= rating ? "currentColor" : "none"}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        rows={3}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience about campus life, faculty, and scope..."
                        className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 resize-none bg-white"
                      />
                      <button
                        onClick={submitReview}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Submit Review
                      </button>
                    </div>

                    {/* Display Reviews */}
                    {uni.reviews?.length > 0 ? (
                      <div className="space-y-3">
                        {uni.reviews.map((r, i) => (
                          <div
                            key={i}
                            className="border-b border-slate-100 pb-3 last:border-0"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex text-amber-400">
                                {Array.from({ length: r.rating }).map(
                                  (_, idx) => (
                                    <Star
                                      key={idx}
                                      size={12}
                                      fill="currentColor"
                                    />
                                  ),
                                )}
                              </div>
                              <span className="text-xs font-medium text-slate-700">
                                {r.user?.name || "Anonymous"}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{r.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-4">
                        No reviews yet. Be the first to write one!
                      </p>
                    )}
                  </div>
                )}

                {/* PAST PAPERS TAB */}
                {activeTab === "Past Papers" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3
                        className="font-semibold text-slate-800"
                        style={{ fontFamily: "Sora" }}
                      >
                        Entry Test Past Papers
                      </h3>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <MessageCircle size={14} /> Request via WhatsApp
                      </a>
                    </div>

                    {papers.length > 0 ? (
                      <div className="grid gap-2">
                        {papers.map((paper) => (
                          <div
                            key={paper._id}
                            className="flex items-center justify-between border border-slate-200 rounded-xl p-3 bg-white hover:border-slate-300"
                          >
                            <div className="flex items-center gap-2.5">
                              <FileText
                                className="text-red-500 shrink-0"
                                size={18}
                              />
                              <div>
                                <p className="text-sm font-medium text-slate-800">
                                  {paper.title}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {paper.year} • {paper.fileType || "PDF"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDownload(paper)}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                              >
                                <Download size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-500 text-sm mb-2">
                          No official past papers uploaded yet.
                        </p>
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Click here to request 10 Years Past Papers package via
                          WhatsApp →
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0 space-y-5">
            {/* Admission Deadline Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Admission Schedule
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock
                    size={18}
                    className={dlColorClass[dl.color] || "text-slate-400"}
                  />
                  <div>
                    <p
                      className={`text-sm font-bold ${dlColorClass[dl.color] || "text-slate-700"}`}
                    >
                      {dl.text}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Last Date:{" "}
                      {uni.admissionDeadline
                        ? new Date(uni.admissionDeadline).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={setAlert}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                  >
                    <Bell size={14} /> Get Deadline Alert
                  </button>
                  {uni.applyLink && (
                    <a
                      href={uni.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors text-center"
                    >
                      Apply Online Official →
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                University Contact
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                {uni.phone && (
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" /> {uni.phone}
                  </p>
                )}
                {uni.address && (
                  <p className="flex items-start gap-2">
                    <MapPin
                      size={14}
                      className="text-slate-400 mt-0.5 shrink-0"
                    />{" "}
                    <span>{uni.address}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
