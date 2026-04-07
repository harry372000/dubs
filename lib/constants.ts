import { JobStatus } from "@/lib/types";

// Languages fully supported by ElevenLabs Dubbing API
export const SUPPORTED_LANGUAGES = [
  { code: "hi", label: "Hindi", supported: true },
  { code: "es", label: "Spanish", supported: true },
  { code: "fr", label: "French", supported: true },
  { code: "de", label: "German", supported: true },
  { code: "pt", label: "Portuguese", supported: true },
  { code: "ar", label: "Arabic", supported: true },
  { code: "zh", label: "Chinese (Simplified)", supported: true },
  { code: "ja", label: "Japanese", supported: true },
  { code: "ko", label: "Korean", supported: true },
  { code: "ru", label: "Russian", supported: true },
  { code: "it", label: "Italian", supported: true },
  { code: "tr", label: "Turkish", supported: true },
  { code: "id", label: "Indonesian", supported: true },
  // Not yet supported by ElevenLabs Dubbing
  { code: "mr", label: "Marathi (Coming Soon)", supported: false },
  { code: "bn", label: "Bengali (Coming Soon)", supported: false },
  { code: "ur", label: "Urdu (Coming Soon)", supported: false },
];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  pending:  "Queued",
  dubbing:  "Dubbing in progress…",
  done:     "Ready to watch",
  failed:   "Failed",
};
