"use client";

import { useState } from "react";
import { ForgotPasswordForm } from "@/components/shared/auth/forgot-password-form";
import { OtpAuthForm } from "@/components/shared/auth/otp-auth-form";

type LoginFormProps = {
  initialError?: string;
  initialNotice?: string;
};

export function LoginForm({ initialError, initialNotice }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [isRequestingPasswordReset, setIsRequestingPasswordReset] =
    useState(false);

  if (isRequestingPasswordReset) {
    return (
      <ForgotPasswordForm
        email={email}
        setEmail={setEmail}
        onBack={() => setIsRequestingPasswordReset(false)}
      />
    );
  }

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

      {initialNotice ? (
        <p className="rounded-xl border border-[color:var(--tone-sky-soft)] bg-[color:var(--tone-sky-soft)] px-4 py-3 text-sm text-[color:var(--tone-sky-deep)]">
          {initialNotice}
        </p>
      ) : null}

      <OtpAuthForm
        email={email}
        mode="login"
        passwordFieldAction={
          <a
            href="#forgot-password"
            onClick={(event) => {
              event.preventDefault();
              setIsRequestingPasswordReset(true);
            }}
            className="text-sm font-semibold text-[color:var(--brand-orange)] transition-colors hover:text-[color:var(--brand-orange-strong)]"
          >
            Forgot password
          </a>
        }
        setEmail={setEmail}
      />
    </div>
  );
}
