import {
  CLIENT_PORTFOLIO_MEDIA_ACCEPTED_TYPES,
  CLIENT_PORTFOLIO_MEDIA_MAX_BYTES,
  CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES,
} from "@/lib/supabase/storage";

export function formatPortfolioFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isClientPortfolioMediaType(type: string) {
  return CLIENT_PORTFOLIO_MEDIA_ACCEPTED_TYPES.includes(type);
}

export function isClientPortfolioMediaSize(size: number) {
  return size <= CLIENT_PORTFOLIO_MEDIA_MAX_BYTES;
}

export function getClientPortfolioFileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function mergeClientPortfolioFiles(existing: File[], incoming: File[]) {
  const merged: File[] = [];
  const seen = new Set<string>();

  for (const file of [...existing, ...incoming]) {
    const key = getClientPortfolioFileKey(file);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    merged.push(file);
  }

  return merged.slice(0, CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES);
}

