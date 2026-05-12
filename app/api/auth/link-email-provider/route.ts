import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { linkOAuthEmailProvider } from "@/server/auth/link-oauth-email-provider";

type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

function readBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return "";
  }

  return authorization.slice("Bearer ".length).trim();
}

async function readSessionTokens(request: Request): Promise<SessionTokens> {
  const body = await request.json().catch(() => ({} as Record<string, string>));
  const accessToken = body.accessToken?.trim() || readBearerToken(request);

  return {
    accessToken,
    refreshToken: body.refreshToken?.trim() || "",
  };
}

function isAdminClientConfigError(error: unknown) {
  return (
    error instanceof Error &&
    error.message === "Supabase admin client is not configured."
  );
}

export async function POST(request: Request) {
  const { accessToken, refreshToken } = await readSessionTokens(request);

  if (!accessToken) {
    return NextResponse.json(
      {
        message: "Sign in again before adding email sign-in.",
        ok: false,
      },
      { status: 401 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        message: "Supabase auth is not configured.",
        ok: false,
      },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user?.id || !user.email) {
    return NextResponse.json(
      {
        message: "Sign in again before adding email sign-in.",
        ok: false,
      },
      { status: 401 },
    );
  }

  try {
    const adminClient = createAdminClient();
    const result = await linkOAuthEmailProvider({
      email: user.email,
      userId: user.id,
      updateUserById: async (userId, attributes) => {
        const { error: updateError } =
          await adminClient.auth.admin.updateUserById(userId, attributes);

        return { error: updateError };
      },
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (routeError) {
    if (!isAdminClientConfigError(routeError)) {
      console.error("Failed to add email sign-in provider.", routeError);
      return NextResponse.json(
        {
          message:
            "We could not finish adding email sign-in yet. Please try again.",
          ok: false,
        },
        { status: 500 },
      );
    }

    if (!refreshToken) {
      return NextResponse.json(
        {
          message:
            "Sign in again before adding email sign-in. Your session is incomplete.",
          ok: false,
        },
        { status: 401 },
      );
    }

    const fallbackClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error: sessionError } = await fallbackClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      console.error(
        "Failed to restore Supabase session for email linking.",
        sessionError,
      );
      return NextResponse.json(
        {
          message:
            "We could not finish adding email sign-in yet. Please try again.",
          ok: false,
        },
        { status: 500 },
      );
    }

    const { error: updateError } = await fallbackClient.auth.updateUser({
      email: user.email,
    });

    if (updateError) {
      console.error("Failed to add email sign-in provider.", updateError);
      return NextResponse.json(
        {
          message:
            updateError.message ??
            "We could not finish adding email sign-in yet. Please try again.",
          ok: false,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  }
}
