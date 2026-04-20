"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  getAuthRedirectPath,
  resolveAppSession,
  saveAppSession,
} from "@/lib/auth/session";
import {
  buildGoogleOAuthMetadataPatch,
  GOOGLE_OAUTH_FAILED_MESSAGE,
  getGoogleOAuthEntryPath,
  readGoogleOAuthContext,
  resolveGoogleOAuthMode,
} from "@/lib/auth/google-oauth";
import { createClient } from "@/lib/supabase/client";

export function OAuthComplete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  const oauthContext = useMemo(
    () => readGoogleOAuthContext(searchParams),
    [searchParams],
  );

  useEffect(() => {
    let isActive = true;

    async function finalizeGoogleAuth() {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!isActive) return;

      if (userError || !user?.email) {
        setError(GOOGLE_OAUTH_FAILED_MESSAGE);
        return;
      }

      const userMetadata = (user.user_metadata ?? null) as Record<
        string,
        unknown
      > | null;
      const resolvedMode = resolveGoogleOAuthMode(oauthContext.mode, userMetadata);
      const metadataPatch = buildGoogleOAuthMetadataPatch(
        user.email,
        oauthContext.role,
        userMetadata,
      );

      if (metadataPatch) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: metadataPatch,
        });

        if (updateError) {
          console.error("Failed to persist Google auth metadata.", updateError);
        }
      }

      const nextUserMetadata = {
        ...(userMetadata ?? {}),
        ...(metadataPatch ?? {}),
      };
      const session = resolveAppSession({
        email: user.email,
        fallbackRole: oauthContext.role,
        mode: resolvedMode,
        userMetadata: nextUserMetadata,
      });

      saveAppSession(session);
      router.replace(getAuthRedirectPath(session.type, resolvedMode));
      router.refresh();
    }

    void finalizeGoogleAuth();

    return () => {
      isActive = false;
    };
  }, [oauthContext.mode, oauthContext.role, router]);

  const returnHref = getGoogleOAuthEntryPath(oauthContext.mode);

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-[color:var(--line-strong)] bg-white p-8 shadow-[var(--shadow-panel-elevated)]">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground">
          Finishing Google sign-in
        </h1>
        <p className="text-sm leading-6 text-[color:var(--ink-muted)]">
          We&apos;re verifying your Google session and preparing your BRaket
          account.
        </p>
      </div>

      {error ? (
        <div className="mt-6 space-y-4">
          <p
            className="rounded-xl border border-[color:var(--tone-red-soft)] bg-[color:var(--tone-red-soft)] px-4 py-3 text-sm text-[color:var(--tone-red-deep)]"
            role="alert"
          >
            {error}
          </p>
          <Button
            type="button"
            className="h-11 w-full rounded-xl bg-gradient-to-r from-[color:var(--brand-orange)] to-[color:var(--brand-orange-accent)] text-sm font-semibold text-white shadow-[var(--shadow-brand-orange-md)] transition-all hover:shadow-[var(--shadow-brand-orange-lg)] hover:brightness-105 active:scale-[0.98]"
            onClick={() => {
              window.location.href = returnHref;
            }}
          >
            Return to auth
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-[color:var(--tone-sky-soft)] bg-[color:var(--tone-sky-soft)] px-4 py-3 text-sm text-[color:var(--tone-sky-deep)]">
          <span className="size-2 animate-pulse rounded-full bg-[color:var(--brand-blue)]" />
          Redirecting you now...
        </div>
      )}
    </div>
  );
}
