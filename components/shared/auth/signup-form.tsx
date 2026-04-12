"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRightIcon,
  GoogleIcon,
  MailIcon,
  PasswordInput,
  UserIcon,
} from "@/components/shared/auth/auth-form.shared";

export function SignUpForm() {
  const router = useRouter();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [userType, setUserType] = useState<"client" | "talent">("client");

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
        localStorage.setItem(
          "braket_session",
          JSON.stringify({ type: userType, username: "new-user" }),
        );
        router.push("/");
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
          {userType === "talent" ? "University Email" : "Email Address"}
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
            <MailIcon />
          </div>
          <Input
            id="signup-email"
            type="email"
            placeholder={
              userType === "talent" ? "you@bicol-u.edu.ph" : "you@example.com"
            }
            className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 text-sm placeholder:text-[color:var(--ink-soft)] focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20"
          />
        </div>
        {userType === "talent" && (
          <p className="text-xs text-[color:var(--ink-soft)]">
            Use your official Bicol University email address for verification.
          </p>
        )}
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
          placeholder="Create a strong password"
        />
        <p className="text-xs text-[color:var(--ink-soft)]">
          Must be at least 8 characters with a number and symbol
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="signup-confirm-password"
          className="text-sm font-medium text-foreground"
        >
          Confirm Password
        </Label>
        <PasswordInput
          id="signup-confirm-password"
          placeholder="Re-enter your password"
        />
      </div>

      {userType === "talent" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label
              htmlFor="signup-school-id"
              className="text-sm font-medium text-foreground"
            >
              School ID (Upload)
            </Label>
            <FileInput
              id="signup-school-id"
              accept="image/*"
              required={userType === "talent"}
            />
            <p className="text-xs text-[color:var(--ink-soft)]">
              Please upload a clear picture of your Bicol University ID to
              verify your student status.
            </p>
            <div className="mt-2 rounded-lg bg-[color:var(--tone-amber-soft)] p-3 text-xs font-medium text-[color:var(--tone-amber-deep)]">
              ℹ️ Note: Pending admin verification of your school email and ID
              before your profile goes live.
            </div>
          </div>
        </div>
      )}

      {showOtp && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <Label
            htmlFor="signup-otp"
            className="text-sm font-medium text-foreground"
          >
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

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="agree-terms"
          className="mt-0.5 size-4 cursor-pointer rounded border-[color:var(--line-strong)] accent-[color:var(--brand-orange)]"
        />
        <Label
          htmlFor="agree-terms"
          className="cursor-pointer text-sm leading-snug text-[color:var(--ink-muted)]"
        >
          I agree to the{" "}
          <a
            href="#"
            className="font-medium text-[color:var(--brand-blue)] hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="font-medium text-[color:var(--brand-blue)] hover:underline"
          >
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-xl bg-gradient-to-r from-[color:var(--brand-orange)] to-[color:var(--brand-orange-accent)] text-sm font-semibold text-white shadow-[var(--shadow-brand-orange-md)] transition-all hover:shadow-[var(--shadow-brand-orange-lg)] hover:brightness-105 active:scale-[0.98]"
      >
        {showOtp ? "Create Account" : "Send Verification Code"}
        <ArrowRightIcon />
      </Button>

      <div className="relative flex items-center gap-4 py-1">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-[color:var(--ink-soft)]">
          or continue with
        </span>
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
