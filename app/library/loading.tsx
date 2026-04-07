import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";

export default function LibraryLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Header skeleton */}
        <div className="mb-10 space-y-3">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-10 w-48" />
          <div className="skeleton h-4 w-40" />
        </div>

        {/* Pulse loader */}
        <PageLoader label="Loading your library…" />

        {/* Ghost video grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 opacity-40 pointer-events-none select-none">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-surface-lowest">
              {/* Thumbnail ghost */}
              <div className="skeleton aspect-video w-full rounded-none" />
              {/* Info ghost */}
              <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-3 w-24" />
                <div className="skeleton h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
