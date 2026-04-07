import PageLoader from "@/components/PageLoader";

export default function SignInLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <PageLoader label="Loading sign-in…" />
    </main>
  );
}
