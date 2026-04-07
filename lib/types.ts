export type JobStatus = "pending" | "dubbing" | "done" | "failed";

export interface Job {
  id: string;
  user_id: string;
  youtube_url: string;
  video_id: string;
  video_title: string | null;
  source_language: string;
  target_language: string;
  status: JobStatus;
  elevenlabs_dubbing_id: string | null;
  audio_url: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}
