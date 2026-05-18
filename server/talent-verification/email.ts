import "server-only";

import { sendEmail } from "@/server/email/brevo";

type VerificationApprovalEmailInput = {
  dashboardUrl: string;
  talent: {
    displayName: string;
    email: string;
  };
};

type VerificationRejectionEmailInput = {
  rejectionReason: string;
  talent: {
    displayName: string;
    email: string;
  };
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendVerificationApprovalEmail({
  dashboardUrl,
  talent,
}: VerificationApprovalEmailInput) {
  const safeName = escapeHtml(talent.displayName);
  const safeUrl = escapeHtml(dashboardUrl);
  const subject = "You're verified on BRaket 🎉";
  const text = [
    `Hi ${talent.displayName},`,
    "",
    "Great news — your BU student verification has been approved!",
    "",
    "Your talent profile is now visible to clients, and your services can be booked on BRaket.",
    "",
    `Head to your dashboard to review your profile and services: ${dashboardUrl}`,
    "",
    "Welcome to BRaket.",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:560px">
      <h1 style="font-size:22px;margin:0 0 12px;color:#16a34a">You're verified on BRaket 🎉</h1>
      <p>Hi ${safeName},</p>
      <p>Great news — your BU student verification has been <strong>approved</strong>!</p>
      <p>Your talent profile is now visible to clients, and your services can be booked on BRaket.</p>
      <p style="margin-top:24px">
        <a
          href="${safeUrl}"
          style="display:inline-block;padding:10px 18px;border-radius:10px;background:#f97316;color:#ffffff;text-decoration:none;font-weight:bold"
        >
          Go to your dashboard
        </a>
      </p>
      <p style="font-size:13px;color:#6b7280;margin-top:24px">Welcome to BRaket.</p>
    </div>
  `;

  return sendEmail({
    html,
    idempotencyKey: `verification-approved-${talent.email}`,
    subject,
    text,
    to: talent.email,
  });
}

export async function sendVerificationRejectionEmail({
  rejectionReason,
  talent,
}: VerificationRejectionEmailInput) {
  const safeName = escapeHtml(talent.displayName);
  const safeReason = escapeHtml(rejectionReason || "No reason provided.");
  const subject = "BRaket verification update";
  const text = [
    `Hi ${talent.displayName},`,
    "",
    "Your BU student verification request was reviewed and could not be approved at this time.",
    "",
    "Reason:",
    rejectionReason || "No reason provided.",
    "",
    "You may submit a new request with updated information at any time.",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:560px">
      <h1 style="font-size:22px;margin:0 0 12px">BRaket verification update</h1>
      <p>Hi ${safeName},</p>
      <p>Your BU student verification request was reviewed and could not be approved at this time.</p>
      <p><strong>Reason:</strong></p>
      <p style="white-space:pre-line;background:#fef2f2;border-left:3px solid #ef4444;padding:10px 14px;border-radius:6px">
        ${safeReason}
      </p>
      <p>You may submit a new request with updated information at any time.</p>
    </div>
  `;

  return sendEmail({
    html,
    idempotencyKey: `verification-rejected-${talent.email}`,
    subject,
    text,
    to: talent.email,
  });
}
