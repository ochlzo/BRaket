import type { Metadata } from "next";
import { SignUpForm } from "@/components/shared/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Account – BRaket",
  description:
    "Create your BRaket account and start showcasing your skills, building your portfolio, and earning through commissions at Bicol University.",
};

export default async function SignUpPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
          Create your account
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Join the BRaket community and start your journey
        </p>
      </div>

      <SignUpForm />
    </div>
  );
}
