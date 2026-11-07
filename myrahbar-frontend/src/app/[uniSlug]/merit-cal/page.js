export const metadata = {
  title: "Aggregate & Merit Calculator",
  description: "Calculate your aggregate for specific university admission in Pakistan.",
};

export default function UniMeritCalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-slate-900 mb-4" style={{ fontFamily: "Sora" }}>Merit Calculator</h1>
      <p className="text-slate-500 mb-6">Calculate your aggregate score for this university.</p>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-sm text-slate-400">Interactive calculator — loading...</p>
      </div>
    </div>
  );
}
