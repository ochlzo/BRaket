"use server";

import { revalidatePath } from "next/cache";

import {
  validateTalentOnboardingFinalization,
  type TalentFinalizationState,
} from "@/app/onboarding/talent/_lib/talent-finalization";
import { prisma } from "@/lib/prisma";
import {
  clearCurrentAppUserCache,
  getCurrentAppUser,
} from "@/server/users/current-user";

export async function finalizeTalentOnboardingAction(): Promise<TalentFinalizationState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return {
      message: "Your session expired. Please sign in again.",
      ok: false,
    };
  }

  if (!currentUser.isVerified) {
    return {
      message: "Wait for admin verification before finishing talent onboarding.",
      ok: false,
    };
  }

  const talentProfile = await prisma.talentProfile.findUnique({
    select: {
      bio: true,
      college: true,
      course: true,
      headline: true,
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
  const validation = validateTalentOnboardingFinalization(talentProfile);

  if (!validation.ok) {
    return validation;
  }

  await prisma.user.update({
    data: { is_talent: true },
    where: { userId: currentUser.id },
  });

  clearCurrentAppUserCache(currentUser.authId);
  revalidatePath("/onboarding/talent");
  revalidatePath("/dashboard/talent");
  revalidatePath("/dashboard/talent/profile");
  revalidatePath("/dashboard/talent/services");

  return {
    message: "Talent onboarding completed.",
    ok: true,
  };
}
