"use client";

import { type AuthMode } from "@/lib/auth/session";
import { useOtpAuth } from "@/components/shared/auth/use-otp-auth";
import { OtpAuthFormView } from "@/components/shared/auth/otp-auth-form.view";

type OtpAuthFormProps = { mode: AuthMode };

export function OtpAuthForm({ mode }: OtpAuthFormProps) {
  const auth = useOtpAuth(mode);

  return <OtpAuthFormView mode={mode} {...auth} />;
}
