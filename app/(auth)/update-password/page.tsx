import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/shared/auth/update-password-form";
import { isPasswordRecoveryAttempt } from "@/lib/auth/password-reset";

export const metadata: Metadata = {
  title: "Update Password - BRaket",
  description:
    "Set a new password for your BRaket account after opening the password reset link from your email.",
};

type UpdatePasswordPageProps = {
  searchParams: Promise<{
    recovery?: string;
  }>;
};

export default async function UpdatePasswordPage({
  searchParams,
}: UpdatePasswordPageProps) {
  const { recovery } = await searchParams;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
          Set a new password
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Choose a new password to finish recovering your BRaket account.
        </p>
      </div>

      <UpdatePasswordForm isRecoveryAttempt={isPasswordRecoveryAttempt(recovery)} />
    </div>
  );
}
