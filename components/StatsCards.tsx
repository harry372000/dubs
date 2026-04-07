"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface Props {
  total: number;
  done: number;
  active: number;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ── Animated counter (fires on mount) ── */
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const duration = 1000;
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [value]);

  return <span className={className}>{display}</span>;
}

/* ── Card 1: Bar Chart ── */
function BarChartCard({
  total, done, active, isDark,
}: { total: number; done: number; active: number; isDark: boolean }) {
  const other = Math.max(0, total - done - active);
  const maxVal = Math.max(total, 1);
  const CHART_H = 52;

  const bars = [
    { label: "Total",  value: total,  color: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,6,102,0.1)" },
    { label: "Done",   value: done,   color: isDark ? "#00e3fd" : "#006875" },
    { label: "Active", value: active, color: isDark ? "#a78bfa" : "#7c3aed" },
    { label: "Other",  value: other,  color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,6,102,0.15)" },
  ];

  const teal = isDark ? "#00e3fd" : "#006875";

  return (
    <motion.div
      className="rounded-2xl p-4 overflow-hidden"
      style={{
        background: isDark ? "rgba(255,255,255,0.03)" : "rgb(var(--color-surface-lowest))",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgb(var(--color-outline-variant))"}`,
        boxShadow: isDark ? "none" : "0 2px 14px rgba(0,6,102,0.06)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-[0.6rem] font-sans font-bold tracking-[0.18em] uppercase text-on-surface-variant">
          Total Jobs
        </p>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: teal }} />
      </div>

      {/* Big number */}
      <p className="font-display font-extrabold text-3xl text-on-surface leading-none mb-3">
        <AnimatedNumber value={total} />
      </p>

      {/* Bar chart */}
      <div className="flex items-end gap-2" style={{ height: CHART_H }}>
        {bars.map(({ label, value, color }, i) => {
          const h = Math.max((value / maxVal) * CHART_H, value > 0 ? 4 : 2);
          return (
            <div key={label} className="flex flex-col items-center gap-1 flex-1">
              <motion.div
                className="w-full rounded-t-md"
                style={{ background: color, originY: 1 }}
                initial={{ scaleY: 0, height: h }}
                animate={{ scaleY: 1, height: h }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.1 }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex gap-2 mt-1.5">
        {bars.map(({ label }) => (
          <p key={label} className="flex-1 text-center text-[0.5rem] font-sans text-on-surface-variant leading-tight">
            {label}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Card 2: Donut Ring ── */
function DonutCard({
  total, done, isDark,
}: { total: number; done: number; isDark: boolean }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const SIZE = 90;
  const STROKE = 9;
  const r = (SIZE - STROKE) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  const green = isDark ? "#4ade80" : "#15803d";
  const trackColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,6,102,0.06)";

  return (
    <motion.div
      className="rounded-2xl p-4 overflow-hidden"
      style={{
        background: isDark ? "rgba(255,255,255,0.03)" : "rgb(var(--color-surface-lowest))",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgb(var(--color-outline-variant))"}`,
        boxShadow: isDark ? "none" : "0 2px 14px rgba(0,6,102,0.06)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-[0.6rem] font-sans font-bold tracking-[0.18em] uppercase text-on-surface-variant">
          Completed
        </p>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: green }} />
      </div>

      <p className="font-display font-extrabold text-3xl text-on-surface leading-none mb-3">
        <AnimatedNumber value={done} />
      </p>

      {/* Ring — centred */}
      <div className="flex justify-center mb-4">
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx={SIZE / 2} cy={SIZE / 2} r={r}
              fill="none" stroke={trackColor} strokeWidth={STROKE}
            />
            <motion.circle
              cx={SIZE / 2} cy={SIZE / 2} r={r}
              fill="none" stroke={green} strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-extrabold text-xl leading-none" style={{ color: green }}>
              <AnimatedNumber value={pct} />%
            </span>
          </div>
        </div>
      </div>

      {/* Legend — two full-width rows */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: green }} />
            <span className="text-on-surface-variant">Done</span>
          </div>
          <span className="font-display font-semibold text-on-surface">{done}</span>
        </div>
        <div className="flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0"
              style={{ background: trackColor, border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,6,102,0.2)"}` }} />
            <span className="text-on-surface-variant">Remaining</span>
          </div>
          <span className="font-display font-semibold text-on-surface">{total - done}</span>
        </div>
        <div className="flex justify-center">
          <span
            className="text-[0.6rem] font-sans font-medium px-2 py-0.5 rounded-full"
            style={{
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,6,102,0.05)",
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,6,102,0.4)",
            }}
          >
            {done} of {total} total
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Card 3: Semi-circle Gauge ── */
function GaugeCard({
  total, active, isDark,
}: { total: number; active: number; isDark: boolean }) {
  const ratio = total > 0 ? active / total : 0;
  const purple = isDark ? "#a78bfa" : "#7c3aed";
  const trackColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,6,102,0.06)";

  // Needle angle: -90° (left) to +90° (right), mapped to ratio 0→1
  const needleAngle = -90 + ratio * 180;

  return (
    <motion.div
      className="rounded-2xl p-4 overflow-hidden"
      style={{
        background: isDark ? "rgba(255,255,255,0.03)" : "rgb(var(--color-surface-lowest))",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgb(var(--color-outline-variant))"}`,
        boxShadow: isDark ? "none" : "0 2px 14px rgba(0,6,102,0.06)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-[0.6rem] font-sans font-bold tracking-[0.18em] uppercase text-on-surface-variant">
          In Progress
        </p>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: purple }} />
      </div>

      <p className="font-display font-extrabold text-3xl text-on-surface leading-none mb-3">
        <AnimatedNumber value={active} />
      </p>

      {/* Semi-circle gauge */}
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 110, height: 68 }}>
          <svg viewBox="0 0 110 68" width={110} height={68}>
            {/* Track */}
            <path
              d="M 8 56 A 47 47 0 0 1 102 56"
              fill="none" stroke={trackColor}
              strokeWidth={8} strokeLinecap="round"
            />
            {/* Fill */}
            <motion.path
              d="M 8 56 A 47 47 0 0 1 102 56"
              fill="none" stroke={purple}
              strokeWidth={8} strokeLinecap="round"
              pathLength={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: Math.max(ratio, active > 0 ? 0.04 : 0) }}
              transition={{ duration: 1.3, ease: EASE, delay: 0.25 }}
            />
            {/* Needle */}
            <motion.line
              x1="55" y1="56"
              x2="55" y2="16"
              stroke={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,6,102,0.5)"}
              strokeWidth={2}
              strokeLinecap="round"
              style={{ transformOrigin: "55px 56px" }}
              initial={{ rotate: -90 }}
              animate={{ rotate: needleAngle }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
            />
            {/* Needle base dot */}
            <circle cx="55" cy="56" r="3.5"
              fill={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,6,102,0.4)"}
            />
          </svg>

          {/* Scale labels */}
          <span className="absolute text-[0.5rem] font-sans text-on-surface-variant" style={{ left: 6, bottom: 10 }}>0</span>
          <span className="absolute text-[0.5rem] font-sans text-on-surface-variant" style={{ right: 6, bottom: 10 }}>{total}</span>
        </div>

        <p className="text-xs font-sans text-on-surface-variant mt-1">
          active {active === 1 ? "job" : "jobs"} of {total}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Main export ── */
export default function StatsCards({ total, done, active }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="grid grid-cols-3 gap-2">
      <BarChartCard  total={total} done={done} active={active} isDark={isDark} />
      <DonutCard     total={total} done={done}                  isDark={isDark} />
      <GaugeCard     total={total}              active={active} isDark={isDark} />
    </div>
  );
}
