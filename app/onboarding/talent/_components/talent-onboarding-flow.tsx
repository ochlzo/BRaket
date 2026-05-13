"use client";

import { useState } from "react";

import { TalentOnboardingForm } from "@/app/onboarding/talent/_components/talent-onboarding-form";
import { TalentPortfolioOnboardingForm } from "@/app/onboarding/talent/_components/talent-portfolio-onboarding-form";

type TalentOnboardingFlowProps = {
  availableSkills: string[];
  currentUser: {
    firstName: string;
    lastName: string;
    username: string;
  };
};

export function TalentOnboardingFlow({
  availableSkills,
  currentUser,
}: TalentOnboardingFlowProps) {
  const [step, setStep] = useState<"profile" | "portfolio">("profile");

  if (step === "portfolio") {
    return <TalentPortfolioOnboardingForm />;
  }

  return (
    <TalentOnboardingForm
      availableSkills={availableSkills}
      currentUser={currentUser}
      onComplete={() => setStep("portfolio")}
    />
  );
}
