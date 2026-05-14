import {
  APP_SESSION_CHANGE_EVENT,
  APP_SESSION_KEY,
  type AppSession,
  normalizeUserRole,
} from "@/lib/auth/session";

export type ClientAppSession = AppSession & {
  verified?: boolean;
};

let cachedSessionRaw: string | null = null;
let cachedSession: ClientAppSession | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseStoredSession(data: string | null): ClientAppSession | null {
  if (!data) {
    return null;
  }

  try {
    const parsed = JSON.parse(data) as unknown;

    if (!isRecord(parsed)) {
      return null;
    }

    const username =
      typeof parsed.username === "string" && parsed.username.trim().length > 0
        ? parsed.username.trim()
        : "";

    if (!username) {
      return null;
    }

    const displayName =
      typeof parsed.displayName === "string" &&
      parsed.displayName.trim().length > 0
        ? parsed.displayName.trim()
        : username;
    const avatarUrl =
      typeof parsed.avatarUrl === "string" && parsed.avatarUrl.trim().length > 0
        ? parsed.avatarUrl.trim()
        : "";

    return {
      avatarUrl,
      displayName,
      type: normalizeUserRole(parsed.type),
      username,
      verified: parsed.verified === true,
    };
  } catch {
    return null;
  }
}

export function subscribeToAppSession(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(APP_SESSION_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(APP_SESSION_CHANGE_EVENT, onStoreChange);
  };
}

export function getClientAppSessionSnapshot() {
  const data = localStorage.getItem(APP_SESSION_KEY);

  if (data === cachedSessionRaw) {
    return cachedSession;
  }

  cachedSessionRaw = data;
  cachedSession = parseStoredSession(data);
  return cachedSession;
}
