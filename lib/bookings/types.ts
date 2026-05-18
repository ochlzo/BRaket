import type { BookingStatus, ReviewTarget } from "@prisma/client";
import type { TalentAvailabilityStatus } from "@/lib/talent-profile/availability";

export type BookingActionState = {
  message: string;
  ok: boolean;
  redirectTo?: string;
};

export type BookingParty = {
  avatarUrl: string;
  displayName: string;
  initials: string;
  username: string;
};

export type BookingReviewItem = {
  comment: string;
  createdAt: string;
  rating: number;
  target: ReviewTarget;
};

export type BookingListItem = {
  budget: number | null;
  client: BookingParty;
  createdAt: string;
  declineReason: string;
  id: string;
  notes: string;
  projectDetails: string;
  reviewFromClient: BookingReviewItem | null;
  reviewFromTalent: BookingReviewItem | null;
  service: {
    id: string;
    priceLabel: string;
    title: string;
  };
  status: BookingStatus;
  talent: BookingParty;
};

export type BookingServiceSummary = {
  categories: string[];
  description: string;
  id: string;
  priceLabel: string;
  talent: BookingParty & {
    availabilityLabel: string;
    availabilityStatus: TalentAvailabilityStatus;
    headline: string;
    isVerified: boolean;
    isBookable: boolean;
    profileHref: string;
    servicesHref: string;
  };
  title: string;
};

export type BookableServiceCard = {
  categories: string[];
  description: string;
  id: string;
  maxPrice: number;
  minPrice: number;
  priceLabel: string;
  talent: BookingParty & {
    headline: string;
    isVerified: boolean;
  };
  title: string;
};

export type TalentServiceListItem = {
  categories: string[];
  createdAt: string;
  description: string;
  id: string;
  priceLabel: string;
  title: string;
};
