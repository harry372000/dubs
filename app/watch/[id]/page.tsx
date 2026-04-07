import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { Job } from "@/lib/types";
import WatchClient from "./WatchClient";
import Navbar from "@/components/Navbar";

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createServerSupabaseClient();
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !job) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <WatchClient job={job as Job} />
    </div>
  );
}
