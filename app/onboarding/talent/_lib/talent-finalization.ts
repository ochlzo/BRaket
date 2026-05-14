export type ProficiencyLevelInput =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "EXPERT";

const YEAR_LEVELS = new Set([1, 2, 3, 4]);

export type TalentFinalizationProfile = {
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

export type TalentFinalizationState = {
  message: string;
  ok: boolean;
};

export function validateTalentOnboardingFinalization(
  profile: TalentFinalizationProfile,
): TalentFinalizationState {
  if (!profile) {
    return {
      message: "Complete step 1 before finalizing onboarding.",
      ok: false,
    };
  }

  if (
    !profile.headline ||
    profile.headline.length < 25 ||
    profile.headline.length > 70 ||
    !profile.bio ||
    profile.bio.length < 150 ||
    profile.bio.length > 500 ||
    !profile.college ||
    !profile.course ||
    !YEAR_LEVELS.has(profile.year_level) ||
    profile.TalentSkills.length < 3 ||
    profile.TalentSkills.length > 10
  ) {
    return {
      message: "Complete step 1 before finalizing onboarding.",
      ok: false,
    };
  }

  return {
    message: "",
    ok: true,
  };
}
