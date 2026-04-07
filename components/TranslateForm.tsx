"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { extractVideoId } from "@/lib/youtube";
import { PlayIcon, DubbingIcon } from "@/components/icons";
import LanguagePicker from "@/components/LanguagePicker";

export default function TranslateForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [lang, setLang] = useState("hi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const videoId = extractVideoId(url);
  const isValid = Boolean(videoId);
  const selectedLang = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  const langSupported = selectedLang?.supported ?? true;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid || loading || !langSupported) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: url, targetLanguage: lang }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start job");

      router.push(`/watch/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card w-full max-w-2xl mx-auto">
      <p className="text-label-md text-on-surface-variant mb-3">Paste a YouTube URL</p>
      <h2 className="text-headline-md text-on-surface mb-8">Translate &amp; Dub a Video</h2>

      {/* URL input */}
      <div className="mb-4">
        <label className="block text-sm font-sans font-medium text-on-surface-variant mb-2">
          YouTube URL
        </label>
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 rounded-xl bg-surface-highest font-sans text-sm text-on-surface placeholder:text-outline outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-surface-lowest transition"
            required
          />
          {url && (
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-sans font-medium ${isValid ? "text-secondary" : "text-red-500"}`}>
              {isValid ? "✓ Valid" : "Invalid URL"}
            </span>
          )}
        </div>
      </div>

      {/* Language selector */}
      <div className="mb-6">
        <label className="block text-sm font-sans font-medium text-on-surface-variant mb-2">
          Target Language
        </label>
        <LanguagePicker value={lang} onChange={setLang} />
      </div>

      {/* Thumbnail preview */}
      {videoId && (
        <div className="mb-6 rounded-xl overflow-hidden bg-surface-container aspect-video w-full relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <PlayIcon className="w-6 h-6 ml-0.5" />
            </div>
          </div>
        </div>
      )}

      {/* Unsupported language warning */}
      {!langSupported && (
        <p className="mb-4 px-4 py-3 rounded-lg bg-amber-50 text-amber-700 text-sm font-sans">
          This language isn&apos;t supported by ElevenLabs Dubbing yet. Please choose another language.
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm font-sans">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || loading || !langSupported}
        className="btn-ai w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Starting Dubbing Job...
          </>
        ) : (
          <>
            <DubbingIcon className="w-5 h-5" />
            Translate &amp; Dub Now
          </>
        )}
      </button>
    </form>
  );
}
