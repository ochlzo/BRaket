import "server-only";

import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";
import {
  buildAvatarInitials,
  buildDisplayName,
  deriveUsername,
} from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminCreateUserInput = {
  bio: string;
  clientOrganizationName: string;
  college: string;
  contactNum: string;
  course: string;
  email: string;
  firstName: string;
  headline: string;
  isVerified: boolean;
  lastName: string;
  role: "client" | "talent";
  website: string;
  yearLevel: number | null;
};

export type AdminUpdateUserInput = AdminCreateUserInput & {
  address: string;
  buEmail: string;
  userId: string;
  username: string;
};

function normalizeEmail(value: string) {
  const email = value.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  return email;
}

function cleanOptional(value: string) {
  const trimmed = value.trim();

  return trimmed || null;
}

function cleanRequired(value: string, label: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }

  return trimmed;
}

function readInitials(firstName: string, lastName: string, email: string) {
  return buildAvatarInitials(buildDisplayName(firstName, lastName, ""), email);
}

async function buildUniqueUsername(email: string, currentUserId?: string) {
  const base = deriveUsername(email);

  for (let index = 0; index < 20; index += 1) {
    const username = index === 0 ? base : `${base}-${index + 1}`;
    const existing = await prisma.user.findFirst({
      select: { userId: true },
      where: { username },
    });

    if (!existing || existing.userId === currentUserId) {
      return username;
    }
  }

  return `${base}-${crypto.randomBytes(3).toString("hex")}`;
}

async function assertUniqueEmail(email: string, currentUserId?: string) {
  const existing = await prisma.user.findUnique({
    select: { userId: true },
    where: { email },
  });

  if (existing && existing.userId !== currentUserId) {
    throw new Error("That email is already used by another Braket account.");
  }
}

function validateTalentInput(input: AdminCreateUserInput) {
  if (input.role !== "talent") return;

  cleanRequired(input.headline, "Headline");
  cleanRequired(input.college, "College");
  cleanRequired(input.course, "Course");
  cleanRequired(input.bio, "Bio");

  if (!input.yearLevel || input.yearLevel < 1 || input.yearLevel > 6) {
    throw new Error("Year level must be between 1 and 6.");
  }
}

export async function createManagedUser(input: AdminCreateUserInput) {
  const email = normalizeEmail(input.email);
  const firstName = cleanRequired(input.firstName, "First name");
  const lastName = cleanRequired(input.lastName, "Last name");
  const password = crypto.randomBytes(24).toString("base64url");
  const supabase = createAdminClient();
  const username = await buildUniqueUsername(email);

  await assertUniqueEmail(email);
  validateTalentInput(input);

  if (input.role === "client") {
    cleanRequired(input.clientOrganizationName, "Organization name");
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    password,
    user_metadata: { firstName, lastName, role: input.role, username },
  });

  if (error || !data.user?.id) {
    throw new Error(error?.message ?? "Unable to create auth user.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          authId: data.user.id,
          contactNum: cleanOptional(input.contactNum),
          email,
          firstName,
          initials: readInitials(firstName, lastName, email),
          is_talent: input.role === "talent",
          is_verified: input.role === "talent" ? input.isVerified : false,
          lastName,
          userId: data.user.id,
          username,
        },
      });

      if (input.role === "client") {
        await tx.clientProfile.create({
          data: {
            client_profile_id: crypto.randomUUID(),
            completed_commissions_count: 0,
            organization_name: cleanRequired(
              input.clientOrganizationName,
              "Organization name",
            ),
            updatedAt: new Date(),
            user_id: data.user.id,
            website: cleanOptional(input.website),
          },
        });
      } else {
        await tx.talentProfile.create({
          data: {
            bio: cleanRequired(input.bio, "Bio"),
            college: cleanRequired(input.college, "College"),
            completed_commissions_count: 0,
            course: cleanRequired(input.course, "Course"),
            headline: cleanRequired(input.headline, "Headline"),
            talent_profile_id: crypto.randomUUID(),
            updatedAt: new Date(),
            user_id: data.user.id,
            website: cleanOptional(input.website),
            year_level: input.yearLevel ?? 1,
          },
        });
      }
    });
  } catch (error) {
    await supabase.auth.admin.deleteUser(data.user.id);
    throw error;
  }
}

export async function updateManagedUser(input: AdminUpdateUserInput) {
  const email = normalizeEmail(input.email);
  const firstName = cleanRequired(input.firstName, "First name");
  const lastName = cleanRequired(input.lastName, "Last name");
  const username =
    cleanOptional(input.username) ?? (await buildUniqueUsername(email, input.userId));
  const existing = await prisma.user.findUnique({
    select: { authId: true, is_talent: true, userId: true },
    where: { userId: input.userId },
  });

  if (!existing || existing.is_talent !== (input.role === "talent")) {
    throw new Error("User was not found in this account queue.");
  }

  validateTalentInput(input);
  await assertUniqueEmail(email, existing.userId);

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(existing.authId, {
    email,
    user_metadata: {
      firstName,
      lastName,
      role: input.role,
      username,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      data: {
        address: cleanOptional(input.address),
        contactNum: cleanOptional(input.contactNum),
        email,
        firstName,
        initials: readInitials(firstName, lastName, email),
        is_verified: input.role === "talent" ? input.isVerified : false,
        lastName,
        username,
      },
      where: { userId: existing.userId },
    });

    if (input.role === "client") {
      await tx.clientProfile.upsert({
        create: {
          client_profile_id: crypto.randomUUID(),
          organization_name: cleanRequired(
            input.clientOrganizationName,
            "Organization name",
          ),
          updatedAt: new Date(),
          user_id: existing.userId,
          website: cleanOptional(input.website),
        },
        update: {
          organization_name: cleanRequired(
            input.clientOrganizationName,
            "Organization name",
          ),
          updatedAt: new Date(),
          website: cleanOptional(input.website),
        },
        where: { user_id: existing.userId },
      });
    } else {
      await tx.talentProfile.upsert({
        create: {
          bio: cleanRequired(input.bio, "Bio"),
          bu_email: cleanOptional(input.buEmail),
          college: cleanRequired(input.college, "College"),
          course: cleanRequired(input.course, "Course"),
          headline: cleanRequired(input.headline, "Headline"),
          talent_profile_id: crypto.randomUUID(),
          updatedAt: new Date(),
          user_id: existing.userId,
          website: cleanOptional(input.website),
          year_level: input.yearLevel ?? 1,
        },
        update: {
          bio: cleanRequired(input.bio, "Bio"),
          bu_email: cleanOptional(input.buEmail),
          college: cleanRequired(input.college, "College"),
          course: cleanRequired(input.course, "Course"),
          headline: cleanRequired(input.headline, "Headline"),
          updatedAt: new Date(),
          website: cleanOptional(input.website),
          year_level: input.yearLevel ?? 1,
        },
        where: { user_id: existing.userId },
      });
    }
  });
}

export async function deleteManagedUser(input: {
  currentAdminAuthId: string;
  userId: string;
}) {
  const user = await prisma.user.findUnique({
    select: { authId: true, userId: true },
    where: { userId: input.userId },
  });

  if (!user) {
    throw new Error("User was not found.");
  }

  if (user.authId === input.currentAdminAuthId) {
    throw new Error("You cannot delete your own admin session user.");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(user.authId);

  if (error) {
    throw new Error(error.message);
  }

  await prisma.user.delete({ where: { userId: user.userId } });
}
