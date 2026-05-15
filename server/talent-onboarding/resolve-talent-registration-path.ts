"use server";

import { getTalentRegistrationPath } from "@/lib/talent-onboarding/registration-route";
import { getApplicantVerificationState } from "@/server/talent-verification/get-applicant-state";
import { getCurrentAppUser } from "@/server/users/current-user";

export async function resolveTalentRegistrationPathAction() {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return "/login";
  }

  const verification = await getApplicantVerificationState(
    currentUser.id,
    currentUser.isVerified,
  );

  return getTalentRegistrationPath({
    isTalent: currentUser.isTalent,
    isVerified: currentUser.isVerified,
    verificationStatus: verification.status,
  });
}
