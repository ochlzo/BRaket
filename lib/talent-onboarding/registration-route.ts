const VERIFICATION_PATH = "/onboarding/talent/verification";
const MAIN_APP_PATH = "/browse";
const TALENT_DASHBOARD_PATH = "/dashboard/talent";
const TALENT_PROFILE_PATH = "/dashboard/talent/profile";
const MAX_ONBOARDING_STEP = 3;
const MIN_ONBOARDING_STEP = 1;

export type TalentOnboardingStep = 1 | 2 | 3;

type TalentRegistrationPathInput = {
  isTalent: boolean;
  isVerified: boolean;
  verificationStatus?: "approved" | "none" | "pending" | "rejected";
};

type TalentVerificationInput = {
  isTalent: boolean;
  isVerified: boolean;
};

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

export function getAllowedTalentOnboardingStep(requestedStep: string | undefined) {
  return parseTalentOnboardingStep(requestedStep) ?? MIN_ONBOARDING_STEP;
}

export function getTalentRegistrationPath({
  isTalent,
  isVerified,
  verificationStatus = "none",
}: TalentRegistrationPathInput) {
  if (!isVerified && verificationStatus !== "pending") {
    return VERIFICATION_PATH;
  }

  if (isTalent && isVerified) {
    return TALENT_PROFILE_PATH;
  }

  return `/onboarding/talent?step=${MIN_ONBOARDING_STEP}`;
}

export function shouldForceTalentVerification({
  isTalent,
  isVerified,
}: TalentVerificationInput) {
  return isTalent && !isVerified;
}

export function getTalentVerificationMaybeLaterPath(
  isTalent: boolean,
  source?: string | null,
) {
  if (source !== "dashboard") {
    return MAIN_APP_PATH;
  }

  return isTalent ? TALENT_DASHBOARD_PATH : `/onboarding/talent?step=${MIN_ONBOARDING_STEP}`;
}
