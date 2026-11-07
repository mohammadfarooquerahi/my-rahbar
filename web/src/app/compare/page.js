export const metadata = {
  title: "Compare Universities in Pakistan Side by Side",
  description: "Compare universities by fees, ranking, location, facilities, and departments to make the best choice.",
  alternates: { canonical: "https://www.rahbars.com/compare" },
};

export default function ComparePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "Sora" }}>
          Compare <span className="text-blue-600">Universities</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">Select two universities and compare them side-by-side: fees, programs, merit, facilities, and more.</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-6xl mb-4">📊</p>
        <h2 className="text-xl font-bold text-slate-800 mb-2">University Comparison Tool</h2>
        <p className="text-slate-500">Select two universities to compare fees, merit cutoffs, departments, and facilities.</p>
      </div>
      <section className="mt-12 prose prose-slate max-w-none">
        <h2>Why Compare Universities?</h2>
        <p>Choosing the right university is one of the biggest decisions for Pakistani students. Our comparison tool helps you make informed choices by showing:</p>
        <ul>
          <li>Fee structures — semester fees, admission charges, hostel costs</li>
          <li>Merit cutoffs — last year&#39;s closing merits for each department</li>
          <li>Available programs and departments</li>
          <li>Location, campus facilities, and scholarship options</li>
          <li>Admission deadlines and entry test requirements</li>
        </ul>
      </section>
    </div>
  );
}
