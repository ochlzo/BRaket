"use server";

import { PriceUnit } from "@prisma/client";
import { revalidatePath } from "next/cache";

import {
  parseTalentServiceStepFormData,
  type TalentServiceStepDirtyField,
  type TalentServiceStepState,
  validateTalentServiceStepInput,
} from "@/app/onboarding/talent/_lib/talent-service-step";
import { validateTalentServiceCategorySelection } from "@/app/onboarding/talent/_lib/talent-service-categories";
import {
  hasDirtyField,
  parseDirtyFields,
} from "@/app/onboarding/talent/_lib/dirty-fields";
import { validateTalentOnboardingFinalization } from "@/app/onboarding/talent/_lib/talent-finalization";
import {
  getServiceMediaObjectPath,
  removeUploadedServiceAssets,
  uploadServiceMedia,
  type UploadedTalentServiceAsset,
} from "@/app/onboarding/talent/_lib/talent-service-media-upload";
import { prisma } from "@/lib/prisma";
import {
  clearCurrentAppUserCache,
  getCurrentAppUser,
} from "@/server/users/current-user";

const EMPTY_STATE: TalentServiceStepState = {
  message: "",
  ok: false,
};
const SERVICE_DIRTY_FIELDS: TalentServiceStepDirtyField[] = [
  "title",
  "description",
  "categoryIds",
  "minPrice",
  "maxPrice",
  "priceUnit",
  "media",
];

class OnboardingFinalizationError extends Error {}

export async function saveTalentServiceStepAction(
  formData: FormData,
): Promise<TalentServiceStepState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return {
      ...EMPTY_STATE,
      message: "Your session expired. Please sign in again.",
    };
  }

  const input = parseTalentServiceStepFormData(formData);
  const validation = validateTalentServiceStepInput(input);

  if (!validation.ok) {
    return validation;
  }

  const talentProfile = await prisma.talentProfile.findUnique({
    select: {
      bio: true,
      college: true,
      course: true,
      headline: true,
      talent_profile_id: true,
      TalentSkills: {
        select: {
          proficiencyLevel: true,
          Skill: { select: { name: true } },
        },
      },
      website: true,
      year_level: true,
    },
    where: { user_id: currentUser.id },
  });

  if (!talentProfile) {
    return {
      ...EMPTY_STATE,
      message: "Complete your talent profile before creating a service.",
    };
  }

  const existingService = input.serviceId
    ? await prisma.service.findFirst({
        select: {
          serviceId: true,
          ServiceMedia: { select: { mediaUrl: true, serviceDetailId: true } },
        },
        where: {
          serviceId: input.serviceId,
          talentProfileId: talentProfile.talent_profile_id,
        },
      })
    : null;

  if (input.serviceId && !existingService) {
    return {
      ...EMPTY_STATE,
      message: "We could not update that service.",
    };
  }

  const validationWithExistingMedia = validateTalentServiceStepInput({
    ...input,
    existingMediaCount: existingService?.ServiceMedia.length ?? 0,
  });

  if (!validationWithExistingMedia.ok) {
    return validationWithExistingMedia;
  }

  const selectedCategories = await prisma.category.findMany({
    select: { categoryId: true },
    where: { categoryId: { in: input.categoryIds } },
  });
  const categoryValidation = validateTalentServiceCategorySelection(
    input,
    selectedCategories.map((category) => category.categoryId),
  );

  if (!categoryValidation.ok) {
    return categoryValidation;
  }

  const dirtyFields = parseDirtyFields(formData, SERVICE_DIRTY_FIELDS);
  let uploadedAssets: UploadedTalentServiceAsset[] = [];

  try {
    if (hasDirtyField(dirtyFields, "media")) {
      uploadedAssets = await uploadServiceMedia(currentUser.authId, input.files);
    }

    await prisma.$transaction(async (tx) => {
      const serviceId = existingService?.serviceId ?? crypto.randomUUID();
      const timestamp = new Date();
      const shouldUpsertService = dirtyFields.some(
        (field) => field !== "categoryIds" && field !== "media",
      );

      if (!existingService || shouldUpsertService) {
        await tx.service.upsert({
          create: {
            description: input.description,
            maxPrice: input.maxPrice,
            minPrice: input.minPrice,
            priceUnit: input.priceUnit as PriceUnit,
            serviceId,
            talentProfileId: talentProfile.talent_profile_id,
            title: input.title,
          },
          update: {
            ...(hasDirtyField(dirtyFields, "description")
              ? { description: input.description }
              : {}),
            ...(hasDirtyField(dirtyFields, "maxPrice")
              ? { maxPrice: input.maxPrice }
              : {}),
            ...(hasDirtyField(dirtyFields, "minPrice")
              ? { minPrice: input.minPrice }
              : {}),
            ...(hasDirtyField(dirtyFields, "priceUnit")
              ? { priceUnit: input.priceUnit as PriceUnit }
              : {}),
            ...(hasDirtyField(dirtyFields, "title")
              ? { title: input.title }
              : {}),
          },
          where: { serviceId },
        });
      }

      if (!existingService || hasDirtyField(dirtyFields, "categoryIds")) {
        const categoryIds = Array.from(new Set(input.categoryIds));

        await tx.serviceCategory.deleteMany({ where: { serviceId } });
        await tx.serviceCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            categoryId,
            serviceCategoryId: crypto.randomUUID(),
            serviceId,
          })),
        });
      }

      if (uploadedAssets.length > 0) {
        await tx.serviceMedia.createMany({
          data: uploadedAssets.map((asset, index) => ({
            createdAt: new Date(timestamp.getTime() + index + 1),
            mediaUrl: asset.publicUrl,
            serviceDetailId: crypto.randomUUID(),
            serviceId,
            updatedAt: new Date(timestamp.getTime() + index + 1),
          })),
        });
      }

      if (
        existingService &&
        hasDirtyField(dirtyFields, "media") &&
        (input.removedExistingMediaUrls?.length ?? 0) > 0
      ) {
        await tx.serviceMedia.deleteMany({
          where: {
            mediaUrl: { in: input.removedExistingMediaUrls },
            serviceId,
          },
        });
      }

      const finalization = validateTalentOnboardingFinalization(talentProfile);
      if (!finalization.ok) {
        throw new OnboardingFinalizationError(
          finalization.message,
        );
      }

      await tx.user.update({
        data: { is_talent: true },
        where: { userId: currentUser.id },
      });
    });
  } catch (error) {
    await removeUploadedServiceAssets(uploadedAssets).catch(() => {});

    return {
      ...EMPTY_STATE,
      message:
        error instanceof OnboardingFinalizationError
          ? error.message
          : "We could not save your service right now.",
    };
  }

  if ((input.removedExistingMediaUrls?.length ?? 0) > 0) {
    const objectPaths = input.removedExistingMediaUrls
      .map(getServiceMediaObjectPath)
      .filter((path): path is string => Boolean(path));

    if (objectPaths.length > 0) {
      await removeUploadedServiceAssets(
        objectPaths.map((objectPath) => ({ objectPath, publicUrl: "" })),
      ).catch(() => {});
    }
  }

  clearCurrentAppUserCache(currentUser.authId);
  revalidatePath("/onboarding/talent");
  revalidatePath("/dashboard/talent");
  revalidatePath("/dashboard/talent/profile");
  revalidatePath("/dashboard/talent/services");

  return {
    message: "Talent onboarding completed.",
    ok: true,
    successToken: crypto.randomUUID(),
  };
}
