import "server-only";

import { Prisma } from "@prisma/client";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  buildAvatarInitials,
  buildDisplayName,
  getAuthRedirectPath,
  getLoginRedirectPath,
  normalizeUserRole,
  resolveCanonicalUsername,
} from "@/lib/auth/session";
import { resolveNamePartsFromMetadata } from "@/lib/auth/name-parts";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";
import {
  type CurrentUserSkill,
  parseRateValue,
  parseSkillsValue,
  pickTextValue,
} from "@/server/users/current-user-helpers";

export { clearCurrentAppUserCache } from "@/server/users/current-user-helpers";

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
  isTalent: boolean;
  isVerified: boolean;
  lastName: string;
  location: string;
  maxRate: number | null;
  minRate: number | null;
  initials: string;
  role: UserRole;
  skills: CurrentUserSkill[];
  username: string;
};

export async function getCurrentAppUser(): Promise<CurrentAppUser | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id || !user.email) {
    return null;
  }

  const authId = user.id;
  const email = user.email.trim().toLowerCase();

  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const existingUser = await prisma.user.findFirst({
    where: { authId },
  });
  const role = normalizeUserRole(metadata.role);
  const nameParts = resolveNamePartsFromMetadata(metadata);
  const username = resolveCanonicalUsername({
    authEmail: email,
    authUsername: pickTextValue(metadata, ["username"]),
    dbUsername: existingUser?.username,
  });
  const authFirstName =
    pickTextValue(metadata, [
      "firstName",
      "firstname",
      "first_name",
      "given_name",
    ]) || nameParts.firstName;
  const authLastName =
    pickTextValue(metadata, [
      "lastName",
      "lastname",
      "last_name",
      "family_name",
    ]) || nameParts.lastName;
  const authDisplayName = pickTextValue(metadata, [
    "display_name",
    "displayName",
    "full_name",
    "name",
  ]);
  const fallbackDisplayName =
    authDisplayName ||
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
  const authAvatarUrl = pickTextValue(metadata, [
    "avatar_url",
    "avatarUrl",
    "picture",
  ]);
  const initials = buildAvatarInitials(
    authDisplayName ||
      buildDisplayName(
        existingUser?.firstName ?? authFirstName,
        existingUser?.lastName ?? authLastName,
        "",
      ),
    email,
  );
  const headline = pickTextValue(metadata, ["headline"]);
  const bio = pickTextValue(metadata, ["bio"]);
  const location =
    existingUser?.address ||
    pickTextValue(metadata, ["location", "address"]);
  const minRate = parseRateValue(metadata.minRate);
  const maxRate = parseRateValue(metadata.maxRate);
  const skills = parseSkillsValue(metadata.skills);
  const baseUserData = {
    authId,
    avatarUrl: authAvatarUrl || null,
    email,
    firstName: authFirstName || null,
    lastName: authLastName || null,
    initials,
    userId: authId,
    username,
  };

  let dbUser = existingUser;

  if (!dbUser) {
    try {
      dbUser = await prisma.user.create({
        data: baseUserData,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        dbUser = await prisma.user.findFirst({
          where: { authId },
        });
      } else {
        throw error;
      }
    }
  }

  if (!dbUser) {
    return null;
  }

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

  if (!dbUser.initials) {
    updateData.initials = initials;
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

  if (!dbUser) {
    return null;
  }

  const currentUser = {
    authId: dbUser.authId,
    avatarUrl: dbUser.avatarUrl ?? "",
    bio: bio || "",
    createdAt: dbUser.createdAt.toISOString(),
    displayName,
    email: dbUser.email,
    firstName: dbUser.firstName ?? authFirstName,
    headline,
    id: dbUser.userId,
    isTalent: dbUser.is_talent,
    isVerified: dbUser.is_verified,
    lastName: dbUser.lastName ?? authLastName,
    location: dbUser.address ?? location ?? "",
    maxRate,
    minRate,
    initials: dbUser.initials ?? initials,
    role,
    skills,
    username: dbUser.username ?? username,
  };

  return currentUser;
}

export async function requireCurrentAppUser(expectedRole?: UserRole) {
  const user = await getCurrentAppUser();

  if (!user) {
    const headerStore = await headers();
    redirect(getLoginRedirectPath(headerStore.get("x-braket-path")));
  }

  if (expectedRole && user.role !== expectedRole) {
    redirect(getAuthRedirectPath(user.role, "login"));
  }

  return user;
}
