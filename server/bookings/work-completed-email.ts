import "server-only";

import { sendEmail } from "@/server/email/brevo";

type WorkCompletedEmailInput = {
  bookingId: string;
  client: { displayName: string; email: string };
  dashboardUrl: string;
  service: { title: string };
  talent: { displayName: string; email: string };
};

export async function sendWorkCompletedEmail({
  bookingId,
  client,
  dashboardUrl,
  service,
  talent,
}: WorkCompletedEmailInput) {
  const subject = `Booking completed: ${service.title}`;
  const text = [
    `Hi ${talent.displayName},`,
    "",
    `${client.displayName} marked the booking for "${service.title}" as completed.`,
    "You can review the finished request and archive it from your dashboard.",
    "",
    `View booking: ${dashboardUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:560px">
      <h1 style="font-size:20px;margin:0 0 12px">Booking completed</h1>
      <p>Hi ${talent.displayName},</p>
      <p><strong>${client.displayName}</strong> marked the booking for <strong>${service.title}</strong> as completed.</p>
      <p>You can review the finished request and archive it from your dashboard.</p>
      <p style="margin-top:20px">
        <a href="${dashboardUrl}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#16a34a;color:#fff;text-decoration:none">
          View booking
        </a>
      </p>
    </div>
  `;

  return sendEmail({
    html,
    idempotencyKey: `work-completed-${bookingId}`,
    tags: [`booking-work-completed:${bookingId}`],
    replyTo: client.email,
    subject,
    text,
    to: talent.email,
  });
}

