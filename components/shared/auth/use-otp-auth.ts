"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildGoogleOAuthRedirectTo } from "@/lib/auth/google-oauth";
import { createClient } from "@/lib/supabase/client";
import { checkSignupEmailAvailabilityAction } from "@/server/auth/check-signup-email-availability-action";
import {
  deriveUsername,
  getAuthRedirectPath,
  resolveAppSession,
  saveAppSession,
  type AuthMode,
} from "@/lib/auth/session";

type Step = "password" | "code";

type AuthUser = { user_metadata?: unknown } | null;
type UseOtpAuthOptions = {
  email?: string;
  setEmail?: (value: string) => void;
};

function readPassword(form: HTMLFormElement, name: string) {
  return String(new FormData(form).get(name) ?? "");
}

export function useOtpAuth(mode: AuthMode, options: UseOtpAuthOptions = {}) {
  const router = useRouter();
  const supabase = createClient();
  const [uncontrolledEmail, setUncontrolledEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("password");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isStartingGoogleAuth, setIsStartingGoogleAuth] = useState(false);
  const email = options.email ?? uncontrolledEmail;
  const setEmail = options.setEmail ?? setUncontrolledEmail;

  const normalizedEmail = email.trim().toLowerCase();
  const isSignup = mode === "signup";

  const completeSession = (user: AuthUser) => {
    const session = resolveAppSession({
      email: normalizedEmail,
      fallbackRole: "client",
      mode,
      userMetadata: user?.user_metadata as Record<string, unknown> | null,
    });

    saveAppSession(session);
    router.replace(getAuthRedirectPath(session.type, mode));
    router.refresh();
  };

  const requestCode = async () => {
    setError("");
    setStatus("");

    if (!normalizedEmail) {
      setError("Enter your email address to continue.");
      return;
    }

    setIsSending(true);
    const { error: requestError } = isSignup
      ? await supabase.auth.resend({
          email: normalizedEmail,
          type: "signup",
        })
      : await supabase.auth.signInWithOtp({
          email: normalizedEmail,
          options: { shouldCreateUser: false },
        });
    setIsSending(false);

    if (requestError) {
      setError(requestError.message);
      return;
    }

    setStep("code");
    setCode("");
    setStatus(
      isSignup
        ? `We sent a confirmation code to ${normalizedEmail}.`
        : `We sent a 6-digit code to ${normalizedEmail}.`,
    );
  };

  const continueWithGoogle = async () => {
    setError("");
    setStatus("");
    setIsStartingGoogleAuth(true);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: buildGoogleOAuthRedirectTo(
          window.location.origin,
          mode,
          "client",
        ),
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setIsStartingGoogleAuth(false);
    }
  };

  const submitPassword = async (form: HTMLFormElement) => {
    setError("");
    setStatus("");

    if (!normalizedEmail) {
      setError("Enter your email address to continue.");
      return;
    }

    if (isSignup) {
      const nextPassword = readPassword(form, "password");
      const nextConfirm = readPassword(form, "confirmPassword");

      if (nextPassword.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }

      if (nextPassword !== nextConfirm) {
        setError("Passwords do not match.");
        return;
      }

      setIsSending(true);
      const emailAvailability = await checkSignupEmailAvailabilityAction(
        normalizedEmail,
      );

      if (!emailAvailability.ok) {
        setIsSending(false);
        setError(emailAvailability.message);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: nextPassword,
        options: {
          data: {
            role: "client",
            username: deriveUsername(normalizedEmail),
          },
        },
      });
      setIsSending(false);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session?.user) {
        completeSession(data.session.user);
        return;
      }

      setStep("code");
      setStatus(`We sent a confirmation code to ${normalizedEmail}.`);
      return;
    }

    const nextPassword = readPassword(form, "password");
    setIsSending(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: nextPassword,
    });
    setIsSending(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    completeSession(data.user);
  };

  const verifyCode = async () => {
    setError("");
    setStatus("");

    const token = code.trim();
    if (token.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    setIsVerifying(true);
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token,
      type: "email",
    });
    setIsVerifying(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    completeSession(data.user);
  };

  const handleSubmit = async (form: HTMLFormElement) => {
    if (step === "password") {
      await submitPassword(form);
      return;
    }

    await verifyCode();
  };

  const resetToPassword = () => {
    setStep("password");
    setCode("");
    setStatus("");
  };

  return {
    code,
    email,
    error,
    isSending,
    isSignup,
    isStartingGoogleAuth,
    isVerifying,
    normalizedEmail,
    continueWithGoogle,
    requestCode,
    setCode,
    setEmail,
    setStep,
    resetToPassword,
    status,
    step,
    handleSubmit,
  };
}
