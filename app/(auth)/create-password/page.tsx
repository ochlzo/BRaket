import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OAuthCreatePasswordForm } from "@/components/shared/auth/oauth-create-password-form";
import {
  buildGoogleOAuthFlowPath,
  getGoogleOAuthEntryPath,
  GOOGLE_OAUTH_FAILED_MESSAGE,
  readGoogleOAuthContext,
} from "@/lib/auth/google-oauth";
import { createClient } from "@/lib/supabase/server";
import { authUserHasEmailProvider } from "@/server/auth/auth-user-has-email-provider";

export const metadata: Metadata = {
  title: "Create Password - BRaket",
  description:
    "Create a password to finish adding email sign-in to your BRaket account after Google authentication.",
};

type CreatePasswordPageProps = {
  searchParams: Promise<{
    mode?: string;
    role?: string;
  }>;
};

function buildAuthErrorRedirect(mode: "login" | "signup") {
  const searchParams = new URLSearchParams({
    authError: GOOGLE_OAUTH_FAILED_MESSAGE,
  });

  return `${getGoogleOAuthEntryPath(mode)}?${searchParams.toString()}`;
}

export default async function CreatePasswordPage({
  searchParams,
}: CreatePasswordPageProps) {
  const { mode, role } = await searchParams;
  const oauthContext = readGoogleOAuthContext(
    new URLSearchParams({
      mode: mode ?? "",
      role: role ?? "",
    }),
  );

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    redirect(buildAuthErrorRedirect(oauthContext.mode));
  }

  try {
    if (await authUserHasEmailProvider(user.id)) {
      redirect(
        buildGoogleOAuthFlowPath(
          "/auth/complete",
          oauthContext.mode,
          oauthContext.role,
        ),
      );
    }
  } catch (providerError) {
    console.error(
      "Failed to verify create-password Google auth provider state.",
      providerError,
    );
    redirect(buildAuthErrorRedirect(oauthContext.mode));
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
          Create a password
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Add email and password sign-in before we finish your Google auth
          flow.
        </p>
      </div>

      <OAuthCreatePasswordForm
        mode={oauthContext.mode}
        role={oauthContext.role}
      />
    </div>
  );
}
