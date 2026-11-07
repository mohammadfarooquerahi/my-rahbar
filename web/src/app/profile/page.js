export const metadata = { title: "My Profile", robots: { index: false } };

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-slate-900 mb-4" style={{ fontFamily: "Sora" }}>My Profile</h1>
      <div className="bg-white border border-slate-200 rounded-2xl p-8">
        <p className="text-slate-400">Loading profile...</p>
      </div>
    </div>
  );
}
