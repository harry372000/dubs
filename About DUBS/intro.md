# About DUBS — What Makes It Different

> Everything you need to introduce DUBS to the world. Use this for LinkedIn posts, product pitches, investor decks, or onboarding copy.

---

## What is DUBS?

DUBS is a browser-native AI video dubbing platform. You paste a YouTube link, pick a language, and within minutes you're watching that video dubbed in the **original speaker's own cloned voice** — entirely in your browser. No downloads. No installs. No technical knowledge required.

---

## The Core Differentiators

### 1. Zero-Friction Input — A URL Is All It Takes
Every other dubbing tool requires you to upload a file, export audio, convert formats, or navigate a complex dashboard. DUBS collapses the entire process into a single text field: paste a YouTube URL, hit go. Audio extraction, voice analysis, translation, and dubbing all happen automatically in the background.

### 2. Voice Cloning — Not Text-to-Speech
This is the biggest differentiator. Most free or low-cost dubbing tools use **generic TTS voices** — the dubbed result sounds like a robot reading a script in another language. DUBS uses ElevenLabs' voice cloning technology to analyse the original speaker's voice characteristics (tone, cadence, timbre) and reproduce them in the target language. A Hindi creator dubbed into Spanish still sounds like *themselves*.

### 3. Multi-Speaker Auto-Detection
DUBS automatically detects how many speakers are present in a video and clones each voice independently. Podcasts, interviews, panel discussions — all handled without any manual configuration from the user.

### 4. Browser-Native Playback — No Exports, No Downloads
The video plays silently (YouTube visuals, no original audio) while the AI-dubbed audio streams in perfect sync through a custom built-in player. Users never leave the browser, never download a file, and never touch a third-party media player. This is how Netflix and Spotify work — not how traditional dubbing tools work.

### 5. Async Job Architecture — Submit and Come Back
Dubbing takes 1–3 minutes. Rather than locking the user in a spinner, DUBS uses an async job queue (Supabase) with a live status poller that updates every 6–8 seconds. Users can submit a job, navigate away, and return to their Library when it's done. The job persists across sessions.

### 6. 13+ Languages, With More Coming
DUBS currently supports:
Hindi · Spanish · French · German · Portuguese · Arabic · Chinese (Simplified) · Japanese · Korean · Russian · Italian · Turkish · Indonesian

Coming soon: Marathi, Bengali, Urdu — expanding access for South Asian language speakers specifically.

### 7. Free to Start — No Credit Card Required
Most voice-cloning platforms paywall the quality features behind expensive subscriptions. DUBS leads with free access. The goal is to lower the barrier to entry for content creators, students, and global audiences.

---

## How It Works (3 Steps)

```
01 — Paste a YouTube URL
     Copy any YouTube link and paste it into the DUBS input field.

02 — Choose Your Language
     Select from 13+ languages. DUBS auto-detects the source language.

03 — Watch & Listen
     Your video plays with the dubbed audio in the original speaker's voice.
     No downloads. No installs. Right in your browser.
```

---

## Tech Stack (for the technically curious)

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion |
| Auth | Clerk (sign-up, sign-in, session management, route protection) |
| AI Dubbing | ElevenLabs Dubbing API (voice cloning + translation + TTS) |
| Database | Supabase PostgreSQL (job queue, status tracking) |
| Storage | Supabase Storage (dubbed audio files, public CDN delivery) |
| Video Playback | YouTube IFrame API (muted visuals) + Web Audio API (dubbed audio) |
| Deployment | Vercel (serverless, edge-optimised) |

---

## Positioning vs. Existing Tools

| Tool | What it does | What it lacks |
|---|---|---|
| YouTube Auto-Translate | Subtitle/caption translation only | No voice dubbing at all |
| HeyGen | AI video dubbing with lip sync | Enterprise pricing, complex onboarding |
| Papercup / Deepdub | Professional dubbing pipeline | Requires content submission, not self-serve |
| ElevenLabs direct | Powerful voice API | Requires technical setup; no YouTube workflow |
| **DUBS** | **Voice-cloned dubbing, URL → browser playback, free** | — |

**DUBS is the only self-serve tool where you paste a YouTube URL and get back a voice-cloned dub, playable in your browser, in under 3 minutes, for free.**

---

## Who Is DUBS For?

- **Content creators** who want their videos accessible to global audiences without hiring a dubbing studio.
- **Students & researchers** who consume educational content in languages they don't speak fluently.
- **Language learners** who want to hear content in their target language in a familiar voice.
- **Global teams** who share video content across regions and languages.
- **Anyone** hitting the language barrier on YouTube every day.

---

## Key Numbers

| Metric | Value |
|---|---|
| Languages supported | 13+ (more coming) |
| Average processing time | < 3 minutes |
| Voice cloning | AI-powered, per-speaker |
| Price to start | Free |
| Setup required | None — paste a URL |

---

## One-Liner (for bios, pitches, posts)

> **DUBS: Paste a YouTube URL. Pick a language. Watch it dubbed in the original speaker's voice — free, in your browser, in minutes.**

---

*Built with Next.js · Powered by ElevenLabs AI · Backed by Supabase*
