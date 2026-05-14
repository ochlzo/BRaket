"use server";

import { prisma } from "@/lib/prisma";
import { getTalentRegistrationPath } from "@/lib/talent-onboarding/registration-route";
import { getCurrentAppUser } from "@/server/users/current-user";

export async function resolveTalentRegistrationPathAction() {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return "/login";
  }

  const talentProfile = await prisma.talentProfile.findUnique({
    select: { talent_profile_id: true },
    where: { user_id: currentUser.id },
  });

  return getTalentRegistrationPath({
    isTalent: currentUser.isTalent,
    isVerified: currentUser.isVerified,
    profileCompletion: talentProfile ? 1 : 0,
  });
}
