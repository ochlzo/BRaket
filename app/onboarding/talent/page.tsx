import { TalentOnboardingForm } from "@/app/onboarding/talent/_components/talent-onboarding-form";
import { TalentOnboardingHeader } from "@/app/onboarding/talent/_components/talent-onboarding-header";
import { getSkillOptions } from "@/app/onboarding/talent/_lib/get-skill-options";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function OnboardingPage() {
  const currentUser = await requireCurrentAppUser();
  const skillOptions = await getSkillOptions();

  return (
    <main className="min-h-screen bg-[color:var(--surface-alt)] px-3 py-6 text-foreground sm:px-6 sm:py-12 lg:px-8">
      <section>
        <div className="mx-auto max-w-2xl">
          <TalentOnboardingHeader />
          <TalentOnboardingForm
            availableSkills={skillOptions}
            currentUser={{
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              username: currentUser.username,
            }}
          />
        </div>
      </section>
    </main>
  );
}
