"use client";

import type { ReactNode } from "react";
import { GoogleAuthButton } from "@/components/shared/auth/google-auth-button";
import { type AuthMode } from "@/lib/auth/session";
import { useOtpAuth } from "@/components/shared/auth/use-otp-auth";
import { OtpAuthFormView } from "@/components/shared/auth/otp-auth-form.view";

type OtpAuthFormProps = {
  callbackUrl?: string;
  email?: string;
  mode: AuthMode;
  passwordFieldAction?: ReactNode;
  setEmail?: (value: string) => void;
};

export function OtpAuthForm({
  callbackUrl,
  email,
  mode,
  passwordFieldAction,
  setEmail,
}: OtpAuthFormProps) {
  const auth = useOtpAuth(mode, { callbackUrl, email, setEmail });

  return (
    <OtpAuthFormView
      mode={mode}
      {...auth}
      googleAuthAction={
        <GoogleAuthButton
          isSignup={auth.isSignup}
          disabled={
            auth.isSending || auth.isStartingGoogleAuth || auth.isVerifying
          }
          onClick={() => {
            void auth.continueWithGoogle();
          }}
        />
      }
      passwordFieldAction={passwordFieldAction}
    />
  );
}
