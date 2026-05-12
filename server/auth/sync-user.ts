import { prisma } from "@/lib/prisma";
import {
  buildAvatarInitials,
  buildDisplayName,
  deriveUsername,
} from "@/lib/auth/session";

type PendingSignup = {
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
};

export async function syncAuthUserToUserModel(input: {
  authId: string;
  email: string;
  pending?: PendingSignup;
}) {
  const firstName = input.pending?.firstName?.trim() || undefined;
  const lastName = input.pending?.lastName?.trim() || undefined;
  const displayName =
    input.pending?.displayName?.trim() ||
    buildDisplayName(firstName ?? "", lastName ?? "", "");
  const initials = buildAvatarInitials(displayName, input.email);
  const existingUser = await prisma.user.findFirst({
    where: { authId: input.authId },
  });

  if (existingUser) {
    await prisma.user.updateMany({
      data: {
        email: input.email,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        initials: existingUser.initials ?? initials,
      },
      where: { authId: input.authId },
    });

    return prisma.user.findFirst({
      where: { authId: input.authId },
    });
  }

  return prisma.user.create({
    data: {
      authId: input.authId,
      email: input.email,
      firstName,
      lastName,
      initials,
      username: deriveUsername(input.email),
      userId: input.authId,
    },
  });
}

