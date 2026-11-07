export const metadata = {
  title: "Student Document Tools & PDF Utilities",
  description: "Free document tools for Pakistani students: compress documents, convert images to PDF, and organize admission files.",
  alternates: { canonical: "https://www.rahbars.com/document-tools" },
};

export default function DocumentToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "Sora" }}>
          Document <span className="text-blue-600">Tools</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">Compress images and documents to meet university upload size requirements. 100% free, no sign-up needed.</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-6xl mb-4">📄</p>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Document Compressor</h2>
        <p className="text-slate-500">Upload your photo or document and compress it to meet university requirements.</p>
      </div>
      <section className="mt-12 prose prose-slate max-w-none">
        <h2>Why You Need This Tool</h2>
        <p>Most Pakistani university admission portals have strict file size limits (usually 100KB-500KB). Our compressor helps you:</p>
        <ul>
          <li>Compress passport photos to under 100KB</li>
          <li>Reduce document scans to meet upload limits</li>
          <li>Convert images to optimized JPEG/WebP format</li>
          <li>Adjust quality to balance size and clarity</li>
        </ul>
      </section>
    </div>
  );
}
