import type { BookingStatus } from "@prisma/client";

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

export type BookingListItem = {
  budget: number | null;
  client: BookingParty;
  createdAt: string;
  declineReason: string;
  id: string;
  notes: string;
  projectDetails: string;
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
    headline: string;
    isVerified: boolean;
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
