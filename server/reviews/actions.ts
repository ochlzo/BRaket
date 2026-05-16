"use server";

import { ReviewTarget } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentAppUser } from "@/server/users/current-user";

export type ReviewActionState = {
  message: string;
  ok: boolean;
};

const EMPTY_STATE: ReviewActionState = {
  message: "",
  ok: false,
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function readRating(formData: FormData) {
  const rating = Number(readText(formData, "rating"));

  return Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null;
}

export async function createBookingReviewAction(
  _previousState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const currentUser = await getCurrentAppUser();
  const bookingId = readText(formData, "bookingId");
  const rating = readRating(formData);
  const comment = readText(formData, "comment");

  if (!currentUser) {
    return { ...EMPTY_STATE, message: "Sign in again before reviewing." };
  }

  if (!bookingId) {
    return { ...EMPTY_STATE, message: "Choose a booking to review." };
  }

  if (!rating) {
    return { ...EMPTY_STATE, message: "Choose a rating from 1 to 5." };
  }

  if (comment.length < 10) {
    return { ...EMPTY_STATE, message: "Write at least 10 characters." };
  }

  const booking = await prisma.booking.findUnique({
    select: {
      bookingId: true,
      clientUserId: true,
      status: true,
      talentUserId: true,
    },
    where: { bookingId },
  });

  if (!booking) {
    return { ...EMPTY_STATE, message: "We could not find that booking." };
  }

  if (booking.status !== "COMPLETED") {
    return {
      ...EMPTY_STATE,
      message: "Reviews are available after a booking is completed.",
    };
  }

  const isClient = booking.clientUserId === currentUser.id;
  const isTalent = booking.talentUserId === currentUser.id;

  if (!isClient && !isTalent) {
    return { ...EMPTY_STATE, message: "You cannot review this booking." };
  }

  const target = isClient ? ReviewTarget.TALENT : ReviewTarget.CLIENT;

  try {
    await prisma.review.create({
      data: {
        bookingId: booking.bookingId,
        clientUserId: booking.clientUserId,
        comment,
        rating,
        reviewerUserId: currentUser.id,
        talentUserId: booking.talentUserId,
        target,
      },
    });
  } catch {
    return {
      ...EMPTY_STATE,
      message: "You already left a review for this booking.",
    };
  }

  revalidatePath("/dashboard/client/bookings");
  revalidatePath("/dashboard/talent/bookings");

  return {
    message: "Review submitted.",
    ok: true,
  };
}
