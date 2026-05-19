import "server-only";

import { prisma } from "@/lib/prisma";

import {
  buildAccountSettingsFormValues,
  type AccountSettingsFormValues,
} from "@/app/settings/account/_lib/account-settings";

export async function getAccountSettingsPageData(
  userId: string,
): Promise<AccountSettingsFormValues | null> {
  const user = await prisma.user.findUnique({
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
      userId,
    },
  });

  if (!user) {
    return null;
  }

  return buildAccountSettingsFormValues(user);
}
