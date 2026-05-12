"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  CLIENT_PORTFOLIO_MEDIA_ACCEPTED_TYPES,
  CLIENT_PORTFOLIO_MEDIA_BUCKET,
  CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES,
} from "@/lib/supabase/storage";
import type { CreateClientPortfolioPostState } from "@/lib/client-profile/types";
import { getCurrentAppUser } from "@/server/users/current-user";

const EMPTY_STATE: CreateClientPortfolioPostState = {
  message: "",
  ok: false,
};

type UploadedPortfolioAsset = {
  objectPath: string;
  publicUrl: string;
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isSupportedImage(file: File) {
  return CLIENT_PORTFOLIO_MEDIA_ACCEPTED_TYPES.includes(file.type);
}

function getFileExtension(file: File) {
  const byType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return byType[file.type] ?? "png";
}

function buildObjectPath(userId: string, index: number, file: File) {
  return `client-portfolio/${userId}/${crypto.randomUUID()}-${index}.${getFileExtension(file)}`;
}

async function removeUploadedAssets(assets: UploadedPortfolioAsset[]) {
  if (assets.length === 0) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.storage
    .from(CLIENT_PORTFOLIO_MEDIA_BUCKET)
    .remove(assets.map((asset) => asset.objectPath));
}

export async function createClientPortfolioPostAction(
  _prevState: CreateClientPortfolioPostState,
  formData: FormData,
): Promise<CreateClientPortfolioPostState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser || currentUser.role !== "client") {
    return {
      ...EMPTY_STATE,
      message: "Your session expired. Please sign in again.",
    };
  }

  const title = readText(formData, "title") || "Untitled post";
  const description = readText(formData, "description");
  const files = formData
    .getAll("media")
    .filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return {
      ...EMPTY_STATE,
      message: "Add at least one image before creating a post.",
    };
  }

  if (files.length > CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES) {
    return {
      ...EMPTY_STATE,
      message: `You can upload at most ${CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES} images per post.`,
    };
  }

  const invalidFile = files.find((file) => !isSupportedImage(file));
  if (invalidFile) {
    return {
      ...EMPTY_STATE,
      message: "Only JPG, PNG, and WebP images are supported.",
    };
  }

  const clientProfile = await prisma.clientProfile.findUnique({
    where: {
      user_id: currentUser.id,
    },
  });

  if (!clientProfile) {
    return {
      ...EMPTY_STATE,
      message: "Complete your client profile before adding portfolio posts.",
    };
  }

  const supabase = createAdminClient();
  const uploadedAssets: UploadedPortfolioAsset[] = [];

  try {
    for (const [index, file] of files.entries()) {
      const objectPath = buildObjectPath(currentUser.id, index, file);
      const { error } = await supabase.storage
        .from(CLIENT_PORTFOLIO_MEDIA_BUCKET)
        .upload(objectPath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from(CLIENT_PORTFOLIO_MEDIA_BUCKET)
        .getPublicUrl(objectPath);

      uploadedAssets.push({
        objectPath,
        publicUrl: data.publicUrl,
      });
    }

    await prisma.$transaction(async (tx) => {
      const portfolioId = crypto.randomUUID();
      const timestamp = new Date();

      await tx.clientPortfolio.create({
        data: {
          client_portfolio_id: portfolioId,
          client_profile_id: clientProfile.client_profile_id,
          createdAt: timestamp,
          desciption: description,
          title,
          updatedAt: timestamp,
        },
      });

      await tx.clientPortfolioMedia.createMany({
        data: uploadedAssets.map((asset, index) => ({
          cportfolio_media_id: crypto.randomUUID(),
          client_portfolio_id: portfolioId,
          createdAt: new Date(timestamp.getTime() + index + 1),
          media_url: asset.publicUrl,
          updatedAt: new Date(timestamp.getTime() + index + 1),
        })),
      });
    });
  } catch {
    await removeUploadedAssets(uploadedAssets).catch(() => {});

    return {
      ...EMPTY_STATE,
      message: "We could not save your portfolio post right now.",
    };
  }

  revalidatePath("/dashboard/client/profile");

  return {
    message: "Portfolio post created.",
    ok: true,
    successToken: crypto.randomUUID(),
  };
}
