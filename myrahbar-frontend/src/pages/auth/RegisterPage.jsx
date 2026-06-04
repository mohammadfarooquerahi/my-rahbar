import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, Lock, Eye, EyeOff, BookOpen } from "lucide-react";
import { useAuthStore } from "../../store";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed.");
      setAuth(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValid = form.email && form.password.length >= 6 && agreed;

  return (
    <>
      <Helmet>
        <title>Sign Up Free | MyRahbar</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--navy)" }}
              >
                <BookOpen size={18} className="text-white" />
              </div>
              <span
                className="font-bold text-xl"
                style={{ fontFamily: "Sora", color: "var(--navy)" }}
              >
                My<span style={{ color: "var(--green)" }}>Rahbar</span>
              </span>
            </Link>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "Sora", color: "var(--navy)" }}
            >
              Create your account
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Get alerts, save universities, and track your merit — free.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
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
                    required
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-3 text-slate-400"
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions checkbox */}
              <label className="flex items-start gap-2 cursor-pointer text-sm text-slate-500">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-blue-600"
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-blue-600 underline">Privacy Policy</Link>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full py-3 text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "var(--navy)" }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-xs text-center text-slate-400">
                Already have an account?{" "}
                <Link to="/auth/login" className="text-blue-600 font-medium hover:underline">
                  Login here
                </Link>
              </p>
            </form>

            <p className="text-center text-sm text-slate-500 mt-4">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
