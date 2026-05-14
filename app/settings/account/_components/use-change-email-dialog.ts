"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { buildDisplayName } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";

import { checkChangeEmailAvailabilityAction } from "../_actions/check-change-email-availability-action";
import { syncAccountEmailAction } from "../_actions/sync-account-email-action";

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
          ? `Enter the OTP that was sent to ${normalizedNewEmail} to finish the change.`
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

    const { error: updateEmailError } = await supabase.auth.updateUser({
      email: normalizedNewEmail,
    });

    setIsSubmittingPassword(false);

    if (updateEmailError) {
      setNewEmailError(updateEmailError.message || "We could not send the confirmation email.");
      setStep("email");
      return;
    }

    setOtpCode("");
    setStep("otp");
  }

  async function handleVerifyOtp() {
    setOtpError("");

    if (!otpCode.trim()) {
      setOtpError("Enter the OTP.");
      return;
    }

    setIsSubmittingOtp(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: normalizedNewEmail,
      token: otpCode.trim(),
      type: "email_change",
    });

    if (verifyError) {
      setIsSubmittingOtp(false);
      setOtpError(verifyError?.message || "We could not verify that OTP yet.");
      return;
    }

    const syncResult = await syncAccountEmailAction();

    if (!syncResult.ok) {
      setIsSubmittingOtp(false);
      setOtpError(syncResult.message);
      return;
    }

    onEmailCommitted(syncResult.email);
    closeDialog();
    router.refresh();
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
