export const metadata = {
  title: "About Us",
  description: "Learn about Rahbars's mission to guide students towards their perfect university and career.",
  alternates: { canonical: "https://www.rahbars.com/about" },
  openGraph: { title: "About Us | Rahbars", description: "Learn about Rahbars mission to guide Pakistani students." },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-900 to-slate-900 py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-teal-500 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "Sora" }}>
            Empowering Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Educational Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 leading-relaxed font-light">
            Rahbars is Pakistan&#39;s premier platform for university admissions, career guidance, and student resources.
          </p>
        </div>
      </section>
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6" style={{ fontFamily: "Sora" }}>Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">Every student deserves access to accurate, up-to-date, and personalized information regarding their higher education options. Our mission is to bridge the gap between aspiring students and educational institutions.</p>
            <p className="text-slate-600 leading-relaxed text-lg">We strive to eliminate the confusion and stress associated with university admissions in Pakistan.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative">
            <div className="grid grid-cols-2 gap-6">
              {[{ n: "100+", l: "Universities Listed" }, { n: "50,000+", l: "Students Helped" }, { n: "500+", l: "Programs Covered" }, { n: "4.9/5", l: "User Rating" }].map((s) => (
                <div key={s.l} className="text-center">
                  <p className="text-2xl font-black text-blue-600" style={{ fontFamily: "Sora" }}>{s.n}</p>
                  <p className="text-sm text-slate-500 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
