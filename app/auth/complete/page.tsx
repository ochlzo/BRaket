import { Suspense } from "react";
import type { Metadata } from "next";
import { OAuthComplete } from "@/components/shared/auth/oauth-complete";

export const metadata: Metadata = {
  title: "Completing Sign In - BRaket",
  description:
    "Finish your Google sign-in and continue to your BRaket account.",
};

function AuthCompleteFallback() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-[color:var(--line-strong)] bg-white p-8 shadow-[var(--shadow-panel-elevated)]">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground">
          Finishing Google sign-in
        </h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          Preparing your BRaket account...
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-[color:var(--tone-sky-soft)] bg-[color:var(--tone-sky-soft)] px-4 py-3 text-sm text-[color:var(--tone-sky-deep)]">
        <span className="size-2 animate-pulse rounded-full bg-[color:var(--brand-blue)]" />
        Loading auth details...
      </div>
    </div>
  );
}

export default function AuthCompletePage() {
  return (
    <main className="min-h-screen bg-[color:var(--surface)] px-6 py-10">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <Suspense fallback={<AuthCompleteFallback />}>
          <OAuthComplete />
        </Suspense>
      </div>
    </main>
  );
}
