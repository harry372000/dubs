/**
 * Extracts the YouTube video ID from various URL formats.
 * Supports: youtu.be, youtube.com/watch, youtube.com/shorts, youtube.com/embed
 */
export function extractVideoId(url: string): string | null {
  // Use URL parsing for standard watch URLs so that `v` works in any position
  // in the query string (e.g. ?list=PL123&v=VIDEO_ID).
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtube.com") {
      const v = parsed.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    }
  } catch {
    // Not a valid URL — fall through to regex patterns
  }

  // Regex patterns for non-watch formats (youtu.be, shorts, embed)
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Returns the YouTube thumbnail URL for a given video ID.
 */
export function getThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
