import { TalentOnboardingFlow } from "@/app/onboarding/talent/_components/talent-onboarding-flow";
import { TalentOnboardingHeader } from "@/app/onboarding/talent/_components/talent-onboarding-header";
import { getCategoryOptions } from "@/app/onboarding/talent/_lib/get-category-options";
import { getSkillOptions } from "@/app/onboarding/talent/_lib/get-skill-options";
import { buildTalentPortfolioStepInitialValues } from "@/app/onboarding/talent/_lib/talent-portfolio-step";
import { buildTalentProfileStepInitialValues } from "@/app/onboarding/talent/_lib/talent-profile-step";
import { buildTalentServiceStepInitialValues } from "@/app/onboarding/talent/_lib/talent-service-step";
import {
  getAllowedTalentOnboardingStep,
} from "@/lib/talent-onboarding/registration-route";
import { prisma } from "@/lib/prisma";
import { requireCurrentAppUser } from "@/server/users/current-user";
import { redirect } from "next/navigation";

type OnboardingPageProps = {
  searchParams: Promise<{
    step?: string;
  }>;
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const { step } = await searchParams;
  const currentUser = await requireCurrentAppUser();
  const talentProfile = await prisma.talentProfile.findUnique({
    select: {
      bio: true,
      college: true,
      course: true,
      headline: true,
      TalentPortfolio: {
        orderBy: { createdAt: "asc" },
        select: {
          description: true,
          talent_portfolio_id: true,
          TalentPortfolioMedia: {
            orderBy: { createdAt: "asc" },
            select: { media_url: true },
          },
          title: true,
        },
        take: 1,
      },
      Services: {
        orderBy: { createdAt: "asc" },
        select: {
          description: true,
          maxPrice: true,
          minPrice: true,
          priceUnit: true,
          ServiceCategories: {
            orderBy: { createdAt: "asc" },
            select: { categoryId: true },
          },
          ServiceMedia: {
            orderBy: { createdAt: "asc" },
            select: { mediaUrl: true },
          },
          serviceId: true,
          title: true,
        },
        take: 1,
      },
      TalentSkills: {
        orderBy: { createdAt: "asc" },
        select: {
          proficiencyLevel: true,
          Skill: { select: { name: true } },
        },
      },
      website: true,
      year_level: true,
    },
    where: { user_id: currentUser.id },
  });
  const initialStep = getAllowedTalentOnboardingStep(step);


  if (step !== String(initialStep)) {
    redirect(`/onboarding/talent?step=${initialStep}`);
  }

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
            initialProfileValues={buildTalentProfileStepInitialValues(
              talentProfile,
            )}
            initialPortfolioValues={buildTalentPortfolioStepInitialValues(
              talentProfile?.TalentPortfolio[0] ?? null,
            )}
            initialServiceValues={buildTalentServiceStepInitialValues(
              talentProfile?.Services[0] ?? null,
            )}
            initialStep={initialStep}
          />
        </div>
      </section>
    </main>
  );
}
