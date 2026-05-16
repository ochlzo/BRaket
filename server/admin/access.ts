import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, parseAdminEmails } from "@/server/admin/access-rules";

export type AdminUser = {
  authId: string;
  email: string;
};

export function getAdminEmailAllowlist() {
  return parseAdminEmails(process.env.BRAKET_ADMIN_EMAILS);
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id || !user.email) {
    return null;
  }

  const email = user.email.trim().toLowerCase();

  if (!isAdminEmail(email, getAdminEmailAllowlist())) {
    return null;
  }

  return { authId: user.id, email };
}

export async function isUserAdminSession() {
  return Boolean(await getAdminUser());
}

export async function requireAdminUser() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id || !user.email) {
    redirect("/admin/login");
  }

  const email = user.email.trim().toLowerCase();

  if (!isAdminEmail(email, getAdminEmailAllowlist())) {
    redirect("/admin/login?error=not-admin");
  }

  return { authId: user.id, email };
}
