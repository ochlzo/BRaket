"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRightIcon,
  MailIcon,
  PasswordInput,
} from "@/components/shared/auth/auth-form.shared";
import type { AuthMode } from "@/lib/auth/session";
import type { UserRole } from "@/lib/types";

type OtpAuthFormViewProps = {
  code: string;
  email: string;
  error: string;
  handleSubmit: (form: HTMLFormElement) => Promise<void>;
  isSending: boolean;
  isSignup: boolean;
  isVerifying: boolean;
  mode: AuthMode;
  normalizedEmail: string;
  passwordFieldAction?: ReactNode;
  requestCode: () => Promise<void>;
  role: UserRole;
  setCode: (value: string) => void;
  setEmail: (value: string) => void;
  setRole: (value: UserRole) => void;
  resetToPassword: () => void;
  status: string;
  step: "password" | "code";
};

function roleLabel(role: UserRole) {
  return role === "talent" ? "Talent" : "Client";
}

export function OtpAuthFormView({
  code,
  email,
  error,
  handleSubmit,
  isSending,
  isSignup,
  isVerifying,
  mode,
  normalizedEmail,
  passwordFieldAction,
  requestCode,
  role,
  setCode,
  setEmail,
  setRole,
  resetToPassword,
  status,
  step,
}: OtpAuthFormViewProps) {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(e.currentTarget);
      }}
    >
      <div className="space-y-2">
        <Label
          htmlFor={`${mode}-email`}
          className="text-sm font-medium text-foreground"
        >
          Email Address
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
            <MailIcon />
          </div>
          <Input
            id={`${mode}-email`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isSignup ? "you@bicol-u.edu.ph" : "you@example.com"}
            className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
          />
        </div>
      </div>

      {step === "password" && (
        <>
          {isSignup ? (
            <>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm Password
                </Label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                {passwordFieldAction}
              </div>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </div>
          )}
        </>
      )}

      {step === "code" && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <Label
              htmlFor={`${mode}-otp`}
              className="text-sm font-medium text-foreground"
            >
              Verification Code
            </Label>
            <Input
              id={`${mode}-otp`}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="123456"
              className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm tracking-[0.4em] placeholder:tracking-normal placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
            />
            <p className="text-xs text-[color:var(--ink-soft)]">
              Enter the 6-digit code we sent to{" "}
              {normalizedEmail || "your email"}.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-[color:var(--line-strong)] bg-white text-sm font-medium text-foreground transition-all hover:bg-[color:var(--surface-alt)] hover:shadow-sm active:scale-[0.98]"
              onClick={resetToPassword}
            >
              Back to password
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-[color:var(--line-strong)] bg-white text-sm font-medium text-foreground transition-all hover:bg-[color:var(--surface-alt)] hover:shadow-sm active:scale-[0.98]"
              onClick={() => void requestCode()}
              disabled={isSending}
            >
              {isSignup ? "Resend confirmation code" : "Resend code"}
            </Button>
          </div>
        </div>
      )}

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
        disabled={isSending || isVerifying}
      >
        {step === "code"
          ? isVerifying
            ? "Verifying..."
            : "Verify Code"
          : isSignup
            ? isSending
              ? "Creating Account..."
              : "Create Account"
            : isSending
              ? "Signing In..."
              : "Sign In"}
        <ArrowRightIcon />
      </Button>

      {step === "password" && !isSignup && (
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl border-[color:var(--line-strong)] bg-white text-sm font-medium text-foreground transition-all hover:bg-[color:var(--surface-alt)] hover:shadow-sm active:scale-[0.98]"
          onClick={() => void requestCode()}
          disabled={isSending}
        >
          Use email code instead
        </Button>
      )}

      <div className="relative flex items-center gap-4 py-1">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-[color:var(--ink-soft)]">
          {isSignup
            ? "Account creation completes after code verification"
            : "Password is primary, code is available as a fallback"}
        </span>
        <Separator className="flex-1" />
      </div>

      <p className="pt-1 text-center text-sm text-[color:var(--ink-muted)]">
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <a
          href={isSignup ? "/login" : "/signup"}
          className="font-semibold text-[color:var(--brand-orange)] transition-colors hover:text-[color:var(--brand-orange-strong)]"
        >
          {isSignup ? "Sign in" : "Create one"}
        </a>
      </p>
    </form>
  );
}
