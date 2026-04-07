"use client";

import { motion } from "framer-motion";

// DUBS brand arc: cyan → sky → indigo → violet → deep-violet
const TILES = [
  { light: "#00e3fd", dark: "#006875" },
  { light: "#38bdf8", dark: "#0369a1" },
  { light: "#818cf8", dark: "#4338ca" },
  { light: "#a78bfa", dark: "#6d28d9" },
  { light: "#7c3aed", dark: "#360094" },
];

interface Props {
  label?: string;
  compact?: boolean;
}

// Folder SVG path — tab at top-left, body below
// viewBox 0 0 56 48
function FolderShape({ fill, style }: { fill: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 56 48"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block", ...style }}
    >
      <path
        d="M4 10 Q0 10 0 14 L0 44 Q0 48 4 48 L52 48 Q56 48 56 44 L56 20 Q56 16 52 16 L26 16 L23.5 12 Q22 10 20 10 Z"
        fill={fill}
      />
      {/* Glass highlight on top portion */}
      <path
        d="M4 10 Q0 10 0 14 L0 26 L56 26 L56 20 Q56 16 52 16 L26 16 L23.5 12 Q22 10 20 10 Z"
        fill="rgba(255,255,255,0.12)"
      />
    </svg>
  );
}

export default function PageLoader({ label = "Loading…", compact = false }: Props) {
  return (
    <>
      {/* Top progress bar */}
      <div className="loading-bar" style={{ width: 0 }} />

      {/* Centered loader */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex flex-col items-center justify-center gap-8 ${compact ? "py-6" : "py-24"}`}
      >
        {/* Bouncing folder row */}
        <div className="flex items-end gap-4">
          {TILES.map((tile, i) => {
            const gradId = `fg-${i}`;
            const shadowId = `fs-${i}`;
            return (
              <div
                key={i}
                className="relative"
                style={{ width: 56, height: 48 }}
              >
                {/* Shadow folder — static, slightly offset down-right */}
                <div
                  className="absolute"
                  style={{ inset: 0, top: 6, left: 4, opacity: 0.55 }}
                >
                  <svg viewBox="0 0 56 48" style={{ width: "100%", height: "100%" }}>
                    <defs>
                      <linearGradient id={shadowId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={tile.dark} />
                        <stop offset="100%" stopColor={tile.dark} stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M4 10 Q0 10 0 14 L0 44 Q0 48 4 48 L52 48 Q56 48 56 44 L56 20 Q56 16 52 16 L26 16 L23.5 12 Q22 10 20 10 Z"
                      fill={`url(#${shadowId})`}
                    />
                  </svg>
                </div>

                {/* Bouncing folder */}
                <motion.div
                  className="absolute"
                  style={{ inset: 0, top: -5, left: -4 }}
                  animate={{ y: [0, -20, -15, 0] }}
                  transition={{
                    duration: 1.1,
                    times: [0, 0.38, 0.58, 1],
                    ease: [0.22, 1, 0.36, 1],
                    repeat: Infinity,
                    delay: i * 0.13,
                    repeatDelay: 0.35,
                  }}
                >
                  <svg viewBox="0 0 56 48" style={{ width: "100%", height: "100%", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.15))" }}>
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={tile.light} />
                        <stop offset="100%" stopColor={tile.dark} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M4 10 Q0 10 0 14 L0 44 Q0 48 4 48 L52 48 Q56 48 56 44 L56 20 Q56 16 52 16 L26 16 L23.5 12 Q22 10 20 10 Z"
                      fill={`url(#${gradId})`}
                    />
                    {/* Glass sheen */}
                    <path
                      d="M4 10 Q0 10 0 14 L0 27 L56 27 L56 20 Q56 16 52 16 L26 16 L23.5 12 Q22 10 20 10 Z"
                      fill="rgba(255,255,255,0.18)"
                    />
                  </svg>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Progress pill */}
        <div
          className="relative overflow-hidden rounded-full bg-surface-container"
          style={{ width: 160, height: 5 }}
        >
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #006875, #00e3fd, #360094)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "55%", "75%", "88%"] }}
            transition={{
              duration: 2.8,
              times: [0, 0.4, 0.7, 1],
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 0.4,
            }}
          />
        </div>

        {/* Label */}
        <motion.p
          className="text-xs font-sans text-on-surface-variant tracking-wide"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {label}
        </motion.p>
      </motion.div>
    </>
  );
}
