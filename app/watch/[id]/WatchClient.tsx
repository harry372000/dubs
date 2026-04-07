"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Job } from "@/lib/types";
import { SUPPORTED_LANGUAGES, JOB_STATUS_LABELS } from "@/lib/constants";
import { PlayIcon, PauseIcon, FullscreenIcon, SpeakerIcon } from "@/components/icons";
import PageLoader from "@/components/PageLoader";

declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement | string, opts: object) => YouTubePlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; BUFFERING: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
}

interface Props {
  job: Job;
}

function formatTime(sec: number) {
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

export default function WatchClient({ job: initialJob }: Props) {
  const [job, setJob] = useState<Job>(initialJob);
  const [ytReady, setYtReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef<YouTubePlayer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const langLabel = SUPPORTED_LANGUAGES.find((l) => l.code === job.target_language)?.label ?? job.target_language;

  // Poll job status until done
  const poll = useCallback(async () => {
    if (job.status === "done" || job.status === "failed") return;
    const res = await fetch(`/api/jobs/${job.id}`);
    const data: Job = await res.json();
    setJob(data);
    if (data.status === "done" || data.status === "failed") {
      if (pollRef.current) clearInterval(pollRef.current);
    }
  }, [job.id, job.status]);

  useEffect(() => {
    if (job.status !== "done" && job.status !== "failed") {
      pollRef.current = setInterval(poll, 6000);
      return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }
  }, [job.status, poll]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (job.status !== "done") return;
    if (window.YT) { setYtReady(true); return; }
    window.onYouTubeIframeAPIReady = () => setYtReady(true);
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  }, [job.status]);

  // Initialize player
  useEffect(() => {
    if (!ytReady || !playerContainerRef.current || !job.audio_url) return;

    playerRef.current = new window.YT.Player(playerContainerRef.current, {
      videoId: job.video_id,
      // controls:0 removes ALL YouTube controls including the volume button
      playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1, mute: 1, disablekb: 1, fs: 0 },
      events: {
        onReady: (event: { target: YouTubePlayer }) => {
          event.target.mute();
          setDuration(event.target.getDuration());
        },
        onStateChange: (event: { data: number }) => {
          const audio = audioRef.current;
          if (!audio || !playerRef.current) return;

          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            const ytTime = playerRef.current.getCurrentTime();
            if (Math.abs(audio.currentTime - ytTime) > 0.5) {
              audio.currentTime = ytTime;
            }
            audio.play().catch(() => {});
            // Tick timer
            timeRef.current = setInterval(() => {
              setCurrentTime(playerRef.current?.getCurrentTime() ?? 0);
            }, 500);
          } else if (
            event.data === window.YT.PlayerState.PAUSED ||
            event.data === window.YT.PlayerState.ENDED
          ) {
            setIsPlaying(false);
            audio.pause();
            if (timeRef.current) clearInterval(timeRef.current);
            if (event.data === window.YT.PlayerState.ENDED) setCurrentTime(0);
          }
        },
      },
    });

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
      if (timeRef.current) clearInterval(timeRef.current);
    };
  }, [ytReady, job.video_id, job.audio_url]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    playerRef.current?.seekTo(t, true);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const handleFullscreen = () => {
    wrapperRef.current?.requestFullscreen().catch(() => {});
  };

  // ── Render states ──

  if (job.status === "failed") {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="card">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-headline-md text-on-surface mb-3">Dubbing Failed</h2>
          <p className="font-sans text-on-surface-variant text-sm mb-6">{job.error_message}</p>
          <a href="/dashboard" className="btn-primary">Back to Dashboard</a>
        </div>
      </main>
    );
  }

  if (job.status !== "done") {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="card text-center">

          {/* Video thumbnail with overlay */}
          {job.video_id && (
            <div className="relative w-full rounded-xl overflow-hidden mb-8 aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${job.video_id}/hqdefault.jpg`}
                alt={job.video_title ?? "Video"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}>
                <div className="text-center">
                  <p className="text-label-md text-white/60 mb-1">AI IS WORKING</p>
                  <p className="font-display font-bold text-white text-lg">
                    {JOB_STATUS_LABELS[job.status]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tile loader */}
          <PageLoader compact label={`Dubbing into ${langLabel} — usually 1–3 minutes`} />

          <p className="text-xs font-sans text-outline mt-2">Auto-refreshing every 6 seconds…</p>
        </div>
      </main>
    );
  }

  // Done — player
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-5xl mx-auto px-6 py-10"
    >
      {/* Header */}
      <div className="mb-5">
        <p className="text-label-md text-on-surface-variant mb-1">{langLabel} dub</p>
        <h1 className="text-headline-md text-on-surface">{job.video_title ?? "Video"}</h1>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="badge badge-done">Dubbed</span>
        <span className="badge badge-pending">Voice Cloned</span>
        <span className="badge badge-pending">{langLabel}</span>
      </div>

      {/* Player wrapper */}
      <div ref={wrapperRef} className="card p-0 overflow-hidden mb-5 rounded-2xl"
        style={{ background: "#000" }}>

        {/* YouTube iframe — no controls, always muted */}
        <div className="aspect-video w-full bg-black" ref={playerContainerRef} />

        {/* Custom control bar */}
        <div className="px-4 py-3 flex items-center gap-3"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>

          {/* Play / Pause */}
          <button onClick={togglePlay}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110"
            style={{ background: "linear-gradient(90deg, #006875, #00e3fd)" }}>
            {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Time */}
          <span className="text-xs font-mono text-white/60 shrink-0 w-20">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Seek bar */}
          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00e3fd ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) 0%)`,
                accentColor: "#00e3fd",
              }}
            />
          </div>

          {/* Dubbed audio badge */}
          <span className="text-[0.6rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0 hidden sm:block"
            style={{ background: "rgba(0,227,253,0.12)", color: "#00e3fd", border: "1px solid rgba(0,227,253,0.2)" }}>
            {langLabel} audio
          </span>

          {/* Fullscreen */}
          <button onClick={handleFullscreen}
            className="shrink-0 transition-opacity hover:opacity-100 opacity-60">
            <FullscreenIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dubbed audio notice */}
      <div className="glass-dark rounded-xl px-5 py-4 flex items-center gap-4 mb-6">
        <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center"
          style={{ background: "rgba(0,227,253,0.08)", border: "1px solid rgba(0,227,253,0.2)" }}>
          <SpeakerIcon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-display font-semibold text-on-surface">
            {langLabel} dubbed audio is playing
          </p>
          <p className="text-xs font-sans text-on-surface-variant">
            Video visuals only — English audio is fully disabled
          </p>
        </div>
      </div>

      {/* Hidden audio element */}
      {job.audio_url && (
        <audio ref={audioRef} src={job.audio_url} preload="auto" className="hidden" />
      )}

      <a href="/dashboard" className="text-sm font-sans text-secondary hover:underline">
        ← Back to Dashboard
      </a>
    </motion.main>
  );
}
