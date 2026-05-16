import "server-only";

import type { BookingStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  BookingListItem,
  BookingParty,
  BookingServiceSummary,
  BookableServiceCard,
} from "@/lib/bookings/types";
import type { CurrentAppUser } from "@/server/users/current-user";

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  maximumFractionDigits: 0,
  style: "currency",
});

function displayName(firstName?: string | null, lastName?: string | null) {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim() || "BRaket user";
}

function mapParty(user: {
  avatarUrl?: string | null;
  firstName?: string | null;
  initials?: string | null;
  lastName?: string | null;
  username?: string | null;
}): BookingParty {
  return {
    avatarUrl: user.avatarUrl ?? "",
    displayName: displayName(user.firstName, user.lastName),
    initials: user.initials ?? "BU",
    username: user.username ?? "",
  };
}

function talentProfileHref(username: string) {
  return username ? `/talent/${username}` : "/browse";
}

function priceLabel(minPrice: { toString: () => string }, maxPrice: { toString: () => string }) {
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

export async function getBookingServiceSummary(
  serviceId: string,
): Promise<BookingServiceSummary | null> {
  const service = await prisma.service.findUnique({
    include: {
      ServiceCategories: {
        include: { Category: true },
        orderBy: { createdAt: "asc" },
      },
      TalentProfile: {
        include: { User: true },
      },
    },
    where: { serviceId },
  });

  if (!service) {
    return null;
  }

  return {
    categories: service.ServiceCategories.map((entry) => entry.Category.name),
    description: service.description,
    id: service.serviceId,
    priceLabel: priceLabel(service.minPrice, service.maxPrice),
    talent: {
      ...mapParty(service.TalentProfile.User),
      headline: service.TalentProfile.headline,
      isVerified: service.TalentProfile.User.is_verified,
      profileHref: talentProfileHref(service.TalentProfile.User.username ?? ""),
      servicesHref: `${talentProfileHref(
        service.TalentProfile.User.username ?? "",
      )}#services`,
    },
    title: service.title,
  };
}

export async function getBookableServices(): Promise<BookableServiceCard[]> {
  const services = await prisma.service.findMany({
    include: {
      ServiceCategories: {
        include: { Category: true },
        orderBy: { createdAt: "asc" },
      },
      TalentProfile: {
        include: { User: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return services.map((service) => ({
    categories: service.ServiceCategories.map((entry) => entry.Category.name),
    description: service.description,
    id: service.serviceId,
    maxPrice: Number(service.maxPrice.toString()),
    minPrice: Number(service.minPrice.toString()),
    priceLabel: priceLabel(service.minPrice, service.maxPrice),
    talent: {
      ...mapParty(service.TalentProfile.User),
      headline: service.TalentProfile.headline,
      isVerified: service.TalentProfile.User.is_verified,
    },
    title: service.title,
  }));
}

export async function getBookingsForUser(
  currentUser: CurrentAppUser,
  viewer: "client" | "talent",
): Promise<BookingListItem[]> {
  const bookings = await prisma.booking.findMany({
    include: {
      Client: true,
      Reviews: {
        orderBy: { createdAt: "asc" },
      },
      Service: true,
      Talent: true,
    },
    orderBy: { createdAt: "desc" },
    where:
      viewer === "talent"
        ? { talentUserId: currentUser.id }
        : { clientUserId: currentUser.id },
  });

  return bookings.map((booking) => {
    const reviewFromClient = booking.Reviews.find(
      (review) => review.target === "TALENT",
    );
    const reviewFromTalent = booking.Reviews.find(
      (review) => review.target === "CLIENT",
    );

    return {
      budget: booking.budget ? Number(booking.budget.toString()) : null,
      client: mapParty(booking.Client),
      createdAt: booking.createdAt.toISOString(),
      declineReason: booking.declineReason ?? "",
      id: booking.bookingId,
      notes: booking.notes ?? "",
      projectDetails: booking.projectDetails,
      reviewFromClient: reviewFromClient
        ? {
            comment: reviewFromClient.comment,
            createdAt: reviewFromClient.createdAt.toISOString(),
            rating: reviewFromClient.rating,
            target: reviewFromClient.target,
          }
        : null,
      reviewFromTalent: reviewFromTalent
        ? {
            comment: reviewFromTalent.comment,
            createdAt: reviewFromTalent.createdAt.toISOString(),
            rating: reviewFromTalent.rating,
            target: reviewFromTalent.target,
          }
        : null,
      service: {
        id: booking.Service.serviceId,
        priceLabel: priceLabel(
          booking.Service.minPrice,
          booking.Service.maxPrice,
        ),
        title: booking.Service.title,
      },
      status: booking.status,
      talent: mapParty(booking.Talent),
    };
  });
}

export function countBookingsByStatus(bookings: BookingListItem[]) {
  const activeStatuses = new Set<BookingStatus>([
    "ACCEPTED",
    "IN_PROGRESS",
    "PENDING",
  ]);

  return {
    active: bookings.filter((booking) => activeStatuses.has(booking.status))
      .length,
    completed: bookings.filter((booking) => booking.status === "COMPLETED")
      .length,
    total: bookings.length,
  };
}
