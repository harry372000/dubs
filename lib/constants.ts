export const SUPPORTED_LANGUAGES = [
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "ar", label: "Arabic" },
  { code: "zh", label: "Chinese (Simplified)" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "ru", label: "Russian" },
  { code: "it", label: "Italian" },
  { code: "tr", label: "Turkish" },
  { code: "bn", label: "Bengali" },
  { code: "ur", label: "Urdu" },
  { code: "id", label: "Indonesian" },
];

export type JobStatus = "pending" | "transcribing" | "translating" | "dubbing" | "done" | "failed";

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  pending: "Queued",
  transcribing: "Extracting transcript...",
  translating: "Translating...",
  dubbing: "Generating dubbed audio...",
  done: "Ready",
  failed: "Failed",
};
