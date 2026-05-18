import type { UserRole } from "@/lib/types";

export function getSettingsSourceFromPathname(
  pathname: string,
  fallback: UserRole,
): UserRole {
  if (pathname.startsWith("/dashboard/talent")) {
    return "talent";
  }

  if (pathname.startsWith("/dashboard/client")) {
    return "client";
  }

  return fallback;
}

export function parseSettingsSource(
  source: string | string[] | undefined,
  fallback: UserRole,
): UserRole {
  const value = Array.isArray(source) ? source[0] : source;

  return value === "talent" || value === "client" ? value : fallback;
}

export function getSettingsHref(source: UserRole, path = "/settings") {
  return `${path}?source=${source}`;
}
