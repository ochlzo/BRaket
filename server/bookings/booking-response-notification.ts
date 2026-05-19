import "server-only";

import type { Booking } from "@prisma/client";

import { sendClientBookingResponseEmail } from "@/server/bookings/email";

type BookingResponseNotification = Pick<
  Booking,
  "bookingId" | "declineReason" | "status"
> & {
  Client: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
  };
  Service: {
    title: string;
  };
  Talent: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
  };
};

export function displayName(user: {
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

export async function notifyClientAboutBookingResponse(
  booking: BookingResponseNotification,
) {
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
