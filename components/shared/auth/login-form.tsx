"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRightIcon,
  GoogleIcon,
  MailIcon,
  PasswordInput,
} from "@/components/shared/auth/auth-form.shared";

export function LoginForm() {
  const router = useRouter();

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        localStorage.setItem(
          "braket_session",
          JSON.stringify({ type: "talent", username: "maria-santos" }),
        );
        router.push("/dashboard/talent");
      }}
    >
      <div className="space-y-2">
        <Label
          htmlFor="login-email"
          className="text-sm font-medium text-foreground"
        >
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
          <Label
            htmlFor="login-password"
            className="text-sm font-medium text-foreground"
          >
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
        <Label
          htmlFor="remember-me"
          className="cursor-pointer text-sm text-[color:var(--ink-muted)]"
        >
          Keep me signed in
        </Label>
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-xl bg-gradient-to-r from-[color:var(--brand-orange)] to-[color:var(--brand-orange-accent)] text-sm font-semibold text-white shadow-[var(--shadow-brand-orange-md)] transition-all hover:shadow-[var(--shadow-brand-orange-lg)] hover:brightness-105 active:scale-[0.98]"
      >
        Sign In
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

