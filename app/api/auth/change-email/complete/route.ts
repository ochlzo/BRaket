import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { clearCurrentAppUserCache } from "@/server/users/current-user";

function readBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return "";
  }

  return authorization.slice("Bearer ".length).trim();
}

function readTextMetadataValue(metadata: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = metadata[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
}

async function readAccessToken(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    accessToken?: string;
  };

  return body.accessToken?.trim() || readBearerToken(request);
}

export async function POST(request: Request) {
  try {
    const accessToken = await readAccessToken(request);

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "Sign in again before changing your email.",
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
          message: "Sign in again before changing your email.",
          ok: false,
        },
        { status: 401 },
      );
    }

    const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    const currentAppUserId = readTextMetadataValue(metadata, [
      "change_email_user_id",
      "userId",
    ]);
    const currentAuthId = readTextMetadataValue(metadata, [
      "change_email_auth_id",
      "authId",
    ]);

    if (!currentAppUserId || !currentAuthId) {
      return NextResponse.json(
        {
          message: "We could not confirm the email change request.",
          ok: false,
        },
        { status: 400 },
      );
    }

    const normalizedEmail = user.email.trim().toLowerCase();
    const adminClient = createAdminClient();

    const updateResult = await prisma.user.updateMany({
      data: {
        authId: user.id,
        email: normalizedEmail,
      },
      where: {
        authId: currentAuthId,
        userId: currentAppUserId,
      },
    });

    if (updateResult.count === 0) {
      return NextResponse.json(
        {
          message: "We could not locate the current account record.",
          ok: false,
        },
        { status: 404 },
      );
    }

    clearCurrentAppUserCache(currentAuthId);

    try {
      const { error: deleteError } = await adminClient.auth.admin.deleteUser(
        currentAuthId,
      );

      if (deleteError) {
        console.error("Failed to delete the old auth user.", deleteError);
      }
    } catch (adminError) {
      if (
        adminError instanceof Error &&
        adminError.message === "Supabase admin client is not configured."
      ) {
        return NextResponse.json(
          {
            message: "Supabase admin access is not configured.",
            ok: false,
          },
          { status: 500 },
        );
      }

      throw adminError;
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (routeError) {
    if (
      routeError instanceof Prisma.PrismaClientKnownRequestError &&
      routeError.code === "P2002"
    ) {
      return NextResponse.json(
        {
          message: "This email is already in use.",
          ok: false,
        },
        { status: 409 },
      );
    }

    console.error("Failed to complete the email change.", routeError);
    return NextResponse.json(
      {
        message: "We could not finish updating your email yet. Please try again.",
        ok: false,
      },
      { status: 500 },
    );
  }
}
