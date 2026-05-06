import type { UserRole } from "@/lib/types";

export const APP_SESSION_KEY = "braket_session";

export type AuthMode = "login" | "signup";

export type AppSession = {
  displayName: string;
  type: UserRole;
  username: string;
};

export function deriveUsername(email: string) {
  const localPart = email.split("@")[0] ?? "";
  const slug = localPart.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return slug.replace(/^-+|-+$/g, "") || "user";
}

export function normalizeUserRole(
  value: unknown,
  fallback: UserRole = "client",
) {
  return value === "talent" || value === "client" ? value : fallback;
}

function readTextMetadataValue(
  metadata: Record<string, unknown>,
  keys: string[],
) {
  for (const key of keys) {
    const value = metadata[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
}

export function buildDisplayName(
  firstName: string,
  lastName: string,
  fallback: string,
) {
  const parts = [firstName.trim(), lastName.trim()].filter(Boolean);
  return parts.join(" ") || fallback.trim();
}

type ResolveAppSessionInput = {
  email: string;
  fallbackRole?: UserRole;
  mode: AuthMode;
  userMetadata?: Record<string, unknown> | null;
};

export function resolveAppSession({
  email,
  fallbackRole,
  mode,
  userMetadata,
}: ResolveAppSessionInput): AppSession {
  const metadata = userMetadata ?? {};
  const resolvedRole = normalizeUserRole(
    metadata.role ?? (mode === "signup" ? fallbackRole : undefined),
    mode === "signup" ? fallbackRole ?? "client" : "client",
  );
  const username =
    typeof metadata.username === "string" && metadata.username.trim()
      ? metadata.username.trim()
      : deriveUsername(email);
  const firstName = readTextMetadataValue(metadata, [
    "firstName",
    "firstname",
    "first_name",
    "given_name",
  ]);
  const lastName = readTextMetadataValue(metadata, [
    "lastName",
    "lastname",
    "last_name",
    "family_name",
  ]);
  const fallbackDisplayName =
    readTextMetadataValue(metadata, ["full_name", "name"]) || username;
  const displayName = buildDisplayName(
    firstName,
    lastName,
    fallbackDisplayName,
  );

  return { displayName, type: resolvedRole, username };
}

export function getAuthRedirectPath(role: UserRole, mode: AuthMode) {
  if (mode === "signup") {
    return role === "talent" ? "/onboarding/talent" : "/dashboard/client";
  }

  return role === "talent" ? "/dashboard/talent" : "/dashboard/client";
}

export function saveAppSession(session: AppSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(APP_SESSION_KEY, JSON.stringify(session));
}

export function clearAppSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(APP_SESSION_KEY);
}
