import type { Metadata } from "next";
import { LoginForm } from "@/components/shared/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In – BRaket",
  description:
    "Sign in to BRaket and access talent discovery and commission opportunities for Bicol University students.",
};

export default function LoginPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
          Welcome back
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Sign in to your BRaket account to continue
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
