import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Hero skeleton */}
        <div className="mb-10 space-y-3">
          <div className="skeleton h-3 w-14" />
          <div className="skeleton h-10 w-72" />
          <div className="skeleton h-4 w-96 max-w-full" />
          <div className="skeleton h-10 w-60 rounded-2xl" />
        </div>

        {/* Pulse loader */}
        <PageLoader label="Preparing your dashboard…" />

        {/* Ghost bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-8 opacity-40 pointer-events-none select-none">

          {/* Form card ghost — 7 cols */}
          <div className="lg:col-span-7 rounded-2xl p-6 bg-surface-lowest space-y-5">
            <div className="skeleton h-3 w-28" />
            <div className="skeleton h-7 w-52" />
            <div className="space-y-2">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="skeleton h-3 w-28" />
              <div className="skeleton h-12 w-full rounded-xl" />
            </div>
            <div className="skeleton h-14 w-full rounded-xl" />
          </div>

          {/* Right col ghost — 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton h-[88px] rounded-2xl" />
              ))}
            </div>
            <div className="rounded-2xl p-6 bg-surface-lowest space-y-4">
              <div className="skeleton h-5 w-40 rounded-lg" />
              {[0, 1].map((i) => (
                <div key={i} className="skeleton h-20 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
