"use server";

import { revalidatePath } from "next/cache";

import {
  parseTalentPortfolioStepFormData,
  type TalentPortfolioStepState,
  validateTalentPortfolioStepInput,
} from "@/app/onboarding/talent/_lib/talent-portfolio-step";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { TALENT_PORTFOLIO_MEDIA_BUCKET } from "@/lib/supabase/storage";
import { getCurrentAppUser } from "@/server/users/current-user";

const EMPTY_STATE: TalentPortfolioStepState = {
  message: "",
  ok: false,
};

type UploadedTalentPortfolioAsset = {
  objectPath: string;
  publicUrl: string;
};

function getFileExtension(file: File) {
  const byType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return byType[file.type] ?? "png";
}

function buildObjectPath(authId: string, index: number, file: File) {
  return `${authId}/portfolio/${crypto.randomUUID()}-${index}.${getFileExtension(
    file,
  )}`;
}

async function removeUploadedAssets(assets: UploadedTalentPortfolioAsset[]) {
  if (assets.length === 0) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.storage
    .from(TALENT_PORTFOLIO_MEDIA_BUCKET)
    .remove(assets.map((asset) => asset.objectPath));
}

export async function saveTalentPortfolioStepAction(
  formData: FormData,
): Promise<TalentPortfolioStepState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return {
      ...EMPTY_STATE,
      message: "Your session expired. Please sign in again.",
    };
  }

  const input = parseTalentPortfolioStepFormData(formData);
  const talentProfile = await prisma.talentProfile.findUnique({
    where: { user_id: currentUser.id },
  });

  if (!talentProfile) {
    return {
      ...EMPTY_STATE,
      message: "Complete your talent profile before adding a portfolio.",
    };
  }

  const existingPortfolio = input.portfolioId
    ? await prisma.talentPortfolio.findFirst({
        include: {
          TalentPortfolioMedia: { select: { tportfolio_media_id: true } },
        },
        where: {
          talent_portfolio_id: input.portfolioId,
          talent_profile_id: talentProfile.talent_profile_id,
        },
      })
    : null;
  const validationWithExistingMedia = validateTalentPortfolioStepInput({
    ...input,
    existingMediaCount: existingPortfolio?.TalentPortfolioMedia.length ?? 0,
  });

  if (!validationWithExistingMedia.ok) {
    return validationWithExistingMedia;
  }

  const uploadedAssets: UploadedTalentPortfolioAsset[] = [];

  try {
    if (input.files.length > 0) {
      const supabase = createAdminClient();

      for (const [index, file] of input.files.entries()) {
        const objectPath = buildObjectPath(currentUser.authId, index, file);
        const { error } = await supabase.storage
          .from(TALENT_PORTFOLIO_MEDIA_BUCKET)
          .upload(objectPath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (error) {
          throw error;
        }

        const { data } = supabase.storage
          .from(TALENT_PORTFOLIO_MEDIA_BUCKET)
          .getPublicUrl(objectPath);

        uploadedAssets.push({
          objectPath,
          publicUrl: data.publicUrl,
        });
      }
    }

    await prisma.$transaction(async (tx) => {
      const portfolioId =
        existingPortfolio?.talent_portfolio_id ?? crypto.randomUUID();
      const timestamp = new Date();

      if (existingPortfolio) {
        await tx.talentPortfolio.update({
          data: {
            description: input.description,
            title: input.title,
            updatedAt: timestamp,
          },
          where: { talent_portfolio_id: portfolioId },
        });
      } else {
        await tx.talentPortfolio.create({
          data: {
            createdAt: timestamp,
            description: input.description,
            talent_portfolio_id: portfolioId,
            talent_profile_id: talentProfile.talent_profile_id,
            title: input.title,
            updatedAt: timestamp,
          },
        });
      }

      if (uploadedAssets.length > 0) {
        await tx.talentPortfolioMedia.createMany({
          data: uploadedAssets.map((asset, index) => ({
            createdAt: new Date(timestamp.getTime() + index + 1),
            media_url: asset.publicUrl,
            talent_portfolio_id: portfolioId,
            tportfolio_media_id: crypto.randomUUID(),
            updatedAt: new Date(timestamp.getTime() + index + 1),
          })),
        });
      }
    });
  } catch {
    await removeUploadedAssets(uploadedAssets).catch(() => {});

    return {
      ...EMPTY_STATE,
      message: "We could not save your portfolio right now.",
    };
  }

  revalidatePath("/onboarding/talent");
  revalidatePath("/dashboard/talent/profile");

  return {
    message: "Portfolio created.",
    ok: true,
    successToken: crypto.randomUUID(),
  };
}
