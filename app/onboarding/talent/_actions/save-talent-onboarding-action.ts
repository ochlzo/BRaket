"use server";

import { cookies } from "next/headers";

import { buildDisplayName, type AppSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { clearCurrentAppUserCache } from "@/server/users/current-user";
import type { SkillLevel } from "@/lib/types";

type TalentOnboardingSkill = {
  level: SkillLevel;
  name: string;
};

type SaveTalentOnboardingInput = {
  bio: string;
  firstName: string;
  headline: string;
  lastName: string;
  maxRate: string;
  minRate: string;
  skills: TalentOnboardingSkill[];
  username: string;
};

type SaveTalentOnboardingResult =
  | { ok: true; session: AppSession }
  | { message: string; ok: false };

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeText(value: string) {
  return value.trim();
}

function parseRate(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function normalizeSkills(skills: TalentOnboardingSkill[]) {
  return skills
    .map((skill) => ({
      level:
        skill.level === "beginner" ||
        skill.level === "expert" ||
        skill.level === "intermediate"
          ? skill.level
          : "intermediate",
      name: skill.name.trim(),
    }))
    .filter((skill) => skill.name.length > 0)
    .slice(0, 10);
}

export async function saveTalentOnboardingAction(
  input: SaveTalentOnboardingInput,
): Promise<SaveTalentOnboardingResult> {
  const username = normalizeUsername(input.username);
  const firstName = normalizeText(input.firstName);
  const lastName = normalizeText(input.lastName);
  const headline = normalizeText(input.headline);
  const bio = normalizeText(input.bio);
  const minRate = parseRate(input.minRate);
  const maxRate = parseRate(input.maxRate);
  const skills = normalizeSkills(input.skills);

  if (!username) {
    return { message: "Enter a username to continue.", ok: false };
  }

  if (!firstName || !lastName) {
    return { message: "Enter your first and last name.", ok: false };
  }

  if (!headline) {
    return { message: "Add a short headline for your profile.", ok: false };
  }

  if (bio.length < 150 || bio.length > 500) {
    return {
      message: "Your bio must be between 150 and 500 characters.",
      ok: false,
    };
  }

  if (!minRate || !maxRate || minRate > maxRate) {
    return {
      message: "Enter a valid minimum and maximum hourly rate.",
      ok: false,
    };
  }

  if (skills.length === 0) {
    return {
      message: "Add at least one skill before completing onboarding.",
      ok: false,
    };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id || !user.email) {
    return { message: "Please sign in again to continue.", ok: false };
  }

  const displayName = buildDisplayName(firstName, lastName, username);
  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      bio,
      firstName,
      headline,
      lastName,
      maxRate,
      minRate,
      name: displayName,
      role: "talent",
      skills,
      username,
    },
  });

  if (updateError) {
    return {
      message: "We couldn't save your profile yet. Please try again.",
      ok: false,
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: { authId: user.id },
  });

  if (existingUser) {
    await prisma.user.updateMany({
      data: {
        bio,
        email: user.email.trim().toLowerCase(),
        firstName,
        lastName,
        username,
      },
      where: { authId: user.id },
    });
  } else {
    await prisma.user.create({
      data: {
        authId: user.id,
        bio,
        email: user.email.trim().toLowerCase(),
        firstName,
        lastName,
        userId: user.id,
        username,
      },
    });
  }

  clearCurrentAppUserCache(user.id);

  return {
    ok: true,
    session: {
      displayName,
      type: "talent",
      username,
    },
  };
}
