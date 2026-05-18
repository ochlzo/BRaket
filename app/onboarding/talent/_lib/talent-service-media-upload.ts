import { createAdminClient } from "@/lib/supabase/admin";
import { TALENT_SERVICE_MEDIA_BUCKET } from "@/lib/supabase/storage";

export type UploadedTalentServiceAsset = {
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
  return `${authId}/services/${crypto.randomUUID()}-${index}.${getFileExtension(
    file,
  )}`;
}

export async function removeUploadedServiceAssets(
  assets: UploadedTalentServiceAsset[],
) {
  if (assets.length === 0) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.storage
    .from(TALENT_SERVICE_MEDIA_BUCKET)
    .remove(assets.map((asset) => asset.objectPath));
}

export async function uploadServiceMedia(authId: string, files: File[]) {
  const uploadedAssets: UploadedTalentServiceAsset[] = [];

  if (files.length === 0) {
    return uploadedAssets;
  }

  const supabase = createAdminClient();

  for (const [index, file] of files.entries()) {
    const objectPath = buildObjectPath(authId, index, file);
    const { error } = await supabase.storage
      .from(TALENT_SERVICE_MEDIA_BUCKET)
      .upload(objectPath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from(TALENT_SERVICE_MEDIA_BUCKET)
      .getPublicUrl(objectPath);

    uploadedAssets.push({
      objectPath,
      publicUrl: data.publicUrl,
    });
  }

  return uploadedAssets;
}
