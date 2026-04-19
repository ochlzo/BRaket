"use client";

import { useState } from "react";
import { ForgotPasswordForm } from "@/components/shared/auth/forgot-password-form";
import { OtpAuthFormView } from "@/components/shared/auth/otp-auth-form.view";
import { useOtpAuth } from "@/components/shared/auth/use-otp-auth";

type LoginFormProps = {
  initialNotice?: string;
};

export function LoginForm({ initialNotice }: LoginFormProps) {
  const auth = useOtpAuth("login");
  const [isRequestingPasswordReset, setIsRequestingPasswordReset] =
    useState(false);

  if (isRequestingPasswordReset) {
    return (
      <ForgotPasswordForm
        email={auth.email}
        setEmail={auth.setEmail}
        onBack={() => setIsRequestingPasswordReset(false)}
      />
    );
  }

  return (
    <div className="space-y-5">
      {initialNotice ? (
        <p className="rounded-xl border border-[color:var(--tone-sky-soft)] bg-[color:var(--tone-sky-soft)] px-4 py-3 text-sm text-[color:var(--tone-sky-deep)]">
          {initialNotice}
        </p>
      ) : null}

      <OtpAuthFormView
        mode="login"
        {...auth}
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
      />
    </div>
  );
}
