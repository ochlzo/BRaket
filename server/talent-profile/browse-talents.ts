import "server-only";

import { prisma } from "@/lib/prisma";
import {
  getTalentAvailability,
  type TalentAvailabilityStatus,
} from "@/lib/talent-profile/availability";
import type { TalentProfileBoost } from "@/lib/talent-profile/types";
import { getActiveBoostsByTalentProfileIds } from "@/server/boosts/boost";

export type VerifiedTalentCard = {
  activeBoost: TalentProfileBoost | null;
  availabilityLabel: string;
  availabilityStatus: TalentAvailabilityStatus;
  avatarUrl: string;
  bio: string;
  college: string;
  course: string;
  displayName: string;
  headline: string;
  initials: string;
  profileHref: string;
  rating: number | null;
  reviewCount: number;
  servicesCount: number;
  isAvailable: boolean;
  skills: string[];
  userId: string;
  username: string;
  yearLevel: number | null;
};

function displayName(user: {
  email: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}) {
  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return name || user.username || user.email;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function getVerifiedTalentCards(): Promise<VerifiedTalentCard[]> {
  const talents = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      avatarUrl: true,
      email: true,
      firstName: true,
      lastName: true,
      userId: true,
      username: true,
      TalentReviewsReceived: {
        select: { rating: true },
        where: { target: "TALENT" },
      },
      TalentProfile: {
        select: {
          bio: true,
          college: true,
          course: true,
          headline: true,
          talent_profile_id: true,
          year_level: true,
          Services: { select: { serviceId: true } },
          TalentSkills: {
            orderBy: { createdAt: "asc" },
            select: { Skill: { select: { name: true } } },
            take: 4,
          },
        },
      },
    },
    where: {
      is_talent: true,
      is_verified: true,
      username: { not: null },
      TalentProfile: { isNot: null },
    },
  });
  const boostByTalentProfileId =
    await getActiveBoostsByTalentProfileIds(
      talents.flatMap((talent) =>
        talent.TalentProfile?.talent_profile_id
          ? [talent.TalentProfile.talent_profile_id]
          : [],
      ),
    );

  return talents.map((talent) => {
    const name = displayName(talent);
    const profile = talent.TalentProfile;
    const servicesCount = profile?.Services.length ?? 0;
    const availability = getTalentAvailability(servicesCount);
    const reviewCount = talent.TalentReviewsReceived.length;
    const rating =
      reviewCount > 0
        ? talent.TalentReviewsReceived.reduce(
            (total, review) => total + review.rating,
            0,
          ) / reviewCount
        : null;

    return {
      activeBoost: profile?.talent_profile_id
        ? boostByTalentProfileId.get(profile.talent_profile_id) ?? null
        : null,
      availabilityLabel: availability.label,
      availabilityStatus: availability.status,
      avatarUrl: talent.avatarUrl ?? "",
      bio: profile?.bio ?? "",
      college: profile?.college ?? "",
      course: profile?.course ?? "",
      displayName: name,
      headline: profile?.headline ?? "",
      initials: initials(name),
      profileHref: `/talent/${talent.username}`,
      rating,
      reviewCount,
      servicesCount,
      isAvailable: availability.isAvailable,
      skills: profile?.TalentSkills.map((skill) => skill.Skill.name) ?? [],
      userId: talent.userId,
      username: talent.username ?? "",
      yearLevel: profile?.year_level ?? null,
    };
  }).sort((left, right) => {
    const boostRank =
      (right.activeBoost?.visibilityRank ?? 0) -
      (left.activeBoost?.visibilityRank ?? 0);

    if (boostRank !== 0) {
      return boostRank;
    }

    return right.reviewCount - left.reviewCount;
  });
}
