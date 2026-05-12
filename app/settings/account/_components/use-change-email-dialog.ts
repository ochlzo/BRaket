"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { buildDisplayName } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";

import { checkChangeEmailAvailabilityAction } from "../_actions/check-change-email-availability-action";

export type ChangeEmailUserContext = {
  authId: string;
  firstName: string;
  id: string;
  lastName: string;
  role: UserRole;
  username: string;
};

type UseChangeEmailDialogArgs = {
  currentEmail: string;
  currentUser: ChangeEmailUserContext;
  onEmailCommitted: (email: string) => void;
  onOpenChange: (open: boolean) => void;
};

type ChangeEmailStep = "email" | "password" | "otp" | "updating";

export function useChangeEmailDialog({
  currentEmail,
  currentUser,
  onEmailCommitted,
  onOpenChange,
}: UseChangeEmailDialogArgs) {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<ChangeEmailStep>("email");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newEmailError, setNewEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isCheckingEmail, startEmailCheckTransition] = useTransition();
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);

  const normalizedCurrentEmail = currentEmail.trim().toLowerCase();
  const normalizedNewEmail = newEmail.trim().toLowerCase();
  const displayName = buildDisplayName(
    currentUser.firstName,
    currentUser.lastName,
    currentUser.username || normalizedCurrentEmail,
  );
  const subtitle =
    step === "email"
      ? "Review your current email, then enter a new one to continue."
      : step === "password"
        ? "Enter your password to continue to the next step."
        : step === "otp"
          ? `Enter the OTP that was sent to ${normalizedNewEmail} finish the change.`
          : "Updating email...";

  function resetDialog() {
    setStep("email");
    setNewEmail("");
    setPassword("");
    setOtpCode("");
    setNewEmailError("");
    setPasswordError("");
    setOtpError("");
    setIsSubmittingPassword(false);
    setIsSubmittingOtp(false);
  }

  function closeDialog() {
    resetDialog();
    onOpenChange(false);
  }

  async function finalizeChange(accessToken: string) {
    const response = await fetch("/api/auth/change-email/complete", {
      body: JSON.stringify({ accessToken }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const payload = (await response.json().catch(() => ({}))) as {
      message?: string;
      ok?: boolean;
    };

    if (!response.ok || !payload.ok) {
      setOtpError(
        payload.message ||
          "We could not finish updating your email yet. Please try again.",
      );
      setStep("otp");
      return false;
    }

    onEmailCommitted(normalizedNewEmail);
    closeDialog();
    router.refresh();
    return true;
  }

  function handleCheckNewEmail() {
    setNewEmailError("");
    setPasswordError("");
    setOtpError("");

    startEmailCheckTransition(async () => {
      const formData = new FormData();
      formData.set("newEmail", newEmail);

      const result = await checkChangeEmailAvailabilityAction(
        { message: "", ok: false },
        formData,
      );

      if (!result.ok) {
        setNewEmailError(result.fieldErrors?.newEmail ?? result.message);
        return;
      }

      setStep("password");
    });
  }

  async function handleVerifyPassword() {
    setPasswordError("");
    setOtpError("");

    if (!password.trim()) {
      setPasswordError("Enter your password.");
      return;
    }

    setIsSubmittingPassword(true);

    const { error: passwordErrorResult } =
      await supabase.auth.signInWithPassword({
        email: normalizedCurrentEmail,
        password,
      });

    if (passwordErrorResult) {
      setIsSubmittingPassword(false);
      setPasswordError("Incorrect password.");
      return;
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email: normalizedNewEmail,
      password,
      options: {
        data: {
          authId: currentUser.authId,
          change_email_auth_id: currentUser.authId,
          change_email_display_name: displayName,
          change_email_first_name: currentUser.firstName,
          change_email_last_name: currentUser.lastName,
          change_email_user_id: currentUser.id,
          display_name: displayName,
          firstName: currentUser.firstName,
          full_name: displayName,
          lastName: currentUser.lastName,
          name: displayName,
          role: currentUser.role,
          userId: currentUser.id,
          username: currentUser.username,
        },
      },
    });

    setIsSubmittingPassword(false);

    if (signupError) {
      const message =
        typeof signupError.message === "string" ? signupError.message : "";
      if (/already registered|already in use/i.test(message)) {
        setNewEmailError("This email is already in use.");
        setStep("email");
        return;
      }

      setPasswordError(message || "We could not send the confirmation code.");
      return;
    }

    setOtpCode("");
    setStep("otp");

    if (data.session?.access_token) {
      setIsSubmittingOtp(true);
      await finalizeChange(data.session.access_token);
      setIsSubmittingOtp(false);
    }
  }

  async function handleVerifyOtp() {
    setOtpError("");

    if (!otpCode.trim()) {
      setOtpError("Enter the OTP.");
      return;
    }

    setIsSubmittingOtp(true);

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: normalizedNewEmail,
      token: otpCode.trim(),
      type: "signup",
    });

    if (verifyError || !data.session?.access_token) {
      setIsSubmittingOtp(false);
      setOtpError(
        verifyError?.message || "We could not verify that OTP yet.",
      );
      return;
    }

    setStep("updating");
    await finalizeChange(data.session.access_token);
    setIsSubmittingOtp(false);
  }

  return {
    closeDialog,
    currentEmail,
    displayName,
    handleCheckNewEmail,
    handleVerifyOtp,
    handleVerifyPassword,
    isCheckingEmail,
    isSubmittingOtp,
    isSubmittingPassword,
    newEmail,
    newEmailError,
    otpCode,
    otpError,
    password,
    passwordError,
    setNewEmail,
    setOtpCode,
    setPassword,
    step,
    subtitle,
  };
}
