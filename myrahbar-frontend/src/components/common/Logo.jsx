import { Link } from "react-router-dom";

export default function Logo({ size = "md", layout = "horizontal" }) {
  // Make the old logo bigger as requested
  const imgSizes = {
    sm: "h-10",
    md: "h-12 md:h-14",
    lg: "h-16 md:h-20",
  };
  
  // Base text scale based on size
  const textScale = {
    sm: "text-xl",
    md: "text-2xl md:text-[28px]",
    lg: "text-4xl",
  };

  const isVertical = layout === "vertical";
  const heightClass = imgSizes[size] || imgSizes.md;
  const fontClass = textScale[size] || textScale.md;

  return (
    <Link 
      to="/" 
      className={`inline-flex group items-center ${isVertical ? "flex-col text-center justify-center gap-1" : "gap-2 sm:gap-3"}`}
    >
      <img
        src="/logo-full.png"
        alt="Rahbars Logo"
        className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-105 shrink-0`}
      />
      <div className={`flex flex-col ${isVertical ? "items-center mt-1" : "items-start justify-center"} shrink-0`}>
        {/* 'Rahbars' matching the image style: Capital R, dark royal blue, wide, rounded feel */}
        <span 
          className={`font-black text-[#1545A5] ${fontClass}`}
          style={{ 
            fontFamily: "'Varela Round', 'Nunito', 'Sora', sans-serif", 
            lineHeight: "1",
            letterSpacing: "0.02em"
          }}
        >
          Rahbars
        </span>
        {/* Tagline matching the image: very small, uppercase, wide tracking, no dashes, same blue color */}
        <span 
          className="font-bold text-[#1545A5] tracking-[0.25em] whitespace-nowrap mt-1"
          style={{ fontSize: size === "sm" ? "0.4rem" : size === "md" ? "0.45rem" : "0.6rem" }}
        >
          LEARN. GROW. SUCCEED.
        </span>
      </div>
    </Link>
  );
}
