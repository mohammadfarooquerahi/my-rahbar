import { Link } from "react-router-dom";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: "h-8",
    md: "h-9 md:h-11",
    lg: "h-14 md:h-16",
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
