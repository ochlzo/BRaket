"use server";

import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import type { BookingActionState } from "@/lib/bookings/types";
import { prisma } from "@/lib/prisma";
import { notifyClientAboutBookingResponse } from "@/server/bookings/booking-response-notification";
import {
  sendTalentBookingRequestEmail,
  sendWorkInitiatedEmail,
  sendWorkSubmittedEmail,
} from "@/server/bookings/email";
import { getCurrentAppUser } from "@/server/users/current-user";

const EMPTY_STATE: BookingActionState = {
  message: "",
  ok: false,
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function parseBudget(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function normalizeConfiguredSiteUrl(value: string) {
  const siteUrl = value.trim().replace(/\/$/, "");

  if (
    siteUrl.startsWith("https://localhost") ||
    siteUrl.startsWith("https://127.0.0.1")
  ) {
    return siteUrl.replace(/^https:\/\//, "http://");
  }

  return siteUrl;
}

async function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return normalizeConfiguredSiteUrl(configuredUrl);
  }

  const headerStore = await headers();
  const host = headerStore.get("host");
  const forwardedProtocol = headerStore.get("x-forwarded-proto") ?? "http";
  const protocol = host?.startsWith("localhost") ? "http" : forwardedProtocol;

  return host ? `${protocol}://${host}` : "";
}

async function getDashboardUrl() {
  const siteUrl = await getSiteUrl();

  return siteUrl
    ? `${siteUrl}/dashboard/talent/bookings`
    : "/dashboard/talent/bookings";
}

export async function createBookingRequestAction(
  _previousState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const currentUser = await getCurrentAppUser();

  if (!currentUser) {
    return {
      ...EMPTY_STATE,
      message: "Please sign in as a client before sending a booking request.",
    };
  }

  const serviceId = readText(formData, "serviceId");
  const projectDetails = readText(formData, "projectDetails");
  const notes = readText(formData, "notes");
  const budget = parseBudget(readText(formData, "budget"));

  if (!serviceId) {
    return { ...EMPTY_STATE, message: "Choose a service to book." };
  }

  const service = await prisma.service.findUnique({
    include: {
      TalentProfile: {
        include: {
          User: true,
        },
      },
    },
    where: { serviceId },
  });

  if (!service) {
    return {
      ...EMPTY_STATE,
      message: "We could not find that service anymore.",
    };
  }

  if (service.TalentProfile.user_id === currentUser.id) {
    return {
      ...EMPTY_STATE,
      message: "You cannot book a service attached to your own account.",
    };
  }

  if (!service.TalentProfile.User.is_verified) {
    return {
      ...EMPTY_STATE,
      message: "This service is no longer available for booking.",
    };
  }

  const booking = await prisma.booking.create({
    data: {
      budget,
      clientUserId: currentUser.id,
      notes: notes || null,
      projectDetails,
      responseToken: crypto.randomUUID(),
      serviceId,
      talentUserId: service.TalentProfile.user_id,
    },
  });

  const talentUser = service.TalentProfile.User;
  const talentName =
    `${talentUser.firstName ?? ""} ${talentUser.lastName ?? ""}`.trim() ||
    talentUser.username ||
    "there";
  const clientName =
    currentUser.displayName ||
    `${currentUser.firstName} ${currentUser.lastName}`.trim() ||
    currentUser.email;
  const siteUrl = await getSiteUrl();
  const emailResult = await sendTalentBookingRequestEmail({
    booking,
    client: {
      displayName: clientName,
      email: currentUser.email,
    },
    dashboardUrl: siteUrl
      ? `${siteUrl}/dashboard/talent/bookings`
      : await getDashboardUrl(),
    responseBaseUrl: siteUrl
      ? `${siteUrl}/bookings/respond/${booking.responseToken}`
      : undefined,
    service: {
      title: service.title,
    },
    talent: {
      displayName: talentName,
      email: talentUser.email,
    },
  });

  if (!emailResult.ok) {
    console.warn(
      `Failed to send booking request email for booking ${booking.bookingId}: ${emailResult.message}`,
    );
  }

  revalidatePath("/dashboard/client/bookings");
  revalidatePath("/dashboard/talent/bookings");

  return {
    message: emailResult.ok
      ? "Booking request sent. The talent was notified by email."
      : "Booking request sent, but the email notification could not be delivered yet.",
    ok: true,
    redirectTo: `/dashboard/client/bookings?created=${booking.bookingId}`,
  };
}

export async function updateBookingStatusAction(
  _previousState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const currentUser = await getCurrentAppUser();
  const bookingId = readText(formData, "bookingId");
  const status = readText(formData, "status");

  if (!currentUser) {
    return { ...EMPTY_STATE, message: "Your session expired." };
  }

  if (!Object.values(BookingStatus).includes(status as BookingStatus)) {
    return { ...EMPTY_STATE, message: "Choose a valid booking status." };
  }

  const booking = await prisma.booking.findUnique({
    include: {
      Client: true,
      Service: true,
      Talent: true,
    },
    where: { bookingId },
  });

  if (!booking) {
    return { ...EMPTY_STATE, message: "We could not find that booking." };
  }

  const nextStatus = status as BookingStatus;

  if (
    (nextStatus === "ACCEPTED" || nextStatus === "DECLINED") &&
    booking.status === nextStatus
  ) {
    return {
      message:
        nextStatus === "ACCEPTED"
          ? "This booking request is already accepted."
          : "This booking request is already declined.",
      ok: true,
    };
  }

  const isTalentOwner = booking.talentUserId === currentUser.id;
  const isClientOwner = booking.clientUserId === currentUser.id;

  if (["ACCEPTED", "DECLINED", "WORK_SUBMITTED"].includes(nextStatus)) {
    if (!isTalentOwner) {
      return { ...EMPTY_STATE, message: "Only the talent can update that status." };
    }
  } else if (["IN_PROGRESS", "COMPLETED"].includes(nextStatus)) {
    if (!isClientOwner) {
      return { ...EMPTY_STATE, message: "Only the client can update that status." };
    }
  } else if (nextStatus === "CANCELLED" && !isClientOwner) {
    return { ...EMPTY_STATE, message: "Only the client can cancel this request." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      data: { status: nextStatus },
      where: { bookingId },
    });

    if (nextStatus === "COMPLETED" && booking.status !== "COMPLETED") {
      await tx.talentProfile.update({
        data: { completed_commissions_count: { increment: 1 } },
        where: { user_id: booking.talentUserId },
      });
    }
  });

  if (nextStatus === "ACCEPTED" || nextStatus === "DECLINED") {
    await notifyClientAboutBookingResponse({
      ...booking,
      declineReason: booking.declineReason ?? null,
      status: nextStatus,
    });
  }

  // Fire notification emails for the new handshake steps
  if (nextStatus === "IN_PROGRESS" || nextStatus === "WORK_SUBMITTED") {
    const full = await prisma.booking.findUnique({
      include: { Client: true, Service: true, Talent: true },
      where: { bookingId },
    });

    if (full) {
      const siteUrl = (await getSiteUrl()).replace(/\/$/, "");
      const clientDashboard = siteUrl
        ? `${siteUrl}/dashboard/client/bookings`
        : "/dashboard/client/bookings";
      const talentDashboard = siteUrl
        ? `${siteUrl}/dashboard/talent/bookings`
        : "/dashboard/talent/bookings";
      const clientName =
        `${full.Client.firstName ?? ""} ${full.Client.lastName ?? ""}`.trim() ||
        full.Client.email;
      const talentName =
        `${full.Talent.firstName ?? ""} ${full.Talent.lastName ?? ""}`.trim() ||
        full.Talent.email;

      if (nextStatus === "IN_PROGRESS") {
        sendWorkInitiatedEmail({
          bookingId,
          client: { displayName: clientName, email: full.Client.email },
          dashboardUrl: talentDashboard,
          service: { title: full.Service.title },
          talent: { displayName: talentName, email: full.Talent.email },
        }).catch((err: unknown) =>
          console.warn("Failed to send work-initiated email:", err),
        );
      }

      if (nextStatus === "WORK_SUBMITTED") {
        sendWorkSubmittedEmail({
          bookingId,
          client: { displayName: clientName, email: full.Client.email },
          dashboardUrl: clientDashboard,
          service: { title: full.Service.title },
          talent: { displayName: talentName, email: full.Talent.email },
        }).catch((err: unknown) =>
          console.warn("Failed to send work-submitted email:", err),
        );
      }
    }
  }

  revalidatePath("/dashboard/client/bookings");
  revalidatePath("/dashboard/talent/bookings");
  revalidatePath("/dashboard/talent/profile");

  return { message: "Booking updated.", ok: true };
}

export async function updateBookingStatusFormAction(formData: FormData) {
  await updateBookingStatusAction(EMPTY_STATE, formData);
}
