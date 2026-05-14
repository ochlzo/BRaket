"use client";

import { useRouter } from "next/navigation";

import { TalentOnboardingForm } from "@/app/onboarding/talent/_components/talent-onboarding-form";
import { TalentPortfolioOnboardingForm } from "@/app/onboarding/talent/_components/talent-portfolio-onboarding-form";
import { TalentServiceOnboardingForm } from "@/app/onboarding/talent/_components/talent-service-onboarding-form";
import type { CategoryOption } from "@/app/onboarding/talent/_lib/get-category-options";

type TalentOnboardingFlowProps = {
  availableCategories: CategoryOption[];
  availableSkills: string[];
  currentUser: {
    firstName: string;
    lastName: string;
    username: string;
  };
  initialStep: 1 | 2 | 3;
};

export function TalentOnboardingFlow({
  availableCategories,
  availableSkills,
  currentUser,
  initialStep,
}: TalentOnboardingFlowProps) {
  const router = useRouter();

  if (initialStep === 3) {
    return (
      <TalentServiceOnboardingForm
        availableCategories={availableCategories}
        onSkip={() => router.push("/dashboard/talent")}
      />
    );
  }

  if (initialStep === 2) {
    return (
      <TalentPortfolioOnboardingForm
        onComplete={() => router.push("/onboarding/talent?step=3")}
      />
    );
  }

  return (
    <TalentOnboardingForm
      availableSkills={availableSkills}
      currentUser={currentUser}
      onComplete={() => router.push("/onboarding/talent?step=2")}
    />
  );
}
