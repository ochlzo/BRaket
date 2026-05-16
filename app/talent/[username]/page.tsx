import { notFound } from "next/navigation";

import { TalentProfileBody } from "@/app/dashboard/talent/profile/_components/talent-profile-body";
import { PublicTalentProfileHero } from "@/app/talent/[username]/_components/public-talent-profile-hero";
import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";
import { getPublicTalentProfilePageData } from "@/server/talent-profile/get-talent-profile";

type Props = { params: Promise<{ username: string }> };

export default async function TalentProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = await getPublicTalentProfilePageData(username);

  if (!profile) {
    notFound();
  }

  return (
    <PageShell
      activeHref="/browse"
      className="bg-[color:var(--surface)]"
      ctaHref="/browse"
      ctaLabel="Browse Talents"
      homeHref="/"
      items={appNavigation}
      signInHref="/login"
    >
      <section className="px-5 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <PublicTalentProfileHero profile={profile} />
          <TalentProfileBody profile={profile} showBookLinks />
        </div>
      </section>
    </PageShell>
  );
}
