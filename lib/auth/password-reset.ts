export const PASSWORD_RESET_EMAIL_REQUIRED_MESSAGE =
  "Enter your email address to continue.";
export const PASSWORD_RESET_MIN_LENGTH_MESSAGE =
  "Password must be at least 8 characters long.";
export const PASSWORD_RESET_CONFIRM_MISMATCH_MESSAGE =
  "Passwords do not match.";
export const PASSWORD_RESET_SESSION_REQUIRED_MESSAGE =
  "Open the password reset link from your email to set a new password.";

export type PasswordResetValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export function buildPasswordResetRedirectTo(siteUrl: string) {
  return new URL("/update-password", siteUrl).toString();
}

export function getPasswordResetSentMessage(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return `If an account exists for ${normalizedEmail}, we sent a password reset link.`;
}

export function validatePasswordResetChange(
  password: string,
  confirmPassword: string,
): PasswordResetValidationResult {
  if (password.length < 8) {
    return {
      ok: false,
      message: PASSWORD_RESET_MIN_LENGTH_MESSAGE,
    };
  }

  if (password !== confirmPassword) {
    return {
      ok: false,
      message: PASSWORD_RESET_CONFIRM_MISMATCH_MESSAGE,
    };
  }

  return { ok: true };
}
