import type { Metadata } from "next";
import { SignUpForm } from "@/components/shared/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Account - BRaket",
  description:
    "Create your BRaket account with Google or email to start showcasing your skills, building your portfolio, and earning through commissions at Bicol University.",
};

type SignUpPageProps = {
  searchParams: Promise<{
    authError?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { authError } = await searchParams;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
          Create your account
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Continue with Google or use email to create a client account.
        </p>
      </div>

      <SignUpForm initialError={authError} />
    </div>
  );
}
