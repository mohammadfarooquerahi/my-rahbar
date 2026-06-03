import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  DollarSign,
  CheckCircle,
  LogOut,
  Edit2,
  Save,
  Heart,
} from "lucide-react";
import { useAuthStore, useWatchlistStore } from "../store";

const FIELDS = [
  "Computer Science",
  "Engineering",
  "Medical",
  "Business",
  "Arts",
  "Architecture",
  "Law",
  "Sciences",
];

export default function ProfilePage() {
  const { user, isLoggedIn, logout, updateProfile } = useAuthStore();
  const { universities } = useWatchlistStore();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    whatsapp: user?.whatsapp || "",
    matricPercent: user?.matricPercent || "",
    fscPercent: user?.fscPercent || "",
    fscSubjects: user?.fscSubjects || "Pre-Engineering",
    budget: user?.budget || "medium",
    needsScholarship: user?.needsScholarship || false,
    needsHostel: user?.needsHostel || false,
    preferredSector: user?.preferredSector || "any",
    interestedField: user?.interestedField || "",
  });

  // If not logged in redirect to login
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <User size={44} className="mx-auto mb-4 text-slate-300" />
        <h2
          className="text-2xl font-bold text-slate-700 mb-2"
          style={{ fontFamily: "Sora" }}
        >
          You are not logged in
        </h2>
        <p className="text-slate-500 mb-6">
          Please login or create an account to view your profile.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/auth/login"
            className="px-5 py-2.5 text-sm font-medium text-white rounded-xl"
            style={{ background: "var(--navy)" }}
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className="px-5 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Profile completeness
  const fields = [
    form.name,
    form.email,
    form.whatsapp,
    form.matricPercent,
    form.fscPercent,
    form.interestedField,
  ];
  const filled = fields.filter(Boolean).length;
  const completeness = Math.round((filled / fields.length) * 100);

  return (
    <>
      <Helmet>
        <title>My Profile | MyRahbar</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "Sora", color: "var(--navy)" }}
          >
            My Profile
          </h1>
          <div className="flex items-center gap-2">
            {editing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-xl"
                style={{ background: "var(--green)" }}
              >
                <Save size={14} />
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50"
              >
                <Edit2 size={14} />
                Edit
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>

        {/* Completeness bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700">
              Profile Completeness
            </p>
            <p
              className="text-sm font-bold"
              style={{ fontFamily: "DM Mono", color: "var(--navy)" }}
            >
              {completeness}%
            </p>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: completeness + "%",
                background:
                  completeness >= 80
                    ? "var(--green)"
                    : completeness >= 50
                      ? "var(--orange)"
                      : "var(--red)",
              }}
            />
          </div>
          {completeness < 100 && (
            <p className="text-xs text-slate-400 mt-2">
              Complete your profile so our AI can give you better university
              matches
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3
              className="font-semibold text-slate-800 mb-4 flex items-center gap-2"
              style={{ fontFamily: "Sora" }}
            >
              <User size={16} className="text-blue-600" />
              Basic Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Full Name
                </label>
                {editing ? (
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700">
                    {form.name || "—"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700">
                    {form.email || "—"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  WhatsApp Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => update("whatsapp", e.target.value)}
                    placeholder="03XX XXXXXXX"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-700">
                    {form.whatsapp || "—"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Academic info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3
              className="font-semibold text-slate-800 mb-4 flex items-center gap-2"
              style={{ fontFamily: "Sora" }}
            >
              <BookOpen size={16} className="text-green-600" />
              Academic Details
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Matric %
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.matricPercent}
                      onChange={(e) => update("matricPercent", e.target.value)}
                      placeholder="e.g. 85"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400"
                      style={{ fontFamily: "DM Mono" }}
                    />
                  ) : (
                    <p
                      className="text-sm font-medium text-slate-700"
                      style={{ fontFamily: "DM Mono" }}
                    >
                      {form.matricPercent ? form.matricPercent + "%" : "—"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    FSc %
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.fscPercent}
                      onChange={(e) => update("fscPercent", e.target.value)}
                      placeholder="e.g. 78"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400"
                      style={{ fontFamily: "DM Mono" }}
                    />
                  ) : (
                    <p
                      className="text-sm font-medium text-slate-700"
                      style={{ fontFamily: "DM Mono" }}
                    >
                      {form.fscPercent ? form.fscPercent + "%" : "—"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  FSc Subjects
                </label>
                {editing ? (
                  <select
                    value={form.fscSubjects}
                    onChange={(e) => update("fscSubjects", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:border-blue-400"
                  >
                    <option>Pre-Engineering</option>
                    <option>Pre-Medical</option>
                    <option>Commerce</option>
                    <option>Arts / Humanities</option>
                    <option>Computer Science</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-slate-700">
                    {form.fscSubjects || "—"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Interested Field
                </label>
                {editing ? (
                  <select
                    value={form.interestedField}
                    onChange={(e) => update("interestedField", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:border-blue-400"
                  >
                    <option value="">— Select —</option>
                    {FIELDS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm font-medium text-slate-700">
                    {form.interestedField || "—"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3
              className="font-semibold text-slate-800 mb-4 flex items-center gap-2"
              style={{ fontFamily: "Sora" }}
            >
              <DollarSign size={16} className="text-orange-500" />
              Preferences
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Budget
                </label>
                {editing ? (
                  <select
                    value={form.budget}
                    onChange={(e) => update("budget", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:border-blue-400"
                  >
                    <option value="low">Low — Under PKR 30,000/sem</option>
                    <option value="medium">Medium — PKR 30k to 80k/sem</option>
                    <option value="high">High — Above PKR 80,000/sem</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-slate-700 capitalize">
                    {form.budget}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Preferred Sector
                </label>
                {editing ? (
                  <select
                    value={form.preferredSector}
                    onChange={(e) => update("preferredSector", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:border-blue-400"
                  >
                    <option value="any">No Preference</option>
                    <option value="government">Government</option>
                    <option value="private">Private</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-slate-700 capitalize">
                    {form.preferredSector === "any"
                      ? "No Preference"
                      : form.preferredSector}
                  </p>
                )}
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.needsScholarship}
                    onChange={(e) =>
                      update("needsScholarship", e.target.checked)
                    }
                    disabled={!editing}
                    className="rounded"
                  />
                  Need Scholarship
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.needsHostel}
                    onChange={(e) => update("needsHostel", e.target.checked)}
                    disabled={!editing}
                    className="rounded"
                  />
                  Need Hostel
                </label>
              </div>
            </div>
          </div>

          {/* Watchlist summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3
              className="font-semibold text-slate-800 mb-4 flex items-center gap-2"
              style={{ fontFamily: "Sora" }}
            >
              <Heart size={16} className="text-red-500" />
              My Watchlist
            </h3>

            {universities.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400 mb-3">
                  No universities saved yet
                </p>
                <Link
                  to="/search"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Browse and save universities →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {universities.slice(0, 4).map((uni) => (
                  <Link
                    key={uni.id}
                    to={"/university/" + uni.slug}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm text-slate-700">
                      {uni.shortName}
                    </span>
                    <span className="text-xs text-slate-400">{uni.city}</span>
                  </Link>
                ))}
                {universities.length > 4 && (
                  <Link
                    to="/watchlist"
                    className="block text-xs text-center text-blue-600 pt-1 hover:underline"
                  >
                    View all {universities.length} saved →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p
            className="text-sm font-semibold text-blue-800 mb-3"
            style={{ fontFamily: "Sora" }}
          >
            Quick Actions
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/find-university"
              className="text-xs font-medium text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100"
            >
              Retake University Quiz
            </Link>
            <Link
              to="/merit-calculator"
              className="text-xs font-medium text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100"
            >
              Calculate Merit
            </Link>
            <Link
              to="/career-match"
              className="text-xs font-medium text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100"
            >
              AI Career Guidance
            </Link>
            <Link
              to="/counseling"
              className="text-xs font-medium text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100"
            >
              Book Counseling
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
