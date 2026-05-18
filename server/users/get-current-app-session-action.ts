"use server";

import type { AppSession } from "@/lib/auth/session";
import { getCurrentAppUser } from "@/server/users/current-user";

export async function getCurrentAppSessionAction(): Promise<AppSession | null> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return null;
  }

  return {
    avatarUrl: currentUser.avatarUrl,
    displayName: currentUser.displayName,
    isTalent: currentUser.isTalent,
    type: currentUser.role,
    username: currentUser.username,
  };
}
