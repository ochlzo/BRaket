import "server-only";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { sendClientBookingResponseEmail } from "@/server/bookings/email";

type BookingResponseResult = {
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

export async function getBookingResponseSummary(responseToken: string) {
  const booking = await getBookingByResponseToken(responseToken);

  if (!booking) {
    return null;
  }

  return {
    clientName: displayName(booking.Client),
    declineReason: booking.declineReason ?? "",
    serviceTitle: booking.Service.title,
    status: booking.status,
    talentName: displayName(booking.Talent),
  };
}

export async function acceptBookingByResponseToken(
  responseToken: string,
): Promise<BookingResponseResult> {
  const booking = await getBookingByResponseToken(responseToken);

  if (!booking) {
    return { message: "We could not find that booking request.", ok: false };
  }

  if (booking.status === "ACCEPTED") {
    return { message: "This booking request is already accepted.", ok: true };
  }

  if (booking.status !== "PENDING") {
    return {
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
    return { message: "We could not find that booking request.", ok: false };
  }

  if (declineReason.length < 10) {
    return { message: "Please share a short reason for declining.", ok: false };
  }

  if (booking.status === "DECLINED") {
    return { message: "This booking request is already declined.", ok: true };
  }

  if (booking.status !== "PENDING") {
    return {
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
