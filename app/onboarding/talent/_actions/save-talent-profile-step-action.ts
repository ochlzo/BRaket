"use server";

import { revalidatePath } from "next/cache";
import type { ProficiencyLevel } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  parseTalentProfileStepFormData,
  type TalentProfileSkillInput,
  type TalentProfileStepState,
  validateTalentProfileStepInput,
} from "@/app/onboarding/talent/_lib/talent-profile-step";
import {
  clearCurrentAppUserCache,
  getCurrentAppUser,
} from "@/server/users/current-user";

const EMPTY_STATE: TalentProfileStepState = {
  message: "",
  ok: false,
};

function getUniqueSkills(skills: TalentProfileSkillInput[]) {
  const skillByName = new Map<string, TalentProfileSkillInput>();

  for (const skill of skills) {
    const key = skill.name.trim().toLowerCase();

    if (!key || skillByName.has(key)) {
      continue;
    }

    skillByName.set(key, {
      level: skill.level,
      name: skill.name.trim(),
    });
  }

  return [...skillByName.values()];
}

export async function saveTalentProfileStepAction(
  formData: FormData,
): Promise<TalentProfileStepState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return {
      ...EMPTY_STATE,
      message: "Your session expired. Please sign in again.",
    };
  }

  const input = parseTalentProfileStepFormData(formData);
  const validation = validateTalentProfileStepInput(input);

  if (!validation.ok) {
    return validation;
  }

  const dbUser = await prisma.user.findUnique({
    where: { userId: currentUser.id },
  });

  if (!dbUser) {
    return {
      ...EMPTY_STATE,
      message: "We could not find your account record.",
    };
  }

  const skills = getUniqueSkills(input.skills);

  try {
    await prisma.$transaction(async (tx) => {
      const existingProfile = await tx.talentProfile.findUnique({
        select: {
          profile_completion: true,
          talent_profile_id: true,
        },
        where: { user_id: dbUser.userId },
      });
      const now = new Date();
      const talentProfileId =
        existingProfile?.talent_profile_id ?? crypto.randomUUID();
      const profileCompletion = Math.max(
        existingProfile?.profile_completion ?? 0,
        1,
      );

      const talentProfile = await tx.talentProfile.upsert({
        create: {
          bio: input.bio,
          college: input.college,
          course: input.course,
          headline: input.headline,
          profile_completion: 1,
          talent_profile_id: talentProfileId,
          updatedAt: now,
          user_id: dbUser.userId,
          website: input.website || null,
          year_level: Number(input.yearLevel),
        },
        update: {
          bio: input.bio,
          college: input.college,
          course: input.course,
          headline: input.headline,
          profile_completion: profileCompletion,
          updatedAt: now,
          website: input.website || null,
          year_level: Number(input.yearLevel),
        },
        where: { user_id: dbUser.userId },
      });

      const skillRows = await Promise.all(
        skills.map((skill) =>
          tx.skill.upsert({
            create: { name: skill.name },
            update: {},
            where: { name: skill.name },
          }),
        ),
      );
      const skillByName = new Map(
        skillRows.map((skill) => [skill.name.toLowerCase(), skill]),
      );

      await tx.talentSkill.deleteMany({
        where: { talentProfileId: talentProfile.talent_profile_id },
      });
      await tx.talentSkill.createMany({
        data: skills.flatMap((skill) => {
          const dbSkill = skillByName.get(skill.name.toLowerCase());

          if (!dbSkill) {
            return [];
          }

          return {
            proficiencyLevel: skill.level as ProficiencyLevel,
            skillId: dbSkill.skillId,
            talentProfileId: talentProfile.talent_profile_id,
          };
        }),
      });
    });
  } catch {
    return {
      ...EMPTY_STATE,
      message: "We could not save your talent profile right now.",
    };
  }

  clearCurrentAppUserCache(currentUser.authId);
  revalidatePath("/onboarding/talent");
  revalidatePath("/dashboard/talent/profile");

  return {
    message: "Talent profile saved.",
    ok: true,
    successToken: crypto.randomUUID(),
  };
}
