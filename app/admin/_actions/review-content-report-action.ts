"use server";

import { revalidatePath } from "next/cache";

import { requireAdminUser } from "@/server/admin/access";
import { updateContentReportReview } from "@/server/moderation/admin-review";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function updateContentReportReviewAction(formData: FormData) {
  const admin = await requireAdminUser();

  await updateContentReportReview({
    adminNotes: readText(formData, "adminNotes"),
    reportId: readText(formData, "reportId"),
    reviewerEmail: admin.email,
    status: readText(formData, "status"),
  });

  revalidatePath("/admin");
}
