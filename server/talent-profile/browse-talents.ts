import "server-only";

import { prisma } from "@/lib/prisma";

export type VerifiedTalentCard = {
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

  return talents.map((talent) => {
    const name = displayName(talent);
    const profile = talent.TalentProfile;
    const reviewCount = talent.TalentReviewsReceived.length;
    const rating =
      reviewCount > 0
        ? talent.TalentReviewsReceived.reduce(
            (total, review) => total + review.rating,
            0,
          ) / reviewCount
        : null;

    return {
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
      servicesCount: profile?.Services.length ?? 0,
      skills: profile?.TalentSkills.map((skill) => skill.Skill.name) ?? [],
      userId: talent.userId,
      username: talent.username ?? "",
      yearLevel: profile?.year_level ?? null,
    };
  });
}
