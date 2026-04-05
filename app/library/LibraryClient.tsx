"use client";

import { motion, cubicBezier } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Job } from "@/lib/types";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { PlayIcon, LibraryIcon } from "@/components/icons";

interface Props {
  jobs: Job[];
}

const EASE = cubicBezier(0.22, 1, 0.36, 1);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.55, ease: EASE },
  }),
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function LibraryClient({ jobs }: Props) {
  const [filter, setFilter] = useState<string>("all");

  const languages = Array.from(new Set(jobs.map((j) => j.target_language)));
  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.target_language === filter);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <p className="text-label-md text-on-surface-variant mb-3">Your Collection</p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-[2.4rem] font-extrabold tracking-tight text-on-surface leading-[1.1]">
              My{" "}
              <span style={{ background: "linear-gradient(90deg, #000666, #006875, #00e3fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Library
              </span>
            </h1>
            <p className="text-on-surface-variant font-sans text-sm mt-1">
              {jobs.length} dubbed {jobs.length === 1 ? "video" : "videos"} ready to watch
            </p>
          </div>

          {/* Language filter */}
          {languages.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`text-xs font-sans font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                  filter === "all"
                    ? "bg-primary text-white"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-high"
                }`}
              >
                All
              </button>
              {languages.map((lang) => {
                const label = SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.label ?? lang;
                return (
                  <button
                    key={lang}
                    onClick={() => setFilter(lang)}
                    className={`text-xs font-sans font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                      filter === lang
                        ? "bg-primary text-white"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-high"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-24 rounded-3xl"
          style={{ background: "var(--color-empty-bg)", border: "1px dashed var(--color-empty-border)" }}
        >
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center bg-surface-container">
            <LibraryIcon className="w-7 h-7" />
          </div>
          <p className="font-display font-semibold text-on-surface text-lg mb-2">
            {filter === "all" ? "Your library is empty" : "No videos in this language"}
          </p>
          <p className="font-sans text-on-surface-variant text-sm mb-6">
            {filter === "all"
              ? "Dub a video from the dashboard and it'll appear here when ready."
              : "Try a different language filter or dub a new video."}
          </p>
          <Link href="/dashboard" className="btn-primary text-sm">
            Go to Dashboard
          </Link>
        </motion.div>
      )}

      {/* Video grid */}
      {filtered.length > 0 && (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((job, i) => {
            const langLabel = SUPPORTED_LANGUAGES.find((l) => l.code === job.target_language)?.label ?? job.target_language;
            const date = new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

            return (
              <motion.div
                key={job.id}
                variants={fadeUp}
                custom={i}
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] bg-surface-lowest"
                style={{ boxShadow: "0 4px 24px var(--color-card-shadow)" }}
                whileHover={{ boxShadow: "0 8px 40px var(--color-card-shadow)" }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-surface-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${job.video_id}/mqdefault.jpg`}
                    alt={job.video_title ?? "Video"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "rgba(0,6,102,0.5)" }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                      <PlayIcon className="w-7 h-7 ml-0.5" />
                    </div>
                  </div>
                  {/* Language badge */}
                  <span className="absolute top-3 left-3 text-[0.65rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(0,6,102,0.85)", color: "#00e3fd", backdropFilter: "blur(8px)" }}>
                    {langLabel}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="font-display font-semibold text-on-surface text-sm leading-snug mb-1 line-clamp-2">
                    {job.video_title ?? "Untitled Video"}
                  </p>
                  <p className="text-xs font-sans text-on-surface-variant mb-3">{date}</p>

                  <Link
                    href={`/watch/${job.id}`}
                    target="_blank"
                    className="btn-ai w-full justify-center text-xs py-2.5"
                  >
                    <PlayIcon className="w-3.5 h-3.5" />
                    Watch Dubbed
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </main>
  );
}
