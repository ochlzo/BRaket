import type { Metadata } from "next";
import { SignUpForm } from "@/components/shared/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Account – BRaket",
  description:
    "Create your BRaket account with a password and confirm it with an email OTP to start showcasing your skills, building your portfolio, and earning through commissions at Bicol University.",
};

export default function SignUpPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
          Create your account
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Choose your account type, set a password, then confirm with a 6-digit email code.
        </p>
      </div>

      <SignUpForm />
    </div>
  );
}
