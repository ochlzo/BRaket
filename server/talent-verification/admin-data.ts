import "server-only";

import { TalentVerificationStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminVerificationRequest = {
  buEmail: string;
  buIdImageUrl: string;
  college: string;
  course: string;
  createdAt: string;
  displayName: string;
  email: string;
  headline: string;
  requestId: string;
  userId: string;
  yearLevel: number | null;
};

export type AdminVerificationDashboardData = {
  activeServices: number;
  pendingRequests: AdminVerificationRequest[];
  totalTalents: number;
  totalUsers: number;
  verifiedTalents: number;
};

export async function getAdminVerificationDashboardData() {
  const [totalUsers, totalTalents, verifiedTalents, activeServices, requests] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { is_talent: true } }),
      prisma.user.count({ where: { is_talent: true, is_verified: true } }),
      prisma.service.count(),
      prisma.talentVerificationRequest.findMany({
        orderBy: { createdAt: "asc" },
        select: {
          buEmail: true,
          buIdImageBucket: true,
          buIdImagePath: true,
          createdAt: true,
          requestId: true,
          User: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              TalentProfile: {
                select: {
                  college: true,
                  course: true,
                  headline: true,
                  year_level: true,
                },
              },
              userId: true,
              username: true,
            },
          },
        },
        where: { status: TalentVerificationStatus.PENDING },
      }),
    ]);
  const signedRequests = await Promise.all(
    requests.map(async (request) => ({
      buEmail: request.buEmail,
      buIdImageUrl: await createSignedBuIdUrl(
        request.buIdImageBucket,
        request.buIdImagePath,
      ),
      college: request.User.TalentProfile?.college ?? "",
      course: request.User.TalentProfile?.course ?? "",
      createdAt: request.createdAt.toISOString(),
      displayName:
        [request.User.firstName, request.User.lastName]
          .filter(Boolean)
          .join(" ") ||
        request.User.username ||
        request.User.email,
      email: request.User.email,
      headline: request.User.TalentProfile?.headline ?? "",
      requestId: request.requestId,
      userId: request.User.userId,
      yearLevel: request.User.TalentProfile?.year_level ?? null,
    })),
  );

  return {
    activeServices,
    pendingRequests: signedRequests,
    totalTalents,
    totalUsers,
    verifiedTalents,
  } satisfies AdminVerificationDashboardData;
}

async function createSignedBuIdUrl(bucket: string, path: string) {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient.storage
    .from(bucket)
    .createSignedUrl(path, 10 * 60);

  if (error) {
    return "";
  }

  return data.signedUrl;
}
