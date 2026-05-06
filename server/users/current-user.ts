import "server-only";

import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  buildDisplayName,
  deriveUsername,
  getAuthRedirectPath,
  normalizeUserRole,
} from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { SkillLevel, UserRole } from "@/lib/types";

const CURRENT_USER_CACHE_TTL_MS = 30_000;

export type CurrentUserSkill = {
  level: SkillLevel;
  name: string;
};

export type CurrentAppUser = {
  authId: string;
  avatarUrl: string;
  bio: string;
  createdAt: string;
  displayName: string;
  email: string;
  firstName: string;
  headline: string;
  id: string;
  isVerified: boolean;
  lastName: string;
  location: string;
  maxRate: number | null;
  minRate: number | null;
  role: UserRole;
  skills: CurrentUserSkill[];
  username: string;
};

type CurrentAppUserCacheEntry = {
  expiresAt: number;
  user: CurrentAppUser;
};

const globalForCurrentUserCache = globalThis as unknown as {
  currentAppUserCache: Map<string, CurrentAppUserCacheEntry> | undefined;
};

const currentAppUserCache =
  globalForCurrentUserCache.currentAppUserCache ?? new Map();

if (process.env.NODE_ENV !== "production") {
  globalForCurrentUserCache.currentAppUserCache = currentAppUserCache;
}

function pickTextValue(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
}

function parseRateValue(value: unknown) {
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

function parseSkillsValue(value: unknown): CurrentUserSkill[] {
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

function buildAvatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}`;
}

function getCacheKey(authId: string, sessionId: string) {
  return `${authId}:${sessionId}`;
}

function readCachedCurrentAppUser(cacheKey: string) {
  const cached = currentAppUserCache.get(cacheKey);

  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    currentAppUserCache.delete(cacheKey);
    return null;
  }

  return cached.user;
}

function writeCachedCurrentAppUser(cacheKey: string, user: CurrentAppUser) {
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

export async function getCurrentAppUser(): Promise<CurrentAppUser | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data,
    error,
  } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub || !data.claims.email) {
    return null;
  }

  const authId = data.claims.sub;
  const email = data.claims.email.trim().toLowerCase();
  const cacheKey = getCacheKey(authId, data.claims.session_id);
  const cachedUser = readCachedCurrentAppUser(cacheKey);

  if (cachedUser) {
    return cachedUser;
  }

  const metadata = (data.claims.user_metadata ?? {}) as Record<string, unknown>;
  const existingUser = await prisma.user.findFirst({
    where: { authId },
  });
  const role = normalizeUserRole(metadata.role);
  const username =
    pickTextValue(metadata, ["username"]) ||
    existingUser?.username ||
    deriveUsername(email);
  const authFirstName = pickTextValue(metadata, [
    "firstName",
    "firstname",
    "first_name",
    "given_name",
  ]);
  const authLastName = pickTextValue(metadata, [
    "lastName",
    "lastname",
    "last_name",
    "family_name",
  ]);
  const fallbackDisplayName =
    pickTextValue(metadata, ["full_name", "name"]) ||
    buildDisplayName(
      existingUser?.firstName ?? "",
      existingUser?.lastName ?? "",
      "",
    ) ||
    username;
  const displayName = buildDisplayName(
    existingUser?.firstName ?? authFirstName,
    existingUser?.lastName ?? authLastName,
    fallbackDisplayName,
  );
  const avatarUrl =
    existingUser?.avatarUrl ||
    pickTextValue(metadata, ["avatar_url", "avatarUrl", "picture"]) ||
    buildAvatarUrl(displayName || username);
  const headline = pickTextValue(metadata, ["headline"]);
  const bio = existingUser?.bio || pickTextValue(metadata, ["bio"]);
  const location =
    existingUser?.address ||
    pickTextValue(metadata, ["location", "address"]);
  const minRate = parseRateValue(metadata.minRate);
  const maxRate = parseRateValue(metadata.maxRate);
  const skills = parseSkillsValue(metadata.skills);

  let dbUser = existingUser;

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        authId,
        avatarUrl,
        bio: bio || null,
        email,
        firstName: authFirstName || null,
        lastName: authLastName || null,
        userId: authId,
        username,
      },
    });
  } else {
    const updateData: Prisma.UserUpdateInput = {};

    if (dbUser.email !== email) {
      updateData.email = email;
    }

    if (dbUser.username !== username) {
      updateData.username = username;
    }

    if (!dbUser.firstName && authFirstName) {
      updateData.firstName = authFirstName;
    }

    if (!dbUser.lastName && authLastName) {
      updateData.lastName = authLastName;
    }

    if (!dbUser.avatarUrl && avatarUrl) {
      updateData.avatarUrl = avatarUrl;
    }

    if (!dbUser.bio && bio) {
      updateData.bio = bio;
    }

    if (!dbUser.address && location) {
      updateData.address = location;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.user.updateMany({
        data: updateData,
        where: { authId: dbUser.authId },
      });
      dbUser = await prisma.user.findFirst({
        where: { authId },
      });
    }
  }

  if (!dbUser) {
    return null;
  }

  const currentUser = {
    authId: dbUser.authId,
    avatarUrl,
    bio: dbUser.bio ?? bio ?? "",
    createdAt: dbUser.createdAt.toISOString(),
    displayName,
    email: dbUser.email,
    firstName: dbUser.firstName ?? authFirstName,
    headline,
    id: dbUser.userId,
    isVerified: metadata.verified === true,
    lastName: dbUser.lastName ?? authLastName,
    location: dbUser.address ?? location ?? "",
    maxRate,
    minRate,
    role,
    skills,
    username: dbUser.username ?? username,
  };

  writeCachedCurrentAppUser(cacheKey, currentUser);
  return currentUser;
}

export async function requireCurrentAppUser(expectedRole?: UserRole) {
  const user = await getCurrentAppUser();

  if (!user) {
    redirect("/login");
  }

  if (expectedRole && user.role !== expectedRole) {
    redirect(getAuthRedirectPath(user.role, "login"));
  }

  return user;
}
