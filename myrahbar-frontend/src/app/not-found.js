export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-6xl font-black text-slate-900 mb-4" style={{ fontFamily: "Sora" }}>404</h1>
      <p className="text-xl text-slate-500 mb-6">Page not found</p>
      <a href="/" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
        Go Home
      </a>
    </div>
  );
}
