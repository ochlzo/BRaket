import type {
  ClientProfile,
  SkillLevel,
  TalentProfile,
  UserRole,
} from "@/lib/types";
import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { ProfileHeroCard } from "@/app/dashboard/profile/_components/profile-hero-card";
import { ProfileStatsGrid } from "@/app/dashboard/profile/_components/profile-stats-grid";
import { ProfileTalentDetails } from "@/app/dashboard/profile/_components/profile-talent-details";
import { ProfileVerificationPanel } from "@/app/dashboard/profile/_components/profile-verification-panel";

type ProfilePageUser = {
  authId: string;
  avatarUrl: string;
  bio: string;
  createdAt: string;
  displayName: string;
  email: string;
  firstName: string;
  headline: string;
  id: string;
  isVerified: boolean;
  lastName: string;
  location: string;
  maxRate: number | null;
  minRate: number | null;
  role: UserRole;
  skills: { level: SkillLevel; name: string }[];
  username: string;
};

type ProfilePageContentProps = {
  subtitle: string;
  title: string;
  user: ProfilePageUser;
};

function buildBaseProfile(user: ProfilePageUser) {
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

export function ProfilePageContent({
  subtitle,
  title,
  user,
}: ProfilePageContentProps) {
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
      subtitle={subtitle}
      title={title}
    >
      <div className="flex h-full flex-col gap-2.5 overflow-hidden">
        <ProfileHeroCard
          isClient={isClient}
          isVerified={user.isVerified}
          joinDate={joinDate}
          profile={profile}
          talentProfile={talentProfile}
        />
        {!isClient ? (
          <ProfileVerificationPanel
            authId={user.authId}
            isVerified={user.isVerified}
          />
        ) : null}
        <ProfileStatsGrid
          activeBookings={activeBookings}
          bookingsCount={bookingsCount}
          completedBookings={completedBookings}
          isClient={isClient}
          talentProfile={talentProfile}
          talentServicesCount={talentServicesCount}
        />
        {talentProfile ? <ProfileTalentDetails talentProfile={talentProfile} /> : null}
      </div>
    </DashboardLayout>
  );
}
