import "server-only";

import { TalentVerificationStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { BU_ID_IMAGE_BUCKET } from "@/lib/supabase/storage";
import { verifyTalentVerificationEmailOtp } from "@/server/talent-verification/email-otp";
import {
  buildBuIdStoragePath,
  isBuEmail,
  normalizeBuEmail,
  validateBuIdImageFile,
} from "@/server/talent-verification/rules";

export type SubmitTalentVerificationInput = {
  authId: string;
  buEmail: string;
  confirmedAt: string | null;
  file: File | null;
  otpCode: string;
  userId: string;
};

export type TalentVerificationMutationResult =
  | { message: string; ok: true }
  | { message: string; ok: false };

export async function submitTalentVerificationRequest({
  authId,
  buEmail: rawBuEmail,
  confirmedAt,
  file,
  otpCode,
  userId,
}: SubmitTalentVerificationInput): Promise<TalentVerificationMutationResult> {
  const buEmail = normalizeBuEmail(rawBuEmail);

  if (!isBuEmail(buEmail)) {
    return {
      message: "Use your @bicol-u.edu.ph email before applying.",
      ok: false,
    };
  }

  if (!confirmedAt) {
    return {
      message: "Confirm your account email from your inbox before applying.",
      ok: false,
    };
  }

  const fileError = validateBuIdImageFile(file);

  if (fileError || !file) {
    return { message: fileError, ok: false };
  }

  const otpVerification = await verifyTalentVerificationEmailOtp({
    buEmail,
    code: otpCode,
    userId,
  });

  if (!otpVerification.ok) {
    return otpVerification;
  }

  const adminClient = createAdminClient();
  const uploadedPath = buildBuIdStoragePath(authId, file);
  const { error: uploadError } = await adminClient.storage
    .from(BU_ID_IMAGE_BUCKET)
    .upload(uploadedPath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return {
      message: `We could not upload your BU ID image yet: ${uploadError.message}`,
      ok: false,
    };
  }

  let oldPendingPath = "";

  try {
    await prisma.$transaction(async (tx) => {
      const pendingRequest = await tx.talentVerificationRequest.findFirst({
        select: { buIdImagePath: true, requestId: true },
        where: { status: TalentVerificationStatus.PENDING, userId },
      });

      if (pendingRequest) {
        oldPendingPath = pendingRequest.buIdImagePath;
        await tx.talentVerificationRequest.update({
          data: {
            buEmail,
            buIdImageBucket: BU_ID_IMAGE_BUCKET,
            buIdImagePath: uploadedPath,
            rejectionReason: null,
            reviewedAt: null,
            reviewedByEmail: null,
          },
          where: { requestId: pendingRequest.requestId },
        });
        return;
      }

      await tx.talentVerificationRequest.create({
        data: {
          buEmail,
          buIdImageBucket: BU_ID_IMAGE_BUCKET,
          buIdImagePath: uploadedPath,
          userId,
        },
      });
    });
  } catch {
    await adminClient.storage.from(BU_ID_IMAGE_BUCKET).remove([uploadedPath]);

    return {
      message: "We could not save your verification request yet.",
      ok: false,
    };
  }

  if (oldPendingPath) {
    await adminClient.storage.from(BU_ID_IMAGE_BUCKET).remove([oldPendingPath]);
  }

  return {
    message: "Your verification request was submitted for admin review.",
    ok: true,
  };
}
