import { ClientAnalyticsDashboard } from "@/app/dashboard/client/_components/client-analytics-dashboard";
import type { BookingListItem } from "@/lib/bookings/types";
import type { ClientProfilePageData } from "@/lib/client-profile/types";
import type { CurrentAppUser } from "@/server/users/current-user";

import { ProfileReviewsPanel } from "@/components/shared/profile-reviews/profile-reviews-panel";
import { ClientPortfolioFeed } from "./client-portfolio-feed";
import { ClientProfileDetails } from "./client-profile-details";
import { ClientProfileHero } from "./client-profile-hero";
import { ClientProfileStats } from "./client-profile-stats";

type ClientProfilePageContentProps = {
  bookings: BookingListItem[];
  profile: ClientProfilePageData;
  user: CurrentAppUser;
};

export function ClientProfilePageContent({
  bookings,
  profile,
  user,
}: ClientProfilePageContentProps) {
  return (
    <div className="bg-[color:var(--surface)] -mx-4 space-y-4 pb-4 sm:mx-0 sm:bg-transparent sm:space-y-6 sm:pb-6">
      <ClientProfileHero profile={profile} user={user} />
      <ClientProfileStats profile={profile} />
      <ClientAnalyticsDashboard bookings={bookings} />
      <ProfileReviewsPanel
        averageRating={profile.averageRating}
        emptyLabel="No talent reviews yet"
        id="client-reviews"
        initialVisibleCount={3}
        reputationLabel={profile.reputationLabel}
        revealCount={10}
        reviews={profile.receivedReviews}
        title="Talent Reviews"
      />
      <ClientProfileDetails profile={profile} />
      <ClientPortfolioFeed portfolio={profile.portfolio} />
    </div>
  );
}
