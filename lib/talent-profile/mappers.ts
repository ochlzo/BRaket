import type {
  TalentProfilePageData,
  TalentProfilePageSource,
  TalentProfilePortfolioItem,
  TalentProfileReviewItem,
  TalentProfileServiceItem,
  TalentProfileSocialLink,
} from "./types";
import { calculateReportBasedReputationScore } from "../reputation-score";
import { getTalentAvailability } from "@/lib/talent-profile/availability";
import { DEFAULT_PROFILE_COVER_BACKGROUND } from "@/lib/profile-cover";

export const DEFAULT_TALENT_COVER_BACKGROUND =
  DEFAULT_PROFILE_COVER_BACKGROUND;

type TalentProfileSource = NonNullable<TalentProfilePageSource["talentProfile"]>;

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

function readPrice(value: { toString: () => string }) {
  const parsed = Number(value.toString());

  return Number.isFinite(parsed) ? parsed : 0;
}

function buildServices(
  services: TalentProfileSource["Services"],
): TalentProfileServiceItem[] {
  return services.map((service) => ({
    categories: service.ServiceCategories.map((entry) =>
      compactText(entry.Category.name),
    ).filter(Boolean),
    categoryIds: service.ServiceCategories.map((entry) =>
      compactText(entry.categoryId),
    ).filter(Boolean),
    description: compactText(service.description),
    id: service.serviceId,
    maxPrice: readPrice(service.maxPrice),
    media: service.ServiceMedia.map((media) => ({
      id: media.serviceDetailId,
      url: media.mediaUrl,
    })),
    mediaUrls: service.ServiceMedia.map((media) => compactText(media.mediaUrl)).filter(
      Boolean,
    ),
    minPrice: readPrice(service.minPrice),
    priceUnit: service.priceUnit,
    title: compactText(service.title),
  }));
}

function buildPortfolioItems(
  portfolio: TalentProfileSource["TalentPortfolio"],
): TalentProfilePortfolioItem[] {
  return portfolio.map((item) => ({
    createdAt: item.createdAt.toISOString(),
    description: compactText(item.description),
    id: item.talent_portfolio_id,
    media: item.TalentPortfolioMedia.map((media) => ({
      id: media.tportfolio_media_id,
      url: media.media_url,
    })),
    mediaUrls: item.TalentPortfolioMedia.map((media) =>
      compactText(media.media_url),
    ).filter(Boolean),
    title: compactText(item.title),
    updatedAt: item.updatedAt.toISOString(),
  }));
}

function reputationLabel(averageRating: number | null, reviewCount: number) {
  if (reviewCount === 0 || averageRating === null) {
    return "No reviews yet";
  }

  if (averageRating >= 4.5) {
    return "Excellent talent";
  }

  if (averageRating >= 4) {
    return "Good talent";
  }

  if (averageRating >= 3) {
    return "Reliable talent";
  }

  return "Needs more trust signals";
}

function buildReceivedReviews(
  reviews: TalentProfilePageSource["user"]["TalentReviewsReceived"],
): TalentProfileReviewItem[] {
  return reviews.map((review) => ({
    bookingServiceTitle: compactText(review.Booking.Service.title),
    comment: compactText(review.comment),
    createdAt: review.createdAt.toISOString(),
    id: review.reviewId,
    rating: review.rating,
    reviewerName: displayName(
      compactText(review.Reviewer.firstName),
      compactText(review.Reviewer.lastName),
      compactText(review.Reviewer.username),
    ),
  }));
}

export function mapTalentProfilePageData(
  source: TalentProfilePageSource,
): TalentProfilePageData {
  const firstName = compactText(source.user.firstName);
  const lastName = compactText(source.user.lastName);
  const username = compactText(source.user.username) || source.user.userId;
  const talentProfile = source.talentProfile;
  const receivedReviews = buildReceivedReviews(source.user.TalentReviewsReceived);
  const talentReviewCount = receivedReviews.length;
  const completedBookingsCount = source.user.TalentBookings.filter(
    (booking) => booking.status === "COMPLETED",
  ).length;
  const talentAvgRating =
    talentReviewCount > 0
      ? receivedReviews.reduce((total, review) => total + review.rating, 0) /
        talentReviewCount
      : null;
  const socialLinks = [
    socialLinkFromRaw("Facebook", source.user.facebook_url),
    socialLinkFromRaw("Instagram", source.user.instagram_url),
    socialLinkFromRaw("X", source.user.x_url),
    socialLinkFromRaw("GitHub", source.user.github_url),
    socialLinkFromRaw("LinkedIn", source.user.linkedin_url),
  ].filter(Boolean) as TalentProfileSocialLink[];
  const services = talentProfile ? buildServices(talentProfile.Services) : [];
  const availability = getTalentAvailability(
    talentProfile?.availabilityStatus,
  );

  return {
    activeBoost: source.activeBoost ?? null,
    availabilityLabel: availability.label,
    availabilityStatus: availability.status,
    authId: source.user.authId,
    avatarUrl: compactText(source.user.avatarUrl),
    backgroundImageUrl:
      compactText(source.user.background_img_url) ||
      DEFAULT_TALENT_COVER_BACKGROUND,
    bio: compactText(talentProfile?.bio),
    college: compactText(talentProfile?.college),
    contactNum: compactText(source.user.contactNum),
    course: compactText(talentProfile?.course),
    displayName: displayName(firstName, lastName, username),
    email: source.user.email,
    facebookUrl: compactText(source.user.facebook_url),
    firstName,
    githubUrl: compactText(source.user.github_url),
    headline: compactText(talentProfile?.headline),
    instagramUrl: compactText(source.user.instagram_url),
    isAvailable: availability.isAvailable,
    isVerified: source.user.is_verified,
    joinedLabel: `Joined ${source.user.createdAt.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })}`,
    lastName,
    linkedinUrl: compactText(source.user.linkedin_url),
    portfolio: talentProfile
      ? buildPortfolioItems(talentProfile.TalentPortfolio)
      : [],
    receivedReviews,
    reputationScore: calculateReportBasedReputationScore(
      source.profileReportCount,
    ),
    reputationLabel: reputationLabel(talentAvgRating, talentReviewCount),
    services,
    talentAvgRating,
    talentReviewCount,
    totalProjectsCompleted: completedBookingsCount,
    userId: source.user.userId,
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
