"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef, useCallback } from "react";

// Web Speech API type declarations (not in default TS lib)
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type ListeningState = "idle" | "listening" | "processing";

export default function VoiceThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [listenState, setListenState] = useState<ListeningState>("idle");
  const [tooltip, setTooltip] = useState("");
  const [hovered, setHovered] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listenStateRef = useRef<ListeningState>("idle");

  useEffect(() => setMounted(true), []);

  // Keep ref in sync so event callbacks have current value without stale closure
  useEffect(() => {
    listenStateRef.current = listenState;
  }, [listenState]);

  const showTooltip = useCallback((msg: string, duration = 2200) => {
    setTooltip(msg);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setTooltip(""), duration);
  }, []);

  const toggleListening = useCallback(() => {
    // If already listening, cancel it
    if (listenStateRef.current === "listening") {
      recognitionRef.current?.stop();
      setListenState("idle");
      return;
    }
    if (listenStateRef.current !== "idle") return;

    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      showTooltip("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListenState("listening");

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setListenState("processing");
      const transcripts = Array.from({ length: event.results[0].length }, (_, i) =>
        event.results[0][i].transcript.toLowerCase().trim()
      );
      const text = transcripts.join(" ");

      const wantsDark =
        /dark\s*(mode|theme)?/.test(text) ||
        /switch\s+to\s+dark/.test(text) ||
        /enable\s+dark/.test(text);
      const wantsLight =
        /light\s*(mode|theme)?/.test(text) ||
        /switch\s+to\s+light/.test(text) ||
        /enable\s+light/.test(text);
      const wantsToggle =
        /toggle\s*(theme|mode)?/.test(text) ||
        /change\s*(theme|mode)?/.test(text) ||
        /flip\s*(theme|mode)?/.test(text);

      setTheme((currentTheme) => {
        if (wantsDark && currentTheme !== "dark") {
          showTooltip("Dark mode on");
          return "dark";
        } else if (wantsLight && currentTheme !== "light") {
          showTooltip("Light mode on");
          return "light";
        } else if (wantsToggle) {
          const next = currentTheme === "dark" ? "light" : "dark";
          showTooltip(next === "dark" ? "Dark mode on" : "Light mode on");
          return next;
        } else if (wantsDark || wantsLight) {
          showTooltip("Already set");
        } else {
          showTooltip(`"${transcripts[0]}"?`);
        }
        return currentTheme;
      });

      setTimeout(() => setListenState("idle"), 400);
    };

    recognition.onerror = () => {
      setListenState("idle");
      showTooltip("Didn't catch that");
    };

    recognition.onend = () => {
      if (listenStateRef.current === "listening") setListenState("idle");
    };

    recognition.start();
  }, [setTheme, showTooltip]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === "dark";
  const isListening = listenState === "listening";
  const isProcessing = listenState === "processing";
  const isActive = isListening || isProcessing;

  const accentColor = isDark ? "#00e3fd" : "#000666";
  const bgColor = isActive
    ? isDark ? "rgba(0,227,253,0.16)" : "rgba(0,6,102,0.1)"
    : isDark ? "rgba(0,227,253,0.07)" : "rgba(0,6,102,0.05)";
  const borderColor = isActive
    ? isDark ? "rgba(0,227,253,0.45)" : "rgba(0,6,102,0.22)"
    : isDark ? "rgba(0,227,253,0.15)" : "rgba(0,6,102,0.1)";

  /* Dot color indicating current theme */
  const dotColor = isDark ? "#00e3fd" : "#360094";

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 select-none"
        style={{ background: bgColor, border: `1px solid ${borderColor}` }}
        aria-label="Voice theme control"
      >
        {/* Ripple when listening */}
        {isListening && (
          <span
            className="absolute inset-0 rounded-xl animate-ping opacity-25"
            style={{ background: accentColor }}
          />
        )}

        {/* Mic icon — always shown */}
        <svg
          className="w-4 h-4 relative z-10 transition-all duration-200"
          viewBox="0 0 24 24" fill="none" strokeWidth={1.8}
          stroke={isActive ? accentColor : isDark ? "rgba(0,227,253,0.65)" : "rgba(0,6,102,0.55)"}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M9 22h6" />
        </svg>

        {/* Theme-state dot — bottom-right corner */}
        <span
          className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full z-10 transition-colors duration-300"
          style={{ background: dotColor, boxShadow: `0 0 4px ${dotColor}` }}
        />
      </button>

      {/* Hover hint — only when idle and not showing other tooltips */}
      {hovered && !isActive && !tooltip && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 pointer-events-none z-50"
          style={{ animation: "fadeIn 0.15s ease" }}
        >
          {/* Arrow */}
          <div className="flex justify-center mb-[-1px]">
            <div className="w-2 h-2 rotate-45"
              style={{
                background: isDark ? "rgba(15,17,21,0.92)" : "rgba(255,255,255,0.95)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,6,102,0.1)",
                borderBottom: "none", borderRight: "none",
              }}
            />
          </div>
          <div
            className="px-3 py-1.5 rounded-xl text-[0.65rem] font-sans font-medium whitespace-nowrap flex items-center gap-2"
            style={{
              background: isDark ? "rgba(15,17,21,0.92)" : "rgba(255,255,255,0.95)",
              border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,6,102,0.1)",
              color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,6,102,0.65)",
              boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,6,102,0.1)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dotColor }} />
            Say <span style={{ color: accentColor, fontWeight: 600 }}>&ldquo;{isDark ? "light mode" : "dark mode"}&rdquo;</span> or <span style={{ color: accentColor, fontWeight: 600 }}>&ldquo;toggle&rdquo;</span>
          </div>
        </div>
      )}

      {/* Listening indicator label */}
      {isListening && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg text-[0.65rem] font-sans font-medium whitespace-nowrap pointer-events-none z-50 flex items-center gap-1.5"
          style={{
            background: isDark ? "rgba(0,227,253,0.12)" : "rgba(0,6,102,0.07)",
            border: isDark ? "1px solid rgba(0,227,253,0.22)" : "1px solid rgba(0,6,102,0.14)",
            color: accentColor,
            animation: "fadeIn 0.15s ease",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accentColor }} />
          Listening…
        </div>
      )}

      {/* Result tooltip */}
      {tooltip && !isListening && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg text-[0.65rem] font-sans font-medium whitespace-nowrap pointer-events-none z-50"
          style={{
            background: isDark ? "rgba(0,227,253,0.12)" : "rgba(0,6,102,0.07)",
            border: isDark ? "1px solid rgba(0,227,253,0.22)" : "1px solid rgba(0,6,102,0.14)",
            color: accentColor,
            animation: "fadeIn 0.15s ease",
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
