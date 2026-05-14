"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  USER_PROFILE_IMAGE_ACCEPTED_TYPES,
  USER_PROFILE_IMAGE_MAX_BYTES,
  USER_PROFILE_IMAGES_BUCKET,
} from "@/lib/supabase/storage";
import type { UpdateClientProfileImagesState } from "@/lib/client-profile/types";
import {
  clearCurrentAppUserCache,
  getCurrentAppUser,
} from "@/server/users/current-user";

const EMPTY_STATE: UpdateClientProfileImagesState = {
  message: "",
  ok: false,
};

function readFile(formData: FormData, key: string) {
  const value = formData.get(key);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function readBoolean(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

function getFileExtension(file: File) {
  const byType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return byType[file.type] ?? "png";
}

function isSupportedImage(file: File) {
  return USER_PROFILE_IMAGE_ACCEPTED_TYPES.includes(file.type);
}

function buildObjectPath(authId: string, folder: "avatars" | "backgrounds", file: File) {
  const prefix = folder === "avatars" ? "avatar" : "background";

  return `${folder}/${authId}/${prefix}-${crypto.randomUUID()}.${getFileExtension(file)}`;
}

function getPublicObjectPath(publicUrl: string | null | undefined) {
  if (!publicUrl) {
    return null;
  }

  try {
    const pathname = new URL(publicUrl).pathname;
    const segments = pathname.split("/").filter(Boolean);
    const prefix = ["storage", "v1", "object", "public", USER_PROFILE_IMAGES_BUCKET];

    if (segments.length <= prefix.length) {
      return null;
    }

    const isBucketUrl = prefix.every((segment, index) => segments[index] === segment);

    if (!isBucketUrl) {
      return null;
    }

    return segments
      .slice(prefix.length)
      .map((segment) => decodeURIComponent(segment))
      .join("/");
  } catch {
    return null;
  }
}

async function removeUploadedImages(objectPaths: string[]) {
  if (objectPaths.length === 0) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.storage
    .from(USER_PROFILE_IMAGES_BUCKET)
    .remove(objectPaths);
}

async function uploadImage(
  authId: string,
  folder: "avatars" | "backgrounds",
  file: File,
) {
  const objectPath = buildObjectPath(authId, folder, file);
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(USER_PROFILE_IMAGES_BUCKET)
    .upload(objectPath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(USER_PROFILE_IMAGES_BUCKET).getPublicUrl(objectPath);

  return {
    objectPath,
    publicUrl,
  };
}

export async function updateClientProfileImagesAction(
  _prevState: UpdateClientProfileImagesState,
  formData: FormData,
): Promise<UpdateClientProfileImagesState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser || currentUser.role !== "client") {
    return {
      ...EMPTY_STATE,
      message: "Your session expired. Please sign in again.",
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: { authId: currentUser.authId },
  });

  if (!dbUser) {
    return {
      ...EMPTY_STATE,
      message: "We could not find your profile record.",
    };
  }

  const avatarImage = readFile(formData, "avatarImage");
  const backgroundImage = readFile(formData, "backgroundImage");
  const removeAvatarImage = readBoolean(formData, "removeAvatarImage");
  const removeBackgroundImage = readBoolean(formData, "removeBackgroundImage");

  if (
    !avatarImage &&
    !backgroundImage &&
    !removeAvatarImage &&
    !removeBackgroundImage
  ) {
    return {
      ...EMPTY_STATE,
      message: "Select at least one image before saving.",
    };
  }

  const files = [
    avatarImage
      ? { folder: "avatars" as const, file: avatarImage }
      : null,
    backgroundImage
      ? { folder: "backgrounds" as const, file: backgroundImage }
      : null,
  ].filter(
    (entry): entry is { folder: "avatars" | "backgrounds"; file: File } =>
      Boolean(entry),
  );

  const invalidFile = files.find(({ file }) => !isSupportedImage(file));

  if (invalidFile) {
    return {
      ...EMPTY_STATE,
      message: "Only JPG, PNG, and WebP images are supported.",
    };
  }

  const oversizedFile = files.find(
    ({ file }) => file.size > USER_PROFILE_IMAGE_MAX_BYTES,
  );

  if (oversizedFile) {
    return {
      ...EMPTY_STATE,
      message: "Keep each image under 5 MB.",
    };
  }

  let nextAvatarUrl = dbUser.avatarUrl ?? null;
  let nextBackgroundImageUrl = dbUser.background_img_url ?? null;
  const uploadedImages: string[] = [];
  const objectPathsToDelete = new Set<string>();
  const currentAvatarObjectPath = getPublicObjectPath(dbUser.avatarUrl);
  const currentBackgroundObjectPath = getPublicObjectPath(
    dbUser.background_img_url,
  );

  try {
    if (removeAvatarImage && !avatarImage) {
      nextAvatarUrl = null;
      if (currentAvatarObjectPath) {
        objectPathsToDelete.add(currentAvatarObjectPath);
      }
    }

    if (removeBackgroundImage && !backgroundImage) {
      nextBackgroundImageUrl = null;
      if (currentBackgroundObjectPath) {
        objectPathsToDelete.add(currentBackgroundObjectPath);
      }
    }

    for (const { folder, file } of files) {
      const uploadedImage = await uploadImage(currentUser.authId, folder, file);
      uploadedImages.push(uploadedImage.objectPath);

      if (folder === "avatars") {
        nextAvatarUrl = uploadedImage.publicUrl;
        if (currentAvatarObjectPath) {
          objectPathsToDelete.add(currentAvatarObjectPath);
        }
      } else {
        nextBackgroundImageUrl = uploadedImage.publicUrl;
        if (currentBackgroundObjectPath) {
          objectPathsToDelete.add(currentBackgroundObjectPath);
        }
      }
    }

    const result = await prisma.user.updateMany({
      data: {
        avatarUrl: nextAvatarUrl,
        background_img_url: nextBackgroundImageUrl,
      },
      where: { authId: currentUser.authId },
    });

    if (result.count === 0) {
      throw new Error("No profile row updated.");
    }
  } catch {
    await removeUploadedImages(uploadedImages).catch(() => {});

    return {
      ...EMPTY_STATE,
      message: "We could not save those images right now.",
    };
  }

  await removeUploadedImages(Array.from(objectPathsToDelete)).catch(() => {});

  clearCurrentAppUserCache(currentUser.authId);
  revalidatePath("/dashboard/client/profile");
  revalidatePath("/dashboard/profile");

  return {
    message: "Profile images updated.",
    ok: true,
  };
}
