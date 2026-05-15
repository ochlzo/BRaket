import type { ProficiencyLevel } from "@prisma/client";

export type TalentProfileSocialLink = {
  href: string;
  label: string;
};

export type TalentProfileSkill = {
  level: ProficiencyLevel;
  name: string;
};

export type TalentProfilePageData = {
  authId: string;
  avatarUrl: string;
  backgroundImageUrl: string;
  bio: string;
  college: string;
  course: string;
  displayName: string;
  email: string;
  facebookUrl: string;
  firstName: string;
  githubUrl: string;
  headline: string;
  instagramUrl: string;
  isVerified: boolean;
  joinedLabel: string;
  lastName: string;
  linkedinUrl: string;
  skills: TalentProfileSkill[];
  socialLinks: TalentProfileSocialLink[];
  username: string;
  website: string;
  xUrl: string;
  yearLevel: number | null;
};

export type TalentProfilePageSource = {
  user: {
    authId: string;
    avatarUrl: string | null;
    background_img_url: string | null;
    createdAt: Date;
    email: string;
    facebook_url: string | null;
    firstName: string | null;
    github_url: string | null;
    instagram_url: string | null;
    is_verified: boolean;
    lastName: string | null;
    linkedin_url: string | null;
    userId: string;
    username: string | null;
    x_url: string | null;
  };
  talentProfile: {
    bio: string;
    college: string;
    course: string;
    headline: string;
    website: string | null;
    year_level: number;
    TalentSkills: Array<{
      proficiencyLevel: ProficiencyLevel;
      Skill: { name: string };
    }>;
  } | null;
};
