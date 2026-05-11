import type { ClientProfilePageData } from "@/lib/client-profile/types";

import { ClientPortfolioFeed } from "./client-portfolio-feed";
import { ClientProfileDetails } from "./client-profile-details";
import { ClientProfileHero } from "./client-profile-hero";
import { ClientProfileStats } from "./client-profile-stats";

type ClientProfilePageContentProps = {
  profile: ClientProfilePageData;
};

export function ClientProfilePageContent({
  profile,
}: ClientProfilePageContentProps) {
  return (
    <div className="space-y-6 pb-6">
      <ClientProfileHero profile={profile} />
      <ClientProfileStats profile={profile} />
      <ClientProfileDetails profile={profile} />
      <ClientPortfolioFeed portfolio={profile.portfolio} />
    </div>
  );
}
