export const CHANGE_EMAIL_REQUIRED_MESSAGE =
  "Enter a new email address.";
export const CHANGE_EMAIL_EXISTS_MESSAGE =
  "This email is already in use.";
export const CHANGE_EMAIL_CHECK_FAILED_MESSAGE =
  "We couldn't verify this email right now.";

export type ChangeEmailAvailability =
  | { ok: true }
  | { ok: false; message: string };

export type AuthUserEmailExists = (email: string) => Promise<boolean>;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getChangeEmailAvailability(
  email: string,
  emailExists: AuthUserEmailExists,
): Promise<ChangeEmailAvailability> {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return {
      ok: false,
      message: CHANGE_EMAIL_REQUIRED_MESSAGE,
    };
  }

  if (await emailExists(normalizedEmail)) {
    return {
      ok: false,
      message: CHANGE_EMAIL_EXISTS_MESSAGE,
    };
  }

  return { ok: true };
}
