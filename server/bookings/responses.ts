import "server-only";

import { revalidatePath } from "next/cache";

import { canViewBookingResponse } from "@/lib/bookings/response-auth";
import { prisma } from "@/lib/prisma";
import {
  displayName,
  notifyClientAboutBookingResponse,
} from "@/server/bookings/booking-response-notification";
import {
  getCurrentAppUser,
  type CurrentAppUser,
} from "@/server/users/current-user";

type BookingResponseResult = {
  code?: "answered" | "invalid-reason" | "not-found" | "not-talent";
  message: string;
  ok: boolean;
};

type BookingWithResponseRelations = NonNullable<
  Awaited<ReturnType<typeof getBookingByResponseToken>>
>;

async function getBookingByResponseToken(responseToken: string) {
  return prisma.booking.findUnique({
    include: {
      Client: true,
      Service: true,
      Talent: true,
    },
    where: { responseToken },
  });
}

async function getBookingByResponseTokenForTalent(
  responseToken: string,
  talentUserId: string,
) {
  return prisma.booking.findFirst({
    include: {
      Client: true,
      Service: true,
      Talent: true,
    },
    where: { responseToken, talentUserId },
  });
}

async function authorizeTalentResponse(
  booking: BookingWithResponseRelations,
): Promise<BookingResponseResult> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return {
      code: "not-talent",
      message: "Please sign in as the talent before responding.",
      ok: false,
    };
  }

  if (booking.talentUserId !== currentUser.id) {
    return {
      code: "not-talent",
      message: "This request belongs to another talent account.",
      ok: false,
    };
  }

  return { message: "", ok: true };
}

function mapBookingResponseSummary(booking: BookingWithResponseRelations) {
  return {
    budget: booking.budget ? Number(booking.budget.toString()) : null,
    clientName: displayName(booking.Client),
    clientProfileHref: booking.Client.username
      ? `/client/${booking.Client.username}`
      : "",
    declineReason: booking.declineReason ?? "",
    notes: booking.notes ?? "",
    projectDetails: booking.projectDetails,
    serviceTitle: booking.Service.title,
    status: booking.status,
    talentUserId: booking.talentUserId,
  };
}

export async function getAuthorizedBookingResponseSummary(
  responseToken: string,
  currentUser: CurrentAppUser | null,
) {
  if (!currentUser) {
    return null;
  }

  const booking = await getBookingByResponseTokenForTalent(
    responseToken,
    currentUser.id,
  );

  if (!booking || !canViewBookingResponse(currentUser, booking)) {
    return null;
  }

  return mapBookingResponseSummary(booking);
}

export async function acceptBookingByResponseToken(
  responseToken: string,
): Promise<BookingResponseResult> {
  const booking = await getBookingByResponseToken(responseToken);

  if (!booking) {
    return {
      code: "not-found",
      message: "We could not find that booking request.",
      ok: false,
    };
  }

  const authorization = await authorizeTalentResponse(booking);

  if (!authorization.ok) {
    return authorization;
  }

  if (booking.status === "ACCEPTED") {
    return { message: "This booking request is already accepted.", ok: true };
  }

  if (booking.status !== "PENDING") {
    return {
      code: "answered",
      message: "This booking request has already been answered.",
      ok: false,
    };
  }

  const updatedBooking = await prisma.booking.update({
    data: { status: "ACCEPTED" },
    include: {
      Client: true,
      Service: true,
      Talent: true,
    },
    where: { bookingId: booking.bookingId },
  });

  await notifyClientAboutBookingResponse(updatedBooking);
  revalidatePath("/dashboard/client/bookings");
  revalidatePath("/dashboard/talent/bookings");

  return {
    message: "Booking accepted. The client has been notified by email.",
    ok: true,
  };
}

export async function declineBookingByResponseToken(
  responseToken: string,
  reason: string,
): Promise<BookingResponseResult> {
  const booking = await getBookingByResponseToken(responseToken);
  const declineReason = reason.trim();

  if (!booking) {
    return {
      code: "not-found",
      message: "We could not find that booking request.",
      ok: false,
    };
  }

  const authorization = await authorizeTalentResponse(booking);

  if (!authorization.ok) {
    return authorization;
  }

  if (declineReason.length < 10) {
    return {
      code: "invalid-reason",
      message: "Please share a short reason for declining.",
      ok: false,
    };
  }

  if (booking.status === "DECLINED") {
    return { message: "This booking request is already declined.", ok: true };
  }

  if (booking.status !== "PENDING") {
    return {
      code: "answered",
      message: "This booking request has already been answered.",
      ok: false,
    };
  }

  const updatedBooking = await prisma.booking.update({
    data: {
      declineReason,
      status: "DECLINED",
    },
    include: {
      Client: true,
      Service: true,
      Talent: true,
    },
    where: { bookingId: booking.bookingId },
  });

  await notifyClientAboutBookingResponse(updatedBooking);
  revalidatePath("/dashboard/client/bookings");
  revalidatePath("/dashboard/talent/bookings");

  return {
    message: "Booking declined. The client has been notified by email.",
    ok: true,
  };
}
