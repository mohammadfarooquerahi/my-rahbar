import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Headphones,
  CheckCircle,
  Clock,
  Star,
  MessageCircle,
  Calendar,
  User,
  Mail,
  Phone,
} from "lucide-react";

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

const TOPICS = [
  "University Selection",
  "Merit and Aggregate Confusion",
  "Scholarship Guidance",
  "Career Path Selection",
  "Document Preparation",
  "Admission Form Help",
  "After Admission Guidance",
  "Other",
];

export default function CounselingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    topic: "",
    slot: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  const isValid =
    form.name && form.email && form.whatsapp && form.topic && form.slot;

  const features = [
    {
      icon: <User size={16} />,
      text: "Expert admission counselors with 5+ years experience",
    },
    {
      icon: <Clock size={16} />,
      text: "45 minute one-on-one session via WhatsApp or Zoom",
    },
    {
      icon: <MessageCircle size={16} />,
      text: "Written summary of advice sent after the session",
    },
    {
      icon: <Star size={16} />,
      text: "4.9 out of 5 rating from 200+ students counseled",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Personal Counseling — 1-on-1 Admission Help | MyRahbar</title>
        <meta
          name="description"
          content="Book a personal counseling session with a MyRahbar expert. Get help with university selection, merit calculation, and admission process."
        />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#F5F3FF" }}
          >
            <Headphones size={26} style={{ color: "#8B5CF6" }} />
          </div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "Sora", color: "var(--navy)" }}
          >
            Personal Counseling
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Confused about which university to choose? Book a session with our
            admission experts and get clear answers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3
                className="font-bold text-slate-800 mb-4"
                style={{ fontFamily: "Sora" }}
              >
                What You Get
              </h3>
              <div className="space-y-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-purple-600"
                      style={{ background: "#F5F3FF" }}
                    >
                      {f.icon}
                    </div>
                    <p className="text-sm text-slate-600">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3
                className="font-bold text-slate-800 mb-3"
                style={{ fontFamily: "Sora" }}
              >
                Session Fee
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Basic Guidance (45 min)
                  </span>
                  <span
                    className="font-bold"
                    style={{ fontFamily: "DM Mono", color: "var(--green)" }}
                  >
                    Free
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Deep Dive Session (90 min)
                  </span>
                  <span
                    className="font-bold"
                    style={{ fontFamily: "DM Mono", color: "var(--navy)" }}
                  >
                    PKR 999
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Full Admission Support</span>
                  <span
                    className="font-bold"
                    style={{ fontFamily: "DM Mono", color: "var(--navy)" }}
                  >
                    PKR 2,499
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
              <p className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <MessageCircle size={14} />
                Instant WhatsApp Help
              </p>
              <p className="text-xs text-purple-700 mb-3">
                For quick questions, message us directly on WhatsApp and we will
                reply within 2 hours.
              </p>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2 text-sm font-medium text-white rounded-xl"
                style={{ background: "#25D366" }}
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#F0FDF4" }}
                >
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3
                  className="text-xl font-bold text-slate-800 mb-2"
                  style={{ fontFamily: "Sora" }}
                >
                  Booking Confirmed!
                </h3>
                <p className="text-slate-500 mb-4">
                  We have received your request. Our counselor will confirm your
                  slot on WhatsApp within 2 hours.
                </p>
                <p className="text-sm text-slate-400">
                  Please save our number:{" "}
                  <span className="font-medium text-slate-600">
                    +92 300 1234567
                  </span>
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3
                  className="font-bold text-slate-800 mb-5"
                  style={{ fontFamily: "Sora" }}
                >
                  Book Your Session
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={15}
                        className="absolute left-3 top-3 text-slate-400"
                      />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Your full name"
                        className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Email and WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail
                          size={15}
                          className="absolute left-3 top-3 text-slate-400"
                        />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="your@email.com"
                          className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-400"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        WhatsApp Number
                      </label>
                      <div className="relative">
                        <Phone
                          size={15}
                          className="absolute left-3 top-3 text-slate-400"
                        />
                        <input
                          type="tel"
                          value={form.whatsapp}
                          onChange={(e) => update("whatsapp", e.target.value)}
                          placeholder="03XX XXXXXXX"
                          className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-400"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      What do you need help with?
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) => update("topic", e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white text-slate-700 focus:border-blue-400"
                      required
                    >
                      <option value="">— Select a topic —</option>
                      {TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time slot */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preferred Time Slot
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => update("slot", slot)}
                          className={
                            "py-2 text-xs font-medium rounded-xl border transition-colors " +
                            (form.slot === slot
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-slate-200 text-slate-600 hover:border-slate-300")
                          }
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Anything else you want to share? (optional)
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Tell us your FSc marks, which university you are confused about, your budget..."
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="w-full py-3 text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: "var(--navy)" }}
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Calendar size={15} />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
