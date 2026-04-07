import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { Job } from "@/lib/types";
import Navbar from "@/components/Navbar";
import LibraryClient from "./LibraryClient";

export default async function LibraryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createServerSupabaseClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "done")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LibraryClient jobs={(jobs as Job[]) ?? []} />
    </div>
  );
}
