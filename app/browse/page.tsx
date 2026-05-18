import { VerifiedTalentsBrowser } from "@/app/browse/_components/verified-talents-browser";
import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";
import { getVerifiedTalentCards } from "@/server/talent-profile/browse-talents";

export default async function BrowsePage() {
  const talents = await getVerifiedTalentCards();

  return (
    <PageShell
      activeHref="/browse"
      className="bg-[linear-gradient(180deg,var(--tone-sky-pale)_0%,var(--surface)_44%)]"
      ctaHref="/#cta"
      items={appNavigation}
      signInHref="/#cta"
    >
      <VerifiedTalentsBrowser talents={talents} />
    </PageShell>
  );
}
