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
  PASSWORD_RESET_SESSION_REQUIRED_MESSAGE,
  validatePasswordResetChange,
} from "@/lib/auth/password-reset";
import { createClient } from "@/lib/supabase/client";

const READY_MESSAGE =
  "Enter your new password below to finish resetting your account.";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [supabase] = useState(createClient);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let isActive = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isActive) return;

      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setError("");
        setHasRecoverySession(Boolean(session));
        setIsChecking(false);
        setStatus(session ? READY_MESSAGE : "");
      }
    });

    const initialize = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!isActive) return;

      setIsChecking(false);

      if (sessionError || !session) {
        setError(PASSWORD_RESET_SESSION_REQUIRED_MESSAGE);
        setHasRecoverySession(false);
        setStatus("");
        return;
      }

      setError("");
      setHasRecoverySession(true);
      setStatus(READY_MESSAGE);
    };

    void initialize();

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!hasRecoverySession) {
      setError(PASSWORD_RESET_SESSION_REQUIRED_MESSAGE);
      return;
    }

    const validation = validatePasswordResetChange(password, confirmPassword);

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

    await supabase.auth.signOut({ scope: "local" });
    router.replace("/login?reset=success");
    router.refresh();
  };

  return (
    <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
      <div className="space-y-2">
        <Label
          htmlFor="reset-password"
          className="text-sm font-medium text-foreground"
        >
          New Password
        </Label>
        <PasswordInput
          id="reset-password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a new password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="reset-confirm-password"
          className="text-sm font-medium text-foreground"
        >
          Confirm New Password
        </Label>
        <PasswordInput
          id="reset-confirm-password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
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
        disabled={isChecking || isSaving || !hasRecoverySession}
      >
        {isChecking
          ? "Checking Reset Link..."
          : isSaving
            ? "Updating Password..."
            : "Update Password"}
        <ArrowRightIcon />
      </Button>

      <div className="text-center text-sm text-[color:var(--ink-muted)]">
        Need another reset email?{" "}
        <a
          href="/login"
          className="font-semibold text-[color:var(--brand-orange)] transition-colors hover:text-[color:var(--brand-orange-strong)]"
        >
          Return to sign in
        </a>
      </div>
    </form>
  );
}
