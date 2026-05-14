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

export const CLIENT_PORTFOLIO_MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export const TALENT_PORTFOLIO_MEDIA_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_TALENT_PORTFOLIO_BUCKET ??
  "talent-portfolio-media";

export const TALENT_SERVICE_MEDIA_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_TALENT_SERVICE_BUCKET ??
  "service-media";

export const TALENT_SERVICE_MEDIA_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const TALENT_SERVICE_MEDIA_MAX_IMAGES = 10;

export const TALENT_SERVICE_MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export const USER_PROFILE_IMAGES_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_USER_PROFILE_IMAGES_BUCKET ??
  "user-profile-images";

export const USER_PROFILE_IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const USER_PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
