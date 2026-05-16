import "server-only";

import { isReportStatusValue } from "@/lib/moderation/report-options";
import { prisma } from "@/lib/prisma";

export async function updateContentReportReview(input: {
  adminNotes: string;
  reportId: string;
  reviewerEmail: string;
  status: string;
}) {
  if (!input.reportId.trim()) {
    throw new Error("Missing report id.");
  }

  if (!isReportStatusValue(input.status)) {
    throw new Error("Invalid report status.");
  }

  await prisma.contentReport.update({
    data: {
      adminNotes: input.adminNotes.trim().slice(0, 500) || null,
      reviewedAt: input.status === "PENDING" ? null : new Date(),
      reviewedByEmail:
        input.status === "PENDING" ? null : input.reviewerEmail.trim(),
      status: input.status,
    },
    where: { reportId: input.reportId },
  });
}
