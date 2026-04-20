import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getGoogleOAuthEntryPath,
  GOOGLE_OAUTH_FAILED_MESSAGE,
  readGoogleOAuthContext,
} from "@/lib/auth/google-oauth";
import { createClient } from "@/lib/supabase/server";

function buildErrorRedirect(requestUrl: URL) {
  const oauthContext = readGoogleOAuthContext(requestUrl.searchParams);
  const redirectUrl = new URL(
    getGoogleOAuthEntryPath(oauthContext.mode),
    requestUrl.origin,
  );

  redirectUrl.searchParams.set("authError", GOOGLE_OAUTH_FAILED_MESSAGE);
  return redirectUrl;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const oauthContext = readGoogleOAuthContext(requestUrl.searchParams);
  const code = requestUrl.searchParams.get("code");

  if (!code || requestUrl.searchParams.has("error")) {
    return NextResponse.redirect(buildErrorRedirect(requestUrl));
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(buildErrorRedirect(requestUrl));
  }

  const redirectUrl = new URL("/auth/complete", requestUrl.origin);
  redirectUrl.searchParams.set("mode", oauthContext.mode);
  redirectUrl.searchParams.set("role", oauthContext.role);

  return NextResponse.redirect(redirectUrl);
}
