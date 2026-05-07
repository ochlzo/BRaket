"use client";

import { OtpAuthForm } from "@/components/shared/auth/otp-auth-form";

type SignUpFormProps = {
  initialError?: string;
};

export function SignUpForm({ initialError }: SignUpFormProps) {
  return (
    <div className="space-y-5">
      {initialError ? (
        <p
          className="rounded-xl border border-[color:var(--tone-red-soft)] bg-[color:var(--tone-red-soft)] px-4 py-3 text-sm text-[color:var(--tone-red-deep)]"
          role="alert"
        >
          {initialError}
        </p>
      ) : null}

      <OtpAuthForm mode="signup" />
    </div>
  );
}
