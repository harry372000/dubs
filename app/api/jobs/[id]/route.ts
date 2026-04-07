import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getDubbingStatus, getDubbedAudio } from "@/lib/elevenlabs";

// GET /api/jobs/[id] — poll job status; downloads & stores audio when ready
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }

  // Terminal states — return immediately
  if (job.status === "done" || job.status === "failed") {
    return Response.json(job);
  }

  // Check ElevenLabs whenever we have a dubbing_id (handles "pending" with saved ID too)
  if (job.elevenlabs_dubbing_id && (job.status === "dubbing" || job.status === "pending")) {
    try {
      const status = await getDubbingStatus(job.elevenlabs_dubbing_id);

      if (status.status === "dubbed") {
        // Download dubbed audio from ElevenLabs
        const buffer = await getDubbedAudio(job.elevenlabs_dubbing_id, job.target_language);
        const bytes = new Uint8Array(buffer);

        // Upload to Supabase Storage
        const path = `${userId}/${id}/dubbed_${job.target_language}.mp3`;
        const { error: uploadError } = await supabase.storage
          .from("dubbed-audio")
          .upload(path, bytes, { contentType: "audio/mpeg", upsert: true });

        if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
          .from("dubbed-audio")
          .getPublicUrl(path);

        // Mark job as done
        const { data: done } = await supabase
          .from("jobs")
          .update({ status: "done", audio_url: publicUrl })
          .eq("id", id)
          .select()
          .single();

        return Response.json(done ?? { ...job, status: "done", audio_url: publicUrl });
      }

      if (status.status === "failed") {
        const message = status.error ?? "Dubbing failed on ElevenLabs";
        await supabase
          .from("jobs")
          .update({ status: "failed", error_message: message })
          .eq("id", id);

        return Response.json({ ...job, status: "failed", error_message: message });
      }
    } catch (err) {
      // Transient error — don't change job state, return current
      console.error("[jobs/[id]] status check error:", err);
    }
  }

  return Response.json(job);
}
