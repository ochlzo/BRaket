"use client";

import { useRouter } from "next/navigation";

import { TalentOnboardingForm } from "@/app/onboarding/talent/_components/talent-onboarding-form";
import { TalentPortfolioOnboardingForm } from "@/app/onboarding/talent/_components/talent-portfolio-onboarding-form";
import { TalentServiceOnboardingForm } from "@/app/onboarding/talent/_components/talent-service-onboarding-form";
import type { CategoryOption } from "@/app/onboarding/talent/_lib/get-category-options";
import type { TalentPortfolioStepInitialValues } from "@/app/onboarding/talent/_lib/talent-portfolio-step";
import type { TalentProfileStepInitialValues } from "@/app/onboarding/talent/_lib/talent-profile-step";
import type { TalentServiceStepInitialValues } from "@/app/onboarding/talent/_lib/talent-service-step";

type TalentOnboardingFlowProps = {
  availableCategories: CategoryOption[];
  availableSkills: string[];
  canContinuePastProfile: boolean;
  currentUser: {
    firstName: string;
    lastName: string;
    username: string;
  };
  initialPortfolioValues: TalentPortfolioStepInitialValues;
  initialProfileValues: TalentProfileStepInitialValues;
  initialServiceValues: TalentServiceStepInitialValues;
  initialStep: 1 | 2 | 3;
};

export function TalentOnboardingFlow({
  availableCategories,
  availableSkills,
  canContinuePastProfile,
  currentUser,
  initialPortfolioValues,
  initialProfileValues,
  initialServiceValues,
  initialStep,
}: TalentOnboardingFlowProps) {
  const router = useRouter();

  if (initialStep === 3) {
    return (
      <TalentServiceOnboardingForm
        availableCategories={availableCategories}
        initialValues={initialServiceValues}
        onBack={() => router.push("/onboarding/talent?step=2")}
        onComplete={() => router.push("/dashboard/talent")}
      />
    );
  }

  if (initialStep === 2) {
    return (
      <TalentPortfolioOnboardingForm
        initialValues={initialPortfolioValues}
        onBack={() => router.push("/onboarding/talent?step=1")}
        onComplete={() => router.push("/onboarding/talent?step=3")}
      />
    );
  }

  return (
    <TalentOnboardingForm
      availableSkills={availableSkills}
      currentUser={currentUser}
      initialValues={initialProfileValues}
      onCancel={() => router.push("/talent/verify")}
      onComplete={() =>
        router.push(
          canContinuePastProfile
            ? "/onboarding/talent?step=2"
            : "/onboarding/talent/verification?step=form",
        )
      }
    />
  );
}
