import "server-only";

import { prisma } from "@/lib/prisma";
import {
  assertPendingVerificationRequest,
  buildApprovalReviewData,
  buildRejectionReviewData,
} from "@/server/talent-verification/review-rules";

export type ReviewTalentVerificationInput = {
  requestId: string;
  reviewerEmail: string;
};

export async function approveTalentVerificationRequest({
  requestId,
  reviewerEmail,
}: ReviewTalentVerificationInput) {
  const reviewedAt = new Date();

  await prisma.$transaction(async (tx) => {
    const request = await tx.talentVerificationRequest.findUnique({
      select: { requestId: true, status: true, userId: true },
      where: { requestId },
    });

    assertPendingVerificationRequest(request);

    await tx.talentVerificationRequest.update({
      data: buildApprovalReviewData(reviewerEmail, reviewedAt),
      where: { requestId },
    });

    await tx.user.update({
      data: { is_verified: true },
      where: { userId: request.userId },
    });
  });
}

export async function rejectTalentVerificationRequest({
  rejectionReason,
  requestId,
  reviewerEmail,
}: ReviewTalentVerificationInput & { rejectionReason: string }) {
  const reviewedAt = new Date();

  await prisma.$transaction(async (tx) => {
    const request = await tx.talentVerificationRequest.findUnique({
      select: { requestId: true, status: true },
      where: { requestId },
    });

    assertPendingVerificationRequest(request);

    await tx.talentVerificationRequest.update({
      data: buildRejectionReviewData(
        reviewerEmail,
        rejectionReason,
        reviewedAt,
      ),
      where: { requestId },
    });
  });
}
