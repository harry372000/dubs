"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef(false);

  // Attach a capture-phase click listener so it fires before React's handlers
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || anchor.target === "_blank") return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        // Same path + search → no navigation
        if (url.pathname + url.search === window.location.pathname + window.location.search) return;
      } catch {
        return;
      }

      // Kick off the progress bar immediately
      if (timerRef.current) clearInterval(timerRef.current);
      activeRef.current = true;
      setVisible(true);
      setWidth(8);

      let cur = 8;
      timerRef.current = setInterval(() => {
        cur += (82 - cur) * 0.07;
        setWidth(cur);
      }, 120);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  // Complete the bar when route resolves
  useEffect(() => {
    if (!activeRef.current) return;
    activeRef.current = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setWidth(100);
    const t = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 380);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[3px] pointer-events-none"
      style={{
        width: `${width}%`,
        background: "linear-gradient(90deg, #006875, #00e3fd, #360094)",
        transition: width === 100 ? "width 0.25s ease-out" : "width 0.12s linear",
        boxShadow: "0 0 10px rgba(0,227,253,0.55), 0 0 4px rgba(0,227,253,0.3)",
      }}
    />
  );
}
