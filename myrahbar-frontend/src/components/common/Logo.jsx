const Link = ({ to, href, children, ...props }) => <a href={href || to} {...props}>{children}</a>;

export default function Logo({ size = "md", layout = "horizontal" }) {
  const isVertical = layout === "vertical";

  // Prominently enlarged icon sizes so the logo mark stands out proudly beside the wordmark & tagline
  const iconSizes = {
    sm: "h-11 w-11 min-w-[44px]",
    md: "h-14 w-14 md:h-16 md:w-16 min-w-[56px] md:min-w-[64px]",
    lg: "h-20 w-20 md:h-24 md:w-24 min-w-[80px]",
  };

  const titleSizes = {
    sm: "text-xl",
    md: "text-2xl md:text-[28px]",
    lg: "text-4xl md:text-5xl",
  };

  const taglineSizes = {
    sm: "text-[9px] tracking-wider",
    md: "text-[10px] md:text-[11px] tracking-[0.18em]",
    lg: "text-xs md:text-sm tracking-[0.22em]",
  };

  const iconClass = iconSizes[size] || iconSizes.md;
  const titleClass = titleSizes[size] || titleSizes.md;
  const taglineClass = taglineSizes[size] || taglineSizes.md;

  return (
    <Link 
      to="/" 
      className={`inline-flex group items-center transition-all ${isVertical ? "flex-col text-center justify-center gap-2" : "gap-3 sm:gap-3.5"}`}
      title="Rahbars - Pakistan's #1 Admission Platform"
    >
      {/* Brand Icon Mark — Made bigger, sharper and well-proportioned */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src="/logo-full.png"
          alt="Rahbars Logo"
          className={`${iconClass} object-contain transition-transform duration-300 group-hover:scale-105 shrink-0 drop-shadow-sm`}
          fetchpriority="high"
          loading="eager"
        />
      </div>

      {/* Brand Name & Tagline Stack */}
      <div className={`flex flex-col ${isVertical ? "items-center" : "items-start justify-center"} shrink-0`}>
        <span 
          className={`font-black text-slate-900 leading-none tracking-tight ${titleClass}`}
          style={{ 
            fontFamily: "'Outfit', 'Sora', sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          Rahbars<span className="text-blue-600">.</span>
        </span>
        <span 
          className={`font-bold text-slate-500 uppercase mt-1 leading-none ${taglineClass}`}
          style={{ 
            fontFamily: "'Inter', sans-serif",
          }}
        >
          LEARN. GROW. SUCCEED.
        </span>
      </div>
    </Link>
  );
}

