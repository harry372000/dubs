import PageLoader from "@/components/PageLoader";

export default function SignUpLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <PageLoader label="Loading sign-up…" />
    </main>
  );
}
