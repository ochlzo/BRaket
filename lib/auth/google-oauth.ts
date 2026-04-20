export type GoogleOAuthMode = "login" | "signup";
export type GoogleOAuthRole = "client" | "talent";

export const GOOGLE_OAUTH_FAILED_MESSAGE =
  "Google sign-in could not be completed. Please try again.";

function normalizeMode(value: string | null): GoogleOAuthMode {
  return value === "signup" ? "signup" : "login";
}

function normalizeRole(value: unknown): GoogleOAuthRole {
  return value === "talent" ? "talent" : "client";
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function deriveUsername(email: string) {
  const localPart = email.split("@")[0] ?? "";
  const slug = localPart.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return slug.replace(/^-+|-+$/g, "") || "user";
}

export function getGoogleOAuthEntryPath(mode: GoogleOAuthMode) {
  return mode === "signup" ? "/signup" : "/login";
}

export function readGoogleOAuthContext(searchParams: URLSearchParams) {
  return {
    mode: normalizeMode(searchParams.get("mode")),
    role: normalizeRole(searchParams.get("role")),
  };
}

export function buildGoogleOAuthRedirectTo(
  origin: string,
  mode: GoogleOAuthMode,
  role: GoogleOAuthRole = "client",
) {
  const url = new URL("/auth/callback", origin);
  url.searchParams.set("mode", mode);

  if (mode === "signup") {
    url.searchParams.set("role", role);
  }

  return url.toString();
}

export function resolveGoogleOAuthMode(
  mode: GoogleOAuthMode,
  userMetadata?: Record<string, unknown> | null,
) {
  return mode === "signup" && hasText(userMetadata?.role) ? "login" : mode;
}

export function buildGoogleOAuthMetadataPatch(
  email: string,
  role: GoogleOAuthRole,
  userMetadata?: Record<string, unknown> | null,
) {
  const patch: Record<string, string> = {};

  if (!hasText(userMetadata?.role)) {
    patch.role = normalizeRole(role);
  }

  if (!hasText(userMetadata?.username)) {
    patch.username = deriveUsername(email);
  }

  return Object.keys(patch).length > 0 ? patch : null;
}
