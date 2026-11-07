export const metadata = {
  title: "Smart University Matcher & Finder",
  description: "Find the best universities matching your marks, budget, and preferred career path in Pakistan.",
  alternates: { canonical: "https://www.rahbars.com/find-university" },
};

export default function FindUniversityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "Sora" }}>
          Smart University <span className="text-blue-600">Finder</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">Answer 10 simple questions and get matched to your perfect university with merit prediction and fee breakdown.</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-6xl mb-4">🎓</p>
        <h2 className="text-xl font-bold text-slate-800 mb-2">University Matcher Quiz</h2>
        <p className="text-slate-500 mb-6">Tell us about your field, budget, marks, and preferences. We&#39;ll find the best fit for you.</p>
        <p className="text-sm text-slate-400">Interactive quiz — loading...</p>
      </div>
      {/* SEO content */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Smart Matcher Works</h2>
        <div className="prose prose-slate max-w-none">
          <p>The Rahbars Smart University Finder uses your academic profile, budget preferences, and career goals to match you with the best universities in Pakistan. Our algorithm considers:</p>
          <ul>
            <li><strong>Your Field:</strong> Computer Science, Engineering, Medical, Business, Arts, Architecture</li>
            <li><strong>Budget:</strong> Low (under PKR 30,000), Medium (30K-80K), or High (above 80K) per semester</li>
            <li><strong>University Type:</strong> Government vs Private preference</li>
            <li><strong>Scholarship Need:</strong> Financial aid requirements</li>
            <li><strong>Location:</strong> Karachi, Lahore, Islamabad, and other cities</li>
          </ul>
          <p>After answering all questions, you&#39;ll receive a personalized list of top 3-5 universities that best match your criteria, along with admission deadlines, fee breakdowns, and merit predictions.</p>
        </div>
      </section>
    </div>
  );
}
