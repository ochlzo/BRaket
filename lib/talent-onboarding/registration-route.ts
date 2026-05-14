const VERIFICATION_PATH = "/onboarding/talent/verification";
const TALENT_PROFILE_PATH = "/dashboard/talent/profile";
const MAX_ONBOARDING_STEP = 3;

type TalentRegistrationPathInput = {
  isTalent: boolean;
  isVerified: boolean;
  profileCompletion: number | null | undefined;
};

export function getTalentOnboardingStep(
  profileCompletion: number | null | undefined,
) {
  const completion =
    typeof profileCompletion === "number" && Number.isFinite(profileCompletion)
      ? Math.max(0, Math.floor(profileCompletion))
      : 0;

  return Math.min(completion + 1, MAX_ONBOARDING_STEP);
}

export function getTalentRegistrationPath({
  isTalent,
  isVerified,
  profileCompletion,
}: TalentRegistrationPathInput) {
  if (!isVerified) {
    return VERIFICATION_PATH;
  }

  if (isTalent) {
    return TALENT_PROFILE_PATH;
  }

  return `/onboarding/talent?step=${getTalentOnboardingStep(profileCompletion)}`;
}

