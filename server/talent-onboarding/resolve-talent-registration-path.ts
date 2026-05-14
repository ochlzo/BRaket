"use server";

import { getTalentRegistrationPath } from "@/lib/talent-onboarding/registration-route";
import { getCurrentAppUser } from "@/server/users/current-user";

export async function resolveTalentRegistrationPathAction() {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return "/login";
  }

  return getTalentRegistrationPath({
    isTalent: currentUser.isTalent,
    isVerified: currentUser.isVerified,
  });
}
