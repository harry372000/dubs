"use client";

import { motion, useInView, cubicBezier } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { LinkIcon, MicIcon, PlayIcon, ArrowRightIcon, CheckIcon } from "@/components/icons";
import DubsLogo from "@/components/DubsLogo";

const LANGUAGES = [
  "Hindi", "Spanish", "French", "German", "Portuguese",
  "Arabic", "Chinese", "Japanese", "Korean", "Russian",
  "Italian", "Turkish", "Indonesian",
];

const FEATURES = [
  { icon: <LinkIcon className="w-5 h-5" />, title: "Paste & Go", desc: "Drop any YouTube URL. DUBS handles audio extraction, voice analysis, and dubbing — all automatically." },
  { icon: <MicIcon className="w-5 h-5" />, title: "AI Voice Cloning", desc: "ElevenLabs AI clones the original speaker's voice and delivers a natural dub in your chosen language." },
  { icon: <PlayIcon className="w-5 h-5" />, title: "Watch in Browser", desc: "Video plays muted. Dubbed audio streams in perfect sync. No downloads, no installs." },
];

const STEPS = [
  { num: "01", title: "Paste a YouTube URL", desc: "Copy any YouTube link and paste it into the DUBS input field." },
  { num: "02", title: "Choose Your Language", desc: "Select from 13+ languages. DUBS detects the source automatically." },
  { num: "03", title: "Watch & Listen", desc: "Your video plays with the dubbed audio in the original speaker's voice." },
];

const EASE = cubicBezier(0.22, 1, 0.36, 1);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: Math.max(0, i) * 0.11, duration: 0.7, ease: EASE },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen text-white overflow-x-hidden" style={{ background: "linear-gradient(160deg, #000666 0%, #000933 45%, #001828 100%)" }}>

      {/* ── Fixed animated background ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,227,253,0.11) 0%, transparent 65%)", top: "-15%", right: "-8%", animation: "floatOrb 11s ease-in-out infinite" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(54,0,148,0.22) 0%, transparent 65%)", bottom: "5%", left: "-8%", animation: "floatOrb 13s ease-in-out infinite reverse" }} />
        <div className="absolute w-[320px] h-[320px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,104,117,0.16) 0%, transparent 65%)", top: "42%", left: "38%", animation: "floatOrb 16s ease-in-out infinite 4s" }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      {/* ── Hero Zone: Navbar + Hero as one unified animated block ── */}
      <motion.div
        className="relative z-10"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Navbar — no border, blends directly into hero */}
        <motion.header
          variants={fadeUp}
          custom={-1}
          className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full"
        >
          <DubsLogo color="white" scale={0.5} />
          <nav className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-sans px-4 py-2 rounded-lg transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.55)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
              Sign In
            </Link>
            <Link href="/sign-up" className="btn-ai text-sm">Get Started Free</Link>
          </nav>
        </motion.header>

        {/* Hero — flows directly under navbar, no gap */}
        <section className="px-6 pt-10 pb-24 max-w-6xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">

            {/* Badge chip */}
            <motion.div variants={fadeUp} custom={0} className="inline-block mb-7">
              <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.22em] uppercase px-4 py-2 rounded-full"
                style={{ background: "rgba(0,227,253,0.08)", border: "1px solid rgba(0,227,253,0.2)", color: "#00e3fd" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
                AI-Powered Video Dubbing
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} custom={1}
              className="font-display font-extrabold tracking-tight leading-[1.04] mb-5"
              style={{ fontSize: "clamp(3rem, 8vw, 6.2rem)" }}>
              Dub Any Video.
              <br />
              <span style={{ background: "linear-gradient(90deg, #00b8cc 0%, #00e3fd 55%, #80f0ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Any Language.
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p variants={fadeUp} custom={1.5}
              className="font-sans text-sm font-medium tracking-wide mb-6"
              style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
              Lost in translation? Not anymore.
            </motion.p>

            {/* Sub */}
            <motion.p variants={fadeUp} custom={2}
              className="font-sans text-lg max-w-[480px] mx-auto mb-10 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.52)" }}>
              Paste a YouTube URL, pick your language, and get the video dubbed in the original speaker&apos;s voice — right in your browser.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} custom={3} className="flex gap-3 justify-center flex-wrap">
              <Link href="/sign-up" className="btn-ai px-8 py-4 text-base"
                style={{ boxShadow: "0 0 36px rgba(0,227,253,0.28)" }}>
                Start Dubbing Free
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link href="/sign-in"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-semibold text-base transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.62)", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.62)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                Sign In
              </Link>
            </motion.div>

            {/* Trust pills */}
            <motion.div variants={fadeUp} custom={4}
              className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-9 text-xs font-sans"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              {["No credit card required", "Free to start", "ElevenLabs powered"].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckIcon className="w-3 h-3 shrink-0" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>
        </section>
      </motion.div>

      {/* ── Language Marquee ── */}
      <div className="relative z-10 py-4 overflow-hidden"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="marquee-container">
          <div className="marquee-track">
            {[...LANGUAGES, ...LANGUAGES, ...LANGUAGES, ...LANGUAGES].map((lang, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-xs font-sans shrink-0 mx-6"
                style={{ color: "rgba(255,255,255,0.38)" }}>
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "#00e3fd", opacity: 0.6 }} />
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <ScrollReveal className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
          <p className="text-label-md mb-3" style={{ color: "#00e3fd" }}>By the numbers</p>
          <h2 className="font-display font-bold text-[2rem] text-white">Built for Global Scale</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { stat: "13+", label: "Languages" },
            { stat: "AI", label: "Voice Cloning" },
            { stat: "< 3 min", label: "Processing" },
            { stat: "Free", label: "To Start" },
          ].map(({ stat, label }, i) => (
            <motion.div key={label} variants={fadeUp} custom={i + 1}
              className="text-center rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="font-display font-extrabold text-[2rem] mb-1 leading-none"
                style={{ background: "linear-gradient(90deg, #00e3fd, #ffffff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {stat}
              </p>
              <p className="text-[0.7rem] font-sans tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.38)" }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ── How It Works ── */}
      <ScrollReveal className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <motion.div variants={fadeUp} custom={0} className="text-center mb-14">
          <p className="text-label-md mb-3" style={{ color: "#00e3fd" }}>Simple. Fast. Free.</p>
          <h2 className="font-display font-bold text-[2rem] text-white">How It Works</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map(({ num, title, desc }, i) => (
            <motion.div key={num} variants={fadeUp} custom={i + 1}
              className="relative rounded-2xl p-7 group transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="block font-display font-extrabold text-[4rem] mb-3 leading-none select-none"
                style={{ color: "rgba(0,227,253,0.09)" }}>
                {num}
              </span>
              <h3 className="font-display font-semibold text-white text-lg mb-2">{title}</h3>
              <p className="text-sm font-sans leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ── Feature Cards ── */}
      <ScrollReveal className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div variants={fadeUp} custom={0} className="text-center mb-14">
          <p className="text-label-md mb-3" style={{ color: "#00e3fd" }}>Everything you need</p>
          <h2 className="font-display font-bold text-[2rem] text-white">One Platform. Every Language.</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, title, desc }, i) => (
            <motion.div key={title} variants={fadeUp} custom={i + 1}
              className="rounded-2xl p-7 cursor-default transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 32px rgba(0,227,253,0.08)", borderColor: "rgba(0,227,253,0.2)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(0,227,253,0.1)", color: "#00e3fd" }}>
                {icon}
              </div>
              <h3 className="font-display font-semibold text-white text-lg mb-2">{title}</h3>
              <p className="text-sm font-sans leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ── Bottom CTA ── */}
      <ScrollReveal className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div variants={fadeUp} custom={0}
          className="relative rounded-3xl overflow-hidden px-10 py-16 text-center"
          style={{ background: "linear-gradient(135deg, rgba(0,6,102,0.92) 0%, rgba(0,104,117,0.55) 100%)", border: "1px solid rgba(0,227,253,0.14)" }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(0,227,253,0.09) 0%, transparent 65%)", transform: "translate(30%,-30%)" }} />
          <motion.p variants={fadeUp} custom={1} className="text-label-md mb-4" style={{ color: "#00e3fd" }}>Get started today</motion.p>
          <motion.h2 variants={fadeUp} custom={2} className="font-display font-extrabold text-[2.4rem] text-white mb-4 leading-tight">
            Break the Language Barrier.
          </motion.h2>
          <motion.p variants={fadeUp} custom={3} className="font-sans max-w-sm mx-auto mb-8 text-sm"
            style={{ color: "rgba(255,255,255,0.48)" }}>
            13 languages. AI voice cloning. One paste away.
          </motion.p>
          <motion.div variants={fadeUp} custom={4}>
            <Link href="/sign-up" className="btn-ai px-10 py-4 text-base inline-flex"
              style={{ boxShadow: "0 0 44px rgba(0,227,253,0.28)" }}>
              Start Dubbing Free
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </ScrollReveal>

      {/* ── Footer ── */}
      <footer className="relative z-10 text-center py-7 font-sans text-xs"
        style={{ color: "rgba(255,255,255,0.18)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        Powered by ElevenLabs AI · Built with Next.js ·{" "}
        <span style={{ color: "rgba(0,227,253,0.4)" }}>DUBS</span>
      </footer>
    </main>
  );
}
