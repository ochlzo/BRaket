import { ProfileReviewsPanel } from "@/components/shared/profile-reviews/profile-reviews-panel";
import type { ClientProfilePageData } from "@/lib/client-profile/types";

import { PublicClientAboutPanel } from "./public-client-about-panel";
import { PublicClientPortfolioSection } from "./public-client-portfolio-section";
import { PublicClientQuickStats } from "./public-client-quick-stats";

type PublicClientProfileBodyProps = {
  profile: ClientProfilePageData;
};

export function PublicClientProfileBody({
  profile,
}: PublicClientProfileBodyProps) {
  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start">
      <div className="space-y-4 sm:space-y-6">
        <PublicClientAboutPanel profile={profile} />
        <PublicClientPortfolioSection portfolio={profile.portfolio} />
      </div>
      <div className="space-y-4 sm:space-y-6">
        <PublicClientQuickStats profile={profile} />
        <ProfileReviewsPanel
          averageRating={profile.averageRating}
          emptyLabel="No talent reviews yet"
          id="client-reviews"
          reputationLabel={profile.reputationLabel}
          reviews={profile.receivedReviews}
          title="Talent Reviews"
        />
      </div>
    </div>
  );
}
