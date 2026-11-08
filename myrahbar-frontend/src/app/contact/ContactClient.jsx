"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, Sparkles } from "lucide-react";
import { API_BASE } from "@/utils/api";

export default function ContactClient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "University Admission Guidance",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message.");

      setStatus({
        type: "success",
        message: "Thank you! Your message has been sent to the Rahbars team. We will reply to your email shortly.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "University Admission Guidance",
        message: "",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Something went wrong. You can also contact us directly via WhatsApp.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            We&#39;re Here to Help
          </div>
          <h1
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
            style={{ fontFamily: "Sora" }}
          >
            Get in Touch with <span className="text-blue-600">Rahbars</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Have questions about university admissions, eligibility criteria, entry tests, or need 1-on-1 counseling?
            Our educational advisors are ready to guide you.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900" style={{ fontFamily: "Sora" }}>
                Send Us a Message
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Fill in the form below and we will get back to you via email within 24 hours.
              </p>
            </div>

            {status.message && (
              <div
                className={`p-4 rounded-2xl mb-6 text-sm flex items-start gap-3 ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <MessageSquare size={18} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farooq Rahi"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 bg-slate-50/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 bg-slate-50/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +92 319 0211218"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 bg-slate-50/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Topic / Subject
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 bg-slate-50/40"
                  >
                    <option value="University Admission Guidance">University Admission Guidance</option>
                    <option value="Aggregate & Merit Calculator Help">Aggregate &amp; Merit Calculator Help</option>
                    <option value="Past Papers & Entry Tests">Past Papers &amp; Entry Tests</option>
                    <option value="University Listing or Data Correction">University Listing / Data Correction</option>
                    <option value="Partnership / Sponsorship">Partnership / Sponsorship</option>
                    <option value="Other Inquiry">Other Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="How can we help you? Describe your field of interest, FSc marks, or university query..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 bg-slate-50/40 resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={15} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick WhatsApp Support Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-7 shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider mb-3">
                  Fastest Response
                </span>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "Sora" }}>
                  WhatsApp Quick Chat
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  Need quick admission counseling or aggregate verification? Chat directly with our counselors.
                  We usually respond within 1 hour.
                </p>
                <a
                  href="https://wa.me/923190211218?text=Assalam-o-Alaikum%20Rahbars!%20I%20need%20help%20with%20university%20admissions."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
                >
                  <MessageSquare size={16} className="text-emerald-600" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Direct Info List */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "Sora" }}>
                Direct Channels
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Email</p>
                  <a
                    href="mailto:farooqrahi828@gmail.com"
                    className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    farooqrahi828@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone / WhatsApp</p>
                  <a
                    href="https://wa.me/923190211218"
                    className="text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors"
                  >
                    +92 319 0211218
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Headquarters</p>
                  <p className="text-sm font-semibold text-slate-800">
                    Hyderabad, Sindh, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-2 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Advisory Hours</p>
                  <p className="text-sm font-semibold text-slate-800">
                    Mon – Sat: 9:00 AM – 9:00 PM PKT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
