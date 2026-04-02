import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl font-bold tracking-tight mb-4">
          <span className="text-primary">DUBS</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Dub Universal Broadcast System
        </p>
        <p className="text-lg text-muted-foreground mb-10">
          Translate and dub any YouTube video into your language — instantly.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-up"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Get Started Free
          </Link>
          <Link
            href="/sign-in"
            className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
