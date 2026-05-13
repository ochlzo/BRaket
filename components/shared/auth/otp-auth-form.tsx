"use client";

import type { ReactNode } from "react";
import { GoogleAuthButton } from "@/components/shared/auth/google-auth-button";
import { type AuthMode } from "@/lib/auth/session";
import { useOtpAuth } from "@/components/shared/auth/use-otp-auth";
import { OtpAuthFormView } from "@/components/shared/auth/otp-auth-form.view";
import { Separator } from "@/components/ui/separator";

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
    <div className="space-y-5">
      <GoogleAuthButton
        isSignup={auth.isSignup}
        disabled={
          auth.isSending || auth.isStartingGoogleAuth || auth.isVerifying
        }
        onClick={() => {
          void auth.continueWithGoogle();
        }}
      />

      <div className="relative flex items-center gap-4 py-1">
        <Separator className="flex-1" />
        <span className="text-xs font-medium text-[color:var(--ink-soft)]">
          or continue with email
        </span>
        <Separator className="flex-1" />
      </div>

      <OtpAuthFormView
        mode={mode}
        {...auth}
        passwordFieldAction={passwordFieldAction}
      />
    </div>
  );
}
