export const metadata = {
  title: "Expert Career Counseling & Mentorship",
  description: "Get personalized guidance from top university students and educational mentors in Pakistan.",
  alternates: { canonical: "https://www.rahbars.com/counseling" },
};

export default function CounselingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "Sora" }}>
          1-on-1 Career <span className="text-blue-600">Counseling</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">Get personalized university admission guidance from experienced mentors via WhatsApp.</p>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-8 text-center">
        <p className="text-6xl mb-4">🎧</p>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Free Counseling Session</h2>
        <p className="text-slate-500 mb-6">Talk to our experts about university selection, admission deadlines, and career paths.</p>
        <a href="https://wa.me/923190211218?text=Assalam-o-Alaikum%20Rahbars!%20I%20need%20guidance%20for%20my%20university%20admission." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold shadow-md hover:bg-[#20bd5a]">
          💬 Chat on WhatsApp
        </a>
      </div>
      <section className="mt-12 prose prose-slate max-w-none">
        <h2>What Our Counselors Help With</h2>
        <ul>
          <li>Choosing the right university based on your marks and goals</li>
          <li>Understanding admission requirements and deadlines</li>
          <li>Scholarship guidance and financial aid options</li>
          <li>Entry test preparation strategies</li>
          <li>Document preparation and submission help</li>
        </ul>
      </section>
    </div>
  );
}
