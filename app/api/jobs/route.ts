import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { extractVideoId } from "@/lib/youtube";
import { createDubbingJob } from "@/lib/elevenlabs";

// POST /api/jobs — create a new dubbing job
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { youtubeUrl, targetLanguage } = await req.json();

  if (!youtubeUrl || !targetLanguage) {
    return Response.json({ error: "youtubeUrl and targetLanguage are required" }, { status: 400 });
  }

  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) {
    return Response.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  // Fetch video title via oEmbed (free, no API key)
  let videoTitle = "Untitled Video";
  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (oembedRes.ok) {
      const oembed = await oembedRes.json();
      videoTitle = oembed.title;
    }
  } catch {
    // Non-fatal — title stays as default
  }

  const supabase = createServerSupabaseClient();

  // Insert job record with "pending" status
  const { data: job, error: insertError } = await supabase
    .from("jobs")
    .insert({
      user_id: userId,
      youtube_url: youtubeUrl,
      video_id: videoId,
      video_title: videoTitle,
      target_language: targetLanguage,
      status: "pending",
    })
    .select()
    .single();

  if (insertError || !job) {
    return Response.json({ error: insertError?.message ?? "Failed to create job" }, { status: 500 });
  }

  // Kick off ElevenLabs dubbing
  try {
    const dubbing = await createDubbingJob(youtubeUrl, targetLanguage);

    // Save the dubbing_id first so it's never lost even if the status update fails
    await supabase
      .from("jobs")
      .update({ elevenlabs_dubbing_id: dubbing.dubbing_id })
      .eq("id", job.id);

    const { data: updated } = await supabase
      .from("jobs")
      .update({ status: "dubbing" })
      .eq("id", job.id)
      .select()
      .single();

    return Response.json(updated ?? { ...job, status: "dubbing", elevenlabs_dubbing_id: dubbing.dubbing_id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    await supabase
      .from("jobs")
      .update({ status: "failed", error_message: message })
      .eq("id", job.id);

    return Response.json({ error: message }, { status: 502 });
  }
}

// DELETE /api/jobs — delete all jobs for the current user
export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("user_id", userId);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

// GET /api/jobs — list all jobs for the current user
export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
