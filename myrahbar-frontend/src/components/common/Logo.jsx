import { Link } from "react-router-dom";

export default function Logo({ size = "md", showName = false }) {
  const sizes = {
    sm: "h-8",
    md: "h-9 md:h-10",
    lg: "h-12 md:h-14",
  };
  const heightClass = sizes[size] || sizes.md;

  return (
    <Link to="/" className="inline-flex items-center gap-2 group">
      <img
        src="/logo-full.png"
        alt="Rahbars Logo"
        className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
      />
      {showName && (
        <span
          className="font-black text-slate-800 tracking-tight hidden sm:block"
          style={{ fontFamily: "Sora", fontSize: size === "lg" ? "1.1rem" : "0.95rem" }}
        >
          Rahbars
        </span>
      )}
    </Link>
  );
}
