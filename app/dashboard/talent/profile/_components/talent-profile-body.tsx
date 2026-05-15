import type { TalentProfilePageData } from "@/lib/talent-profile/types";

import { TalentAboutPanel } from "./talent-about-panel";
import { TalentPortfolioSection } from "./talent-portfolio-section";
import { TalentQuickStats } from "./talent-quick-stats";
import { TalentServicesSection } from "./talent-services-section";

type TalentProfileBodyProps = {
  profile: TalentProfilePageData;
};

export function TalentProfileBody({ profile }: TalentProfileBodyProps) {
  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start">
      <div className="space-y-4 sm:space-y-6">
        <TalentAboutPanel profile={profile} />
        <TalentServicesSection services={profile.services} />
      </div>
      <div className="space-y-4 sm:space-y-6">
        <TalentQuickStats profile={profile} />
        <TalentPortfolioSection portfolio={profile.portfolio} />
      </div>
    </div>
  );
}
