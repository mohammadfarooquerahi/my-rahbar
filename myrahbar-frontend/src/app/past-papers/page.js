export const metadata = {
  title: "Download Past Papers & Entry Test Solutions",
  description: "Free download past papers and sample tests for Pakistani university entry tests including NTS, ECAT, MDCAT, and FAST.",
  alternates: { canonical: "https://www.rahbars.com/past-papers" },
};

export default function PastPapersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "Sora" }}>
          Past Papers & <span className="text-blue-600">Entry Tests</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">Download official past papers and practice for university entry tests across Pakistan.</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-6xl mb-4">📝</p>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Past Papers Library</h2>
        <p className="text-slate-500">Browse and download past papers by university and test type.</p>
      </div>
      <section className="mt-12 prose prose-slate max-w-none">
        <h2>Available Past Papers</h2>
        <ul>
          <li><strong>ECAT (Engineering):</strong> Past papers for NED, UET, and other engineering universities</li>
          <li><strong>MDCAT (Medical):</strong> PMC MDCAT practice papers and solutions</li>
          <li><strong>FAST Entry Test:</strong> Computer Science and Engineering test papers</li>
          <li><strong>NTS/NAT:</strong> National Testing Service papers for HEC-recognized universities</li>
          <li><strong>NUST NET:</strong> NUST Engineering and Technology test papers</li>
          <li><strong>IBA Sukkur/Karachi:</strong> Business and management aptitude test papers</li>
        </ul>
      </section>
    </div>
  );
}
