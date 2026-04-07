const BASE_URL = "https://api.elevenlabs.io/v1";

function apiKey() {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set");
  return key;
}

export interface DubbingJob {
  dubbing_id: string;
  expected_duration_sec: number;
}

export interface DubbingStatus {
  dubbing_id: string;
  name: string;
  status: "dubbing" | "dubbed" | "failed";
  target_languages: string[];
  error?: string;
}

/**
 * Creates a dubbing job from a YouTube URL.
 * ElevenLabs handles: audio extraction, voice cloning, translation, TTS.
 */
export async function createDubbingJob(
  youtubeUrl: string,
  targetLang: string
): Promise<DubbingJob> {
  const form = new FormData();
  form.append("source_url", youtubeUrl);
  form.append("target_lang", targetLang);
  form.append("num_speakers", "0"); // auto-detect speaker count
  form.append("watermark", "true");

  const res = await fetch(`${BASE_URL}/dubbing`, {
    method: "POST",
    headers: { "xi-api-key": apiKey() },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ElevenLabs dubbing failed (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * Polls the status of an existing dubbing job.
 */
export async function getDubbingStatus(dubbingId: string): Promise<DubbingStatus> {
  const res = await fetch(`${BASE_URL}/dubbing/${dubbingId}`, {
    headers: { "xi-api-key": apiKey() },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ElevenLabs status check failed (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * Downloads the dubbed audio as an ArrayBuffer.
 * Only call once status is "dubbed".
 */
export async function getDubbedAudio(
  dubbingId: string,
  targetLang: string
): Promise<ArrayBuffer> {
  const res = await fetch(`${BASE_URL}/dubbing/${dubbingId}/audio/${targetLang}`, {
    headers: { "xi-api-key": apiKey() },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ElevenLabs audio download failed (${res.status}): ${text}`);
  }

  return res.arrayBuffer();
}
