"use server";

import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

type UserType = "client" | "talent";

function getRole(userType: UserType) {
  return userType === "talent" ? "TALENT" : "CLIENT";
}

export async function sendSignupMagicLinkAction(input: {
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
}) {
  const email = input.email.trim().toLowerCase();
  if (!email) return { ok: false as const, message: "Email is required." };

  const cookieStore = await cookies();
  cookieStore.set(
    "braket_signup",
    JSON.stringify({
      email,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      role: getRole(input.userType),
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    },
  );

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "";
  const emailRedirectTo = origin ? `${origin}/auth/callback` : undefined;

  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: emailRedirectTo ? { emailRedirectTo } : undefined,
  });

  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const };
}

