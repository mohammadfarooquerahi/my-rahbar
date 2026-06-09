import { Link } from "react-router-dom";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };
  const heightClass = sizes[size] || sizes.md;

  return (
    <Link to="/" className="inline-flex items-center gap-2.5 group">
      <img 
        src="/logo-full.png" 
        alt="Rahbars Logo" 
        className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-105`} 
      />
    </Link>
  );
}
