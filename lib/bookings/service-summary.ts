import type { BookingServiceSummary } from "./types";
import {
  getTalentAvailability,
  type TalentAvailabilityStatus,
} from "@/lib/talent-profile/availability";

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  maximumFractionDigits: 0,
  style: "currency",
});

type PriceValue = { toString: () => string };

type ServiceSummaryReviewSource = {
  comment: string;
  createdAt: Date;
  rating: number;
  reviewId: string;
  target: string;
  Reviewer: {
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
  };
};

type ServiceSummarySource = {
  description: string;
  maxPrice: PriceValue;
  minPrice: PriceValue;
  serviceId: string;
  title: string;
  Bookings: Array<{
    bookingId: string;
    status: string;
    Reviews: ServiceSummaryReviewSource[];
  }>;
  ServiceCategories: Array<{ Category: { name: string } }>;
  ServiceMedia: Array<{
    mediaUrl: string;
    serviceDetailId: string;
  }>;
  TalentProfile: {
    availabilityStatus?: TalentAvailabilityStatus | null;
    headline: string;
    User: {
      avatarUrl?: string | null;
      firstName?: string | null;
      initials?: string | null;
      is_verified: boolean;
      lastName?: string | null;
      username?: string | null;
    };
  };
};

function displayName(
  firstName?: string | null,
  lastName?: string | null,
  username?: string | null,
) {
  return (
    `${firstName ?? ""} ${lastName ?? ""}`.trim() || username || "BRaket user"
  );
}

function talentProfileHref(username: string) {
  return username ? `/talent/${username}` : "/browse";
}

function priceLabel(minPrice: PriceValue, maxPrice: PriceValue) {
  const min = Number(minPrice.toString());
  const max = Number(maxPrice.toString());

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return "Price on request";
  }

  if (min === max) {
    return pesoFormatter.format(min);
  }

  return `${pesoFormatter.format(min)} - ${pesoFormatter.format(max)}`;
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

export function buildBookingServiceSummary(
  service: ServiceSummarySource,
): BookingServiceSummary {
  const username = service.TalentProfile.User.username ?? "";
  const availability = getTalentAvailability(
    service.TalentProfile.availabilityStatus,
  );
  const reviews = service.Bookings.filter(
    (booking) => booking.status === "COMPLETED",
  ).flatMap((booking) =>
    booking.Reviews.filter((review) => review.target === "TALENT").map(
      (review) => ({
        bookingServiceTitle: service.title,
        comment: review.comment.trim(),
        createdAt: review.createdAt.toISOString(),
        id: review.reviewId,
        rating: review.rating,
        reviewerName: displayName(
          review.Reviewer.firstName,
          review.Reviewer.lastName,
          review.Reviewer.username,
        ),
      }),
    ),
  );
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : null;

  return {
    averageRating,
    categories: service.ServiceCategories.map((entry) => entry.Category.name),
    description: service.description,
    id: service.serviceId,
    media: service.ServiceMedia.map((media) => ({
      id: media.serviceDetailId,
      url: media.mediaUrl,
    })),
    priceLabel: priceLabel(service.minPrice, service.maxPrice),
    reputationLabel: reputationLabel(averageRating, reviews.length),
    reviews,
    talent: {
      avatarUrl: service.TalentProfile.User.avatarUrl ?? "",
      displayName: displayName(
        service.TalentProfile.User.firstName,
        service.TalentProfile.User.lastName,
        service.TalentProfile.User.username,
      ),
      availabilityLabel: availability.label,
      availabilityStatus: availability.status,
      headline: service.TalentProfile.headline,
      initials: service.TalentProfile.User.initials ?? "BU",
      isVerified: service.TalentProfile.User.is_verified,
      profileHref: talentProfileHref(username),
      servicesHref: `${talentProfileHref(username)}#services`,
      username,
    },
    title: service.title,
  };
}
