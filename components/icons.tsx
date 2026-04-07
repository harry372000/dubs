/**
 * DUBS Gradient Icon System
 * All icons use SVG linearGradient strokes/fills for the abstract gradient style.
 */

interface IconProps {
  className?: string;
  size?: number;
}

// ── Gradient definitions ──────────────────────────────────────────────────────

function GradCyanTeal({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00e3fd" />
        <stop offset="1" stopColor="#006875" />
      </linearGradient>
    </defs>
  );
}

function GradVioletCyan({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8690ee" />
        <stop offset="1" stopColor="#00e3fd" />
      </linearGradient>
    </defs>
  );
}

function GradIndigoCyan({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#000666" />
        <stop offset="0.5" stopColor="#006875" />
        <stop offset="1" stopColor="#00e3fd" />
      </linearGradient>
    </defs>
  );
}

function GradVioletTeal({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#360094" />
        <stop offset="1" stopColor="#00e3fd" />
      </linearGradient>
    </defs>
  );
}

function GradRedPink({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f43f5e" />
        <stop offset="1" stopColor="#ba1a1a" />
      </linearGradient>
    </defs>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

export function LinkIcon({ className = "w-5 h-5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradCyanTeal id="grad-link" />
      <path stroke="url(#grad-link)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  );
}

export function MicIcon({ className = "w-5 h-5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradVioletCyan id="grad-mic" />
      <path stroke="url(#grad-mic)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  );
}

export function PlayIcon({ className = "w-5 h-5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradCyanTeal id="grad-play" />
      <path fill="url(#grad-play)"
        d="M6.3 2.841A1.5 1.5 0 004.5 4.13v15.74a1.5 1.5 0 002.366 1.225l11.13-7.87a1.5 1.5 0 000-2.45L6.866 2.842A1.5 1.5 0 006.3 2.84z" />
    </svg>
  );
}

export function PauseIcon({ className = "w-5 h-5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradCyanTeal id="grad-pause" />
      <rect x="5" y="3" width="4" height="18" rx="1.5" fill="url(#grad-pause)" />
      <rect x="15" y="3" width="4" height="18" rx="1.5" fill="url(#grad-pause)" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "w-4 h-4", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradCyanTeal id="grad-arrow" />
      <path stroke="url(#grad-arrow)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

export function CheckIcon({ className = "w-3 h-3", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradCyanTeal id="grad-check" />
      <path stroke="url(#grad-check)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export function TrashIcon({ className = "w-3.5 h-3.5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradRedPink id="grad-trash" />
      <path stroke="url(#grad-trash)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

export function ListIcon({ className = "w-5 h-5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradIndigoCyan id="grad-list" />
      <path stroke="url(#grad-list)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
    </svg>
  );
}

export function QuoteIcon({ className = "w-4 h-4", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradVioletCyan id="grad-quote" />
      <path fill="url(#grad-quote)"
        d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
    </svg>
  );
}

export function SpeakerIcon({ className = "w-4 h-4", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradCyanTeal id="grad-speaker" />
      <path fill="url(#grad-speaker)"
        d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zm5.084 1.046a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
      <path fill="url(#grad-speaker)"
        d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </svg>
  );
}

export function FullscreenIcon({ className = "w-4 h-4", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradVioletTeal id="grad-fullscreen" />
      <path stroke="url(#grad-fullscreen)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  );
}

export function GlobeIcon({ className = "w-5 h-5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradVioletCyan id="grad-globe" />
      <path stroke="url(#grad-globe)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

export function SparkleIcon({ className = "w-5 h-5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradVioletCyan id="grad-sparkle" />
      <path fill="url(#grad-sparkle)"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

export function LibraryIcon({ className = "w-5 h-5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradIndigoCyan id="grad-library" />
      <path stroke="url(#grad-library)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-1.5-3.75c.621 0 1.125.504 1.125 1.125v1.5" />
    </svg>
  );
}

export function ClipboardIcon({ className = "w-5 h-5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradIndigoCyan id="grad-clipboard" />
      <path stroke="url(#grad-clipboard)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  );
}

export function CircleCheckIcon({ className = "w-5 h-5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradCyanTeal id="grad-circle-check" />
      <path stroke="url(#grad-circle-check)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function BoltIcon({ className = "w-5 h-5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradVioletCyan id="grad-bolt" />
      <path fill="url(#grad-bolt)"
        d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.268a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" />
    </svg>
  );
}

export function DubbingIcon({ className = "w-5 h-5", size }: IconProps) {
  const s = size ?? 24;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <GradVioletTeal id="grad-dubbing" />
      <path stroke="url(#grad-dubbing)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  );
}
