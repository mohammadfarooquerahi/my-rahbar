export const metadata = {
  title: "Aggregate & Merit Calculator 2026",
  description: "Calculate your university aggregate percentage for NUST, FAST, MDCAT, NED, UET, and all Pakistani universities accurately.",
  alternates: { canonical: "https://www.rahbars.com/merit-calculator" },
};

export default function MeritCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "Sora" }}>
          Aggregate & <span className="text-blue-600">Merit Calculator</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">Enter your Matric, FSc/A-Level, and entry test marks to calculate your aggregate for any Pakistani university.</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-6xl mb-4">🧮</p>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Merit Calculator</h2>
        <p className="text-slate-500 mb-6">Select your target university and enter your marks to see if you qualify.</p>
        <p className="text-sm text-slate-400">Interactive calculator — loading...</p>
      </div>
      {/* SEO content */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">How University Aggregate is Calculated in Pakistan</h2>
        <div className="prose prose-slate max-w-none">
          <p>Each Pakistani university has its own aggregate formula. The most common formula weighs your Matric marks, FSc/Intermediate marks, and entry test score. For example:</p>
          <ul>
            <li><strong>NUST:</strong> Matric 10% + FSc 40% + Entry Test 50%</li>
            <li><strong>FAST-NUCES:</strong> Matric 10% + FSc 40% + FAST Test 50%</li>
            <li><strong>NED University:</strong> Matric 10% + FSc 40% + ECAT/Own Test 50%</li>
            <li><strong>Medical (MDCAT):</strong> Matric 10% + FSc 40% + MDCAT 50%</li>
          </ul>
          <p>Our calculator supports all major Pakistani universities including NUST, FAST, NED, LUMS, UET, Dow University, IBA, and more. Simply select your target university and enter your percentage marks.</p>
          <h3>Understanding Merit Status</h3>
          <p><strong>Likely Admitted:</strong> Your aggregate is 3+ points above the closing merit. <strong>Borderline:</strong> Within 0-3 points of closing merit. <strong>Below Merit:</strong> Below the closing merit from the previous year.</p>
        </div>
      </section>
    </div>
  );
}
