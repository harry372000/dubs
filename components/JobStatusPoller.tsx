"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Job } from "@/lib/types";
import { ListIcon, TrashIcon } from "@/components/icons";
import JobCard from "./JobCard";

interface Props {
  initialJobs: Job[];
}

export default function JobStatusPoller({ initialJobs }: Props) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [clearing, setClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const pollActiveJobs = useCallback(async () => {
    const active = jobs.filter((j) => j.status === "dubbing" || j.status === "pending");
    if (active.length === 0) return;

    const updates = await Promise.allSettled(
      active.map((j) => fetch(`/api/jobs/${j.id}`).then((r) => r.json() as Promise<Job>))
    );

    setJobs((prev) =>
      prev.map((job) => {
        const idx = active.findIndex((a) => a.id === job.id);
        if (idx === -1) return job;
        const result = updates[idx];
        return result.status === "fulfilled" ? result.value : job;
      })
    );
  }, [jobs]);

  useEffect(() => {
    const hasActive = jobs.some((j) => j.status === "dubbing" || j.status === "pending");
    if (!hasActive) return;
    const interval = setInterval(pollActiveJobs, 8000);
    return () => clearInterval(interval);
  }, [jobs, pollActiveJobs]);

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await fetch("/api/jobs", { method: "DELETE" });
      setJobs([]);
    } finally {
      setClearing(false);
    }
  };

  if (jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-14 rounded-2xl"
        style={{ background: "var(--color-empty-bg)", border: "1px dashed var(--color-empty-border)" }}
      >
        <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-surface-container">
          <ListIcon className="w-5 h-5" />
        </div>
        <p className="font-display font-semibold text-on-surface mb-1">No translations yet</p>
        <p className="text-sm font-sans text-on-surface-variant">Paste a YouTube URL to dub your first video.</p>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Header with count + clear button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-title-lg text-on-surface">Recent Translations</h2>
          <span className="badge badge-pending">{jobs.length}</span>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={clearing}
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium px-3 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-50"
          style={{ color: "#ba1a1a", background: "rgba(186,26,26,0.06)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(186,26,26,0.12)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(186,26,26,0.06)")}
        >
          <TrashIcon className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      {/* Confirmation dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
              onClick={() => setShowConfirm(false)}
            />
            {/* Dialog */}
            <motion.div
              className="relative z-10 rounded-2xl p-7 w-full max-w-sm"
              style={{
                background: isDark ? "rgb(var(--color-surface-container))" : "rgb(var(--color-surface-lowest))",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgb(var(--color-outline-variant))"}`,
                boxShadow: isDark ? "0 24px 60px rgba(0,0,0,0.5)" : "0 24px 60px rgba(0,6,102,0.12)",
              }}
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(186,26,26,0.1)" }}>
                <TrashIcon className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface mb-1">Remove all translations?</h3>
              <p className="text-sm font-sans text-on-surface-variant mb-6">
                This will permanently delete all jobs from your history. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-all duration-200 text-on-surface bg-surface-container hover:bg-surface-high"
                  style={{ border: `1px solid rgb(var(--color-outline-variant))` }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => { setShowConfirm(false); await handleClearAll(); }}
                  disabled={clearing}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: "rgba(186,26,26,0.12)",
                    color: isDark ? "#ff8a80" : "#ba1a1a",
                    border: "1px solid rgba(186,26,26,0.28)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(186,26,26,0.22)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(186,26,26,0.12)")}
                >
                  {clearing ? "Removing…" : "Remove all"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job list with stagger */}
      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
              transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden"
            >
              <JobCard job={job} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
