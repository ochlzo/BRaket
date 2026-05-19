"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  CLIENT_PORTFOLIO_MEDIA_BUCKET,
  CLIENT_PORTFOLIO_MEDIA_MAX_BYTES,
  CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES,
} from "@/lib/supabase/storage";
import type { CreateClientPortfolioPostState } from "@/lib/client-profile/types";
import { getCurrentAppUser } from "@/server/users/current-user";

const EMPTY_STATE: CreateClientPortfolioPostState = {
  message: "",
  ok: false,
};

type UploadedAsset = {
  objectPath: string;
  publicUrl: string;
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseStringArray(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed
          .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
          .filter(Boolean)
      : [];
  } catch {
    return [];
  }
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

function getMediaObjectPath(publicUrl: string) {
  const marker = `/storage/v1/object/public/${CLIENT_PORTFOLIO_MEDIA_BUCKET}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const objectPath = publicUrl.slice(markerIndex + marker.length);
  return objectPath ? decodeURIComponent(objectPath) : null;
}

async function removeUploadedAssets(assets: UploadedAsset[]) {
  if (assets.length === 0) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.storage
    .from(CLIENT_PORTFOLIO_MEDIA_BUCKET)
    .remove(assets.map((asset) => asset.objectPath));
}

export async function updateClientPortfolioPostAction(
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

  const portfolioId = readText(formData, "portfolioId");
  const title = readText(formData, "title");
  const description = readText(formData, "description");
  const existingMediaUrls = parseStringArray(formData.get("existingMediaUrls"));
  const removedExistingMediaUrls = parseStringArray(
    formData.get("removedExistingMediaUrls"),
  );
  const files = formData
    .getAll("media")
    .filter((entry): entry is File => entry instanceof File);

  if (!portfolioId) {
    return {
      ...EMPTY_STATE,
      message: "We could not identify the portfolio post to update.",
    };
  }

  if (!title) {
    return {
      ...EMPTY_STATE,
      message: "Portfolio title is required.",
    };
  }

  if (!description) {
    return {
      ...EMPTY_STATE,
      message: "Description is required.",
    };
  }

  const portfolio = await prisma.clientPortfolio.findFirst({
    include: {
      ClientPortfolioMedia: {
        select: {
          media_url: true,
        },
      },
    },
    where: {
      client_portfolio_id: portfolioId,
      ClientProfile: {
        user_id: currentUser.id,
      },
    },
  });

  if (!portfolio) {
    return {
      ...EMPTY_STATE,
      message: "We could not find that portfolio post.",
    };
  }

  const currentMediaCount = portfolio.ClientPortfolioMedia.length;
  const removedSet = new Set(
    removedExistingMediaUrls.length > 0
      ? removedExistingMediaUrls
      : portfolio.ClientPortfolioMedia
          .map((media) => media.media_url)
          .filter((url) => !existingMediaUrls.includes(url)),
  );
  const totalMediaCount = currentMediaCount - removedSet.size + files.length;

  if (totalMediaCount === 0) {
    return {
      ...EMPTY_STATE,
      message: "Add at least one portfolio image.",
    };
  }

  if (totalMediaCount > CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES) {
    return {
      ...EMPTY_STATE,
      message: `You can upload at most ${CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES} images per post.`,
    };
  }

  const invalidFile = files.find((file) =>
    !["image/jpeg", "image/png", "image/webp"].includes(file.type),
  );
  if (invalidFile) {
    return {
      ...EMPTY_STATE,
      message: "Only JPG, PNG, and WebP images are supported.",
    };
  }

  const oversizedFile = files.find((file) => file.size > CLIENT_PORTFOLIO_MEDIA_MAX_BYTES);
  if (oversizedFile) {
    return {
      ...EMPTY_STATE,
      message: "Keep each image under 5 MB.",
    };
  }

  const uploadedAssets: UploadedAsset[] = [];

  try {
    const supabase = createAdminClient();

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
      await tx.clientPortfolio.update({
        data: {
          description,
          title,
          updatedAt: new Date(),
        },
        where: {
          client_portfolio_id: portfolioId,
        },
      });

      if (removedSet.size > 0) {
        await tx.clientPortfolioMedia.deleteMany({
          where: {
            client_portfolio_id: portfolioId,
            media_url: { in: Array.from(removedSet) },
          },
        });
      }

      if (uploadedAssets.length > 0) {
        await tx.clientPortfolioMedia.createMany({
          data: uploadedAssets.map((asset, index) => ({
            cportfolio_media_id: crypto.randomUUID(),
            client_portfolio_id: portfolioId,
            createdAt: new Date(Date.now() + index + 1),
            media_url: asset.publicUrl,
            updatedAt: new Date(Date.now() + index + 1),
          })),
        });
      }
    });
  } catch {
    await removeUploadedAssets(uploadedAssets).catch(() => {});

    return {
      ...EMPTY_STATE,
      message: "We could not save your portfolio post right now.",
    };
  }

  if (removedSet.size > 0) {
    const objectPaths = Array.from(removedSet)
      .map(getMediaObjectPath)
      .filter((value): value is string => Boolean(value));

    if (objectPaths.length > 0) {
      await removeUploadedAssets(
        objectPaths.map((objectPath) => ({ objectPath, publicUrl: "" })),
      ).catch(() => {});
    }
  }

  revalidatePath("/dashboard/client/profile");

  return {
    message: "Portfolio post updated.",
    ok: true,
    successToken: crypto.randomUUID(),
  };
}
