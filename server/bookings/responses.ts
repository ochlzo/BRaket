import "server-only";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { sendClientBookingResponseEmail } from "@/server/bookings/email";
import { getCurrentAppUser } from "@/server/users/current-user";

type BookingResponseResult = {
  code?: "answered" | "invalid-reason" | "not-found" | "not-talent";
  message: string;
  ok: boolean;
};

type BookingWithResponseRelations = NonNullable<
  Awaited<ReturnType<typeof getBookingByResponseToken>>
>;

function displayName(user: {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}) {
  return (
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
    user.username ||
    "BRaket user"
  );
}

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

async function notifyClient(booking: BookingWithResponseRelations) {
  const result = await sendClientBookingResponseEmail({
    booking,
    client: {
      displayName: displayName(booking.Client),
      email: booking.Client.email,
    },
    service: {
      title: booking.Service.title,
    },
    talent: {
      displayName: displayName(booking.Talent),
      email: booking.Talent.email,
    },
  });

  if (!result.ok) {
    console.warn(
      `Failed to send booking response email for booking ${booking.bookingId}: ${result.message}`,
    );
  }

  return result;
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

export async function getBookingResponseSummary(responseToken: string) {
  const booking = await getBookingByResponseToken(responseToken);

  if (!booking) {
    return null;
  }

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
    talentName: displayName(booking.Talent),
    talentUserId: booking.talentUserId,
  };
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

  await notifyClient(updatedBooking);
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

  await notifyClient(updatedBooking);
  revalidatePath("/dashboard/client/bookings");
  revalidatePath("/dashboard/talent/bookings");

  return {
    message: "Booking declined. The client has been notified by email.",
    ok: true,
  };
}
