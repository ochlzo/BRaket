export const BU_ID_IMAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_BU_ID_BUCKET ?? "BU ID Image";

export const BU_ID_IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const BU_ID_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const CLIENT_PORTFOLIO_MEDIA_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_CLIENT_PORTFOLIO_BUCKET ??
  "client-portfolio-media";

export const CLIENT_PORTFOLIO_MEDIA_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES = 10;
