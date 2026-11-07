"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, RefreshCw, Image, Check, AlertCircle, Sparkles, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store";
import { API_BASE, getImageUrl } from "../../utils/api";

const COLOR_OPTIONS = [
  { value: "blue", label: "Blue (e.g. NUST / STEM)", badgeClass: "bg-blue-700/90" },
  { value: "emerald", label: "Emerald (e.g. DOW / Medical)", badgeClass: "bg-emerald-700/90" },
  { value: "purple", label: "Purple (e.g. FAST / Tech)", badgeClass: "bg-purple-700/90" },
  { value: "rose", label: "Rose (e.g. NED / Engineering)", badgeClass: "bg-rose-700/90" },
  { value: "amber", label: "Amber (e.g. IBA / Business)", badgeClass: "bg-amber-700/90" },
  { value: "sky", label: "Sky (e.g. UoK / General)", badgeClass: "bg-sky-700/90" },
];

export default function HeroStudentsManager() {
  const { token } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    tag: "",
    subtitle: "",
    imageUrl: "",
    color: "blue",
    order: 0,
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Client-side image compression to guarantee small payload (under 1MB) & fast upload
  const compressImage = (file, maxWidth = 800, quality = 0.85) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith("image/") || file.type.includes("gif") || file.type.includes("svg")) {
        return resolve(file);
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                return resolve(file);
              }
              const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
                type: "image/webp",
              });
              resolve(compressedFile);
            },
            "image/webp",
            quality
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/hero-students/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error(`Server returned status ${res.status}. Please check your connection.`);
      }

      if (res.ok && data.success && data.students) {
        setStudents(data.students);
      } else {
        toast.error(data.error || data.message || "Failed to load hero students");
      }
    } catch (err) {
      toast.error("Error loading hero students: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStudents();
    }
  }, [token]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      tag: "",
      subtitle: "",
      imageUrl: "",
      color: "blue",
      order: students.length + 1,
      isActive: true,
    });
    setSelectedFile(null);
    setPreviewImage("");
    setShowAddModal(true);
  };

  const openEditModal = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      tag: student.tag,
      subtitle: student.subtitle,
      imageUrl: student.imageUrl,
      color: student.color || "blue",
      order: student.order || 0,
      isActive: student.isActive !== false,
    });
    setSelectedFile(null);
    setPreviewImage(getImageUrl(student.imageUrl));
    setShowAddModal(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const optimized = await compressImage(file, 600, 0.85);
      setSelectedFile(optimized);
      const reader = new FileReader();
      reader.onload = (uploadEvt) => {
        const base64 = uploadEvt.target.result;
        setPreviewImage(base64);
        setFormData((prev) => ({ ...prev, imageUrl: base64 }));
      };
      reader.readAsDataURL(optimized);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.tag.trim() || !formData.subtitle.trim()) {
      return toast.error("Please fill in Student Name, Tag, and Subtitle.");
    }
    if (!selectedFile && !formData.imageUrl.trim()) {
      return toast.error("Please provide an image URL or upload a photo.");
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("tag", formData.tag.trim());
      data.append("subtitle", formData.subtitle.trim());
      data.append("color", formData.color);
      data.append("order", formData.order);
      data.append("isActive", formData.isActive);

      if (selectedFile) {
        data.append("image", selectedFile);
      } else {
        data.append("imageUrl", formData.imageUrl.trim());
      }

      const url = editingId
        ? `${API_BASE}/api/hero-students/admin/${editingId}`
        : `${API_BASE}/api/hero-students/admin`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseErr) {
        throw new Error(`Server returned HTTP ${res.status}. Please try again.`);
      }

      if (res.ok && result.success) {
        toast.success(editingId ? "Student updated successfully!" : "Student added to Hero!");
        setShowAddModal(false);
        fetchStudents();
      } else {
        toast.error(result.error || result.message || "Failed to save student.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from Hero?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/hero-students/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch (e) {}

      if (res.ok && data.success) {
        toast.success("Student removed from Hero.");
        setStudents((prev) => prev.filter((s) => s._id !== id));
      } else {
        toast.error(data.error || data.message || "Failed to delete.");
      }
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm("Reset all hero cards to the original 6 default students?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/hero-students/admin/reset`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch (e) {}

      if (res.ok && data.success) {
        toast.success("Reset to 6 default students!");
        fetchStudents();
      } else {
        toast.error(data.error || data.message || "Failed to reset.");
      }
    } catch (err) {
      toast.error("Reset failed: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="text-blue-600" size={24} />
            Hero Section Student Showcase
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Edit the student success cards, university tags, and photos displayed on the homepage hero.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            title="Reset to 6 default students"
          >
            <RefreshCw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Grid of Student Cards (Admin View) */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading hero students...</div>
      ) : students.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <p className="text-slate-600 font-semibold mb-3">No hero students found.</p>
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
          >
            Load Default 6 Students
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {students.map((student) => {
            const colorOption = COLOR_OPTIONS.find((c) => c.value === student.color) || COLOR_OPTIONS[0];
            return (
              <div
                key={student._id}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Photo Preview */}
                <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                  <img
                    src={getImageUrl(student.imageUrl)}
                    alt={student.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'Student')}&background=0284c7&color=fff&size=400`;
                    }}
                  />
                  {/* Uni Tag Badge */}
                  <div
                    className={`absolute top-2 right-2 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow ${colorOption.badgeClass}`}
                  >
                    {student.tag}
                  </div>

                  {!student.isActive && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded">
                        Hidden
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{student.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{student.subtitle}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Order: #{student.order || 0}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => openEditModal(student)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(student._id, student.name)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add or Edit Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-black text-slate-900">
                {editingId ? "Edit Hero Student" : "Add Student to Hero"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ammar K."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Tag / University & Subtitle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tag / Uni *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NUST, DOW, FAST"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Badge Color
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subtitle / Program */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Program / Subtitle *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BS CS • NUST or MBBS • DUHS"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Photo Input (Upload or URL) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Student Photo *
                </label>

                {/* File Upload Option */}
                <div className="flex items-center gap-2 mb-2">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-blue-50/50 transition">
                    <Upload size={15} />
                    <span>{selectedFile ? selectedFile.name : "Upload Photo from Device"}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                {/* URL Option */}
                <div className="relative">
                  <span className="text-xs text-slate-400 block mb-1">or paste Image URL:</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      if (!selectedFile) setPreviewImage(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Preview Thumbnail */}
                {previewImage && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-12 h-14 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Student')}&background=334155&color=fff&size=400&bold=true`;
                      }}
                    />
                    <div className="text-xs text-slate-600">
                      <p className="font-bold">Live Photo Preview</p>
                      <p className="text-[10px] text-slate-400">Aspect 4:5 will be applied on Hero</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order & Active Toggle */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isActiveToggle" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Visible on Hero
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingId ? "Update Student" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

