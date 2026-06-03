import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  FileText,
  Search,
  Lock,
  MessageCircle,
  Download,
  Eye,
  X,
  BookOpen,
  Loader,
} from "lucide-react";

const WHATSAPP = "923455589079";

export default function PastPapersPage() {
  const [universities, setUniversities] = useState([]);
  const [selectedUni, setSelectedUni] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loadingUnis, setLoadingUnis] = useState(true);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Load universities from API on page load
  useEffect(() => {
    fetch("/api/universities")
      .then((res) => res.json())
      .then((data) => {
        setUniversities(data.universities || []);
        setLoadingUnis(false);
      })
      .catch(() => setLoadingUnis(false));
  }, []);

  // Load papers when university selected
  useEffect(() => {
    if (!selectedUni) {
      setPapers([]);
      return;
    }

    setLoadingPapers(true);
    fetch("/api/pastpapers?universityId=" + selectedUni._id)
      .then((res) => res.json())
      .then((data) => {
        setPapers(Array.isArray(data) ? data : []);
        setLoadingPapers(false);
      })
      .catch(() => {
        setPapers([]);
        setLoadingPapers(false);
      });
  }, [selectedUni]);

  // Track download click
  const handleDownload = async (paper) => {
    try {
      await fetch("/api/pastpapers/" + paper._id + "/download", {
        method: "POST",
      });
    } catch {}
    window.open(paper.fileUrl, "_blank");
  };

  // Filter universities by search text
  const filtered = universities.filter(
    (u) =>
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.shortName?.toLowerCase().includes(searchText.toLowerCase()),
  );

  // WhatsApp message with university name
  const waLink =
    "https://wa.me/" +
    WHATSAPP +
    "?text=" +
    encodeURIComponent(
      "Hi, I want to buy 10 years past papers for " +
        (selectedUni?.name || "a university"),
    );

  return (
    <>
      <Helmet>
        <title>Past Papers — University Entry Test Papers | MyRahbar</title>
        <meta
          name="description"
          content="Download university entry test past papers for Karachi universities. Free papers available to download."
        />
      </Helmet>

      {/* Page header */}
      <section
        className="py-14 border-b border-slate-200"
        style={{ background: "var(--bg)" }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-5 text-blue-600">
            <FileText size={28} />
          </div>
          <h1
            className="text-4xl font-black mb-3"
            style={{ fontFamily: "Sora", color: "var(--navy)" }}
          >
            University Past Papers
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Free entry test past papers for Karachi universities. 10 year
            packages available via WhatsApp.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar — university list */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden sticky top-20">
              <div className="p-4 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  Select University
                </p>
                <div className="flex items-center bg-slate-100 rounded-xl px-3 gap-2">
                  <Search size={14} className="text-slate-400 shrink-0" />
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search university..."
                    className="flex-1 bg-transparent py-2 text-sm outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
                {loadingUnis && (
                  <div className="flex items-center justify-center py-10">
                    <Loader size={20} className="text-slate-400 animate-spin" />
                  </div>
                )}

                {!loadingUnis && filtered.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-6 px-4">
                    No universities found
                  </p>
                )}

                {filtered.map((uni) => (
                  <button
                    key={uni._id}
                    onClick={() => setSelectedUni(uni)}
                    className={
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-slate-100 last:border-0 " +
                      (selectedUni?._id === uni._id
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-slate-50 text-slate-700")
                    }
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: "var(--navy)" }}
                    >
                      {uni.shortName?.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {uni.shortName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {uni.city}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — papers content */}
          <div className="flex-1 min-w-0">
            {/* No university selected */}
            {!selectedUni && (
              <div className="text-center py-20">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                <h3
                  className="text-xl font-bold text-slate-500 mb-2"
                  style={{ fontFamily: "Sora" }}
                >
                  Select a University
                </h3>
                <p className="text-slate-400 text-sm">
                  Choose a university from the list to see available past papers
                </p>

                {/* Quick select buttons */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {universities.slice(0, 6).map((u) => (
                    <button
                      key={u._id}
                      onClick={() => setSelectedUni(u)}
                      className="text-sm text-slate-600 border border-slate-200 bg-white px-4 py-2 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors"
                    >
                      {u.shortName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* University selected */}
            {selectedUni && (
              <div>
                {/* Header */}
                <div className="mb-6">
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: "Sora", color: "var(--navy)" }}
                  >
                    {selectedUni.name}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {loadingPapers
                      ? "Loading papers..."
                      : papers.length + " papers available"}
                  </p>
                </div>

                {/* Loading */}
                {loadingPapers && (
                  <div className="flex items-center justify-center py-16">
                    <Loader size={28} className="text-blue-600 animate-spin" />
                  </div>
                )}

                {/* No papers */}
                {!loadingPapers && papers.length === 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                    <FileText
                      size={40}
                      className="mx-auto mb-4 text-slate-300"
                    />
                    <h3 className="font-semibold text-slate-600 mb-2">
                      No papers uploaded yet
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                      Papers for this university have not been added yet.
                      Contact us on WhatsApp.
                    </p>
                    <a
                      href={
                        "https://wa.me/" +
                        WHATSAPP +
                        "?text=" +
                        encodeURIComponent(
                          "Hi, do you have past papers for " +
                            selectedUni.name +
                            "?",
                        )
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-xl"
                      style={{ background: "#25D366" }}
                    >
                      <MessageCircle size={15} />
                      Ask on WhatsApp
                    </a>
                  </div>
                )}

                {/* Papers list */}
                {!loadingPapers && papers.length > 0 && (
                  <div className="grid gap-4">
                    {papers.map((paper) => (
                      <div
                        key={paper._id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex items-start gap-3">
                            <div className="w-11 h-11 bg-red-100 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {paper.subject}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span
                                  className="text-sm font-medium"
                                  style={{
                                    fontFamily: "DM Mono",
                                    color: "var(--navy)",
                                  }}
                                >
                                  {paper.year}
                                </span>
                                {paper.degreeLevel && (
                                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                                    {paper.degreeLevel}
                                  </span>
                                )}
                                {paper.fileSize && (
                                  <span className="text-xs text-slate-400">
                                    {paper.fileSize}
                                  </span>
                                )}
                                <span className="text-xs text-slate-400">
                                  {paper.downloadCount || 0} downloads
                                </span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-medium">
                                  FREE
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => setPreviewUrl(paper.fileUrl)}
                              className="flex items-center gap-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition"
                            >
                              <Eye size={14} />
                              Preview
                            </button>
                            <button
                              onClick={() => handleDownload(paper)}
                              className="flex items-center gap-1.5 text-sm font-medium text-white px-4 py-2 rounded-xl transition"
                              style={{ background: "var(--green)" }}
                            >
                              <Download size={14} />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 10 years premium banner */}
                <div className="mt-8 bg-slate-900 rounded-2xl p-7 text-white relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 opacity-5">
                    <Lock size={120} />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div>
                      <div className="bg-yellow-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full w-max mb-3">
                        PREMIUM PACKAGE
                      </div>
                      <h3
                        className="text-xl font-bold mb-1"
                        style={{ fontFamily: "Sora" }}
                      >
                        Get 10 Years Past Papers
                      </h3>
                      <p className="text-slate-300 text-sm">
                        Complete 2014–2024 solved papers with answer keys. Fast
                        delivery via WhatsApp.
                      </p>
                    </div>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-xl transition"
                    >
                      <MessageCircle size={18} />
                      Order on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}
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
                  <Download size={13} />
                  Download
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
              title="Past Paper Preview"
            />
          </div>
        </div>
      )}
    </>
  );
}
