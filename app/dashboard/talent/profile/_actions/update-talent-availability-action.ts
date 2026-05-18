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

  const updatedRows = await prisma.$executeRaw`
    update "TalentProfile"
    set
      "availability_status" = cast(${status} as talent_availability_status),
      "updatedAt" = now()
    where "user_id" = ${user.id}
  `;

  if (updatedRows === 0) {
    throw new Error("We could not find your talent profile.");
  }

  revalidatePath("/browse");
  revalidatePath("/dashboard/talent/profile");

  if (user.username) {
    revalidatePath(`/talent/${user.username}`);
  }

  return { availabilityStatus: status };
}
