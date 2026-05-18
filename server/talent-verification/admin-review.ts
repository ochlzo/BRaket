import "server-only";

import { prisma } from "@/lib/prisma";
import {
  assertPendingVerificationRequest,
  buildApprovalReviewData,
  buildRejectionReviewData,
} from "@/server/talent-verification/review-rules";
import {
  sendVerificationApprovalEmail,
  sendVerificationRejectionEmail,
} from "@/server/talent-verification/email";

export type ReviewTalentVerificationInput = {
  requestId: string;
  reviewerEmail: string;
};

function talentDisplayName(
  firstName: string | null,
  lastName: string | null,
  email: string,
) {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim() || email;
}

export async function approveTalentVerificationRequest({
  requestId,
  reviewerEmail,
}: ReviewTalentVerificationInput) {
  const reviewedAt = new Date();

  const { talentEmail, talentFirstName, talentLastName } =
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

      const user = await tx.user.update({
        data: { is_verified: true },
        select: { email: true, firstName: true, lastName: true },
        where: { userId: request.userId },
      });

      return {
        talentEmail: user.email,
        talentFirstName: user.firstName,
        talentLastName: user.lastName,
      };
    });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  const dashboardUrl = siteUrl
    ? `${siteUrl}/dashboard/talent`
    : "/dashboard/talent";

  await sendVerificationApprovalEmail({
    dashboardUrl,
    talent: {
      displayName: talentDisplayName(talentFirstName, talentLastName, talentEmail),
      email: talentEmail,
    },
  }).catch((err: unknown) => {
    console.warn("Failed to send verification approval email:", err);
  });
}

export async function rejectTalentVerificationRequest({
  rejectionReason,
  requestId,
  reviewerEmail,
}: ReviewTalentVerificationInput & { rejectionReason: string }) {
  const reviewedAt = new Date();

  const { talentEmail, talentFirstName, talentLastName } =
    await prisma.$transaction(async (tx) => {
      const request = await tx.talentVerificationRequest.findUnique({
        select: { requestId: true, status: true, userId: true },
        where: { requestId },
      });

      assertPendingVerificationRequest(request);

      await tx.talentVerificationRequest.update({
        data: buildRejectionReviewData(reviewerEmail, rejectionReason, reviewedAt),
        where: { requestId },
      });

      const user = await tx.user.findUnique({
        select: { email: true, firstName: true, lastName: true },
        where: { userId: request.userId },
      });

      return {
        talentEmail: user?.email ?? "",
        talentFirstName: user?.firstName ?? null,
        talentLastName: user?.lastName ?? null,
      };
    });

  if (talentEmail) {
    await sendVerificationRejectionEmail({
      rejectionReason,
      talent: {
        displayName: talentDisplayName(talentFirstName, talentLastName, talentEmail),
        email: talentEmail,
      },
    }).catch((err: unknown) => {
      console.warn("Failed to send verification rejection email:", err);
    });
  }
}
