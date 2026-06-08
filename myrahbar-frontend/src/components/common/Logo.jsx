import { Link } from "react-router-dom";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: { wrap: "w-7 h-7", text: "text-base", dot: "w-1.5 h-1.5" },
    md: { wrap: "w-9 h-9", text: "text-xl", dot: "w-2 h-2" },
    lg: { wrap: "w-12 h-12", text: "text-3xl", dot: "w-2.5 h-2.5" },
  };
  const s = sizes[size];

  return (
    <Link to="/" className="inline-flex items-center gap-2.5 group">
      {/* Icon mark */}
      <div
        className={`${s.wrap} rounded-xl flex items-center justify-center relative overflow-hidden shrink-0`}
        style={{
          background:
            "linear-gradient(135deg, var(--blue) 0%, #6366f1 100%)",
        }}
      >
        <span
          className="text-white font-black leading-none"
          style={{
            fontFamily: "Sora",
            fontSize: size === "sm" ? 14 : size === "md" ? 18 : 24,
          }}
        >
          R
        </span>
        <div
          className={`absolute bottom-1 right-1 ${s.dot} rounded-full`}
          style={{ background: "var(--yellow)" }}
        />
      </div>

      {/* Text */}
      <div className="flex items-baseline gap-0">
        <span
          className={`font-black ${s.text} leading-none text-slate-900 dark:text-white`}
          style={{ fontFamily: "Sora" }}
        >
          Rahbars
        </span>
        <span
          className={`font-black ${s.text} leading-none`}
          style={{ fontFamily: "Sora", color: "var(--blue)" }}
        >
          .com
        </span>
      </div>
    </Link>
  );
}
