import "server-only";

import type { Booking } from "@prisma/client";

import { sendEmail } from "@/server/email/brevo";
import { recordBookingEmailEvent } from "@/server/bookings/email-events";

type BookingTalentEmailInput = {
  booking: Pick<Booking, "bookingId" | "budget" | "projectDetails" | "notes">;
  client: {
    displayName: string;
    email: string;
  };
  dashboardUrl: string;
  responseBaseUrl?: string;
  service: {
    title: string;
  };
  talent: {
    displayName: string;
    email: string;
  };
};

type BookingClientEmailInput = {
  booking: Pick<Booking, "bookingId" | "declineReason" | "status">;
  client: {
    displayName: string;
    email: string;
  };
  service: {
    title: string;
  };
  talent: {
    displayName: string;
    email: string;
  };
};

type BookingCancelEmailInput = {
  booking: Pick<Booking, "bookingId" | "status">;
  client: {
    displayName: string;
    email: string;
  };
  service: {
    title: string;
  };
  talent: {
    displayName: string;
    email: string;
  };
};

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  maximumFractionDigits: 0,
  style: "currency",
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatBudget(value: BookingTalentEmailInput["booking"]["budget"]) {
  if (!value) {
    return "Not specified";
  }

  return pesoFormatter.format(Number(value.toString()));
}

export async function sendTalentBookingRequestEmail({
  booking,
  client,
  dashboardUrl,
  responseBaseUrl,
  service,
  talent,
}: BookingTalentEmailInput) {
  const safeTalentName = escapeHtml(talent.displayName);
  const safeClientName = escapeHtml(client.displayName);
  const safeServiceTitle = escapeHtml(service.title);
  const safeProjectDetails = escapeHtml(booking.projectDetails);
  const safeNotes = booking.notes ? escapeHtml(booking.notes) : "";
  const reviewUrl = responseBaseUrl ?? dashboardUrl;
  const budget = formatBudget(booking.budget);
  const subject = `New booking request for ${service.title}`;
  const text = [
    `Hi ${talent.displayName},`,
    "",
    `${client.displayName} wants to avail your service: ${service.title}.`,
    `Budget: ${budget}`,
    "",
    "Project details:",
    booking.projectDetails,
    "",
    booking.notes ? `Notes: ${booking.notes}` : "",
    "",
    `View the client and request: ${reviewUrl}`,
    `Dashboard: ${dashboardUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
      <h1 style="font-size:20px;margin:0 0 12px">New booking request</h1>
      <p>Hi ${safeTalentName},</p>
      <p><strong>${safeClientName}</strong> wants to avail your service:</p>
      <p style="font-size:16px"><strong>${safeServiceTitle}</strong></p>
      <p><strong>Budget:</strong> ${escapeHtml(budget)}</p>
      <p><strong>Project details:</strong></p>
      <p style="white-space:pre-line">${safeProjectDetails}</p>
      ${
        safeNotes
          ? `<p><strong>Additional notes:</strong></p><p style="white-space:pre-line">${safeNotes}</p>`
          : ""
      }
      <p>
        <a href="${escapeHtml(reviewUrl)}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#2563eb;color:#ffffff;text-decoration:none">
          View client and request
        </a>
      </p>
      <p style="font-size:13px;color:#6b7280">Open the request to view the client profile before accepting or declining. You can also review this in your dashboard: ${escapeHtml(dashboardUrl)}</p>
    </div>
  `;

  recordBookingEmailEvent({
    bookingId: booking.bookingId,
    clientEmail: client.email,
    kind: "talent-booking-request",
    serviceId: undefined,
    stage: "attempt",
    talentEmail: talent.email,
  });

  try {
    const result = await sendEmail({
      html,
      idempotencyKey: `booking-request-${booking.bookingId}`,
      tags: [`booking-request:${booking.bookingId}`],
      replyTo: client.email,
      subject,
      text,
      to: talent.email,
    });

    recordBookingEmailEvent({
      bookingId: booking.bookingId,
      clientEmail: client.email,
      kind: "talent-booking-request",
      message: result.ok ? undefined : result.message,
      serviceId: undefined,
      stage: result.ok ? "success" : "failure",
      talentEmail: talent.email,
    });

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    recordBookingEmailEvent({
      bookingId: booking.bookingId,
      clientEmail: client.email,
      kind: "talent-booking-request",
      message,
      serviceId: undefined,
      stage: "failure",
      talentEmail: talent.email,
    });

    return {
      ok: false,
      message: `Booking email request threw an error: ${message}`,
    };
  }
}

export async function sendClientBookingResponseEmail({
  booking,
  client,
  service,
  talent,
}: BookingClientEmailInput) {
  const accepted = booking.status === "ACCEPTED";
  const safeClientName = escapeHtml(client.displayName);
  const safeTalentName = escapeHtml(talent.displayName);
  const safeServiceTitle = escapeHtml(service.title);
  const safeReason = booking.declineReason
    ? escapeHtml(booking.declineReason)
    : "";
  const subject = accepted
    ? `Your booking request was accepted: ${service.title}`
    : `Your booking request was declined: ${service.title}`;
  const text = accepted
    ? [
        `Hi ${client.displayName},`,
        "",
        `${talent.displayName} accepted your booking request for ${service.title}.`,
        `You can reply to this email to coordinate with ${talent.displayName}.`,
      ].join("\n")
    : [
        `Hi ${client.displayName},`,
        "",
        `${talent.displayName} declined your booking request for ${service.title}.`,
        "",
        "Reason:",
        booking.declineReason ?? "No reason provided.",
      ].join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
      <h1 style="font-size:20px;margin:0 0 12px">
        ${accepted ? "Booking accepted" : "Booking declined"}
      </h1>
      <p>Hi ${safeClientName},</p>
      <p>
        <strong>${safeTalentName}</strong>
        ${accepted ? "accepted" : "declined"} your booking request for
        <strong>${safeServiceTitle}</strong>.
      </p>
      ${
        accepted
          ? `<p>You can reply to this email to coordinate with ${safeTalentName}.</p>`
          : `<p><strong>Reason:</strong></p><p style="white-space:pre-line">${safeReason || "No reason provided."}</p>`
      }
    </div>
  `;

  return sendEmail({
    html,
    idempotencyKey: `booking-response-${booking.bookingId}-${booking.status}`,
    tags: [`booking-response:${booking.bookingId}:${booking.status}`],
    replyTo: talent.email,
    subject,
    text,
    to: client.email,
  });
}

type WorkStatusEmailInput = {
  bookingId: string;
  client: { displayName: string; email: string };
  dashboardUrl: string;
  service: { title: string };
  talent: { displayName: string; email: string };
};

export async function sendWorkInitiatedEmail({
  bookingId,
  client,
  dashboardUrl,
  service,
  talent,
}: WorkStatusEmailInput) {
  const safeClient = escapeHtml(client.displayName);
  const safeService = escapeHtml(service.title);
  const safeUrl = escapeHtml(dashboardUrl);
  const subject = `Work started: ${service.title}`;
  const text = [
    `Hi ${talent.displayName},`,
    "",
    `${client.displayName} has initiated work on your booking for "${service.title}".`,
    "You can now start working on the project.",
    "",
    `View booking: ${dashboardUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:560px">
      <h1 style="font-size:20px;margin:0 0 12px">Work started</h1>
      <p>Hi ${escapeHtml(talent.displayName)},</p>
      <p><strong>${safeClient}</strong> has initiated work on your booking for <strong>${safeService}</strong>.</p>
      <p>You can now begin working on the project.</p>
      <p style="margin-top:20px">
        <a href="${safeUrl}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#2563eb;color:#fff;text-decoration:none">
          View booking
        </a>
      </p>
    </div>
  `;

  return sendEmail({
    html,
    idempotencyKey: `work-initiated-${bookingId}`,
    tags: [`booking-work-initiated:${bookingId}`],
    replyTo: client.email,
    subject,
    text,
    to: talent.email,
  });
}

export async function sendWorkSubmittedEmail({
  bookingId,
  client,
  dashboardUrl,
  service,
  talent,
}: WorkStatusEmailInput) {
  const safeTalent = escapeHtml(talent.displayName);
  const safeService = escapeHtml(service.title);
  const safeUrl = escapeHtml(dashboardUrl);
  const subject = `Work submitted for your review: ${service.title}`;
  const text = [
    `Hi ${client.displayName},`,
    "",
    `${talent.displayName} has submitted their work for "${service.title}" and it's ready for your review.`,
    "",
    "Please log in to your dashboard to review and approve the completed work.",
    "",
    `View booking: ${dashboardUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:560px">
      <h1 style="font-size:20px;margin:0 0 12px">Work submitted for your review</h1>
      <p>Hi ${escapeHtml(client.displayName)},</p>
      <p><strong>${safeTalent}</strong> has submitted their work for <strong>${safeService}</strong> and it's ready for your review.</p>
      <p>Please log in to your dashboard to review and approve the completed work.</p>
      <p style="margin-top:20px">
        <a href="${safeUrl}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#f97316;color:#fff;text-decoration:none">
          Review & approve
        </a>
      </p>
      <p style="font-size:13px;color:#6b7280;margin-top:16px">Once you approve, the booking will be marked as completed and you'll be prompted to leave a review.</p>
    </div>
  `;

  return sendEmail({
    html,
    idempotencyKey: `work-submitted-${bookingId}`,
    tags: [`booking-work-submitted:${bookingId}`],
    replyTo: talent.email,
    subject,
    text,
    to: client.email,
  });
}

export async function sendClientBookingCancelledEmail({
  booking,
  client,
  service,
  talent,
}: BookingCancelEmailInput) {
  const safeClientName = escapeHtml(client.displayName);
  const safeTalentName = escapeHtml(talent.displayName);
  const safeServiceTitle = escapeHtml(service.title);
  const subject = `Your booking was canceled: ${service.title}`;
  const text = [
    `Hi ${talent.displayName},`,
    "",
    `${client.displayName} canceled the booking for "${service.title}".`,
    "The request is no longer active.",
    "",
    `Booking id: ${booking.bookingId}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:560px">
      <h1 style="font-size:20px;margin:0 0 12px">Booking canceled</h1>
      <p>Hi ${safeTalentName},</p>
      <p><strong>${safeClientName}</strong> canceled the booking for <strong>${safeServiceTitle}</strong>.</p>
      <p>The request is no longer active.</p>
      <p style="font-size:13px;color:#6b7280;margin-top:16px">Booking id: ${booking.bookingId}</p>
    </div>
  `;

  return sendEmail({
    html,
    idempotencyKey: `booking-cancelled-${booking.bookingId}`,
    tags: [`booking-cancelled:${booking.bookingId}`],
    replyTo: client.email,
    subject,
    text,
    to: talent.email,
  });
}
