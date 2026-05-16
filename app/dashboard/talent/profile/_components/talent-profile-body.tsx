import type { TalentProfilePageData } from "@/lib/talent-profile/types";

import { ProfileReviewsPanel } from "@/components/shared/profile-reviews/profile-reviews-panel";
import { TalentAboutPanel } from "./talent-about-panel";
import { TalentPortfolioSection } from "./talent-portfolio-section";
import { TalentQuickStats } from "./talent-quick-stats";
import { TalentServicesSection } from "./talent-services-section";

type TalentProfileBodyProps = {
  profile: TalentProfilePageData;
  showBookLinks?: boolean;
};

export function TalentProfileBody({
  profile,
  showBookLinks = false,
}: TalentProfileBodyProps) {
  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start">
      <div className="space-y-4 sm:space-y-6">
        <TalentAboutPanel profile={profile} />
        <ProfileReviewsPanel
          averageRating={profile.talentAvgRating}
          emptyLabel="No client reviews yet"
          id="talent-reviews"
          reputationLabel={profile.reputationLabel}
          reviews={profile.receivedReviews}
          title="Client Reviews"
        />
        <TalentServicesSection
          services={profile.services}
          showBookLinks={showBookLinks}
        />
      </div>
      <div className="space-y-4 sm:space-y-6">
        <TalentQuickStats profile={profile} />
        <TalentPortfolioSection
          portfolio={profile.portfolio}
          showReportLinks={showBookLinks}
        />
      </div>
    </div>
  );
}
