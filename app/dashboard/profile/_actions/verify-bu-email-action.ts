"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { clearCurrentAppUserCache } from "@/server/users/current-user";

const BU_EMAIL_DOMAIN = "@bicol-u.edu.ph";

type VerifyBuEmailResult =
  | { message: string; ok: true }
  | { message: string; ok: false };

export async function verifyBuEmailAction(): Promise<VerifyBuEmailResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id || !user.email) {
    return {
      message: "Please sign in again before verifying your BU email.",
      ok: false,
    };
  }

  const email = user.email.trim().toLowerCase();

  if (!email.endsWith(BU_EMAIL_DOMAIN)) {
    return {
      message: `Use a valid ${BU_EMAIL_DOMAIN} email address to verify your student identity.`,
      ok: false,
    };
  }

  const confirmedAt =
    (user as { confirmed_at?: string | null; email_confirmed_at?: string | null })
      .email_confirmed_at ??
    (user as { confirmed_at?: string | null; email_confirmed_at?: string | null })
      .confirmed_at;

  if (!confirmedAt) {
    return {
      message: "Confirm your BU email from your inbox before verifying here.",
      ok: false,
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      verified: true,
      verifiedEmail: email,
      verifiedProvider: "bu_email",
    },
  });

  if (updateError) {
    return {
      message: "We could not verify your BU email yet. Please try again.",
      ok: false,
    };
  }

  clearCurrentAppUserCache(user.id);
  revalidatePath("/dashboard/profile");

  return {
    message: "Your BU email has been verified.",
    ok: true,
  };
}
