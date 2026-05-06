export const BU_ID_IMAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_BU_ID_BUCKET ?? "BU ID Image";

export const BU_ID_IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const BU_ID_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
