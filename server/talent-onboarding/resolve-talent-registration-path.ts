"use server";

import { getTalentRegistrationPath } from "@/lib/talent-onboarding/registration-route";
import { prisma } from "@/lib/prisma";
import { getApplicantVerificationState } from "@/server/talent-verification/get-applicant-state";
import { getCurrentAppUser } from "@/server/users/current-user";

export async function resolveTalentRegistrationPathAction() {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return "/login";
  }

  const [verification, talentProfile] = await Promise.all([
    getApplicantVerificationState(currentUser.id, currentUser.isVerified),
    prisma.talentProfile.findUnique({
      select: { talent_profile_id: true },
      where: { user_id: currentUser.id },
    }),
  ]);

  return getTalentRegistrationPath({
    hasTalentProfile: Boolean(talentProfile),
    isTalent: currentUser.isTalent,
    isVerified: currentUser.isVerified,
    verificationStatus: verification.status,
  });
}
