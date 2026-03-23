"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

/* ─── Icon helpers ─── */
function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-[color:var(--ink-muted)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-[color:var(--ink-muted)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

/* ─── Shared password input ─── */
function PasswordInput({
  id,
  placeholder = "Enter your password",
}: {
  id: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
        <LockIcon />
      </div>
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 pr-10 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

/* ─── Login Form ─── */
export function LoginForm() {
  const router = useRouter();

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        localStorage.setItem("braket_session", JSON.stringify({ type: "talent", username: "maria-santos" }));
        router.push("/dashboard/talent");
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-sm font-medium text-foreground">
          Email Address
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
            <MailIcon />
          </div>
          <Input
            id="login-email"
            type="email"
            placeholder="you@bicol-u.edu.ph"
            className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <a
            href="#"
            className="text-xs font-medium text-[color:var(--brand-blue)] transition-colors hover:text-[color:var(--brand-blue-strong)]"
          >
            Forgot password?
          </a>
        </div>
        <PasswordInput id="login-password" />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remember-me"
          className="size-4 cursor-pointer rounded border-[color:var(--line-strong)] accent-[color:var(--brand-orange)]"
        />
        <Label htmlFor="remember-me" className="cursor-pointer text-sm text-[color:var(--ink-muted)]">
          Keep me signed in
        </Label>
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-xl bg-gradient-to-r from-[color:var(--brand-orange)] to-[#FF9252] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(255,107,53,0.35)] transition-all hover:shadow-[0_12px_32px_rgba(255,107,53,0.45)] hover:brightness-105 active:scale-[0.98]"
      >
        Sign In
        <ArrowRightIcon />
      </Button>

      <div className="relative flex items-center gap-4 py-1">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-[color:var(--ink-soft)]">or continue with</span>
        <Separator className="flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-xl border-[color:var(--line-strong)] bg-white text-sm font-medium text-foreground transition-all hover:bg-[color:var(--surface-alt)] hover:shadow-sm active:scale-[0.98]"
      >
        <GoogleIcon />
        Google
      </Button>

      <p className="pt-1 text-center text-sm text-[color:var(--ink-muted)]">
        Don&apos;t have an account?{" "}
        <a
          href="/signup"
          className="font-semibold text-[color:var(--brand-orange)] transition-colors hover:text-[color:var(--brand-orange-strong)]"
        >
          Create one
        </a>
      </p>
    </form>
  );
}

/* ─── Sign Up Form ─── */
export function SignUpForm() {
  const router = useRouter();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!showOtp) {
          setShowOtp(true);
          return;
        }
        if (otp !== "123456") {
          alert("Invalid OTP code. Please use 123456 for testing.");
          return;
        }
        localStorage.setItem("braket_session", JSON.stringify({ type: "client", username: "new-user" }));
        router.push("/");
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="signup-first-name" className="text-sm font-medium text-foreground">
            First Name
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
              <UserIcon />
            </div>
            <Input
              id="signup-first-name"
              type="text"
              placeholder="Juan"
              className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-last-name" className="text-sm font-medium text-foreground">
            Last Name
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
              <UserIcon />
            </div>
            <Input
              id="signup-last-name"
              type="text"
              placeholder="Dela Cruz"
              className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">
          University Email
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
              <MailIcon />
            </div>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@bicol-u.edu.ph"
              className="h-11 w-full rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-[color:var(--line-strong)] px-4 text-sm font-medium transition-colors hover:bg-[color:var(--surface-alt)]"
            onClick={() => setShowOtp(true)}
          >
            Send OTP
          </Button>
        </div>
      </div>

      {showOtp && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <Label htmlFor="signup-otp" className="text-sm font-medium text-foreground">
            Verification Code
          </Label>
          <Input
            id="signup-otp"
            type="text"
            placeholder="123456"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
          />
          <p className="text-xs text-[color:var(--ink-soft)]">
            We&apos;ve sent a 6-digit code to your email.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">
          Password
        </Label>
        <PasswordInput id="signup-password" placeholder="Create a strong password" />
        <p className="text-xs text-[color:var(--ink-soft)]">
          Must be at least 8 characters with a number and symbol
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-foreground">
          Confirm Password
        </Label>
        <PasswordInput id="signup-confirm-password" placeholder="Re-enter your password" />
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="agree-terms"
          className="mt-0.5 size-4 cursor-pointer rounded border-[color:var(--line-strong)] accent-[color:var(--brand-orange)]"
        />
        <Label htmlFor="agree-terms" className="cursor-pointer text-sm leading-snug text-[color:var(--ink-muted)]">
          I agree to the{" "}
          <a href="#" className="font-medium text-[color:var(--brand-blue)] hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="font-medium text-[color:var(--brand-blue)] hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-xl bg-gradient-to-r from-[color:var(--brand-orange)] to-[#FF9252] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(255,107,53,0.35)] transition-all hover:shadow-[0_12px_32px_rgba(255,107,53,0.45)] hover:brightness-105 active:scale-[0.98]"
      >
        Create Account
        <ArrowRightIcon />
      </Button>

      <div className="relative flex items-center gap-4 py-1">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-[color:var(--ink-soft)]">or continue with</span>
        <Separator className="flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-xl border-[color:var(--line-strong)] bg-white text-sm font-medium text-foreground transition-all hover:bg-[color:var(--surface-alt)] hover:shadow-sm active:scale-[0.98]"
      >
        <GoogleIcon />
        Google
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
