"use server";

import { revalidatePath } from "next/cache";

import {
  getServiceMediaObjectPath,
  removeUploadedServiceAssets,
} from "@/app/onboarding/talent/_lib/talent-service-media-upload";
import { prisma } from "@/lib/prisma";
import { clearCurrentAppUserCache, getCurrentAppUser } from "@/server/users/current-user";

export async function deleteTalentServiceAction(serviceId: string) {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return { message: "Your session expired. Please sign in again.", ok: false };
  }

  const ownedService = await prisma.service.findFirst({
    select: {
      ServiceMedia: { select: { mediaUrl: true } },
      serviceId: true,
    },
    where: {
      serviceId,
      TalentProfile: { user_id: currentUser.id },
    },
  });

  if (!ownedService) {
    return { message: "We could not find that service.", ok: false };
  }

  await prisma.$transaction(async (tx) => {
    await tx.contentReport.deleteMany({
      where: { targetId: serviceId, targetType: "SERVICE" },
    });

    await tx.service.delete({
      where: { serviceId },
    });
  });

  const objectPaths = ownedService.ServiceMedia.map((media) =>
    getServiceMediaObjectPath(media.mediaUrl),
  ).filter((path): path is string => Boolean(path));

  if (objectPaths.length > 0) {
    await removeUploadedServiceAssets(
      objectPaths.map((objectPath) => ({ objectPath, publicUrl: "" })),
    ).catch(() => {});
  }

  clearCurrentAppUserCache(currentUser.authId);
  revalidatePath("/dashboard/talent");
  revalidatePath("/dashboard/talent/profile");
  revalidatePath("/dashboard/talent/services");

  return { message: "Service deleted.", ok: true };
}
