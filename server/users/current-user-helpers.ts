import type { SkillLevel } from "@/lib/types";

export type CurrentUserSkill = {
  level: SkillLevel;
  name: string;
};

export function pickTextValue(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
}

export function parseRateValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return null;
}

export function parseSkillsValue(value: unknown): CurrentUserSkill[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const maybeSkill = entry as Record<string, unknown>;
    const name =
      typeof maybeSkill.name === "string" ? maybeSkill.name.trim() : "";

    if (!name) {
      return [];
    }

    const normalizedLevel = normalizeSkillLevel(maybeSkill.level);

    return [{ level: normalizedLevel, name }];
  });
}

function normalizeSkillLevel(value: unknown): SkillLevel {
  if (typeof value !== "string") {
    return "INTERMEDIATE";
  }

  switch (value.trim().toUpperCase()) {
    case "BEGINNER":
      return "BEGINNER";
    case "INTERMEDIATE":
      return "INTERMEDIATE";
    case "ADVANCED":
      return "ADVANCED";
    case "EXPERT":
      return "EXPERT";
    default:
      return "INTERMEDIATE";
  }
}

export function clearCurrentAppUserCache(authId: string) {
  void authId;
  // Kept for existing mutation flows; getCurrentAppUser now reads fresh DB state.
}
