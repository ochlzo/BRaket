import "server-only";

import { prisma } from "@/lib/prisma";

export type AdminContentReport = {
  adminNotes: string;
  createdAt: string;
  details: string;
  reason: string;
  reportId: string;
  reporterEmail: string;
  reporterName: string;
  reviewedAt: string;
  reviewedByEmail: string;
  status: string;
  targetId: string;
  targetAudience: "client" | "talent" | "unknown";
  targetLabel: string;
  targetPath: string;
  targetType: string;
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

export async function getAdminContentReports(): Promise<AdminContentReport[]> {
  const reports = await prisma.contentReport.findMany({
    include: {
      Reporter: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 50,
  });
  const profileTargetIds = reports
    .filter((report) => report.targetType === "PROFILE")
    .map((report) => report.targetId);
  const profileTargets = profileTargetIds.length
    ? await prisma.user.findMany({
        select: {
          is_talent: true,
          userId: true,
        },
        where: { userId: { in: profileTargetIds } },
      })
    : [];
  const profileAudienceById = new Map<
    string,
    AdminContentReport["targetAudience"]
  >(
    profileTargets.map((user) => [
      user.userId,
      user.is_talent ? "talent" : "client",
    ]),
  );

  return reports.map((report) => ({
    adminNotes: report.adminNotes ?? "",
    createdAt: report.createdAt.toISOString(),
    details: report.details ?? "",
    reason: report.reason,
    reportId: report.reportId,
    reporterEmail: report.Reporter.email,
    reporterName: displayName(report.Reporter),
    reviewedAt: report.reviewedAt?.toISOString() ?? "",
    reviewedByEmail: report.reviewedByEmail ?? "",
    status: report.status,
    targetId: report.targetId,
    targetAudience:
      report.targetType === "PROFILE"
        ? (profileAudienceById.get(report.targetId) ?? "unknown")
        : "unknown",
    targetLabel: report.targetLabel,
    targetPath: report.targetPath ?? "",
    targetType: report.targetType,
  }));
}
