"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  buildAccountSettingsFormValues,
  normalizeContactNumber,
  parseAccountSettingsFormData,
  validateAccountSettingsInput,
  type UpdateAccountSettingsState,
} from "@/app/settings/account/_lib/account-settings";
import {
  clearCurrentAppUserCache,
  getCurrentAppUser,
} from "@/server/users/current-user";

const EMPTY_STATE: UpdateAccountSettingsState = {
  message: "",
  ok: false,
};

function buildUniqueConstraintErrorState(
  target: unknown,
) {
  const fieldErrors: Partial<Record<"contactNum" | "username", string>> = {};

  if (Array.isArray(target) && target.includes("username")) {
    fieldErrors.username = "Username is already taken.";
  }

  if (Array.isArray(target) && target.includes("contactNum")) {
    fieldErrors.contactNum = "Contact number is already in use.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please fix the highlighted fields.",
      ok: false,
    } satisfies UpdateAccountSettingsState;
  }

  return {
    ...EMPTY_STATE,
    message: "We could not save your account settings right now.",
  };
}

export async function updateAccountSettingsAction(
  formData: FormData,
): Promise<UpdateAccountSettingsState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return {
      ...EMPTY_STATE,
      message: "Please sign in again to continue.",
    };
  }

  const input = parseAccountSettingsFormData(formData);
  const validation = validateAccountSettingsInput(input);

  if (!validation.ok) {
    return validation;
  }

  const usernameConflict = await prisma.user.findFirst({
    select: {
      userId: true,
    },
    where: {
      NOT: {
        userId: currentUser.id,
      },
      username: input.username,
    },
  });

  if (usernameConflict) {
    return validateAccountSettingsInput(input, {
      usernameTaken: true,
    });
  }

  const contactNum = normalizeContactNumber(input.contactNum);
  const contactNumConflict = await prisma.user.findFirst({
    select: {
      userId: true,
    },
    where: {
      NOT: {
        userId: currentUser.id,
      },
      contactNum,
    },
  });

  if (contactNumConflict) {
    return validateAccountSettingsInput(input, {
      contactNumTaken: true,
    });
  }

  try {
    await prisma.user.update({
      data: {
        address: input.address || null,
        contactNum,
        facebook_url: input.facebookUrl || null,
        firstName: input.firstName || null,
        github_url: input.githubUrl || null,
        instagram_url: input.instagramUrl || null,
        lastName: input.lastName || null,
        linkedin_url: input.linkedinUrl || null,
        updatedAt: new Date(),
        username: input.username || null,
        x_url: input.xUrl || null,
      },
      where: {
        userId: currentUser.id,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return buildUniqueConstraintErrorState(error.meta?.target);
    }

    return {
      ...EMPTY_STATE,
      message: "We could not save your account settings right now.",
    };
  }

  const savedUser = await prisma.user.findUnique({
    select: {
      address: true,
      contactNum: true,
      email: true,
      TalentProfile: {
        select: {
          bu_email: true,
        },
      },
      facebook_url: true,
      firstName: true,
      github_url: true,
      instagram_url: true,
      lastName: true,
      linkedin_url: true,
      username: true,
      x_url: true,
    },
    where: {
      userId: currentUser.id,
    },
  });

  if (!savedUser) {
    return {
      ...EMPTY_STATE,
      message: "We could not refresh your saved account settings.",
    };
  }

  clearCurrentAppUserCache(currentUser.authId);
  revalidatePath("/settings/account");
  revalidatePath("/dashboard/client/profile");
  revalidatePath("/dashboard/talent/profile");

  return {
    message: "Account settings updated.",
    ok: true,
    values: buildAccountSettingsFormValues(savedUser),
  };
}
