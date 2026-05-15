"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import type { SubmitTalentVerificationState } from "@/app/onboarding/talent/verification/_actions/submit-talent-verification-state";
import { submitTalentVerificationRequest } from "@/server/talent-verification/submit-request";
import {
  clearCurrentAppUserCache,
  getCurrentAppUser,
} from "@/server/users/current-user";

export async function submitTalentVerificationAction(
  _previousState: SubmitTalentVerificationState,
  formData: FormData,
): Promise<SubmitTalentVerificationState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return {
      message: "Your session expired. Please sign in again.",
      ok: false,
    };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id || !user.email) {
    return {
      message: "Please sign in again before submitting verification.",
      ok: false,
    };
  }

  const fileValue = formData.get("studentId");
  const file = fileValue instanceof File ? fileValue : null;
  const confirmedAt =
    (user as { confirmed_at?: string | null; email_confirmed_at?: string | null })
      .email_confirmed_at ??
    (user as { confirmed_at?: string | null; email_confirmed_at?: string | null })
      .confirmed_at ??
    null;
  const result = await submitTalentVerificationRequest({
    authId: user.id,
    confirmedAt,
    file,
    userEmail: user.email,
    userId: currentUser.id,
  });

  clearCurrentAppUserCache(currentUser.authId);
  revalidatePath("/onboarding/talent/verification");
  revalidatePath("/talent/verify");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/talent/profile");

  return result;
}
