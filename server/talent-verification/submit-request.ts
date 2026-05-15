import "server-only";

import { TalentVerificationStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { BU_ID_IMAGE_BUCKET } from "@/lib/supabase/storage";
import {
  buildBuIdStoragePath,
  isBuEmail,
  normalizeBuEmail,
  validateBuIdImageFile,
} from "@/server/talent-verification/rules";

export type SubmitTalentVerificationInput = {
  authId: string;
  confirmedAt: string | null;
  file: File | null;
  userId: string;
  userEmail: string;
};

export type TalentVerificationMutationResult =
  | { message: string; ok: true }
  | { message: string; ok: false };

export async function submitTalentVerificationRequest({
  authId,
  confirmedAt,
  file,
  userEmail,
  userId,
}: SubmitTalentVerificationInput): Promise<TalentVerificationMutationResult> {
  const buEmail = normalizeBuEmail(userEmail);

  if (!isBuEmail(buEmail)) {
    return {
      message: "Use your confirmed @bicol-u.edu.ph email before applying.",
      ok: false,
    };
  }

  if (!confirmedAt) {
    return {
      message: "Confirm your BU email from your inbox before applying.",
      ok: false,
    };
  }

  const fileError = validateBuIdImageFile(file);

  if (fileError || !file) {
    return { message: fileError, ok: false };
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
