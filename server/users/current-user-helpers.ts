import type { SkillLevel } from "@/lib/types";

export type CurrentUserSkill = {
  level: SkillLevel;
  name: string;
};

type CurrentUserCacheEntry = {
  expiresAt: number;
  user: unknown;
};

const CURRENT_USER_CACHE_TTL_MS = 30_000;

const globalForCurrentUserCache = globalThis as unknown as {
  currentAppUserCache: Map<string, CurrentUserCacheEntry> | undefined;
};

const currentAppUserCache =
  globalForCurrentUserCache.currentAppUserCache ?? new Map();

if (process.env.NODE_ENV !== "production") {
  globalForCurrentUserCache.currentAppUserCache = currentAppUserCache;
}

export function pickTextValue(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
}

export function parseRateValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return null;
}

export function parseSkillsValue(value: unknown): CurrentUserSkill[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const maybeSkill = entry as Record<string, unknown>;
    const name =
      typeof maybeSkill.name === "string" ? maybeSkill.name.trim() : "";

    if (!name) {
      return [];
    }

    const level = maybeSkill.level;
    const normalizedLevel: SkillLevel =
      level === "beginner" || level === "expert" || level === "intermediate"
        ? level
        : "intermediate";

    return [{ level: normalizedLevel, name }];
  });
}

export function getCacheKey(authId: string, sessionId: string) {
  return `${authId}:${sessionId}`;
}

export function readCachedCurrentAppUser<T>(cacheKey: string) {
  const cached = currentAppUserCache.get(cacheKey);

  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    currentAppUserCache.delete(cacheKey);
    return null;
  }

  return cached.user as T;
}

export function writeCachedCurrentAppUser<T>(cacheKey: string, user: T) {
  currentAppUserCache.set(cacheKey, {
    expiresAt: Date.now() + CURRENT_USER_CACHE_TTL_MS,
    user,
  });
}

export function clearCurrentAppUserCache(authId: string) {
  for (const cacheKey of currentAppUserCache.keys()) {
    if (cacheKey.startsWith(`${authId}:`)) {
      currentAppUserCache.delete(cacheKey);
    }
  }
}
