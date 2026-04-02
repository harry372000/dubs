import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          DUBS
        </Link>
        <UserButton afterSignOutUrl="/" />
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-10">
          Paste a YouTube URL to translate and dub it into any language.
        </p>
        {/* TranslateForm will go here in Phase 2 */}
        <div className="border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
          Translation form coming in Phase 2
        </div>
      </main>
    </div>
  );
}
