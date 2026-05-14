const VERIFICATION_PATH = "/onboarding/talent/verification";
const TALENT_PROFILE_PATH = "/dashboard/talent/profile";
const MAX_ONBOARDING_STEP = 3;
const MIN_ONBOARDING_STEP = 1;

export type TalentOnboardingStep = 1 | 2 | 3;

type TalentRegistrationPathInput = {
  isTalent: boolean;
  isVerified: boolean;
  profileCompletion: number | null | undefined;
};

type TalentVerificationInput = {
  isTalent: boolean;
  isVerified: boolean;
};

export function getTalentOnboardingStep(
  profileCompletion: number | null | undefined,
): TalentOnboardingStep {
  const completion =
    typeof profileCompletion === "number" && Number.isFinite(profileCompletion)
      ? Math.max(0, Math.floor(profileCompletion))
      : 0;

  return Math.min(completion + 1, MAX_ONBOARDING_STEP) as TalentOnboardingStep;
}

function parseTalentOnboardingStep(value: string | undefined) {
  const step = Number(value);

  if (
    Number.isInteger(step) &&
    step >= MIN_ONBOARDING_STEP &&
    step <= MAX_ONBOARDING_STEP
  ) {
    return step as TalentOnboardingStep;
  }

  return null;
}

export function getAllowedTalentOnboardingStep(
  requestedStep: string | undefined,
  profileCompletion: number | null | undefined,
) {
  const nextStep = getTalentOnboardingStep(profileCompletion);
  const parsedStep = parseTalentOnboardingStep(requestedStep);

  if (!parsedStep || parsedStep > nextStep) {
    return nextStep;
  }

  return parsedStep;
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

export function shouldForceTalentVerification({
  isTalent,
  isVerified,
}: TalentVerificationInput) {
  return isTalent && !isVerified;
}
