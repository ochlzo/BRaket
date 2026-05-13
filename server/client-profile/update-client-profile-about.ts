"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { UpdateClientProfileAboutState } from "@/lib/client-profile/types";
import { getCurrentAppUser } from "@/server/users/current-user";

const EMPTY_STATE: UpdateClientProfileAboutState = {
  message: "",
  ok: false,
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function updateClientProfileAboutAction(
  _prevState: UpdateClientProfileAboutState,
  formData: FormData,
): Promise<UpdateClientProfileAboutState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser || currentUser.role !== "client") {
    return {
      ...EMPTY_STATE,
      message: "Your session expired. Please sign in again.",
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: { userId: currentUser.id },
  });

  if (!dbUser) {
    return {
      ...EMPTY_STATE,
      message: "We could not find your profile record.",
    };
  }

  const about = readText(formData, "about");

  try {
    const result = await prisma.clientProfile.updateMany({
      data: {
        about: about || null,
        updatedAt: new Date(),
      },
      where: { user_id: dbUser.userId },
    });

    if (result.count === 0) {
      return {
        ...EMPTY_STATE,
        message: "We could not find your client profile record.",
      };
    }
  } catch {
    return {
      ...EMPTY_STATE,
      message: "We could not save your bio right now.",
    };
  }

  revalidatePath("/dashboard/client/profile");

  return {
    message: "Bio updated.",
    ok: true,
  };
}
