import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

type PendingSignup = {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
};

export async function syncAuthUserToUserModel(input: {
  authId: string;
  email: string;
  pending?: PendingSignup;
}) {
  const firstName = input.pending?.firstName?.trim() || undefined;
  const lastName = input.pending?.lastName?.trim() || undefined;
  const role = input.pending?.role;

  return prisma.user.upsert({
    where: { authId: input.authId },
    create: {
      authId: input.authId,
      email: input.email,
      firstname: firstName,
      lastname: lastName,
      role,
    },
    update: {
      email: input.email,
      firstname: firstName ?? undefined,
      lastname: lastName ?? undefined,
      role: role ?? undefined,
    },
  });
}

