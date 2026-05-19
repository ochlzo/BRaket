"use client";

import { useRouter } from "next/navigation";

import { TalentServiceOnboardingForm } from "@/app/onboarding/talent/_components/talent-service-onboarding-form";
import { buildTalentServiceStepInitialValues } from "@/app/onboarding/talent/_lib/talent-service-step";
import type { CategoryOption } from "@/app/onboarding/talent/_lib/get-category-options";

type CreateServiceFormProps = {
  availableCategories: CategoryOption[];
};

export function CreateServiceForm({
  availableCategories,
}: CreateServiceFormProps) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl">
      <TalentServiceOnboardingForm
        availableCategories={availableCategories}
        initialValues={buildTalentServiceStepInitialValues(null)}
        onBack={() => {
          router.push("/dashboard/talent/services");
        }}
        onComplete={() => {
          router.push("/dashboard/talent/services");
          router.refresh();
        }}
        showSkipButton={false}
      />
    </div>
  );
}
