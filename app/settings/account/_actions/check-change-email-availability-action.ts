"use server";

import { authUserEmailExists } from "@/server/auth/auth-user-email-exists";
import {
  CHANGE_EMAIL_CHECK_FAILED_MESSAGE,
  getChangeEmailAvailability,
  type ChangeEmailAvailability,
} from "@/server/auth/get-change-email-availability";

export type CheckChangeEmailAvailabilityState = {
  fieldErrors?: {
    newEmail?: string;
  };
  message: string;
  ok: boolean;
};

export async function checkChangeEmailAvailabilityAction(
  _previousState: ChangeEmailAvailability,
  formData: FormData,
): Promise<CheckChangeEmailAvailabilityState> {
  try {
    const submittedEmail = formData.get("newEmail");

    if (typeof submittedEmail !== "string") {
      return {
        ok: false,
        fieldErrors: {
          newEmail: "Enter a new email address.",
        },
        message: "Please fix the highlighted field.",
      };
    }

    const availability = await getChangeEmailAvailability(
      submittedEmail,
      authUserEmailExists,
    );

    if (!availability.ok) {
      return {
        ok: false,
        fieldErrors: {
          newEmail: availability.message,
        },
        message: availability.message,
      };
    }

    return {
      message: "",
      ok: true,
    };
  } catch (error) {
    console.error("Failed to check change email availability.", error);

    return {
      ok: false,
      fieldErrors: {
        newEmail: CHANGE_EMAIL_CHECK_FAILED_MESSAGE,
      },
      message: CHANGE_EMAIL_CHECK_FAILED_MESSAGE,
    };
  }
}
