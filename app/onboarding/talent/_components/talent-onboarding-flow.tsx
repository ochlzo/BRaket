"use client";

import { useRouter } from "next/navigation";

import { TalentOnboardingForm } from "@/app/onboarding/talent/_components/talent-onboarding-form";
import { TalentPortfolioOnboardingForm } from "@/app/onboarding/talent/_components/talent-portfolio-onboarding-form";
import { TalentServiceOnboardingForm } from "@/app/onboarding/talent/_components/talent-service-onboarding-form";

type TalentOnboardingFlowProps = {
  availableSkills: string[];
  currentUser: {
    firstName: string;
    lastName: string;
    username: string;
  };
  initialStep: 1 | 2 | 3;
};

export function TalentOnboardingFlow({
  availableSkills,
  currentUser,
  initialStep,
}: TalentOnboardingFlowProps) {
  const router = useRouter();

  if (initialStep === 3) {
    return <TalentServiceOnboardingForm />;
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
