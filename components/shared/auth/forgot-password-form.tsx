"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRightIcon,
  AUTH_FORM_AUTO_COMPLETE,
  MailIcon,
} from "@/components/shared/auth/auth-form.shared";
import {
  buildPasswordResetRedirectTo,
  getPasswordResetSentMessage,
  PASSWORD_RESET_EMAIL_REQUIRED_MESSAGE,
} from "@/lib/auth/password-reset";
import { createClient } from "@/lib/supabase/client";

type ForgotPasswordFormProps = {
  email: string;
  onBack: () => void;
  setEmail: (value: string) => void;
};

export function ForgotPasswordForm({
  email,
  onBack,
  setEmail,
}: ForgotPasswordFormProps) {
  const [supabase] = useState(createClient);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("");

  const normalizedEmail = email.trim().toLowerCase();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!normalizedEmail) {
      setError(PASSWORD_RESET_EMAIL_REQUIRED_MESSAGE);
      return;
    }

    setIsSending(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: buildPasswordResetRedirectTo(window.location.origin),
      },
    );
    setIsSending(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setEmail(normalizedEmail);
    setStatus(getPasswordResetSentMessage(normalizedEmail));
  };

  return (
    <form
      autoComplete={AUTH_FORM_AUTO_COMPLETE}
      className="space-y-5"
      onSubmit={(event) => void handleSubmit(event)}
    >
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-[-0.03em] text-foreground">
          Reset your password
        </h2>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Enter the email on your BRaket account and we&apos;ll send you a
          password reset link.
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="forgot-password-email"
          className="text-sm font-medium text-foreground"
        >
          Email Address
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
            <MailIcon />
          </div>
          <Input
            id="forgot-password-email"
            type="email"
            autoComplete={AUTH_FORM_AUTO_COMPLETE}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
          />
        </div>
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
        disabled={isSending}
      >
        {isSending ? "Sending Reset Link..." : "Send Reset Link"}
        <ArrowRightIcon />
      </Button>

      <div className="text-center text-sm text-[color:var(--ink-muted)]">
        Remembered your password?{" "}
        <a
          href="#login"
          onClick={(event) => {
            event.preventDefault();
            onBack();
          }}
          className="font-semibold text-[color:var(--brand-orange)] transition-colors hover:text-[color:var(--brand-orange-strong)]"
        >
          Back to sign in
        </a>
      </div>
    </form>
  );
}
