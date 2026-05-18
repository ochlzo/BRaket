import "server-only";

import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/server/email/brevo";
import { isBuEmail, normalizeBuEmail } from "@/server/talent-verification/rules";

const OTP_TTL_MINUTES = 10;

type OtpResult = { message: string; ok: boolean };
type CreatedOtpRow = { otp_id: string };
type PendingOtpRow = { code_hash: string; otp_id: string };

function createOtpCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function hashOtpCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function normalizeOtpCode(code: string) {
  return code.trim().replace(/\s+/g, "");
}

export async function sendTalentVerificationEmailOtp({
  buEmail,
  userId,
}: {
  buEmail: string;
  userId: string;
}): Promise<OtpResult> {
  const normalizedBuEmail = normalizeBuEmail(buEmail);

  if (!isBuEmail(normalizedBuEmail)) {
    return { message: "Use your @bicol-u.edu.ph email.", ok: false };
  }

  const code = createOtpCode();
  const otpId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  const [otp] = await prisma.$queryRaw<CreatedOtpRow[]>`
    INSERT INTO "talent_verification_email_otps" (
      "otp_id",
      "user_id",
      "bu_email",
      "code_hash",
      "expires_at",
      "updated_at"
    )
    VALUES (
      ${otpId},
      ${userId},
      ${normalizedBuEmail},
      ${hashOtpCode(code)},
      ${expiresAt},
      CURRENT_TIMESTAMP
    )
    RETURNING "otp_id"
  `;

  const email = await sendEmail({
    html: `<p>Your BRaket talent verification code is <strong>${code}</strong>.</p><p>This code expires in ${OTP_TTL_MINUTES} minutes.</p>`,
    idempotencyKey: `talent-verification-otp-${otp.otp_id}`,
    subject: "Your BRaket BU verification code",
    text: `Your BRaket talent verification code is ${code}. This code expires in ${OTP_TTL_MINUTES} minutes.`,
    to: normalizedBuEmail,
  });

  if (!email.ok) {
    await prisma.$executeRaw`
      DELETE FROM "talent_verification_email_otps"
      WHERE "otp_id" = ${otp.otp_id}
    `;

    return {
      message: email.message,
      ok: false,
    };
  }

  return {
    message: `We sent a verification code to ${normalizedBuEmail}.`,
    ok: true,
  };
}

export async function verifyTalentVerificationEmailOtp({
  buEmail,
  code,
  userId,
}: {
  buEmail: string;
  code: string;
  userId: string;
}): Promise<OtpResult> {
  const normalizedBuEmail = normalizeBuEmail(buEmail);
  const normalizedCode = normalizeOtpCode(code);

  if (!/^\d{6}$/.test(normalizedCode)) {
    return { message: "Enter the 6-digit code sent to your BU email.", ok: false };
  }

  const [otp] = await prisma.$queryRaw<PendingOtpRow[]>`
    SELECT "otp_id", "code_hash"
    FROM "talent_verification_email_otps"
    WHERE "user_id" = ${userId}
      AND "bu_email" = ${normalizedBuEmail}
      AND "consumed_at" IS NULL
      AND "expires_at" > CURRENT_TIMESTAMP
    ORDER BY "created_at" DESC
    LIMIT 1
  `;

  if (!otp || otp.code_hash !== hashOtpCode(normalizedCode)) {
    return { message: "That verification code is invalid or expired.", ok: false };
  }

  await prisma.$executeRaw`
    UPDATE "talent_verification_email_otps"
    SET "consumed_at" = CURRENT_TIMESTAMP,
        "updated_at" = CURRENT_TIMESTAMP
    WHERE "otp_id" = ${otp.otp_id}
  `;

  return { message: "", ok: true };
}
