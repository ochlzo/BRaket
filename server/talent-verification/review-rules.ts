import { TalentVerificationStatus } from "@prisma/client";

export type ReviewableRequest = { status: TalentVerificationStatus };

export function assertPendingVerificationRequest<T extends ReviewableRequest>(
  request: T | null,
): asserts request is T & { status: typeof TalentVerificationStatus.PENDING } {
  if (!request || request.status !== TalentVerificationStatus.PENDING) {
    throw new Error("This verification request is no longer pending.");
  }
}

export function buildApprovalReviewData(
  reviewerEmail: string,
  reviewedAt = new Date(),
) {
  return {
    rejectionReason: null,
    reviewedAt,
    reviewedByEmail: reviewerEmail,
    status: TalentVerificationStatus.APPROVED,
  };
}

export function buildRejectionReviewData(
  reviewerEmail: string,
  rejectionReason: string,
  reviewedAt = new Date(),
) {
  return {
    rejectionReason: rejectionReason.trim() || null,
    reviewedAt,
    reviewedByEmail: reviewerEmail,
    status: TalentVerificationStatus.REJECTED,
  };
}
