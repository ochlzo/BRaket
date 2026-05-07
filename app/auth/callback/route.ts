import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getGoogleOAuthEntryPath,
  getGoogleOAuthCallbackRedirectPath,
  GOOGLE_OAUTH_FAILED_MESSAGE,
  readGoogleOAuthContext,
} from "@/lib/auth/google-oauth";
import { createClient } from "@/lib/supabase/server";
import { authUserHasEmailProvider } from "@/server/auth/auth-user-has-email-provider";

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

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    return NextResponse.redirect(buildErrorRedirect(requestUrl));
  }

  try {
    const hasEmailProvider = await authUserHasEmailProvider(user.id);
    const redirectUrl = new URL(
      getGoogleOAuthCallbackRedirectPath(
        !hasEmailProvider,
        oauthContext.mode,
        oauthContext.role,
      ),
      requestUrl.origin,
    );

    return NextResponse.redirect(redirectUrl);
  } catch (providerError) {
    console.error(
      "Failed to verify Google auth email provider state.",
      providerError,
    );
  }

  return NextResponse.redirect(buildErrorRedirect(requestUrl));
}
