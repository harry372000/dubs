"use client";

interface Props {
  color?: string;    // text color — "white" for dark bg, "currentColor" for themed
  scale?: number;    // default 1
  showTagline?: boolean;
  className?: string;
}

export default function DubsLogo({
  color = "currentColor",
  scale = 1,
  showTagline = false,
  className = "",
}: Props) {
  const isLight = color !== "white" && color !== "#fff" && color !== "#ffffff";

  // Unique gradient IDs (avoid SVG conflicts if ever two logos render)
  const uid = "dubs";

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 11 * scale,
        flexShrink: 0,
      }}
    >
      {/* ── Play icon ── */}
      <svg
        width={64 * scale}
        height={60 * scale}
        viewBox="0 0 68 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Icon background gradient */}
          <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00e3fd" stopOpacity="0.18" />
            <stop offset="1" stopColor="#003d8f" stopOpacity="0.22" />
          </linearGradient>

          {/* Play triangle gradient */}
          <linearGradient id={`${uid}-play`} x1="16" y1="12" x2="42" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00e3fd" />
            <stop offset="0.55" stopColor="#0093c4" />
            <stop offset="1" stopColor="#0050a8" />
          </linearGradient>

          {/* Wave gradient */}
          <linearGradient id={`${uid}-wave`} x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#00e3fd" />
            <stop offset="1" stopColor="#0060cc" stopOpacity="0.4" />
          </linearGradient>

          {/* Gloss overlay */}
          <linearGradient id={`${uid}-gloss`} x1="0" y1="0" x2="0" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.22" />
            <stop offset="0.5" stopColor="white" stopOpacity="0.06" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <filter id={`${uid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background rounded square */}
        <rect
          x="1" y="1" width="58" height="58" rx="14"
          fill={`url(#${uid}-bg)`}
          stroke="rgba(0,227,253,0.25)"
          strokeWidth="1"
        />

        {/* Gloss sheen on top half */}
        <rect
          x="1" y="1" width="58" height="29" rx="14"
          fill={`url(#${uid}-gloss)`}
        />

        {/* Play triangle */}
        <path
          d="M18 14 L18 46 L44 30 Z"
          fill={`url(#${uid}-play)`}
          filter={`url(#${uid}-glow)`}
        />

        {/* Triangle inner highlight (3D effect) */}
        <path
          d="M18 14 L18 28 L32 21 Z"
          fill="rgba(255,255,255,0.22)"
        />

        {/* Sound wave — inner arc */}
        <path
          d="M46 20 Q53 30 46 40"
          stroke={`url(#${uid}-wave)`}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Sound wave — outer arc */}
        <path
          d="M50 15 Q60 30 50 45"
          stroke={`url(#${uid}-wave)`}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          strokeOpacity="0.55"
        />
      </svg>

      {/* ── Wordmark + tagline ── */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: 28 * scale,
            letterSpacing: "-0.03em",
            color: color,
            lineHeight: 1,
          }}
        >
          DUBS
        </span>

        {showTagline && (
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: 8.5 * scale,
              letterSpacing: "0.04em",
              marginTop: 4 * scale,
              color: isLight
                ? "rgba(0,6,102,0.45)"
                : "rgba(255,255,255,0.45)",
              whiteSpace: "nowrap",
            }}
          >
            Lost in translation? Not anymore.
          </span>
        )}
      </div>
    </div>
  );
}
