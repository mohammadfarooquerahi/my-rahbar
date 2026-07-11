import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  "Admission Guide", "Merit & Aggregate", "Entry Tests",
  "University Reviews", "Scholarships", "Career Guidance", "Student Life"
];

export default function AIBlogGenerator({ token }) {
  const [step, setStep] = useState("input"); // input | generating | review | saving | done | pending
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Admission Guide");
  const [keywords, setKeywords] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [trending, setTrending] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editSeoTitle, setEditSeoTitle] = useState("");
  const [editSeoDesc, setEditSeoDesc] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editFaqs, setEditFaqs] = useState([]);
  const [editTags, setEditTags] = useState("");
  const [error, setError] = useState("");
  const [savedBlogId, setSavedBlogId] = useState(null);
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [activeView, setActiveView] = useState("generate"); // generate | pending

  useEffect(() => {
    if (activeView === "pending") loadPendingBlogs();
  }, [activeView]);

  const loadPendingBlogs = async () => {
    setLoadingPending(true);
    try {
      const res = await fetch("/api/blogs?status=pending&limit=50", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPendingBlogs(data.blogs || []);
    } catch { } finally { setLoadingPending(false); }
  };

  const fetchTrending = async () => {
    setLoadingTrending(true);
    try {
      const API_BASE = import.meta.env.PROD ? "https://my-rahbar-production-45d9.up.railway.app" : "";
      const res = await fetch(`${API_BASE}/api/blogs/trending-topics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTrending(data.topics || []);
    } catch { setError("Could not load trending topics"); }
    finally { setLoadingTrending(false); }
  };

  const handleGenerate = async () => {
    if (!title.trim()) { setError("Please enter a blog title first."); return; }
    setError("");
    setStep("generating");
    try {
      const API_BASE = import.meta.env.PROD ? "https://my-rahbar-production-45d9.up.railway.app" : "";
      const res = await fetch(`${API_BASE}/api/blogs/ai-generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, category, keywords, additionalContext })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Generation failed");
      setGenerated(data.generated);
      setEditContent(data.generated.content || "");
      setEditSeoTitle(data.generated.seoTitle || title);
      setEditSeoDesc(data.generated.seoDescription || "");
      setEditExcerpt(data.generated.excerpt || "");
      setEditFaqs(data.generated.faqs || []);
      setEditTags((data.generated.tags || []).join(", "));
      setStep("review");
    } catch (e) {
      setError(e.message);
      setStep("input");
    }
  };

  const handleSaveDraft = async (publish = false) => {
    setStep("saving");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", editContent);
    formData.append("excerpt", editExcerpt);
    formData.append("category", category);
    formData.append("seoTitle", editSeoTitle);
    formData.append("seoDescription", editSeoDesc);
    formData.append("readTime", generated?.readTime || 8);
    formData.append("status", publish ? "published" : "pending");
    (editTags.split(",").map(t => t.trim()).filter(Boolean)).forEach(t => formData.append("tags[]", t));
    (generated?.keywords || []).forEach(k => formData.append("keywords[]", k));

    // Append FAQs as JSON string
    formData.append("faqs", JSON.stringify(editFaqs));

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");
      setSavedBlogId(data.blog?._id || data._id);
      setStep("done");
    } catch (e) {
      setError(e.message);
      setStep("review");
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/blogs/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Approval failed");
      loadPendingBlogs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`/api/blogs/${id}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Rejection failed");
      loadPendingBlogs();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetAll = () => {
    setStep("input"); setTitle(""); setKeywords(""); setAdditionalContext("");
    setGenerated(null); setError(""); setSavedBlogId(null); setCategory("Admission Guide");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <span className="text-2xl">🤖</span> AI Blog Generator
          </h2>
          <p className="text-sm text-slate-500 mt-1">Generate detailed, SEO-ready educational blogs in seconds using AI</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView("generate")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeView === "generate" ? "bg-blue-600 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            ✨ Generate Blog
          </button>
          <button
            onClick={() => { setActiveView("pending"); loadPendingBlogs(); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeView === "pending" ? "bg-orange-500 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            ⏳ Pending Approval {pendingBlogs.length > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">{pendingBlogs.length}</span>}
          </button>
        </div>
      </div>

      {/* ─── PENDING APPROVAL VIEW ─── */}
      {activeView === "pending" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-orange-50">
            <h3 className="font-bold text-orange-800">📋 Blogs Pending Your Approval</h3>
            <p className="text-xs text-orange-600 mt-0.5">Review AI-generated blogs before they go live on the website</p>
          </div>
          {loadingPending ? (
            <div className="p-10 text-center text-slate-400">Loading...</div>
          ) : pendingBlogs.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-bold text-slate-600">No blogs pending approval</p>
              <p className="text-sm text-slate-400 mt-1">All blogs have been reviewed!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingBlogs.map(b => (
                <div key={b._id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase">{b.category}</span>
                        <span className="text-[10px] text-slate-400">{b.readTime} min read</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug mb-1">{b.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{b.excerpt}</p>
                      {b.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {b.tags.slice(0, 4).map(t => (
                            <span key={t} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        to={`/blog/${b.slug}`}
                        target="_blank"
                        className="px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                      >
                        👁 Preview
                      </Link>
                      <button
                        onClick={() => handleReject(b._id)}
                        className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                      >
                        ✕ Reject
                      </button>
                      <button
                        onClick={() => handleApprove(b._id)}
                        className="px-4 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow transition-colors"
                      >
                        ✓ Approve & Publish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── GENERATE VIEW ─── */}
      {activeView === "generate" && (
        <>
          {/* Step: Done */}
          {step === "done" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Blog Saved Successfully!</h3>
              <p className="text-slate-500 mb-6">Your blog has been saved as <strong>Pending</strong> and is waiting for your approval before it goes live.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button onClick={() => { setActiveView("pending"); loadPendingBlogs(); }}
                  className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
                  ⏳ Review & Approve Now
                </button>
                <button onClick={resetAll}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                  ✨ Generate Another Blog
                </button>
              </div>
            </div>
          )}

          {/* Step: Generating */}
          {step === "generating" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-lg font-black text-slate-800 mb-2">AI is Writing Your Blog...</h3>
              <p className="text-slate-500 text-sm">Generating a detailed 1500+ word article with FAQs, SEO tags, and internal links. This takes about 15-30 seconds.</p>
              <div className="mt-6 bg-blue-50 rounded-xl p-4 text-xs text-blue-700 font-medium">
                📝 Topic: <strong>{title}</strong>
              </div>
            </div>
          )}

          {/* Step: Saving */}
          {step === "saving" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-lg font-black text-slate-800 mb-2">Saving Blog to Database...</h3>
            </div>
          )}

          {/* Step: Input */}
          {step === "input" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Form */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="font-black text-slate-800 mb-5 flex items-center gap-2">
                    <span>✏️</span> Blog Details
                  </h3>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                      ⚠️ {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Blog Title *</label>
                      <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. MDCAT 2025 Registration — Complete Step by Step Guide"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                        <select
                          value={category}
                          onChange={e => setCategory(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        >
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Keywords</label>
                        <input
                          value={keywords}
                          onChange={e => setKeywords(e.target.value)}
                          placeholder="MDCAT 2025, PMC test, MBBS admission"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Additional Context (Optional)</label>
                      <textarea
                        value={additionalContext}
                        onChange={e => setAdditionalContext(e.target.value)}
                        rows={3}
                        placeholder="Add any specific points you want covered, e.g. 'Include 2025 dates, focus on Karachi students, mention UHS university...'"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                      />
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={!title.trim()}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      ✨ Generate Full Blog with AI
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Trending Topics */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                    🔥 Trending Topics
                  </h3>
                  <button
                    onClick={fetchTrending}
                    disabled={loadingTrending}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
                  >
                    {loadingTrending ? "Loading..." : "↻ Load"}
                  </button>
                </div>
                {trending.length === 0 && !loadingTrending && (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-400 mb-3">Click "Load" to see trending Pakistani education topics</p>
                    <button onClick={fetchTrending} className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors">
                      Load Trending Topics
                    </button>
                  </div>
                )}
                <div className="space-y-2">
                  {trending.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => { setTitle(t.title); setCategory(t.category); }}
                      className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <div className="shrink-0 mt-0.5">
                          {t.hot ? <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">🔥 HOT</span>
                            : <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full">NEW</span>}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700 group-hover:text-blue-700 leading-snug">{t.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{t.category}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step: Review & Edit */}
          {step === "review" && generated && (
            <div className="space-y-5">
              {/* Top bar */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-black text-green-800 text-sm">Blog Generated Successfully!</p>
                    <p className="text-xs text-green-600">Review and edit the content below, then save or publish directly.</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={resetAll} className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    ✕ Start Over
                  </button>
                  <button onClick={() => handleSaveDraft(false)} className="px-4 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow transition-colors">
                    ⏳ Save for Approval
                  </button>
                  <button onClick={() => handleSaveDraft(true)} className="px-4 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow transition-colors">
                    🚀 Publish Directly
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                  ⚠️ {error}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Content Editor */}
                <div className="lg:col-span-2 space-y-5">
                  {/* Title */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <label className="block text-xs font-bold text-slate-700 mb-2">📌 Blog Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 transition-all" />
                  </div>

                  {/* Main Content */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <label className="block text-xs font-bold text-slate-700 mb-2">📝 Article Content (HTML)</label>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={20}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none focus:border-blue-400 transition-all resize-y font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5">You can edit the HTML directly. Bold text = &lt;strong&gt;, heading = &lt;h2&gt;</p>
                  </div>

                  {/* FAQs */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h4 className="font-black text-slate-800 text-sm mb-4">❓ FAQs (shown at bottom of article)</h4>
                    <div className="space-y-4">
                      {editFaqs.map((faq, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <div className="mb-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Q{i + 1} Question</label>
                            <input
                              value={faq.question}
                              onChange={e => {
                                const updated = [...editFaqs];
                                updated[i].question = e.target.value;
                                setEditFaqs(updated);
                              }}
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-300 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Answer</label>
                            <textarea
                              value={faq.answer}
                              onChange={e => {
                                const updated = [...editFaqs];
                                updated[i].answer = e.target.value;
                                setEditFaqs(updated);
                              }}
                              rows={2}
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-300 bg-white resize-none"
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setEditFaqs([...editFaqs, { question: "", answer: "" }])}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
                      >
                        + Add FAQ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: SEO Fields */}
                <div className="space-y-4">
                  {/* SEO Box */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h4 className="font-black text-slate-800 text-sm mb-4">🔍 SEO Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">SEO Title</label>
                        <input value={editSeoTitle} onChange={e => setEditSeoTitle(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-400 transition-all" />
                        <p className={`text-[10px] mt-1 ${editSeoTitle.length > 60 ? "text-red-500" : "text-slate-400"}`}>
                          {editSeoTitle.length}/60 chars
                        </p>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Meta Description</label>
                        <textarea value={editSeoDesc} onChange={e => setEditSeoDesc(e.target.value)}
                          rows={3}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-400 transition-all resize-none" />
                        <p className={`text-[10px] mt-1 ${editSeoDesc.length > 155 ? "text-red-500" : "text-slate-400"}`}>
                          {editSeoDesc.length}/155 chars
                        </p>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Excerpt</label>
                        <textarea value={editExcerpt} onChange={e => setEditExcerpt(e.target.value)}
                          rows={2}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-400 transition-all resize-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Tags (comma separated)</label>
                        <input value={editTags} onChange={e => setEditTags(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-400 transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Google Preview */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-3">Google Search Preview</p>
                    <div className="bg-white rounded-xl p-3 border border-slate-100">
                      <p className="text-blue-700 text-sm font-bold leading-snug line-clamp-1">{editSeoTitle || title}</p>
                      <p className="text-green-700 text-[10px] mt-0.5">rahbars.com/blog/...</p>
                      <p className="text-slate-600 text-[11px] mt-1 leading-relaxed line-clamp-2">{editSeoDesc}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button onClick={() => handleSaveDraft(true)}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2">
                      🚀 Publish Directly
                    </button>
                    <button onClick={() => handleSaveDraft(false)}
                      className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2">
                      ⏳ Save for Approval
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
