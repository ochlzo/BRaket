"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRightIcon,
  MailIcon,
  PasswordInput,
  UserIcon,
} from "@/components/shared/auth/auth-form.shared";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPendingSignup } from "@/features/auth/authSlice";
import { sendSignupMagicLinkAction } from "@/server/auth/actions";

export function SignUpForm() {
  const dispatch = useAppDispatch();
  const [userType, setUserType] = useState<"client" | "talent">("client");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setIsSending(true);

        dispatch(
          setPendingSignup({
            email,
            firstName,
            lastName,
            userType,
          }),
        );

        const result = await sendSignupMagicLinkAction({
          email,
          firstName,
          lastName,
          userType,
        });

        setIsSending(false);
        if (!result.ok) {
          setError(result.message);
          return;
        }

        setSent(true);
      }}
    >
      <div className="flex rounded-xl bg-[color:var(--surface-alt)] p-1">
        <button
          type="button"
          onClick={() => setUserType("client")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            userType === "client"
              ? "bg-white text-foreground shadow-sm"
              : "text-[color:var(--ink-muted)] hover:text-foreground"
          }`}
        >
          Client
        </button>
        <button
          type="button"
          onClick={() => setUserType("talent")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            userType === "talent"
              ? "bg-white text-foreground shadow-sm"
              : "text-[color:var(--ink-muted)] hover:text-foreground"
          }`}
        >
          Talent
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="signup-first-name"
            className="text-sm font-medium text-foreground"
          >
            First Name
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
              <UserIcon />
            </div>
            <Input
              id="signup-first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Juan"
              className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="signup-last-name"
            className="text-sm font-medium text-foreground"
          >
            Last Name
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
              <UserIcon />
            </div>
            <Input
              id="signup-last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Dela Cruz"
              className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="signup-email"
          className="text-sm font-medium text-foreground"
        >
          Email Address
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
            <MailIcon />
          </div>
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={userType === "talent" ? "you@bicol-u.edu.ph" : "you@example.com"}
            className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="signup-password"
          className="text-sm font-medium text-foreground"
        >
          Password
        </Label>
        <PasswordInput
          id="signup-password"
          value={password}
          onChange={setPassword}
          placeholder="Create a password (not used yet)"
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-[color:var(--tone-red-deep)]">
          {error}
        </p>
      )}

      {sent && (
        <p className="text-sm text-[color:var(--ink-muted)]">
          Check your email for the magic link to finish signing up.
        </p>
      )}

      <Button
        type="submit"
        disabled={isSending}
        className="h-11 w-full rounded-xl bg-gradient-to-r from-[color:var(--brand-orange)] to-[color:var(--brand-orange-accent)] text-sm font-semibold text-white shadow-[var(--shadow-brand-orange-md)] transition-all hover:shadow-[var(--shadow-brand-orange-lg)] hover:brightness-105 active:scale-[0.98]"
      >
        {isSending ? "Sending..." : "Send OTP"}
        <ArrowRightIcon />
      </Button>

      <p className="pt-1 text-center text-sm text-[color:var(--ink-muted)]">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-[color:var(--brand-orange)] transition-colors hover:text-[color:var(--brand-orange-strong)]"
        >
          Sign in
        </a>
      </p>
    </form>
  );
}

