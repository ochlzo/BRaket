export const BU_EMAIL_DOMAIN = "@bicol-u.edu.ph";
const BU_ID_IMAGE_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const BU_ID_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export type VerificationFileLike = {
  name: string;
  size: number;
  type: string;
};

export function normalizeBuEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isBuEmail(email: string) {
  return normalizeBuEmail(email).endsWith(BU_EMAIL_DOMAIN);
}

export function validateBuIdImageFile(file: VerificationFileLike | null) {
  if (!file || file.size <= 0) {
    return "Upload a clear BU ID image.";
  }

  if (!BU_ID_IMAGE_ACCEPTED_TYPES.includes(file.type)) {
    return "Upload a JPG, PNG, or WebP image of your BU ID.";
  }

  if (file.size > BU_ID_IMAGE_MAX_BYTES) {
    return "Keep the BU ID image under 5 MB.";
  }

  return "";
}

export function buildBuIdStoragePath(authId: string, file: VerificationFileLike) {
  const extension =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    file.type.split("/").pop() ||
    "jpg";

  return `${authId}/talent-verification-${crypto.randomUUID()}.${extension}`;
}
