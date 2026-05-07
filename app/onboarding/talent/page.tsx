import { TalentOnboardingForm } from "@/app/onboarding/talent/_components/talent-onboarding-form";
import { TalentOnboardingHeader } from "@/app/onboarding/talent/_components/talent-onboarding-header";
import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";

export default function OnboardingPage() {
  return (
    <PageShell
      activeHref="/onboarding"
      ctaHref="/post-project"
      homeHref="/"
      items={appNavigation}
      signInHref="/login"
    >
      <section className="px-5 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <TalentOnboardingHeader />
          <TalentOnboardingForm />
        </div>
      </section>
    </PageShell>
  );
}
