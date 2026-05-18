"use server";

import { revalidatePath } from "next/cache";

import { requireAdminUser } from "@/server/admin/access";
import {
  createManagedUser,
  deleteManagedUser,
  updateManagedUser,
  type AdminCreateUserInput,
} from "@/server/admin/users-review";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function readRole(formData: FormData): "client" | "talent" {
  return readText(formData, "role") === "talent" ? "talent" : "client";
}

function readYearLevel(formData: FormData) {
  const value = Number(readText(formData, "yearLevel"));

  return Number.isInteger(value) ? value : null;
}

function readUserInput(formData: FormData): AdminCreateUserInput {
  return {
    bio: readText(formData, "bio"),
    clientOrganizationName: readText(formData, "clientOrganizationName"),
    college: readText(formData, "college"),
    contactNum: readText(formData, "contactNum"),
    course: readText(formData, "course"),
    email: readText(formData, "email"),
    firstName: readText(formData, "firstName"),
    headline: readText(formData, "headline"),
    isVerified: readText(formData, "isVerified") === "on",
    lastName: readText(formData, "lastName"),
    role: readRole(formData),
    website: readText(formData, "website"),
    yearLevel: readYearLevel(formData),
  };
}

export async function createManagedUserAction(formData: FormData) {
  await requireAdminUser();
  await createManagedUser(readUserInput(formData));

  revalidatePath("/admin");
}

export async function updateManagedUserAction(formData: FormData) {
  await requireAdminUser();
  await updateManagedUser({
    ...readUserInput(formData),
    address: readText(formData, "address"),
    buEmail: readText(formData, "buEmail"),
    userId: readText(formData, "userId"),
    username: readText(formData, "username"),
  });

  revalidatePath("/admin");
}

export async function deleteManagedUserAction(formData: FormData) {
  const admin = await requireAdminUser();

  await deleteManagedUser({
    currentAdminAuthId: admin.authId,
    userId: readText(formData, "userId"),
  });

  revalidatePath("/admin");
}
