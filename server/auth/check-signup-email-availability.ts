"use server";

import { authUserEmailExists } from "@/server/auth/auth-user-email-exists";
import {
  getSignupEmailAvailability,
  SIGNUP_EMAIL_CHECK_FAILED_MESSAGE,
  type SignupEmailAvailability,
} from "@/server/auth/get-signup-email-availability";

export async function checkSignupEmailAvailability(
  email: string,
): Promise<SignupEmailAvailability> {
  try {
    return await getSignupEmailAvailability(email, authUserEmailExists);
  } catch (error) {
    console.error("Failed to check signup email availability.", error);

    return {
      ok: false,
      message: SIGNUP_EMAIL_CHECK_FAILED_MESSAGE,
    };
  }
}
