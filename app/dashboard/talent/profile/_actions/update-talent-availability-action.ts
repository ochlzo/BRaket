"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { isTalentAvailabilityStatus } from "@/lib/talent-profile/availability";
import { requireCurrentAppUser } from "@/server/users/current-user";

export async function updateTalentAvailabilityAction(formData: FormData) {
  const user = await requireCurrentAppUser("talent");
  const status = String(formData.get("availabilityStatus") ?? "");

  if (!isTalentAvailabilityStatus(status)) {
    throw new Error("Choose a valid availability status.");
  }

  await prisma.talentProfile.updateMany({
    data: { availabilityStatus: status },
    where: { user_id: user.id },
  });

  revalidatePath("/browse");
  revalidatePath("/dashboard/talent/profile");

  if (user.username) {
    revalidatePath(`/talent/${user.username}`);
  }
}
