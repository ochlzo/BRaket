import "server-only";

import { TalentVerificationStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type ApplicantVerificationState = {
  buEmail: string;
  rejectionReason: string;
  status: "approved" | "none" | "pending" | "rejected";
  submittedAt: string;
};

const EMPTY_STATE: ApplicantVerificationState = {
  buEmail: "",
  rejectionReason: "",
  status: "none",
  submittedAt: "",
};

export async function getApplicantVerificationState(
  userId: string,
  isVerified: boolean,
): Promise<ApplicantVerificationState> {
  if (isVerified) {
    return { ...EMPTY_STATE, status: "approved" as const };
  }

  const request = await prisma.talentVerificationRequest.findFirst({
    orderBy: { createdAt: "desc" },
    select: {
      buEmail: true,
      createdAt: true,
      rejectionReason: true,
      status: true,
    },
    where: { userId },
  });

  if (!request) {
    return EMPTY_STATE;
  }

  return {
    buEmail: request.buEmail,
    rejectionReason: request.rejectionReason ?? "",
    status: mapRequestStatus(request.status),
    submittedAt: request.createdAt.toISOString(),
  };
}

function mapRequestStatus(
  status: TalentVerificationStatus,
): ApplicantVerificationState["status"] {
  if (status === TalentVerificationStatus.APPROVED) {
    return "approved";
  }

  if (status === TalentVerificationStatus.REJECTED) {
    return "rejected";
  }

  return "pending";
}
