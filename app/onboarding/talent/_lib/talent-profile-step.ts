export type TalentProfileSkillInput = {
  level: ProficiencyLevelInput;
  name: string;
};

export type TalentProfileStepInput = {
  bio: string;
  college: string;
  course: string;
  headline: string;
  skills: TalentProfileSkillInput[];
  website: string;
  yearLevel: string;
};

export type TalentProfileStepState = {
  fieldErrors?: Record<string, string>;
  message: string;
  ok: boolean;
  successToken?: string;
};

export type TalentProfileStepInitialValues = TalentProfileStepInput;

export type ProficiencyLevelInput =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "EXPERT";

const PROFICIENCY_LEVELS = new Set<string>([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);
const YEAR_LEVELS = new Set(["1", "2", "3", "4"]);

const EMPTY_INITIAL_VALUES: TalentProfileStepInitialValues = {
  bio: "",
  college: "",
  course: "",
  headline: "",
  skills: [],
  website: "",
  yearLevel: "",
};

type TalentProfileStepSource = {
  bio: string;
  college: string;
  course: string;
  headline: string;
  TalentSkills: {
    proficiencyLevel: ProficiencyLevelInput;
    Skill: { name: string };
  }[];
  website: string | null;
  year_level: number;
} | null;

function readText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function normalizeWebsite(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}

function parseSkills(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((skill) => {
        if (!skill || typeof skill !== "object") {
          return null;
        }

        const entry = skill as Record<string, unknown>;
        const name = typeof entry.name === "string" ? entry.name.trim() : "";
        const level = typeof entry.level === "string" ? entry.level : "";

        if (!name || !PROFICIENCY_LEVELS.has(level)) {
          return null;
        }

        return {
          level: level as ProficiencyLevelInput,
          name,
        };
      })
      .filter((skill): skill is TalentProfileSkillInput => Boolean(skill));
  } catch {
    return [];
  }
}

export function parseTalentProfileStepFormData(
  formData: FormData,
): TalentProfileStepInput {
  return {
    bio: readText(formData, "bio"),
    college: readText(formData, "college"),
    course: readText(formData, "course"),
    headline: readText(formData, "headline"),
    skills: parseSkills(formData.get("skills")),
    website: normalizeWebsite(readText(formData, "website")),
    yearLevel: readText(formData, "yearLevel"),
  };
}

export function buildTalentProfileStepInitialValues(
  profile: TalentProfileStepSource,
): TalentProfileStepInitialValues {
  if (!profile) {
    return EMPTY_INITIAL_VALUES;
  }

  return {
    bio: profile.bio,
    college: profile.college,
    course: profile.course,
    headline: profile.headline,
    skills: profile.TalentSkills.map((skill) => ({
      level: skill.proficiencyLevel,
      name: skill.Skill.name,
    })),
    website: profile.website ?? "",
    yearLevel: String(profile.year_level),
  };
}

export function validateTalentProfileStepInput(
  input: TalentProfileStepInput,
): TalentProfileStepState {
  const fieldErrors: Record<string, string> = {};

  if (!input.headline) {
    fieldErrors.headline = "Headline is required.";
  } else if (input.headline.length < 25 || input.headline.length > 70) {
    fieldErrors.headline = "Headline must be 25 to 70 characters.";
  }

  if (!input.bio) {
    fieldErrors.bio = "Bio is required.";
  } else if (input.bio.length < 150 || input.bio.length > 500) {
    fieldErrors.bio = "Bio must be 150 to 500 characters.";
  }

  if (!input.college) {
    fieldErrors.college = "College is required.";
  }

  if (!input.course) {
    fieldErrors.course = "Course is required.";
  }

  if (!YEAR_LEVELS.has(input.yearLevel)) {
    fieldErrors.yearLevel = "Select a valid year level.";
  }

  if (input.skills.length < 3) {
    fieldErrors.skills = "Select at least 3 skills.";
  } else if (input.skills.length > 10) {
    fieldErrors.skills = "Select up to 10 skills.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please fix the highlighted fields.",
      ok: false,
    };
  }

  return {
    message: "",
    ok: true,
  };
}
