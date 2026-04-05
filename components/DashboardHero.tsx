"use client";

import { motion, cubicBezier } from "framer-motion";
import { QuoteIcon } from "@/components/icons";

const EASE = cubicBezier(0.22, 1, 0.36, 1);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: EASE },
  }),
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

const QUOTES = [
  "The limits of my language are the limits of my world.",
  "Language is the road map of a culture.",
  "One language sets you in a corridor for life. Two languages open every door.",
];

export default function DashboardHero() {
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="mb-10">
      {/* Label */}
      <motion.p variants={fadeUp} custom={0} className="text-label-md text-on-surface-variant mb-3">
        The Hub
      </motion.p>

      {/* Headline */}
      <motion.h1 variants={fadeUp} custom={1}
        className="font-display text-[2.6rem] font-extrabold tracking-tight text-on-surface leading-[1.1] mb-3">
        Translate the{" "}
        <span style={{ background: "linear-gradient(90deg, #000666, #006875, #00e3fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          World&apos;s Content
        </span>
      </motion.h1>

      {/* Sub */}
      <motion.p variants={fadeUp} custom={2} className="font-sans text-on-surface-variant max-w-lg text-[0.95rem] leading-relaxed">
        Paste a YouTube URL below. We&apos;ll extract the audio, clone the voice, and dub it in your chosen language.
      </motion.p>

      {/* Daily quote chip */}
      <motion.div variants={fadeUp} custom={3} className="mt-5 inline-flex items-start gap-3 rounded-2xl px-5 py-3 max-w-xl bg-surface-container"
        style={{ border: "1px solid var(--color-outline-variant)" }}>
        <QuoteIcon className="w-4 h-4 mt-0.5 shrink-0" />
        <p className="text-xs font-sans italic text-on-surface-variant leading-relaxed">{quote}</p>
      </motion.div>
    </motion.div>
  );
}
