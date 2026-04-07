import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { Job } from "@/lib/types";
import Navbar from "@/components/Navbar";
import TranslateForm from "@/components/TranslateForm";
import JobStatusPoller from "@/components/JobStatusPoller";
import DashboardHero from "@/components/DashboardHero";
import StatsCards from "@/components/StatsCards";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createServerSupabaseClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  const doneCount = jobs?.filter((j) => j.status === "done").length ?? 0;
  const activeCount = jobs?.filter((j) => j.status === "dubbing" || j.status === "pending").length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Hero */}
        <DashboardHero />

        {/* Bento grid — 12 col */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left: Translate form — 7 cols */}
          <div className="lg:col-span-7">
            <TranslateForm />
          </div>

          {/* Right: Stats + Recent — 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-5">

            {/* Stats row */}
            <StatsCards
              total={jobs?.length ?? 0}
              done={doneCount}
              active={activeCount}
            />

            {/* Recent translations */}
            <JobStatusPoller initialJobs={(jobs as Job[]) ?? []} />
          </div>
        </div>

        {/* Intelligence Engine banner */}
        <div className="mt-14 rounded-3xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #000666 0%, #1a237e 55%, #006875 100%)" }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #00e3fd 0%, transparent 70%)", transform: "translate(30%,-30%)" }} />
          <div className="relative z-10 px-10 py-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-label-md text-secondary-container mb-2">Powered by AI</p>
              <h3 className="font-display font-bold text-[1.5rem] text-white mb-1">Intelligence Engine</h3>
              <p className="font-sans text-white/55 max-w-sm text-sm">
                ElevenLabs voice cloning · Auto speaker detection · 13+ target languages
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              {[
                { stat: "13+", sub: "Languages" },
                { stat: "AI", sub: "Voice Clone" },
                { stat: "Free", sub: "To Start" },
              ].map(({ stat, sub }) => (
                <div key={sub} className="px-5 py-3 rounded-xl text-center"
                  style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
                  <p className="text-xl font-display font-bold text-white">{stat}</p>
                  <p className="text-[0.65rem] font-sans text-white/55 tracking-wide uppercase mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
