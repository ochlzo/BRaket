import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/shared/auth/update-password-form";

export const metadata: Metadata = {
  title: "Update Password - BRaket",
  description:
    "Set a new password for your BRaket account after opening the password reset link from your email.",
};

export default function UpdatePasswordPage() {
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

      <UpdatePasswordForm />
    </div>
  );
}
