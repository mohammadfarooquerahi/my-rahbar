export const metadata = { title: "Sign Up", robots: { index: false } };

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl font-black text-slate-900 text-center mb-6" style={{ fontFamily: "Sora" }}>Create Account</h1>
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <p className="text-center text-slate-400">Registration form — loading...</p>
      </div>
    </div>
  );
}
