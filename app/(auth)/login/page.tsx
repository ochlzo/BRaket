import type { Metadata } from "next";
import { LoginForm } from "@/components/shared/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In - BRaket",
  description:
    "Sign in to BRaket with Google, your password, or a 6-digit email code to access talent discovery and commission opportunities for Bicol University students.",
};

type LoginPageProps = {
  searchParams: Promise<{
    authError?: string;
    reset?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { authError, reset } = await searchParams;
  const initialNotice =
    reset === "success"
      ? "Your password was updated. Sign in with your new password."
      : undefined;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
          Welcome back
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Sign in with Google, your password, or a 6-digit email code.
        </p>
      </div>

      <LoginForm initialError={authError} initialNotice={initialNotice} />
    </div>
  );
}
