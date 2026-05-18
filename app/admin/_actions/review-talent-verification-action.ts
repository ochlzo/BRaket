"use server";

import { revalidatePath } from "next/cache";

import {
  approveTalentVerificationRequest,
  rejectTalentVerificationRequest,
} from "@/server/talent-verification/admin-review";
import { requireAdminUser } from "@/server/admin/access";

function readRequestId(formData: FormData) {
  const requestId = formData.get("requestId");

  if (typeof requestId !== "string" || !requestId.trim()) {
    throw new Error("Missing verification request id.");
  }

  return requestId.trim();
}

export async function approveTalentVerificationAction(formData: FormData) {
  const admin = await requireAdminUser();

  await approveTalentVerificationRequest({
    requestId: readRequestId(formData),
    reviewerEmail: admin.email,
  });

  revalidatePath("/admin");
  revalidatePath("/browse");
  revalidatePath("/onboarding/talent/verification");
  revalidatePath("/dashboard/talent/profile");
}

export async function rejectTalentVerificationAction(formData: FormData) {
  const admin = await requireAdminUser();
  const rejectionReason = formData.get("rejectionReason");

  await rejectTalentVerificationRequest({
    rejectionReason:
      typeof rejectionReason === "string" ? rejectionReason : "",
    requestId: readRequestId(formData),
    reviewerEmail: admin.email,
  });

  revalidatePath("/admin");
  revalidatePath("/onboarding/talent/verification");
  revalidatePath("/talent/verify");
}
