import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { syncAuthUserToUserModel } from "@/server/auth/sync-user";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const pendingCookie = request.cookies.get("braket_signup")?.value;
  const pending =
    pendingCookie && pendingCookie.length < 5000
      ? (safeJsonParse(pendingCookie) as
          | {
              firstName?: string;
              lastName?: string;
              role?: "CLIENT" | "TALENT";
            }
          | undefined)
      : undefined;

  const dashboardPath =
    pending?.role === "TALENT" ? "/dashboard/talent" : "/dashboard/client";

  const response = NextResponse.redirect(new URL(dashboardPath, request.url));

  if (!code) return response;

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return response;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id || !user.email) return response;

  await syncAuthUserToUserModel({
    authId: user.id,
    email: user.email,
    pending: {
      firstName: pending?.firstName,
      lastName: pending?.lastName,
      role: pending?.role,
    },
  });

  response.cookies.set("braket_signup", "", { path: "/", maxAge: 0 });
  return response;
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}
