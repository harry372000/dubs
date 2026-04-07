"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

const FLAGS: Record<string, string> = {
  hi: "🇮🇳", es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪", pt: "🇧🇷",
  ar: "🇸🇦", zh: "🇨🇳", ja: "🇯🇵", ko: "🇰🇷", ru: "🇷🇺",
  it: "🇮🇹", tr: "🇹🇷", id: "🇮🇩", mr: "🇮🇳", bn: "🇧🇩", ur: "🇵🇰",
};

interface Props {
  value: string;
  onChange: (code: string) => void;
}

export default function LanguagePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = SUPPORTED_LANGUAGES.find((l) => l.code === value);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left"
        style={{
          background: open ? "rgb(var(--color-surface-highest))" : "rgb(var(--color-surface-highest) / 0.6)",
          border: open
            ? "1px solid rgba(0,104,117,0.4)"
            : "1px solid rgb(var(--color-outline-variant) / 0.5)",
          boxShadow: open ? "0 0 0 3px rgba(0,227,253,0.1)" : "none",
        }}
      >
        <span className="flex items-center gap-3">
          <span className="text-xl leading-none">{FLAGS[value] ?? "🌐"}</span>
          <span className="font-sans text-sm font-medium text-on-surface">
            {selected?.label?.replace(" (Coming Soon)", "") ?? value}
          </span>
          {selected && !selected.supported && (
            <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: "rgba(251,191,36,0.15)", color: "#d97706" }}>
              Soon
            </span>
          )}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <svg className="w-4 h-4 text-outline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </motion.div>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl overflow-hidden bg-surface-lowest"
            style={{
              backdropFilter: "blur(20px)",
              border: "1px solid rgb(var(--color-outline-variant))",
              boxShadow: "0 16px 48px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header */}
            <div className="px-4 pt-3 pb-2 border-b border-outline-variant/30">
              <p className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-on-surface-variant">
                Select Target Language
              </p>
            </div>

            {/* Grid of languages */}
            <div className="p-3 grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map(({ code, label, supported }) => {
                const isSelected = code === value;
                const cleanLabel = label.replace(" (Coming Soon)", "");
                return (
                  <button
                    key={code}
                    type="button"
                    disabled={!supported}
                    onClick={() => { onChange(code); setOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: isSelected
                        ? "linear-gradient(90deg, rgba(0,104,117,0.12), rgba(0,227,253,0.1))"
                        : "transparent",
                      border: isSelected
                        ? "1px solid rgba(0,227,253,0.3)"
                        : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected && supported)
                        e.currentTarget.style.background = "rgb(var(--color-surface-high))";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span className="text-lg leading-none shrink-0">{FLAGS[code] ?? "🌐"}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs font-sans font-medium text-on-surface truncate">
                        {cleanLabel}
                      </span>
                    </span>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                    {!supported && (
                      <span className="text-[0.55rem] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0"
                        style={{ background: "rgba(251,191,36,0.15)", color: "#d97706" }}>
                        Soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
