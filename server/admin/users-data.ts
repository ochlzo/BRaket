import "server-only";

import { BookingStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type AdminManagedUser = {
  address: string;
  avatarUrl: string;
  bio: string;
  buEmail: string;
  clientOrganizationName: string;
  college: string;
  completedCommissionsCount: number;
  contactNum: string;
  course: string;
  createdAt: string;
  email: string;
  firstName: string;
  headline: string;
  initials: string;
  isVerified: boolean;
  lastName: string;
  role: "client" | "talent";
  userId: string;
  username: string;
  website: string;
  yearLevel: number | null;
};

const clientAvailedStatuses = [
  BookingStatus.ACCEPTED,
  BookingStatus.IN_PROGRESS,
  BookingStatus.COMPLETED,
];

export async function getAdminManagedUsers(role: "client" | "talent") {
  const isTalent = role === "talent";
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      ClientProfile: {
        select: {
          completed_commissions_count: true,
          organization_name: true,
          website: true,
        },
      },
      TalentProfile: {
        select: {
          bio: true,
          bu_email: true,
          college: true,
          completed_commissions_count: true,
          course: true,
          headline: true,
          website: true,
          year_level: true,
        },
      },
      address: true,
      avatarUrl: true,
      contactNum: true,
      createdAt: true,
      email: true,
      firstName: true,
      initials: true,
      is_talent: true,
      is_verified: true,
      lastName: true,
      userId: true,
      username: true,
    },
    where: { is_talent: isTalent },
  });
  const userIds = users.map((user) => user.userId);
  const bookingCounts = isTalent
    ? await countCompletedTalentBookings(userIds)
    : await countClientServicesAvailed(userIds);

  return users.map((user) => {
    const talent = user.TalentProfile;
    const client = user.ClientProfile;

    return {
      address: user.address ?? "",
      avatarUrl: user.avatarUrl ?? "",
      bio: talent?.bio ?? "",
      buEmail: talent?.bu_email ?? "",
      clientOrganizationName: client?.organization_name ?? "",
      college: talent?.college ?? "",
      completedCommissionsCount: bookingCounts.get(user.userId) ?? 0,
      contactNum: user.contactNum ?? "",
      course: talent?.course ?? "",
      createdAt: user.createdAt.toISOString(),
      email: user.email,
      firstName: user.firstName ?? "",
      headline: talent?.headline ?? "",
      initials: user.initials ?? "",
      isVerified: user.is_verified,
      lastName: user.lastName ?? "",
      role,
      userId: user.userId,
      username: user.username ?? "",
      website: talent?.website ?? client?.website ?? "",
      yearLevel: talent?.year_level ?? null,
    } satisfies AdminManagedUser;
  });
}

async function countCompletedTalentBookings(userIds: string[]) {
  if (userIds.length === 0) {
    return new Map<string, number>();
  }

  const counts = await prisma.booking.groupBy({
    _count: { _all: true },
    by: ["talentUserId"],
    where: {
      status: BookingStatus.COMPLETED,
      talentUserId: { in: userIds },
    },
  });

  return new Map(
    counts.map((count) => [count.talentUserId, count._count._all]),
  );
}

async function countClientServicesAvailed(userIds: string[]) {
  if (userIds.length === 0) {
    return new Map<string, number>();
  }

  const counts = await prisma.booking.groupBy({
    _count: { _all: true },
    by: ["clientUserId"],
    where: {
      clientUserId: { in: userIds },
      status: { in: clientAvailedStatuses },
    },
  });

  return new Map(
    counts.map((count) => [count.clientUserId, count._count._all]),
  );
}
