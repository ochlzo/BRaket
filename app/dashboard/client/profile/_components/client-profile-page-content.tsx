import type { ClientProfilePageData } from "@/lib/client-profile/types";
import type { CurrentAppUser } from "@/server/users/current-user";

import { ClientPortfolioFeed } from "./client-portfolio-feed";
import { ClientProfileDetails } from "./client-profile-details";
import { ClientProfileHero } from "./client-profile-hero";
import { ClientProfileStats } from "./client-profile-stats";

type ClientProfilePageContentProps = {
  profile: ClientProfilePageData;
  user: CurrentAppUser;
};

export function ClientProfilePageContent({
  profile,
  user,
}: ClientProfilePageContentProps) {
  return (
    <div className="bg-[color:var(--surface)] -mx-4 space-y-4 pb-4 sm:mx-0 sm:bg-transparent sm:space-y-6 sm:pb-6">
      <ClientProfileHero profile={profile} user={user} />
      <ClientProfileStats profile={profile} />
      <ClientProfileDetails profile={profile} />
      <ClientPortfolioFeed portfolio={profile.portfolio} />
    </div>
  );
}
