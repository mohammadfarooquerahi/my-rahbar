export const metadata = {
  title: "AI Career Match & Chat",
  description: "Use AI to find the best career path and university match based on your interests and skills.",
  alternates: { canonical: "https://www.rahbars.com/career-match" },
};

export default function CareerMatchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "Sora" }}>
          AI Career <span className="text-blue-600">Chat</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">Chat with our AI assistant to discover career paths, get university recommendations, and ask admission questions.</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-6xl mb-4">✨</p>
        <h2 className="text-xl font-bold text-slate-800 mb-2">AI Career Advisor</h2>
        <p className="text-slate-500 mb-4">Powered by AI to help you navigate university admissions in Pakistan.</p>
        <p className="text-sm text-slate-400">Interactive chat — loading...</p>
      </div>
      <section className="mt-12 prose prose-slate max-w-none">
        <h2>What You Can Ask</h2>
        <ul>
          <li>Which university is best for Computer Science in Pakistan?</li>
          <li>What are the admission requirements for NUST?</li>
          <li>Compare FAST vs COMSATS for software engineering</li>
          <li>What career options are available after a BS in Business?</li>
          <li>How to prepare for MDCAT/ECAT entry tests?</li>
        </ul>
      </section>
    </div>
  );
}
