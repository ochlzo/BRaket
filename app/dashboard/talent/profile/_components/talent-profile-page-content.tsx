import type { TalentProfilePageData } from "@/lib/talent-profile/types";
import type { CurrentAppUser } from "@/server/users/current-user";

import { TalentProfileBody } from "./talent-profile-body";
import { TalentProfileHero } from "./talent-profile-hero";

type TalentProfilePageContentProps = {
  profile: TalentProfilePageData;
  user: CurrentAppUser;
};

export function TalentProfilePageContent({
  profile,
  user,
}: TalentProfilePageContentProps) {
  return (
    <div className="-mx-4 space-y-4 bg-[color:var(--surface)] pb-4 sm:mx-0 sm:bg-transparent sm:space-y-6 sm:pb-6">
      <TalentProfileHero profile={profile} user={user} />
      <TalentProfileBody profile={profile} />
    </div>
  );
}
