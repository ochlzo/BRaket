import { notFound } from "next/navigation";

import { TalentProfileHero } from "@/app/talent/[username]/_components/talent-profile-hero";
import { TalentProfileMainContent } from "@/app/talent/[username]/_components/talent-profile-main-content";
import { TalentProfileSidebar } from "@/app/talent/[username]/_components/talent-profile-sidebar";
import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";
import {
  getReviewsByTalent,
  getServicesByTalent,
  getTalentByUsername,
} from "@/lib/mock-data";

type Props = { params: Promise<{ username: string }> };

export default async function TalentProfilePage({ params }: Props) {
  const { username } = await params;
  const talent = getTalentByUsername(username);

  if (!talent) {
    return notFound();
  }

  const services = getServicesByTalent(talent.id);
  const reviews = getReviewsByTalent(talent.id);
  const primaryServiceId = services[0]?.id;

  return (
    <PageShell
      activeHref="/browse"
      ctaHref="/post-project"
      ctaLabel="Post a Project"
      homeHref="/"
      items={appNavigation}
      signInHref="/login"
    >
      <TalentProfileHero primaryServiceId={primaryServiceId} talent={talent} />
      <section className="px-5 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_340px]">
          <TalentProfileMainContent
            reviews={reviews}
            services={services}
            talent={talent}
          />
          <TalentProfileSidebar
            primaryServiceId={primaryServiceId}
            talent={talent}
          />
        </div>
      </section>
    </PageShell>
  );
}
