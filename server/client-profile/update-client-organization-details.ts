"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  parseOrganizationDetailsFormData,
  type UpdateOrganizationDetailsState,
  validateOrganizationDetailsInput,
} from "@/lib/client-profile/organization-details";
import {
  clearCurrentAppUserCache,
  getCurrentAppUser,
} from "@/server/users/current-user";

const EMPTY_STATE: UpdateOrganizationDetailsState = {
  message: "",
  ok: false,
};

export async function updateClientOrganizationDetailsAction(
  _prevState: UpdateOrganizationDetailsState,
  formData: FormData,
): Promise<UpdateOrganizationDetailsState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser || currentUser.role !== "client") {
    return {
      ...EMPTY_STATE,
      message: "Your session expired. Please sign in again.",
    };
  }

  const input = parseOrganizationDetailsFormData(formData);
  const validation = validateOrganizationDetailsInput(input);

  if (!validation.ok) {
    return validation;
  }

  const user = await prisma.user.findUnique({
    where: { userId: currentUser.id },
  });

  if (!user) {
    return {
      ...EMPTY_STATE,
      message: "We could not find your client account record.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        data: {
          address: input.businessAddress || null,
          updatedAt: new Date(),
        },
        where: { userId: user.userId },
      });

      await tx.clientProfile.upsert({
        create: {
          about: null,
          business_address: input.businessAddress || null,
          client_profile_id: crypto.randomUUID(),
          client_avg_rating: null,
          client_reputation_score: null,
          client_review_count: null,
          completed_commissions_count: null,
          organization_name: input.organizationName,
          updatedAt: new Date(),
          user_id: user.userId,
          website: input.website || null,
        },
        update: {
          business_address: input.businessAddress || null,
          organization_name: input.organizationName,
          updatedAt: new Date(),
          website: input.website || null,
        },
        where: {
          user_id: user.userId,
        },
      });
    });
  } catch {
    return {
      ...EMPTY_STATE,
      message: "We could not save your organization details right now.",
    };
  }

  clearCurrentAppUserCache(currentUser.authId);
  revalidatePath("/dashboard/client/profile");

  return {
    message: "Organization details updated.",
    ok: true,
    successToken: crypto.randomUUID(),
  };
}
