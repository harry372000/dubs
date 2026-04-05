"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
          {NAV_LINKS.map(({ href, label }, i) => (
            <motion.div key={href} className="flex items-center" variants={linkVariants} custom={i} initial="hidden" animate="show">
              <Link
                href={href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-sans font-medium transition-colors",
                  pathname.startsWith(href)
                    ? "bg-primary-fixed text-primary dark:bg-surface-highest dark:text-on-surface"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                )}
              >
                {label}
              </Link>
            </motion.div>
          ))}
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
