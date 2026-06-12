import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import UniversityDataCollector from "./UniversityDataCollector";
import AIBlogGenerator from "../components/admin/AIBlogGenerator";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  BookOpen,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  LogOut,
  Eye,
  Bell,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Send,
  AlertCircle,
  CheckSquare,
  Loader,
} from "lucide-react";

import { useAuthStore } from "../store";

const TABS = [
  "Dashboard",
  "Universities",
  "Add University",
  "AI Collect",
  "Upload Excel",
  "Reviews",
  "Error Logs",
  "Bookings",
  "Past Papers",
  "Blogs",
  "AI Blog Generator",
  "News",
];

const EMPTY_UNI = {
  name: "",
  slug: "",
  shortName: "",
  type: "government",
  city: "Karachi",
  established: "",
  website: "",
  admissionOpen: true,
  admissionDeadline: "",
  admissionDeadlines: [],
  admissionTestType: "Own Test",
  testRequired: "",
  admissionFee: "",
  hostelAvailable: false,
  hostelFee: "",
  messFee: "",
  aggregateFormula: { matric: 0.1, fsc: 0.4, test: 0.5 },
  scholarships: "",
  requiredDocuments: "",
  departments: [],
};


const EMPTY_DEPT = {
  name: "",
  category: "CS",
  semesterFee: "",
  seats: { merit: 0, selfFinance: 0 },
  lastMerit: [{ year: 2024, closing: "" }],
};

export default function AdminPage() {
  const { user, isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Universities");
  const [unis, setUnis] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUni, setEditingUni] = useState(null);
  const [uniForm, setUniForm] = useState(EMPTY_UNI);
  const [deptForm, setDeptForm] = useState(EMPTY_DEPT);
  const [departments, setDepartments] = useState([]);
  const [msg, setMsg] = useState("");
  const [expandedUni, setExpandedUni] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [errorLogs, setErrorLogs] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [pastPapers, setPastPapers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [news, setNews] = useState([]);
  const [excelPreview, setExcelPreview] = useState(null);
  const [excelImportResult, setExcelImportResult] = useState(null);
  const [uniFilter, setUniFilter] = useState("all"); // 'all', 'pending', 'approved'
  const [paperForm, setPaperForm] = useState({
    universityId: "",
    year: "2024",
    subject: "",
    degreeLevel: "Bachelors",
    file: null,
  });
  const [blogForm, setBlogForm] = useState({
    title: "", content: "", excerpt: "", category: "Admission Guide",
    tags: "", keywords: "", seoTitle: "", seoDescription: "",
    status: "published", coverColor: "#EFF6FF", readTime: 5, file: null,
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    type: "news",
    priority: "medium",
    isActive: true,
    expiresAt: "",
  });

  const token = JSON.parse(localStorage.getItem("rahbar-auth") || "{}")?.state
    ?.token;

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  const handleUploadPaper = async (e) => {
    e.preventDefault();
    if (!paperForm.file) return showMsg("File is required");
    const formData = new FormData();
    formData.append("universityId", paperForm.universityId);
    formData.append("year", paperForm.year);
    formData.append("subject", paperForm.subject);
    formData.append("degreeLevel", paperForm.degreeLevel);
    formData.append("file", paperForm.file);
    setLoading(true);
    try {
      const res = await fetch("/api/pastpapers/upload", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });
      if (!res.ok) throw new Error((await res.json()).message);
      showMsg("Past paper uploaded");
      setPaperForm({
        universityId: "",
        year: "2024",
        subject: "",
        degreeLevel: "Bachelors",
        file: null,
      });
      loadData();
    } catch (err) {
      showMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", blogForm.title);
    formData.append("content", blogForm.content);
    formData.append("excerpt", blogForm.excerpt || blogForm.content.replace(/<[^>]*>/g,'').substring(0,160));
    formData.append("category", blogForm.category);
    formData.append("tags", blogForm.tags);
    formData.append("keywords", blogForm.keywords);
    formData.append("seoTitle", blogForm.seoTitle || blogForm.title);
    formData.append("seoDescription", blogForm.seoDescription || blogForm.excerpt);
    formData.append("status", blogForm.status);
    formData.append("coverColor", blogForm.coverColor);
    formData.append("readTime", blogForm.readTime);
    if (blogForm.file) formData.append("featuredImage", blogForm.file);
    setLoading(true);
    try {
      const url = editingBlog ? `/api/blogs/${editingBlog._id}` : "/api/blogs";
      const method = editingBlog ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { Authorization: "Bearer " + token }, body: formData });
      if (!res.ok) throw new Error((await res.json()).message);
      showMsg(editingBlog ? "Blog updated!" : "Blog created!");
      setBlogForm({ title: "", content: "", excerpt: "", category: "Admission Guide", tags: "", keywords: "", seoTitle: "", seoDescription: "", status: "published", coverColor: "#EFF6FF", readTime: 5, file: null });
      setEditingBlog(null);
      loadData();
    } catch (err) { showMsg(err.message); }
    finally { setLoading(false); }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete this blog? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
      if (!res.ok) throw new Error((await res.json()).message);
      showMsg("Blog deleted");
      loadData();
    } catch (err) { showMsg(err.message); }
  };

  const handleToggleBlogStatus = async (blog) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      const res = await fetch(`/api/blogs/${blog._id}`, { method: "PUT", headers: { Authorization: "Bearer " + token }, body: formData });
      if (!res.ok) throw new Error((await res.json()).message);
      showMsg(`Blog ${newStatus === "published" ? "published" : "set to draft"}`);
      loadData();
    } catch (err) { showMsg(err.message); }
  };

  const handleSeedBlogs = async () => {
    if (!window.confirm("Seed 20 educational blogs? Existing seeded blogs will be replaced.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/blogs/seed", { method: "POST", headers: { Authorization: "Bearer " + token } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showMsg(`✅ Seeded ${data.blogs?.length || 20} blogs successfully!`);
      loadData();
    } catch (err) { showMsg(err.message); }
    finally { setLoading(false); }
  };

  const startEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title, content: blog.content, excerpt: blog.excerpt || "",
      category: blog.category, tags: (blog.tags || []).join(", "),
      keywords: (blog.keywords || []).join(", "),
      seoTitle: blog.seoTitle || "", seoDescription: blog.seoDescription || "",
      status: blog.status, coverColor: blog.coverColor || "#EFF6FF",
      readTime: blog.readTime || 5, file: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateNews = async () => {
    if (!newsForm.title.trim() || !newsForm.content.trim())
      return showMsg("Title and content are required.");
    setLoading(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(newsForm),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      showMsg("News created successfully");
      setNewsForm({
        title: "",
        content: "",
        type: "news",
        priority: "medium",
        isActive: true,
        expiresAt: "",
      });
      loadData();
    } catch (err) {
      showMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNews = async () => {
    if (!newsForm.title.trim() || !newsForm.content.trim())
      return showMsg("Title and content are required.");
    setLoading(true);
    try {
      const res = await fetch("/api/news/" + newsForm._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(newsForm),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      showMsg("News updated successfully");
      setNewsForm({
        title: "",
        content: "",
        type: "news",
        priority: "medium",
        isActive: true,
        expiresAt: "",
      });
      loadData();
    } catch (err) {
      showMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNewsActive = async (item) => {
    try {
      const res = await fetch("/api/news/" + item._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      showMsg(item.isActive ? "Unpublished" : "Published");
      loadData();
    } catch {
      showMsg("Failed to toggle status.");
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("Delete this news item?")) return;
    try {
      const res = await fetch("/api/news/" + id, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("Delete failed");
      showMsg("News deleted");
      loadData();
    } catch {
      showMsg("Failed to delete.");
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        navigate("/auth/login");
        return;
      }
      if (user?.role !== "admin") navigate("/");
    }, 300);
    return () => clearTimeout(timer);
  }, [isLoggedIn, user, navigate]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "Universities") {
        const res = await fetch("/api/admin/universities", { headers });
        const data = await res.json();
        setUnis(data.universities || []);
      }
      if (activeTab === "Reviews") {
        const res = await fetch("/api/admin/reviews", { headers });
        const data = await res.json();
        setReviews(data.reviews || []);
      }
      if (activeTab === "Bookings") {
        const res = await fetch("/api/admin/bookings", { headers });
        const data = await res.json();
        setBookings(data.bookings || []);
      }
      if (activeTab === "Dashboard") {
        const res = await fetch("/api/admin/dashboard", { headers });
        const data = await res.json();
        setDashboardStats(data);
      }
      if (activeTab === "Error Logs") {
        const res = await fetch("/api/admin/error-logs", { headers });
        const data = await res.json();
        setErrorLogs(data || []);
      }
      if (activeTab === "Past Papers") {
        const res = await fetch("/api/pastpapers", { headers });
        const data = await res.json();
        setPastPapers(data || []);
      }
      if (activeTab === "Blogs") {
        const res = await fetch("/api/blogs", { headers });
        const data = await res.json();
        setBlogs(data.blogs || []);
      }
      if (activeTab === "News") {
        const res = await fetch("/api/news", { headers });
        const data = await res.json();
        setNews(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // University actions
  const approveUni = async (id) => {
    await fetch("/api/admin/universities/" + id + "/approve", {
      method: "PUT",
      headers,
    });
    showMsg("University approved and is now live");
    loadData();
  };

  const rejectUni = async (id) => {
    await fetch("/api/admin/universities/" + id + "/reject", {
      method: "PUT",
      headers,
    });
    showMsg("University rejected");
    loadData();
  };

  const deleteUni = async (id) => {
    if (!window.confirm("Delete this university?")) return;
    await fetch("/api/admin/universities/" + id, { method: "DELETE", headers });
    showMsg("University deleted");
    loadData();
  };

  // Start editing a university
  const startEdit = (uni) => {
    setEditingUni(uni._id);
    setUniForm({
      name: uni.name,
      slug: uni.slug,
      shortName: uni.shortName,
      type: uni.type,
      city: uni.city,
      established: uni.established,
      website: uni.website,
      admissionOpen: uni.admissionOpen,
      admissionDeadline: uni.admissionDeadline
        ? new Date(uni.admissionDeadline).toISOString().split("T")[0]
        : "",
      admissionDeadlines: uni.admissionDeadlines || [],
      admissionTestType: uni.admissionTestType || "Own Test",
      testRequired: uni.testRequired,
      admissionFee: uni.admissionFee,
      hostelAvailable: uni.hostelAvailable,
      hostelFee: uni.hostelFee || "",
      messFee: uni.messFee || "",
      aggregateFormula: uni.aggregateFormula,
      scholarships: uni.scholarships?.join(", ") || "",
      requiredDocuments: uni.requiredDocuments?.join(", ") || "",
    });
    setDepartments(uni.departments || []);
    setActiveTab("Add University");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Save university (create or update)
  const saveUniversity = async () => {
    if (!uniForm.name || !uniForm.slug || !uniForm.shortName) {
      showMsg("Name, slug and short name are required");
      return;
    }

    const payload = {
      ...uniForm,
      established: parseInt(uniForm.established) || 0,
      admissionFee: parseInt(uniForm.admissionFee) || 0,
      hostelFee: parseInt(uniForm.hostelFee) || null,
      messFee: parseInt(uniForm.messFee) || null,
      scholarships: uniForm.scholarships
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      requiredDocuments: uniForm.requiredDocuments
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      departments,
      status: "approved",
    };

    try {
      let res;
      if (editingUni) {
        res = await fetch("/api/admin/universities/" + editingUni, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/universities", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showMsg(
        editingUni
          ? "University updated successfully"
          : "University added successfully",
      );
      setUniForm(EMPTY_UNI);
      setDepartments([]);
      setEditingUni(null);
      setActiveTab("Universities");
      loadData();
    } catch (err) {
      showMsg("Error: " + err.message);
    }
  };

  // Add department to list
  const addDepartment = () => {
    if (!deptForm.name) {
      showMsg("Department name is required");
      return;
    }
    setDepartments((prev) => [
      ...prev,
      {
        ...deptForm,
        semesterFee: parseInt(deptForm.semesterFee) || 0,
        seats: {
          merit: parseInt(deptForm.seats.merit) || 0,
          selfFinance: parseInt(deptForm.seats.selfFinance) || 0,
        },
        lastMerit: deptForm.lastMerit[0].closing
          ? [
              {
                year: parseInt(deptForm.lastMerit[0].year),
                closing: parseFloat(deptForm.lastMerit[0].closing),
              },
            ]
          : [],
      },
    ]);
    setDeptForm(EMPTY_DEPT);
    showMsg("Department added");
  };

  const removeDept = (index) => {
    setDepartments((prev) => prev.filter((_, i) => i !== index));
  };

  // Review actions
  const approveReview = async (id) => {
    await fetch("/api/admin/reviews/" + id + "/approve", {
      method: "PUT",
      headers,
    });
    showMsg("Review approved");
    loadData();
  };

  const rejectReview = async (id) => {
    await fetch("/api/admin/reviews/" + id + "/reject", {
      method: "PUT",
      headers,
    });
    showMsg("Review rejected");
    loadData();
  };

  const statusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={
          "text-xs font-medium px-2 py-0.5 rounded-full " +
          (map[status] || map.pending)
        }
      >
        {status}
      </span>
    );
  };

  const handleExcelPreview = async (e) => {
    e.preventDefault();
    if (!excelFile) { showMsg("Please select an Excel file first"); return; }
    const formData = new FormData();
    formData.append("file", excelFile);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/preview-excel", { method: "POST", headers: { Authorization: "Bearer " + token }, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setExcelPreview(data);
    } catch (err) { showMsg("Preview error: " + err.message); }
    finally { setLoading(false); }
  };

  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) { showMsg("Please select an Excel file first"); return; }
    const formData = new FormData();
    formData.append("file", excelFile);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/upload-excel", { method: "POST", headers: { Authorization: "Bearer " + token }, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showMsg(data.message || `Import done!`);
      setExcelFile(null); setExcelPreview(null); setExcelImportResult(data);
    } catch (err) { showMsg("Error: " + err.message); }
    finally { setLoading(false); }
  };


  const updateFormula = (key, val) => {
    setUniForm((prev) => ({
      ...prev,
      aggregateFormula: {
        ...prev.aggregateFormula,
        [key]: parseFloat(val) || 0,
      },
    }));
  };

  if (!isLoggedIn || user?.role !== "admin") return null;

  return (
    <>
      <Helmet>
        <title>Admin Panel | Rahbars</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: "var(--navy)" }}
            >
              <Shield size={18} />
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "Sora", color: "var(--navy)" }}
              >
                Admin Panel
              </h1>
              <p className="text-slate-500 text-sm">
                Logged in as {user?.name}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="text-sm text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              View Site
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>

        {/* Success message */}
        {msg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
            {msg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Universities",
              value: unis.length,
              icon: <BookOpen size={16} />,
              color: "text-blue-600 bg-blue-50",
            },
            {
              label: "Pending",
              value: unis.filter((u) => u.status === "pending").length,
              icon: <Clock size={16} />,
              color: "text-orange-600 bg-orange-50",
            },
            {
              label: "Reviews",
              value: reviews.length,
              icon: <MessageSquare size={16} />,
              color: "text-green-600 bg-green-50",
            },
            {
              label: "Bookings",
              value: bookings.length,
              icon: <Users size={16} />,
              color: "text-purple-600 bg-purple-50",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-4"
            >
              <div
                className={
                  "w-8 h-8 rounded-xl flex items-center justify-center mb-2 " +
                  s.color
                }
              >
                {s.icon}
              </div>
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "Sora", color: "var(--navy)" }}
              >
                {s.value}
              </p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab !== "Add University") {
                  setEditingUni(null);
                  setUniForm(EMPTY_UNI);
                  setDepartments([]);
                }
              }}
              className={
                "px-4 py-2 text-sm font-medium rounded-xl border transition-colors " +
                (activeTab === tab
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50")
              }
            >
              {tab === "Add University" && (
                <Plus size={13} className="inline mr-1" />
              )}
              {tab}
            </button>
          ))}
        </div>

        {/* ===== DASHBOARD TAB ===== */}
        {activeTab === "Dashboard" && dashboardStats && (
          <div className="space-y-6">
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "Sora", color: "var(--navy)" }}
            >
              System Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                <p className="text-3xl font-black text-blue-600 mb-2">
                  {dashboardStats.totalUsers}
                </p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  Total Users
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                <p className="text-3xl font-black text-green-600 mb-2">
                  {dashboardStats.totalReviews}
                </p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  Total Reviews
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                <p className="text-3xl font-black text-purple-600 mb-2">
                  {dashboardStats.totalBookings}
                </p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  Consult Bookings
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                <p className="text-3xl font-black text-red-600 mb-2">
                  {dashboardStats.totalErrors}
                </p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  Logged Errors
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===== UPLOAD EXCEL TAB ===== */}
        {activeTab === "Upload Excel" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "Sora", color: "var(--navy)" }}>Upload University Excel Data</h2>
              <p className="text-sm text-slate-500 mb-2">Bulk import universities and departments. <strong>Step 1:</strong> Preview → <strong>Step 2:</strong> Import.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 text-xs text-blue-700">
                <strong>Excel Columns:</strong> University Name | Short Name | Type | City | Website | Established | Admission Open | Admission Fee | Test Type | Matric % | FSc % | Test % | Hostel | Hostel Fee | Scholarships | Required Documents | Departments (format: <em>CS,60,50000,78.5 | Math,40,35000,71</em>)
              </div>

              <form onSubmit={handleExcelPreview} className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors">
                  <input type="file" accept=".xlsx, .xls" onChange={(e) => { setExcelFile(e.target.files[0]); setExcelPreview(null); setExcelImportResult(null); }}
                    className="hidden" id="excel-upload" />
                  <label htmlFor="excel-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                      <BookOpen size={22} />
                    </div>
                    <span className="text-sm font-semibold text-blue-600 hover:underline">Select Excel File (.xlsx / .xls)</span>
                    <span className="text-xs text-slate-400 mt-1">{excelFile ? excelFile.name : "No file selected"}</span>
                  </label>
                </div>

                <button type="submit" disabled={loading || !excelFile}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition disabled:opacity-50 flex justify-center items-center gap-2">
                  {loading ? "Parsing..." : <><Save size={18} /> Preview Import</>}
                </button>
              </form>
            </div>

            {/* Preview Table */}
            {excelPreview && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">Preview — {excelPreview.total} Universities Found</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{excelPreview.duplicates} will update existing records</p>
                  </div>
                  <button onClick={handleExcelUpload} disabled={loading}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 disabled:opacity-50">
                    {loading ? "Importing..." : `✓ Import All ${excelPreview.total}`}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {["University","Type","City","Test Type","Depts","Docs","Status"].map(h => (
                          <th key={h} className="text-left px-4 py-2.5 text-slate-500 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {excelPreview.preview.map((u, i) => (
                        <tr key={i} className={u.isDuplicate ? "bg-amber-50" : ""}>
                          <td className="px-4 py-2.5">
                            <p className="font-bold text-slate-800">{u.name}</p>
                            <p className="text-slate-400">{u.shortName}</p>
                          </td>
                          <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full font-bold ${u.type === "private" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>{u.type}</span></td>
                          <td className="px-4 py-2.5 text-slate-600">{u.city}</td>
                          <td className="px-4 py-2.5"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{u.admissionTestType}</span></td>
                          <td className="px-4 py-2.5 text-slate-600">{u.departments?.length || 0}</td>
                          <td className="px-4 py-2.5 text-slate-600">{u.requiredDocuments?.length || 0}</td>
                          <td className="px-4 py-2.5">
                            {u.isDuplicate
                              ? <span className="text-amber-600 font-bold">⟳ Update</span>
                              : <span className="text-green-600 font-bold">+ New</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Import Result */}
            {excelImportResult && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="font-bold text-green-800 text-lg">Import Complete!</h3>
                <p className="text-green-700 text-sm mt-1">{excelImportResult.message}</p>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="bg-white rounded-xl px-4 py-2 border border-green-200 text-center">
                    <p className="text-xl font-black text-green-600">{excelImportResult.imported}</p>
                    <p className="text-xs text-slate-500">New</p>
                  </div>
                  <div className="bg-white rounded-xl px-4 py-2 border border-green-200 text-center">
                    <p className="text-xl font-black text-amber-600">{excelImportResult.updated}</p>
                    <p className="text-xs text-slate-500">Updated</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">All imported universities are in <strong>Pending</strong> status. Go to Universities tab to approve them.</p>
              </div>
            )}
          </div>
        )}

        {/* ===== ERROR LOGS TAB ===== */}
        {activeTab === "Error Logs" && (
          <div className="space-y-4">
            <h2
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "Sora", color: "var(--navy)" }}
            >
              System Error Logs
            </h2>
            {loading ? (
              <p>Loading...</p>
            ) : errorLogs.length === 0 ? (
              <p className="text-slate-500">No errors logged.</p>
            ) : (
              errorLogs.map((err) => (
                <div
                  key={err._id}
                  className="bg-white p-4 rounded-xl border border-red-200 border-l-4 border-l-red-500 flex justify-between items-start"
                >
                  <div>
                    <h4 className="font-bold text-red-700">{err.message}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      {err.route} • {new Date(err.timestamp).toLocaleString()}
                    </p>
                    {err.stack && (
                      <pre className="text-[10px] text-slate-400 mt-2 max-h-24 overflow-y-auto bg-slate-50 p-2 rounded">
                        {err.stack}
                      </pre>
                    )}
                  </div>
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    Unresolved
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* ===== UNIVERSITIES TAB ===== */}
        {activeTab === "Universities" && (
          <div className="space-y-3">
            <div className="flex gap-2 mb-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <button onClick={() => setUniFilter("all")} className={`px-4 py-2 rounded-lg text-sm font-bold flex-1 ${uniFilter === "all" ? "bg-white shadow text-blue-600" : "text-slate-500 hover:text-slate-700"}`}>
                All ({unis.length})
              </button>
              <button onClick={() => setUniFilter("pending")} className={`px-4 py-2 rounded-lg text-sm font-bold flex-1 ${uniFilter === "pending" ? "bg-white shadow text-orange-600" : "text-slate-500 hover:text-slate-700"}`}>
                Pending ({unis.filter(u => u.status === "pending").length})
              </button>
              <button onClick={() => setUniFilter("approved")} className={`px-4 py-2 rounded-lg text-sm font-bold flex-1 ${uniFilter === "approved" ? "bg-white shadow text-green-600" : "text-slate-500 hover:text-slate-700"}`}>
                Approved ({unis.filter(u => u.status === "approved" || !u.status).length})
              </button>
            </div>

            {loading && (
              <p className="text-center text-slate-400 py-10">Loading...</p>
            )}
            {!loading && unis.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <BookOpen size={36} className="mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500 mb-4">No universities yet</p>
                <button
                  onClick={() => setActiveTab("Add University")}
                  className="text-sm font-medium text-white px-4 py-2 rounded-xl"
                  style={{ background: "var(--navy)" }}
                >
                  Add First University
                </button>
              </div>
            )}

            {unis
              .filter(uni => uniFilter === "all" ? true : uniFilter === "pending" ? uni.status === "pending" : uni.status !== "pending")
              .map((uni) => (
              <div
                key={uni._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                {/* University row */}
                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ background: "var(--navy)" }}
                    >
                      {uni.shortName?.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        {uni.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {statusBadge(uni.status)}
                        <span className="text-xs text-slate-400 capitalize">
                          {uni.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {uni.departments?.length || 0} depts
                        </span>
                        {uni.admissionOpen ? (
                          <span className="text-xs text-green-600">● Open</span>
                        ) : (
                          <span className="text-xs text-red-500">● Closed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {uni.status === "pending" && (
                      <>
                        <button
                          onClick={() => approveUni(uni._id)}
                          className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-lg hover:bg-green-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectUni(uni._id)}
                          className="text-xs font-medium text-red-600 bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => startEdit(uni)}
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <Link
                      to={"/university/" + uni.slug}
                      target="_blank"
                      className="p-1.5 text-slate-400 hover:text-blue-600"
                    >
                      <Eye size={15} />
                    </Link>
                    <button
                      onClick={() => deleteUni(uni._id)}
                      className="p-1.5 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedUni(expandedUni === uni._id ? null : uni._id)
                      }
                      className="p-1.5 text-slate-400"
                    >
                      {expandedUni === uni._id ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded departments view */}
                {expandedUni === uni._id && (
                  <div className="border-t border-slate-100 px-4 pb-4 pt-3 bg-slate-50">
                    <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                      Departments
                    </p>
                    {uni.departments?.length === 0 && (
                      <p className="text-xs text-slate-400">
                        No departments added yet
                      </p>
                    )}
                    <div className="grid gap-2">
                      {uni.departments?.map((d, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-white rounded-xl px-3 py-2 text-sm"
                        >
                          <span className="font-medium text-slate-700">
                            {d.name}
                          </span>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>
                              Fee: PKR {d.semesterFee?.toLocaleString()}
                            </span>
                            <span>Merit seats: {d.seats?.merit}</span>
                            {d.lastMerit?.[0] && (
                              <span>Last merit: {d.lastMerit[0].closing}%</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===== ADD / EDIT UNIVERSITY TAB ===== */}
        {activeTab === "Add University" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2
              className="text-lg font-bold text-slate-800 mb-5"
              style={{ fontFamily: "Sora" }}
            >
              {editingUni ? "Edit University" : "Add New University"}
            </h2>

            <div className="space-y-5">
              {/* Basic info */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3 pb-1 border-b border-slate-100">
                  Basic Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      University Full Name *
                    </label>
                    <input
                      value={uniForm.name}
                      onChange={(e) =>
                        setUniForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="e.g. University of Karachi"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Short Name *
                    </label>
                    <input
                      value={uniForm.shortName}
                      onChange={(e) =>
                        setUniForm((p) => ({ ...p, shortName: e.target.value }))
                      }
                      placeholder="e.g. UoK"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      URL Slug * (no spaces, use dashes)
                    </label>
                    <input
                      value={uniForm.slug}
                      onChange={(e) =>
                        setUniForm((p) => ({
                          ...p,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-"),
                        }))
                      }
                      placeholder="e.g. university-of-karachi"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Type
                    </label>
                    <select
                      value={uniForm.type}
                      onChange={(e) =>
                        setUniForm((p) => ({ ...p, type: e.target.value }))
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400"
                    >
                      <option value="government">Government</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      City
                    </label>
                    <input
                      value={uniForm.city}
                      onChange={(e) =>
                        setUniForm((p) => ({ ...p, city: e.target.value }))
                      }
                      placeholder="Karachi"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Established Year
                    </label>
                    <input
                      type="number"
                      value={uniForm.established}
                      onChange={(e) =>
                        setUniForm((p) => ({
                          ...p,
                          established: e.target.value,
                        }))
                      }
                      placeholder="e.g. 1951"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Official Website
                    </label>
                    <input
                      value={uniForm.website}
                      onChange={(e) =>
                        setUniForm((p) => ({ ...p, website: e.target.value }))
                      }
                      placeholder="https://university.edu.pk"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Entry Test Required
                    </label>
                    <input
                      value={uniForm.testRequired}
                      onChange={(e) =>
                        setUniForm((p) => ({
                          ...p,
                          testRequired: e.target.value,
                        }))
                      }
                      placeholder="e.g. NTS / ECAT / Own Test"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Admission info */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3 pb-1 border-b border-slate-100">Admission Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* General deadline (backward compat) */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">General Deadline (all programs)</label>
                    <input type="date" value={uniForm.admissionDeadline}
                      onChange={(e) => setUniForm((p) => ({ ...p, admissionDeadline: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  </div>

                  {/* Admission Test Type */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Admission Test Type</label>
                    <select value={uniForm.admissionTestType || "Own Test"}
                      onChange={(e) => setUniForm((p) => ({ ...p, admissionTestType: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 bg-white">
                      {["Own Test","HEC-NAT","NTS","SAT","MDCAT","ECAT","NUMS","None","Multiple"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Admission Fee */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Admission Fee (PKR)</label>
                    <input type="number" value={uniForm.admissionFee}
                      onChange={(e) => setUniForm((p) => ({ ...p, admissionFee: e.target.value }))}
                      placeholder="e.g. 3500"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  </div>
                </div>

                {/* Per-Degree Deadlines */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-600">📅 Deadlines by Degree Level</p>
                    <button type="button"
                      onClick={() => setUniForm(p => ({ ...p, admissionDeadlines: [...(p.admissionDeadlines||[]), { degreeLevel: "BS", deadline: "", note: "" }] }))}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800">+ Add Deadline</button>
                  </div>
                  {(uniForm.admissionDeadlines || []).map((dl, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <select value={dl.degreeLevel}
                        onChange={e => { const arr = [...(uniForm.admissionDeadlines||[])]; arr[i].degreeLevel = e.target.value; setUniForm(p => ({...p, admissionDeadlines: arr})); }}
                        className="border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none focus:border-blue-400 bg-white">
                        {["BS","MS","PhD","BBA","MBA","MBBS","BDS","All"].map(d => <option key={d}>{d}</option>)}
                      </select>
                      <input type="date" value={dl.deadline}
                        onChange={e => { const arr = [...(uniForm.admissionDeadlines||[])]; arr[i].deadline = e.target.value; setUniForm(p => ({...p, admissionDeadlines: arr})); }}
                        className="flex-1 border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none focus:border-blue-400" />
                      <input type="text" placeholder="Note (optional)" value={dl.note}
                        onChange={e => { const arr = [...(uniForm.admissionDeadlines||[])]; arr[i].note = e.target.value; setUniForm(p => ({...p, admissionDeadlines: arr})); }}
                        className="flex-1 border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none focus:border-blue-400" />
                      <button type="button"
                        onClick={() => setUniForm(p => ({...p, admissionDeadlines: (p.admissionDeadlines||[]).filter((_,j)=>j!==i)}))}
                        className="text-red-400 hover:text-red-600 text-xs font-bold">✕</button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" checked={uniForm.admissionOpen}
                        onChange={(e) => setUniForm((p) => ({ ...p, admissionOpen: e.target.checked }))}
                        className="rounded" />
                      Admission Currently Open
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={uniForm.hostelAvailable}
                        onChange={(e) =>
                          setUniForm((p) => ({
                            ...p,
                            hostelAvailable: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                      Hostel Available
                    </label>
                  </div>
                  {uniForm.hostelAvailable && (
                    <>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Hostel Fee/month (PKR)
                        </label>
                        <input
                          type="number"
                          value={uniForm.hostelFee}
                          onChange={(e) =>
                            setUniForm((p) => ({
                              ...p,
                              hostelFee: e.target.value,
                            }))
                          }
                          placeholder="e.g. 5000"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Mess Fee/month (PKR)
                        </label>
                        <input
                          type="number"
                          value={uniForm.messFee}
                          onChange={(e) =>
                            setUniForm((p) => ({
                              ...p,
                              messFee: e.target.value,
                            }))
                          }
                          placeholder="e.g. 6000"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Aggregate formula */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3 pb-1 border-b border-slate-100">
                  Aggregate Formula (must add up to 1.0)
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {["matric", "fsc", "test"].map((key) => (
                    <div key={key}>
                      <label className="block text-xs text-slate-500 mb-1 uppercase">
                        {key} weight
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={uniForm.aggregateFormula[key]}
                        onChange={(e) => updateFormula(key, e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                        style={{ fontFamily: "DM Mono" }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Total:{" "}
                  {(
                    (uniForm.aggregateFormula.matric || 0) +
                    (uniForm.aggregateFormula.fsc || 0) +
                    (uniForm.aggregateFormula.test || 0)
                  ).toFixed(2)}{" "}
                  (should be 1.00)
                </p>
              </div>

              {/* Scholarships */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3 pb-1 border-b border-slate-100">
                  Scholarships & Documents
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Scholarships (comma separated)
                    </label>
                    <input
                      value={uniForm.scholarships}
                      onChange={(e) =>
                        setUniForm((p) => ({
                          ...p,
                          scholarships: e.target.value,
                        }))
                      }
                      placeholder="HEC Need-Based, Merit Scholarship, Vice Chancellor Award"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Required Documents (comma separated)
                    </label>
                    <input
                      value={uniForm.requiredDocuments}
                      onChange={(e) =>
                        setUniForm((p) => ({
                          ...p,
                          requiredDocuments: e.target.value,
                        }))
                      }
                      placeholder="Matric Certificate, FSc Certificate, CNIC, Domicile, 4 Photos"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Departments */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3 pb-1 border-b border-slate-100">
                  Departments
                </p>

                {/* Existing departments */}
                {departments.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {departments.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-slate-700 text-sm">
                            {d.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {d.category} · PKR{" "}
                            {parseInt(d.semesterFee).toLocaleString()}/sem ·
                            Merit: {d.seats?.merit} · SF: {d.seats?.selfFinance}
                            {d.lastMerit?.[0]?.closing
                              ? " · Last merit: " + d.lastMerit[0].closing + "%"
                              : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              // Populate form with this dept's data and remove from list
                              setDeptForm({
                                name: d.name,
                                category: d.category,
                                semesterFee: d.semesterFee,
                                lastMerit: d.lastMerit?.[0]?.closing || "",
                                meritSeats: d.seats?.merit || 0,
                                selfFinanceSeats: d.seats?.selfFinance || 0,
                              });
                              removeDept(i);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-500"
                            title="Edit department"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              removeDept(i);
                            }}
                            className="p-1 text-slate-400 hover:text-red-500"
                            title="Remove department"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add department form */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-600 mb-3">
                    Add Department
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Department Name *
                      </label>
                      <input
                        value={deptForm.name}
                        onChange={(e) =>
                          setDeptForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="e.g. BS Computer Science"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Category
                      </label>
                      <select
                        value={deptForm.category}
                        onChange={(e) =>
                          setDeptForm((p) => ({
                            ...p,
                            category: e.target.value,
                          }))
                        }
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:border-blue-400"
                      >
                        {[
                          "CS",
                          "Engineering",
                          "Medical",
                          "Business",
                          "Arts",
                          "Architecture",
                          "Law",
                          "Sciences",
                        ].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Semester Fee (PKR)
                      </label>
                      <input
                        type="number"
                        value={deptForm.semesterFee}
                        onChange={(e) =>
                          setDeptForm((p) => ({
                            ...p,
                            semesterFee: e.target.value,
                          }))
                        }
                        placeholder="e.g. 25000"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Last Closing Merit %
                      </label>
                      <input
                        type="number"
                        value={deptForm.lastMerit[0].closing}
                        onChange={(e) =>
                          setDeptForm((p) => ({
                            ...p,
                            lastMerit: [
                              { year: 2024, closing: e.target.value },
                            ],
                          }))
                        }
                        placeholder="e.g. 75.5"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Merit Seats
                      </label>
                      <input
                        type="number"
                        value={deptForm.seats.merit}
                        onChange={(e) =>
                          setDeptForm((p) => ({
                            ...p,
                            seats: { ...p.seats, merit: e.target.value },
                          }))
                        }
                        placeholder="e.g. 60"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Self-Finance Seats
                      </label>
                      <input
                        type="number"
                        value={deptForm.seats.selfFinance}
                        onChange={(e) =>
                          setDeptForm((p) => ({
                            ...p,
                            seats: { ...p.seats, selfFinance: e.target.value },
                          }))
                        }
                        placeholder="e.g. 30"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:border-blue-400"
                      />
                    </div>
                  </div>
                  <button
                    onClick={addDepartment}
                    className="mt-3 flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-xl"
                    style={{ background: "var(--blue)" }}
                  >
                    <Plus size={14} /> Add Department
                  </button>
                </div>
              </div>

              {/* Save button */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={saveUniversity}
                  className="flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl"
                  style={{ background: "var(--green)" }}
                >
                  <Save size={15} />
                  {editingUni ? "Update University" : "Save University"}
                </button>
                <button
                  onClick={() => {
                    setUniForm(EMPTY_UNI);
                    setDepartments([]);
                    setEditingUni(null);
                    setActiveTab("Universities");
                  }}
                  className="text-sm font-medium text-slate-600 border border-slate-200 px-6 py-3 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== REVIEWS TAB ===== */}
        {activeTab === "Reviews" && (
          <div className="space-y-3">
            {loading && (
              <p className="text-center text-slate-400 py-10">Loading...</p>
            )}
            {!loading && reviews.length === 0 && (
              <p className="text-center text-slate-400 py-10">No reviews yet</p>
            )}
            {reviews.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {statusBadge(r.status)}
                      <span className="text-xs text-slate-400">
                        ⭐ {r.rating}/5
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{r.text}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      By: {r.userId?.name || "Anonymous"}
                    </p>
                  </div>
                  {r.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => approveReview(r._id)}
                        className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-lg hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectReview(r._id)}
                        className="text-xs font-medium text-red-600 bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== PAST PAPERS TAB ===== */}
        {activeTab === "Past Papers" && (
          <div className="space-y-6">
            {/* Upload form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2
                className="text-lg font-bold mb-5"
                style={{ fontFamily: "Sora", color: "var(--navy)" }}
              >
                Upload Past Paper (PDF only)
              </h2>

              <form onSubmit={handleUploadPaper} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Select University *
                    </label>
                    <select
                      required
                      value={paperForm.universityId}
                      onChange={(e) =>
                        setPaperForm({
                          ...paperForm,
                          universityId: e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400"
                    >
                      <option value="">— Choose University —</option>
                      {unis.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Subject / Department *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Entry Test, Computer Science"
                      value={paperForm.subject}
                      onChange={(e) =>
                        setPaperForm({ ...paperForm, subject: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Year *
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="e.g. 2024"
                      min="2000"
                      max="2030"
                      value={paperForm.year}
                      onChange={(e) =>
                        setPaperForm({ ...paperForm, year: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Degree Level
                    </label>
                    <select
                      value={paperForm.degreeLevel}
                      onChange={(e) =>
                        setPaperForm({
                          ...paperForm,
                          degreeLevel: e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400"
                    >
                      <option value="Bachelors">Bachelors (BS/BE/BBA)</option>
                      <option value="Masters">Masters (MS/MBA)</option>
                      <option value="Medical">Medical (MBBS/BDS)</option>
                    </select>
                  </div>
                </div>

                {/* File upload */}
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    PDF File * (max 20MB)
                  </label>
                  <div
                    className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                    onClick={() =>
                      document.getElementById("paper-file-input").click()
                    }
                  >
                    <input
                      id="paper-file-input"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) =>
                        setPaperForm({ ...paperForm, file: e.target.files[0] })
                      }
                    />
                    {paperForm.file ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText size={24} className="text-red-500" />
                        <div className="text-left">
                          <p className="font-medium text-slate-700 text-sm">
                            {paperForm.file.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {(paperForm.file.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <FileText
                          size={28}
                          className="mx-auto mb-2 text-slate-400"
                        />
                        <p className="text-sm text-slate-600 font-medium">
                          Click to select PDF file
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Only PDF files allowed • Max 20MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    loading || !paperForm.file || !paperForm.universityId
                  }
                  className="flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl disabled:opacity-50"
                  style={{ background: "var(--green)" }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      Upload Paper
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Papers list */}
            <div>
              <h3 className="font-semibold text-slate-700 mb-3 text-sm">
                Uploaded Papers ({pastPapers.length})
              </h3>
              {pastPapers.length === 0 && (
                <p className="text-slate-400 text-sm text-center py-8 bg-white rounded-2xl border border-slate-200">
                  No papers uploaded yet
                </p>
              )}
              <div className="grid gap-3">
                {pastPapers.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-red-100 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 text-sm">
                          {p.subject} — {p.year}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {p.universityName} • {p.degreeLevel} • {p.fileSize} •{" "}
                          {p.downloadCount} downloads
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={p.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"
                      >
                        View
                      </a>
                      <button
                        onClick={async () => {
                          if (!window.confirm("Delete this paper?")) return;
                          const token = JSON.parse(
                            localStorage.getItem("rahbar-auth") || "{}",
                          )?.state?.token;
                          await fetch("/api/pastpapers/" + p._id, {
                            method: "DELETE",
                            headers: { Authorization: "Bearer " + token },
                          });
                          showMsg("Paper deleted");
                          loadData();
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== BLOGS TAB ===== */}
        {activeTab === "Blogs" && (
          <div className="space-y-6">
            {/* Stats + Seed */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Total Blogs</p>
                <p className="text-3xl font-black text-blue-600">{blogs.length}</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Published</p>
                <p className="text-3xl font-black text-emerald-600">{blogs.filter(b => b.status === "published").length}</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Drafts</p>
                <p className="text-3xl font-black text-amber-600">{blogs.filter(b => b.status === "draft").length}</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Total Views</p>
                <p className="text-3xl font-black text-purple-600">{blogs.reduce((a, b) => a + (b.views || 0), 0)}</p>
              </div>
            </div>

            {/* Seed Button */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-5 text-white flex items-center justify-between">
              <div>
                <p className="font-bold text-base mb-1">🚀 Seed 20 Educational Blogs</p>
                <p className="text-indigo-200 text-xs">Auto-generate 20 SEO-optimized articles about Pakistan university admissions</p>
              </div>
              <button onClick={handleSeedBlogs} disabled={loading}
                className="bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors shrink-0 ml-4">
                {loading ? "Seeding..." : "Seed Blogs"}
              </button>
            </div>

            {/* Create / Edit Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800">
                  {editingBlog ? `✏️ Edit: ${editingBlog.title.substring(0, 40)}...` : "➕ Create New Blog"}
                </h2>
                {editingBlog && (
                  <button onClick={() => { setEditingBlog(null); setBlogForm({ title: "", content: "", excerpt: "", category: "Admission Guide", tags: "", keywords: "", seoTitle: "", seoDescription: "", status: "published", coverColor: "#EFF6FF", readTime: 5, file: null }); }}
                    className="text-xs text-slate-500 hover:text-red-500 border border-slate-200 px-3 py-1.5 rounded-lg">
                    ✕ Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleUploadBlog} className="space-y-4">
                {/* Row 1: Title + Category */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Title *</label>
                    <input required placeholder="How to Calculate Aggregate for..." className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                      value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Category *</label>
                    <select className="w-full border border-slate-200 p-3 rounded-xl text-sm bg-white outline-none focus:border-blue-400"
                      value={blogForm.category} onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}>
                      {["Admission Guide","Merit & Aggregate","Entry Tests","Scholarships","University Reviews","Career Guide"].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Excerpt (short description) *</label>
                  <textarea rows={2} placeholder="Brief 1-2 sentence summary shown on blog card..." className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-blue-400 resize-none"
                    value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} />
                </div>

                {/* Content */}
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Content (HTML) *</label>
                  <textarea required rows={12} placeholder="&lt;h2&gt;Heading&lt;/h2&gt;&lt;p&gt;Your content...&lt;/p&gt;" className="w-full border border-slate-200 p-3 rounded-xl text-xs font-mono outline-none focus:border-blue-400 resize-y"
                    value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} />
                  <p className="text-xs text-slate-400 mt-1">💡 Supports full HTML: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;, &lt;a href&gt;, &lt;table&gt;</p>
                </div>

                {/* Row: Tags + Keywords + Read Time + Cover Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Tags (comma separated)</label>
                    <input placeholder="MDCAT, merit, 2025" className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-400"
                      value={blogForm.tags} onChange={e => setBlogForm({ ...blogForm, tags: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">SEO Keywords (comma)</label>
                    <input placeholder="aggregate formula pakistan" className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-400"
                      value={blogForm.keywords} onChange={e => setBlogForm({ ...blogForm, keywords: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Read Time (mins)</label>
                    <input type="number" min={1} max={60} className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-400"
                      value={blogForm.readTime} onChange={e => setBlogForm({ ...blogForm, readTime: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Cover Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" className="w-10 h-10 border border-slate-200 rounded-lg cursor-pointer p-1"
                        value={blogForm.coverColor} onChange={e => setBlogForm({ ...blogForm, coverColor: e.target.value })} />
                      <span className="text-xs text-slate-500">{blogForm.coverColor}</span>
                    </div>
                  </div>
                </div>

                {/* SEO Fields */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-black text-blue-700">🔍 SEO Fields (for Google ranking)</p>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">SEO Title (max 70 chars)</label>
                    <input placeholder="How to Calculate Aggregate Pakistan 2025 | Rahbars" className="w-full border border-blue-200 bg-white p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                      value={blogForm.seoTitle} onChange={e => setBlogForm({ ...blogForm, seoTitle: e.target.value })} />
                    <p className="text-[10px] text-slate-400 mt-0.5">{blogForm.seoTitle.length}/70 chars</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">SEO Description (max 160 chars)</label>
                    <textarea rows={2} placeholder="Step-by-step guide to calculate your aggregate..." className="w-full border border-blue-200 bg-white p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 resize-none"
                      value={blogForm.seoDescription} onChange={e => setBlogForm({ ...blogForm, seoDescription: e.target.value })} />
                    <p className="text-[10px] text-slate-400 mt-0.5">{blogForm.seoDescription.length}/160 chars</p>
                  </div>
                </div>

                {/* Status + Image + Submit */}
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Status</label>
                    <select className="border border-slate-200 p-2.5 rounded-xl text-sm bg-white outline-none"
                      value={blogForm.status} onChange={e => setBlogForm({ ...blogForm, status: e.target.value })}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Featured Image (optional)</label>
                    <input type="file" accept="image/*" className="border border-slate-200 p-2 rounded-xl text-xs w-full"
                      onChange={e => setBlogForm({ ...blogForm, file: e.target.files[0] })} />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors disabled:opacity-60">
                      {loading ? "Saving..." : editingBlog ? "Update Blog" : "Publish Blog"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Blog List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">All Blogs ({blogs.length})</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {blogs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No blogs yet. Create one above or seed 20 educational blogs.</p>
                  </div>
                ) : blogs.map(b => (
                  <div key={b._id} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: b.coverColor || "#EFF6FF" }}>
                      <BookOpen size={20} className="text-blue-400 opacity-50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">{b.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}>{b.status}</span>
                        <span className="text-[10px] text-slate-400">{b.category}</span>
                        <span className="text-[10px] text-slate-400">{b.views || 0} views</span>
                        <span className="text-[10px] text-slate-400">{b.readTime || 5} min</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a href={`/blog/${b.slug}`} target="_blank" rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors" title="View">
                        <Eye size={15} />
                      </a>
                      <button onClick={() => startEditBlog(b)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors" title="Edit">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleToggleBlogStatus(b)}
                        className={`p-1.5 transition-colors text-xs font-bold ${b.status === "published" ? "text-amber-500 hover:text-amber-700" : "text-emerald-500 hover:text-emerald-700"}`}
                        title={b.status === "published" ? "Set Draft" : "Publish"}>
                        {b.status === "published" ? "Draft" : "Pub"}
                      </button>
                      <button onClick={() => handleDeleteBlog(b._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== NEWS TAB ===== */}
        {activeTab === "News" && (
          <div className="space-y-6">
            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Total Items",
                  value: news.length,
                  color: "text-blue-600",
                },
                {
                  label: "Published",
                  value: news.filter((n) => n.isActive).length,
                  color: "text-emerald-600",
                },
                {
                  label: "High Priority",
                  value: news.filter((n) => n.priority === "high").length,
                  color: "text-red-600",
                },
                {
                  label: "Expiring Soon",
                  value: news.filter(
                    (n) =>
                      n.expiresAt &&
                      new Date(n.expiresAt) > new Date() &&
                      new Date(n.expiresAt) - Date.now() <
                        3 * 24 * 60 * 60 * 1000,
                  ).length,
                  color: "text-amber-600",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white border border-slate-100 rounded-2xl px-5 py-4"
                >
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">
                    {s.label}
                  </p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* ── Create / Edit Form ── */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2
                    className="text-lg font-bold text-slate-800"
                    style={{ fontFamily: "Sora" }}
                  >
                    {newsForm._id ? "Edit News Item" : "Create News Item"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {newsForm._id
                      ? "Update the fields below then save"
                      : "Fill all required fields"}
                  </p>
                </div>
                {newsForm._id && (
                  <button
                    onClick={() =>
                      setNewsForm({
                        title: "",
                        content: "",
                        type: "news",
                        priority: "medium",
                        isActive: true,
                        expiresAt: "",
                      })
                    }
                    className="text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
                  >
                    ✕ Cancel Edit
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    placeholder="e.g. KU announces Fall 2026 Admissions"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newsForm.title}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, title: e.target.value })
                    }
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    placeholder="Full description, source details, or summary..."
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newsForm.content}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, content: e.target.value })
                    }
                  />
                </div>

                {/* Type + Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Type
                    </label>
                    <select
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      value={newsForm.type}
                      onChange={(e) =>
                        setNewsForm({ ...newsForm, type: e.target.value })
                      }
                    >
                      <option value="news">News</option>
                      <option value="notification">Notification</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Priority
                    </label>
                    <select
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      value={newsForm.priority}
                      onChange={(e) =>
                        setNewsForm({ ...newsForm, priority: e.target.value })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Expires At + Active toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Expires At{" "}
                      <span className="font-normal text-slate-400 normal-case">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      value={newsForm.expiresAt || ""}
                      onChange={(e) =>
                        setNewsForm({ ...newsForm, expiresAt: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Publish immediately
                      </p>
                      <p className="text-xs text-slate-400">
                        Show on public news page
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNewsForm({
                          ...newsForm,
                          isActive: !newsForm.isActive,
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-colors relative ${newsForm.isActive ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${newsForm.isActive ? "translate-x-6" : "translate-x-0.5"}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Reference Link */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Reference Link{" "}
                    <span className="font-normal text-slate-400 normal-case">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://university.edu.pk/admissions"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    value={newsForm.referenceLink || ""}
                    onChange={(e) =>
                      setNewsForm({
                        ...newsForm,
                        referenceLink: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Link to the official university page or source article.
                  </p>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={newsForm._id ? handleUpdateNews : handleCreateNews}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : null}
                    {newsForm._id ? "Save Changes" : "Create News"}
                  </button>
                </div>
              </div>
            </div>

            {/* ── News List ── */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[1fr_110px_90px_80px_100px_auto] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50">
                {[
                  "Title",
                  "Type",
                  "Priority",
                  "Status",
                  "Created",
                  "Actions",
                ].map((h) => (
                  <p
                    key={h}
                    className="text-xs font-bold text-slate-400 uppercase tracking-wide"
                  >
                    {h}
                  </p>
                ))}
              </div>

              {news.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <p className="font-semibold text-slate-500">
                    No news items yet
                  </p>
                  <p className="text-sm mt-1">
                    Use the form above to create one.
                  </p>
                </div>
              )}

              <div className="divide-y divide-slate-50">
                {news.map((n) => (
                  <div
                    key={n._id}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_110px_90px_80px_100px_auto] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors"
                  >
                    {/* Title + content */}
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {n.content}
                      </p>
                    </div>

                    {/* Type */}
                    <span
                      className={`hidden sm:inline-flex w-fit text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide
              ${
                n.type === "news"
                  ? "bg-sky-50 text-sky-700 border-sky-200"
                  : n.type === "notification"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
                    >
                      {n.type}
                    </span>

                    {/* Priority */}
                    <span
                      className={`hidden sm:inline-flex w-fit text-[11px] font-bold px-2.5 py-1 rounded-full border capitalize
              ${
                n.priority === "high"
                  ? "bg-red-50 text-red-600 border-red-200"
                  : n.priority === "medium"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-slate-50 text-slate-500 border-slate-200"
              }`}
                    >
                      {n.priority}
                    </span>

                    {/* Active */}
                    <button
                      onClick={() => handleToggleNewsActive(n)}
                      className="hidden sm:flex items-center gap-1.5"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${n.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                      />
                      <span
                        className={`text-xs font-semibold ${n.isActive ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {n.isActive ? "Live" : "Draft"}
                      </span>
                    </button>

                    {/* Date */}
                    <span className="hidden sm:block text-xs text-slate-400">
                      {new Date(n.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setNewsForm({
                            ...n,
                            expiresAt: n.expiresAt
                              ? new Date(n.expiresAt).toISOString().slice(0, 16)
                              : "",
                          })
                        }
                        className="p-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteNews(n._id)}
                        className="p-2 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== AI COLLECT TAB ===== */}
        {activeTab === "AI Collect" && <UniversityDataCollector />}

        {/* ===== BOOKINGS TAB ===== */}
        {activeTab === "Bookings" && (
          <div className="space-y-3">
            {loading && (
              <p className="text-center text-slate-400 py-10">Loading...</p>
            )}
            {!loading && bookings.length === 0 && (
              <p className="text-center text-slate-400 py-10">
                No bookings yet
              </p>
            )}
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {statusBadge(b.status)}
                      <span className="text-xs text-slate-500">{b.slot}</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {b.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {b.email} · {b.whatsapp}
                    </p>
                    <p className="text-xs text-slate-500">Topic: {b.topic}</p>
                    {b.message && (
                      <p className="text-xs text-slate-400 mt-1 italic">
                        "{b.message}"
                      </p>
                    )}
                  </div>
                  <a
                    href={"https://wa.me/" + b.whatsapp.replace(/\D/g, "")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-white px-3 py-1.5 rounded-lg shrink-0"
                    style={{ background: "#25D366" }}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── AI BLOG GENERATOR TAB ─── */}
        {activeTab === "AI Blog Generator" && (
          <AIBlogGenerator token={token} />
        )}

      </div>
    </>
  );
}
