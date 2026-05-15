import type {
  TalentProfilePageData,
  TalentProfilePageSource,
  TalentProfileSocialLink,
} from "./types";
import { DEFAULT_PROFILE_COVER_BACKGROUND } from "@/lib/profile-cover";

export const DEFAULT_TALENT_COVER_BACKGROUND =
  DEFAULT_PROFILE_COVER_BACKGROUND;

function compactText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function displayName(firstName: string, lastName: string, username: string) {
  const name = `${firstName} ${lastName}`.trim();
  return name || username;
}

function socialLinkFromRaw(label: string, value: string | null | undefined) {
  const raw = compactText(value);

  if (!raw) {
    return null;
  }

  if (/^https?:\/\//i.test(raw)) {
    return { href: raw, label } satisfies TalentProfileSocialLink;
  }

  const handle = raw.replace(/^@/, "");
  const href =
    label === "Instagram"
      ? `https://www.instagram.com/${handle}`
      : label === "Facebook"
        ? `https://www.facebook.com/${handle}`
        : label === "X"
          ? `https://x.com/${handle}`
          : label === "GitHub"
            ? `https://github.com/${handle}`
            : `https://www.linkedin.com/in/${handle}`;

  return { href, label } satisfies TalentProfileSocialLink;
}

function normalizeWebsiteUrl(value: string | null | undefined) {
  const url = compactText(value);

  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url.replace(/^\/\//, "")}`;
}

export function mapTalentProfilePageData(
  source: TalentProfilePageSource,
): TalentProfilePageData {
  const firstName = compactText(source.user.firstName);
  const lastName = compactText(source.user.lastName);
  const username = compactText(source.user.username) || source.user.userId;
  const talentProfile = source.talentProfile;
  const socialLinks = [
    socialLinkFromRaw("Facebook", source.user.facebook_url),
    socialLinkFromRaw("Instagram", source.user.instagram_url),
    socialLinkFromRaw("X", source.user.x_url),
    socialLinkFromRaw("GitHub", source.user.github_url),
    socialLinkFromRaw("LinkedIn", source.user.linkedin_url),
  ].filter(Boolean) as TalentProfileSocialLink[];

  return {
    authId: source.user.authId,
    avatarUrl: compactText(source.user.avatarUrl),
    backgroundImageUrl:
      compactText(source.user.background_img_url) ||
      DEFAULT_TALENT_COVER_BACKGROUND,
    bio: compactText(talentProfile?.bio),
    college: compactText(talentProfile?.college),
    course: compactText(talentProfile?.course),
    displayName: displayName(firstName, lastName, username),
    email: source.user.email,
    facebookUrl: compactText(source.user.facebook_url),
    firstName,
    githubUrl: compactText(source.user.github_url),
    headline: compactText(talentProfile?.headline),
    instagramUrl: compactText(source.user.instagram_url),
    isVerified: source.user.is_verified,
    joinedLabel: `Joined ${source.user.createdAt.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })}`,
    lastName,
    linkedinUrl: compactText(source.user.linkedin_url),
    skills:
      talentProfile?.TalentSkills.map((skill) => ({
        level: skill.proficiencyLevel,
        name: skill.Skill.name,
      })) ?? [],
    socialLinks,
    username,
    website: normalizeWebsiteUrl(talentProfile?.website),
    xUrl: compactText(source.user.x_url),
    yearLevel: talentProfile?.year_level ?? null,
  };
}
