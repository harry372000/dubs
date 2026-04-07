"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { UserButton } from "@clerk/nextjs";
import { motion, cubicBezier } from "framer-motion";
import { cn } from "@/lib/utils";
import VoiceThemeToggle from "@/components/VoiceThemeToggle";
import DubsLogo from "@/components/DubsLogo";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/library", label: "Library" },
];

const EASE = cubicBezier(0.22, 1, 0.36, 1);

const navVariants = {
  hidden: { opacity: 0, y: -12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: -6 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.06, duration: 0.45, ease: EASE },
  }),
};

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate="show"
      className="sticky top-0 z-50 glass"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.0)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
        >
          <Link href="/dashboard" className="flex items-center text-primary dark:text-white shrink-0">
            <DubsLogo color="currentColor" scale={0.44} />
          </Link>
        </motion.div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }, i) => {
            const isActive = pathname.startsWith(href);
            return (
              <motion.div key={href} className="flex items-center" variants={linkVariants} custom={i} initial="hidden" animate="show">
                <Link
                  href={href}
                  className="relative px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors duration-200 flex items-center"
                  style={{
                    color: isActive
                      ? isDark ? "#00e3fd" : "#000666"
                      : undefined,
                  }}
                >
                  {/* Sliding glow pill */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={isDark ? {
                        background: "rgba(0,227,253,0.08)",
                        boxShadow: "0 0 10px rgba(0,227,253,0.3), 0 0 22px rgba(0,227,253,0.12), inset 0 0 8px rgba(0,227,253,0.05)",
                      } : {
                        background: "rgba(0,6,102,0.07)",
                        boxShadow: "0 0 10px rgba(0,6,102,0.18), 0 0 20px rgba(0,6,102,0.08), inset 0 0 8px rgba(0,6,102,0.04)",
                      }}
                      transition={{ type: "spring", stiffness: 420, damping: 38 }}
                    />
                  )}
                  {/* Label */}
                  <span className={cn(
                    "relative z-10",
                    !isActive && "text-on-surface-variant hover:text-on-surface"
                  )}>
                    {label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Voice toggle + User */}
        <motion.div
          className="ml-auto flex items-center gap-2"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        >
          <VoiceThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </motion.div>
      </div>
    </motion.header>
  );
}
