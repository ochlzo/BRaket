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
    targetLabel: report.targetLabel,
    targetPath: report.targetPath ?? "",
    targetType: report.targetType,
  }));
}
