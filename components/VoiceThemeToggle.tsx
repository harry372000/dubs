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

  const startListening = useCallback(() => {
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

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListenState("idle");
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === "dark";
  const isActive = listenState === "listening" || listenState === "processing";

  const bgColor = isActive
    ? isDark ? "rgba(0,227,253,0.18)" : "rgba(0,6,102,0.12)"
    : isDark ? "rgba(0,227,253,0.1)" : "rgba(0,6,102,0.06)";

  const borderColor = isActive
    ? isDark ? "rgba(0,227,253,0.5)" : "rgba(0,6,102,0.25)"
    : isDark ? "rgba(0,227,253,0.2)" : "rgba(0,6,102,0.1)";

  return (
    <div className="relative">
      <button
        onMouseDown={startListening}
        onMouseUp={stopListening}
        onTouchStart={startListening}
        onTouchEnd={stopListening}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 select-none"
        style={{ background: bgColor, border: `1px solid ${borderColor}` }}
        title="Hold to speak: say 'dark mode', 'light mode', or 'toggle'"
        aria-label="Voice theme toggle"
      >
        {/* Ripple ring when listening */}
        {listenState === "listening" && (
          <span
            className="absolute inset-0 rounded-xl animate-ping opacity-30"
            style={{ background: isDark ? "rgba(0,227,253,0.4)" : "rgba(0,6,102,0.2)" }}
          />
        )}

        {isActive ? (
          /* Mic active */
          <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="none"
            strokeWidth={1.8} stroke={isDark ? "#00e3fd" : "#000666"}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M9 22h6" />
          </svg>
        ) : isDark ? (
          /* Sun icon */
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="url(#grad-sun-v)">
            <defs>
              <linearGradient id="grad-sun-v" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00e3fd" /><stop offset="1" stopColor="#006875" />
              </linearGradient>
            </defs>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        ) : (
          /* Moon icon */
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="url(#grad-moon-v)">
            <defs>
              <linearGradient id="grad-moon-v" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#360094" /><stop offset="1" stopColor="#8690ee" />
              </linearGradient>
            </defs>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        )}
      </button>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg text-[0.65rem] font-sans font-medium whitespace-nowrap pointer-events-none z-50"
          style={{
            background: isDark ? "rgba(0,227,253,0.15)" : "rgba(0,6,102,0.08)",
            border: isDark ? "1px solid rgba(0,227,253,0.25)" : "1px solid rgba(0,6,102,0.15)",
            color: isDark ? "#00e3fd" : "#000666",
            animation: "fadeIn 0.15s ease",
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
