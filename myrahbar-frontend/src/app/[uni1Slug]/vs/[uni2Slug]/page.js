export const metadata = {
  title: "Compare Universities",
  description: "Side by side comparison of two Pakistani universities.",
};

export default function CompareDetailPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-slate-900 mb-4" style={{ fontFamily: "Sora" }}>University Comparison</h1>
      <p className="text-slate-500">Loading comparison...</p>
    </div>
  );
}
