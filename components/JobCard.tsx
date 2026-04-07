import Link from "next/link";
import { Job } from "@/lib/types";
import { SUPPORTED_LANGUAGES, JOB_STATUS_LABELS } from "@/lib/constants";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const langLabel = SUPPORTED_LANGUAGES.find((l) => l.code === job.target_language)?.label ?? job.target_language;
  const statusLabel = JOB_STATUS_LABELS[job.status] ?? job.status;
  const createdAt = new Date(job.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="card flex gap-4 animate-fade-in">
      {/* Thumbnail */}
      <div className="w-28 h-16 shrink-0 rounded-lg overflow-hidden bg-surface-container relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${job.video_id}/mqdefault.jpg`}
          alt={job.video_title ?? "Video"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-display font-semibold text-on-surface truncate mb-1">
          {job.video_title ?? "Untitled Video"}
        </p>
        <p className="text-xs font-sans text-on-surface-variant mb-2">
          {langLabel} · {createdAt}
        </p>

        {/* Status */}
        <div className="flex items-center gap-3">
          <span className={`badge badge-${job.status}`}>
            {job.status === "dubbing" && (
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            )}
            {statusLabel}
          </span>

          {job.status === "done" && (
            <Link
              href={`/watch/${job.id}`}
              target="_blank"
              className="text-xs font-sans font-medium text-secondary hover:underline"
            >
              Watch →
            </Link>
          )}

          {job.status === "failed" && job.error_message && (
            <span className="text-xs font-sans text-red-500 truncate max-w-[200px]">
              {job.error_message}
            </span>
          )}
        </div>
      </div>

      {/* Progress shimmer for dubbing */}
      {job.status === "dubbing" && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 shimmer rounded-full" />
      )}
    </div>
  );
}
