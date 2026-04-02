/**
 * Extracts the YouTube video ID from various URL formats.
 * Supports: youtu.be, youtube.com/watch, youtube.com/shorts
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
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
