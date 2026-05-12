"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ArrowRightIcon,
  PasswordInput,
} from "@/components/shared/auth/auth-form.shared";
import {
  buildGoogleOAuthFlowPath,
  getGoogleOAuthEntryPath,
  type GoogleOAuthMode,
  type GoogleOAuthRole,
} from "@/lib/auth/google-oauth";
import {
  validatePasswordResetChange,
  type PasswordResetValidationResult,
} from "@/lib/auth/password-reset";
import { createClient } from "@/lib/supabase/client";

const READY_MESSAGE =
  "Create a password to finish adding email sign-in to your Google account.";
const SESSION_REQUIRED_MESSAGE =
  "Continue with Google again to create a password for this account.";

type OAuthCreatePasswordFormProps = {
  mode: GoogleOAuthMode;
  role: GoogleOAuthRole;
};

function validatePasswordChange(
  password: string,
  confirmPassword: string,
): PasswordResetValidationResult {
  return validatePasswordResetChange(password, confirmPassword);
}

export function OAuthCreatePasswordForm({
  mode,
  role,
}: OAuthCreatePasswordFormProps) {
  const router = useRouter();
  const [supabase] = useState(createClient);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [hasSession, setHasSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadSession() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!isActive) return;

      setIsChecking(false);

      if (userError || !user) {
        setHasSession(false);
        setStatus("");
        setError(SESSION_REQUIRED_MESSAGE);
        return;
      }

      setError("");
      setHasSession(true);
      setStatus(READY_MESSAGE);
    }

    void loadSession();

    return () => {
      isActive = false;
    };
  }, [supabase]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!hasSession) {
      setError(SESSION_REQUIRED_MESSAGE);
      return;
    }

    const validation = validatePasswordChange(password, confirmPassword);

    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    setIsSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setIsSaving(false);
      setError(updateError.message);
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (
      sessionError ||
      !session?.access_token ||
      !session.refresh_token
    ) {
      setIsSaving(false);
      setError(SESSION_REQUIRED_MESSAGE);
      return;
    }

    const linkResponse = await fetch("/api/auth/link-email-provider", {
      body: JSON.stringify({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
      }),
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    });

    const linkResult = (await linkResponse.json().catch(() => null)) as
      | { message?: string; ok?: boolean }
      | null;

    if (!linkResponse.ok || !linkResult?.ok) {
      setIsSaving(false);
      setError(
        linkResult?.message ??
          "We could not finish adding email sign-in yet. Please try again.",
      );
      return;
    }

    router.replace(buildGoogleOAuthFlowPath("/auth/complete", mode, role));
    router.refresh();
  };

  const returnHref = getGoogleOAuthEntryPath(mode);

  return (
    <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
      <div className="space-y-2">
        <Label
          htmlFor="oauth-create-password"
          className="text-sm font-medium text-foreground"
        >
          Create Password
        </Label>
        <PasswordInput
          id="oauth-create-password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="oauth-confirm-password"
          className="text-sm font-medium text-foreground"
        >
          Confirm Password
        </Label>
        <PasswordInput
          id="oauth-confirm-password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>

      {error ? (
        <p
          className="rounded-xl border border-[color:var(--tone-red-soft)] bg-[color:var(--tone-red-soft)] px-4 py-3 text-sm text-[color:var(--tone-red-deep)]"
          role="alert"
        >
          {error}
        </p>
      ) : status ? (
        <p className="rounded-xl border border-[color:var(--tone-sky-soft)] bg-[color:var(--tone-sky-soft)] px-4 py-3 text-sm text-[color:var(--tone-sky-deep)]">
          {status}
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-xl bg-gradient-to-r from-[color:var(--brand-orange)] to-[color:var(--brand-orange-accent)] text-sm font-semibold text-white shadow-[var(--shadow-brand-orange-md)] transition-all hover:shadow-[var(--shadow-brand-orange-lg)] hover:brightness-105 active:scale-[0.98]"
        disabled={isChecking || isSaving || !hasSession}
      >
        {isChecking
          ? "Checking Session..."
          : isSaving
            ? "Saving Password..."
            : "Continue"}
        <ArrowRightIcon />
      </Button>

      <div className="text-center text-sm text-[color:var(--ink-muted)]">
        Want to restart sign-in?{" "}
        <a
          href={returnHref}
          className="font-semibold text-[color:var(--brand-orange)] transition-colors hover:text-[color:var(--brand-orange-strong)]"
        >
          Return to auth
        </a>
      </div>
    </form>
  );
}
