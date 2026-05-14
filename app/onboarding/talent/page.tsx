import { TalentOnboardingFlow } from "@/app/onboarding/talent/_components/talent-onboarding-flow";
import { TalentOnboardingHeader } from "@/app/onboarding/talent/_components/talent-onboarding-header";
import { getCategoryOptions } from "@/app/onboarding/talent/_lib/get-category-options";
import { getSkillOptions } from "@/app/onboarding/talent/_lib/get-skill-options";
import { requireCurrentAppUser } from "@/server/users/current-user";

type OnboardingPageProps = {
  searchParams: Promise<{
    step?: string;
  }>;
};

function parseOnboardingStep(value: string | undefined) {
  if (value === "3") {
    return 3;
  }

  return value === "2" ? 2 : 1;
}

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const { step } = await searchParams;
  const initialStep = parseOnboardingStep(step);
  const currentUser = await requireCurrentAppUser();
  const categoryOptions = await getCategoryOptions();
  const skillOptions = await getSkillOptions();

  return (
    <main className="min-h-screen bg-[color:var(--surface-alt)] px-3 py-6 text-foreground sm:px-6 sm:py-12 lg:px-8">
      <section>
        <div className="mx-auto max-w-2xl">
          <TalentOnboardingHeader />
          <TalentOnboardingFlow
            availableCategories={categoryOptions}
            availableSkills={skillOptions}
            currentUser={{
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              username: currentUser.username,
            }}
            initialStep={initialStep}
          />
        </div>
      </section>
    </main>
  );
}
