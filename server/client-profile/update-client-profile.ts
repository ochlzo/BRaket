"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type {
  ClientProfileEditorValues,
  UpdateClientProfileState,
} from "@/lib/client-profile/types";
import { clearCurrentAppUserCache, getCurrentAppUser } from "@/server/users/current-user";

const EMPTY_STATE: UpdateClientProfileState = {
  message: "",
  ok: false,
};

function readText(formData: FormData, key: keyof ClientProfileEditorValues) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizePhoneNumber(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits || null;
}

function normalizeHref(value: string) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value.replace(/^\/\//, "")}`;
}

export async function updateClientProfileAction(
  _prevState: UpdateClientProfileState,
  formData: FormData,
): Promise<UpdateClientProfileState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser || currentUser.role !== "client") {
    return {
      ...EMPTY_STATE,
      message: "Your session expired. Please sign in again.",
    };
  }

  const organizationName = readText(formData, "organizationName");

  if (!organizationName) {
    return {
      fieldErrors: {
        organizationName: "Organization name is required.",
      },
      message: "Please fix the highlighted fields.",
      ok: false,
    };
  }

  const user = await prisma.user.findUnique({
    where: { userId: currentUser.id },
  });

  if (!user) {
    return {
      ...EMPTY_STATE,
      message: "We could not find your client account record.",
    };
  }

  const avatarUrl = readText(formData, "avatarUrl");
  const backgroundImageUrl = readText(formData, "backgroundImageUrl");
  const firstName = readText(formData, "firstName");
  const lastName = readText(formData, "lastName");
  const username = readText(formData, "username");
  const contactNum = normalizePhoneNumber(readText(formData, "contactNum"));
  const businessAddress = readText(formData, "businessAddress");
  const website = normalizeHref(readText(formData, "website"));
  const about = readText(formData, "about");
  const facebookUrl = readText(formData, "facebookUrl");
  const instagramUrl = readText(formData, "instagramUrl");
  const xUrl = readText(formData, "xUrl");
  const githubUrl = readText(formData, "githubUrl");
  const linkedinUrl = readText(formData, "linkedinUrl");

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        data: {
          address: businessAddress || null,
          avatarUrl: avatarUrl || null,
          background_img_url: backgroundImageUrl || null,
          contactNum,
          facebook_url: facebookUrl || null,
          firstName: firstName || null,
          github_url: githubUrl || null,
          instagram_url: instagramUrl || null,
          lastName: lastName || null,
          linkedin_url: linkedinUrl || null,
          updatedAt: new Date(),
          username: username || null,
          x_url: xUrl || null,
        },
        where: { userId: user.userId },
      });

      await tx.clientProfile.upsert({
        create: {
          about: about || null,
          business_address: businessAddress || null,
          client_profile_id: crypto.randomUUID(),
          client_avg_rating: null,
          client_reputation_score: null,
          client_review_count: null,
          completed_commissions_count: null,
          organization_name: organizationName,
          updatedAt: new Date(),
          user_id: user.userId,
          website: website || null,
        },
        update: {
          about: about || null,
          business_address: businessAddress || null,
          organization_name: organizationName,
          updatedAt: new Date(),
          website: website || null,
        },
        where: {
          user_id: user.userId,
        },
      });
    });
  } catch {
    return {
      ...EMPTY_STATE,
      message: "We could not save your client profile right now.",
    };
  }

  clearCurrentAppUserCache(currentUser.authId);
  revalidatePath("/dashboard/client/profile");

  return {
    message: "Client profile updated.",
    ok: true,
  };
}
