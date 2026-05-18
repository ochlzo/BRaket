import type {
  ClientProfileEditorValues,
  ClientProfilePageData,
  ClientProfilePageSource,
  ClientProfilePortfolioItem,
  ClientProfileReviewItem,
  ClientProfileSocialLink,
} from "./types";
import { calculateReportBasedReputationScore } from "../reputation-score";
import { DEFAULT_PROFILE_COVER_BACKGROUND } from "@/lib/profile-cover";

export const DEFAULT_COVER_BACKGROUND = DEFAULT_PROFILE_COVER_BACKGROUND;

type PortfolioSource = NonNullable<
  ClientProfilePageSource["clientProfile"]
>["ClientPortfolio"];

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
    return { href: raw, label } satisfies ClientProfileSocialLink;
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

  return { href, label } satisfies ClientProfileSocialLink;
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

function buildPortfolioItems(
  items: PortfolioSource,
): ClientProfilePortfolioItem[] {
  return items.map((item) => ({
    createdAt: item.createdAt.toISOString(),
    description: compactText(item.description),
    id: item.client_portfolio_id,
    media: item.ClientPortfolioMedia.map((media) => ({
      id: media.cportfolio_media_id,
      url: media.media_url,
    })),
    title: compactText(item.title),
    updatedAt: item.updatedAt.toISOString(),
  }));
}

function reputationLabel(averageRating: number | null, reviewCount: number) {
  if (reviewCount === 0 || averageRating === null) {
    return "No reviews yet";
  }

  if (averageRating >= 4.5) {
    return "Excellent client";
  }

  if (averageRating >= 4) {
    return "Good client";
  }

  if (averageRating >= 3) {
    return "Reliable client";
  }

  return "Needs more trust signals";
}

function buildReceivedReviews(
  reviews: ClientProfilePageSource["user"]["ClientReviewsReceived"],
): ClientProfileReviewItem[] {
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

export function mapClientProfilePageData(
  source: ClientProfilePageSource,
): ClientProfilePageData {
  const firstName = compactText(source.user.firstName);
  const lastName = compactText(source.user.lastName);
  const username = compactText(source.user.username) || source.user.userId;
  const email = source.user.email;
  const talentEmail = compactText(source.user.TalentVerificationRequests[0]?.buEmail);
  const organizationName =
    compactText(source.clientProfile?.organization_name) ||
    displayName(firstName, lastName, username);
  const joinedLabel = ` ${source.user.createdAt.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })}`;
  const clientProfile = source.clientProfile;
  const receivedReviews = buildReceivedReviews(source.user.ClientReviewsReceived);
  const reviewCount = receivedReviews.length;
  const averageRating =
    reviewCount > 0
      ? receivedReviews.reduce((total, review) => total + review.rating, 0) /
        reviewCount
      : null;
  const socialLinks = [
    socialLinkFromRaw("Facebook", source.user.facebook_url),
    socialLinkFromRaw("Instagram", source.user.instagram_url),
    socialLinkFromRaw("X", source.user.x_url),
    socialLinkFromRaw("GitHub", source.user.github_url),
    socialLinkFromRaw("LinkedIn", source.user.linkedin_url),
  ].filter(Boolean) as ClientProfileSocialLink[];

  return {
    about: compactText(clientProfile?.about),
    averageRating,
    authId: source.user.authId,
    avatarUrl: compactText(source.user.avatarUrl),
    backgroundImageUrl:
      compactText(source.user.background_img_url) || DEFAULT_COVER_BACKGROUND,
    businessAddress: compactText(clientProfile?.business_address),
    completedCommissionsCount:
      clientProfile?.completed_commissions_count ?? null,
    contactNum: compactText(source.user.contactNum),
    displayName: displayName(firstName, lastName, username),
    email,
    firstName,
    facebookUrl: compactText(source.user.facebook_url),
    githubUrl: compactText(source.user.github_url),
    instagramUrl: compactText(source.user.instagram_url),
    joinedLabel,
    lastName,
    linkedinUrl: compactText(source.user.linkedin_url),
    organizationName,
    portfolio: clientProfile
      ? buildPortfolioItems(clientProfile.ClientPortfolio)
      : [],
    receivedReviews,
    reputationScore: calculateReportBasedReputationScore(
      source.profileReportCount,
    ),
    reputationLabel: reputationLabel(averageRating, reviewCount),
    reviewCount,
    socialLinks,
    talentEmail,
    userId: source.user.userId,
    username,
    website: normalizeWebsiteUrl(clientProfile?.website),
    xUrl: compactText(source.user.x_url),
  };
}

export function buildClientProfileEditorValues(
  profile: ClientProfilePageData,
): ClientProfileEditorValues {
  return {
    about: profile.about,
    avatarUrl: profile.avatarUrl,
    backgroundImageUrl: profile.backgroundImageUrl,
    businessAddress: profile.businessAddress,
    contactNum: profile.contactNum,
    facebookUrl: profile.facebookUrl,
    firstName: profile.firstName,
    githubUrl: profile.githubUrl,
    instagramUrl: profile.instagramUrl,
    lastName: profile.lastName,
    linkedinUrl: profile.linkedinUrl,
    organizationName: profile.organizationName,
    username: profile.username,
    website: profile.website,
    xUrl: profile.xUrl,
  };
}
