import type { ClientProfile, TalentProfile } from "@/lib/types";

import { bookings } from "@/lib/mock-data/bookings";
import { categories } from "@/lib/mock-data/categories";
import { clients } from "@/lib/mock-data/clients";
import { reviews } from "@/lib/mock-data/reviews";
import { services } from "@/lib/mock-data/services";
import { talents } from "@/lib/mock-data/talents";

export function getTalentByUsername(username: string): TalentProfile | undefined {
  return talents.find((talent) => talent.username === username);
}

export function getTalentById(id: string): TalentProfile | undefined {
  return talents.find((talent) => talent.id === id);
}

export function getServiceById(id: string) {
  return services.find((service) => service.id === id);
}

export function getServicesByTalent(talentId: string) {
  return services.filter(
    (service) => service.talentId === talentId && service.status === "published",
  );
}

export function getBookingsByClient(clientId: string) {
  return bookings.filter((booking) => booking.clientId === clientId);
}

export function getBookingsByTalent(talentId: string) {
  return bookings.filter((booking) => booking.talentId === talentId);
}

export function getReviewsByTalent(talentId: string) {
  return reviews.filter((review) => review.talentId === talentId);
}

export function getCategoryLabel(slug: string): string {
  return categories.find((category) => category.slug === slug)?.label ?? slug;
}

export function getPendingTalents(): TalentProfile[] {
  return talents.filter((talent) => !talent.verified);
}

export function getAllUsers(): (TalentProfile | ClientProfile)[] {
  return [...talents, ...clients];
}
