export const SIGNUP_EMAIL_REQUIRED_MESSAGE =
  "Enter your email address to continue.";
export const SIGNUP_EMAIL_EXISTS_MESSAGE =
  "An account with this email already exists. Sign in instead.";
export const SIGNUP_EMAIL_CHECK_FAILED_MESSAGE =
  "We couldn't verify this email right now. Please try again.";

export type SignupEmailAvailability =
  | { ok: true }
  | { ok: false; message: string };

export type AuthUserEmailExists = (email: string) => Promise<boolean>;

function normalizeSignupEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getSignupEmailAvailability(
  email: string,
  emailExists: AuthUserEmailExists,
): Promise<SignupEmailAvailability> {
  const normalizedEmail = normalizeSignupEmail(email);

  if (!normalizedEmail) {
    return {
      ok: false,
      message: SIGNUP_EMAIL_REQUIRED_MESSAGE,
    };
  }

  if (await emailExists(normalizedEmail)) {
    return {
      ok: false,
      message: SIGNUP_EMAIL_EXISTS_MESSAGE,
    };
  }

  return { ok: true };
}
