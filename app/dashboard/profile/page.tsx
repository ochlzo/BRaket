import {
  ProfileAccountFooter,
} from "@/app/dashboard/profile/_components/profile-account-footer";
import { ProfileHeroCard } from "@/app/dashboard/profile/_components/profile-hero-card";
import { ProfileQuickActions } from "@/app/dashboard/profile/_components/profile-quick-actions";
import { ProfileStatsGrid } from "@/app/dashboard/profile/_components/profile-stats-grid";
import { ProfileTalentDetails } from "@/app/dashboard/profile/_components/profile-talent-details";
import { ProfileVerificationPanel } from "@/app/dashboard/profile/_components/profile-verification-panel";
import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { requireCurrentAppUser } from "@/server/users/current-user";
import type { ClientProfile, TalentProfile } from "@/lib/types";

function buildBaseProfile(user: Awaited<ReturnType<typeof requireCurrentAppUser>>) {
  const fullName = user.displayName || user.username;

  return {
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    createdAt: user.createdAt,
    email: user.email,
    firstName: user.firstName || fullName,
    id: user.id,
    lastName: user.lastName,
    role: user.role,
    userId: user.authId,
    username: user.username,
  };
}

export default async function ProfilePage() {
  const user = await requireCurrentAppUser();
  const isClient = user.role === "client";
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const activeBookings = 0;
  const bookingsCount = 0;
  const completedBookings = 0;
  const talentServicesCount = 0;

  const profile: ClientProfile | TalentProfile = isClient
    ? {
        ...buildBaseProfile(user),
        company: "",
        projectsPosted: 0,
        role: "client",
      }
    : {
        ...buildBaseProfile(user),
        available: true,
        completedProjects: 0,
        headline: user.headline,
        location: user.location,
        maxRate: user.maxRate ?? 0,
        minRate: user.minRate ?? 0,
        rating: 0,
        reviewCount: 0,
        role: "talent",
        servicesCount: 0,
        skills: user.skills,
        verified: user.isVerified,
      };
  const talentProfile = isClient ? null : (profile as TalentProfile);

  return (
    <DashboardLayout
      noScroll
      role={user.role}
      subtitle="View the real profile information tied to your signed-in account."
      title="My Profile"
    >
      <div className="flex h-full flex-col gap-2.5 overflow-hidden">
        <ProfileHeroCard
          isClient={isClient}
          isVerified={user.isVerified}
          joinDate={joinDate}
          profile={profile}
          talentProfile={talentProfile}
        />
        <ProfileVerificationPanel
          authId={user.authId}
          isVerified={user.isVerified}
        />
        <ProfileStatsGrid
          activeBookings={activeBookings}
          bookingsCount={bookingsCount}
          completedBookings={completedBookings}
          isClient={isClient}
          profile={profile}
          talentProfile={talentProfile}
          talentServicesCount={talentServicesCount}
        />
        {talentProfile ? <ProfileTalentDetails talentProfile={talentProfile} /> : null}
        <ProfileQuickActions isClient={isClient} />
        <ProfileAccountFooter
          joinDate={joinDate}
          profileId={profile.id}
          role={user.role}
        />
      </div>
    </DashboardLayout>
  );
}
