import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

type SignatureParts = {
  li: string;
  t: string;
  te: string;
};

function parsePaymongoSignature(signatureHeader: string): SignatureParts | null {
  const entries = signatureHeader.split(",").map((part) => part.trim());
  const parts = Object.fromEntries(
    entries.map((entry) => {
      const [key, value = ""] = entry.split("=");

      return [key, value];
    }),
  );

  if (!parts.t) {
    return null;
  }

  return {
    li: parts.li ?? "",
    t: parts.t,
    te: parts.te ?? "",
  };
}

function safeCompareHex(left: string, right: string) {
  if (!left || !right) {
    return false;
  }

  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyPaymongoWebhookSignature({
  payload,
  signatureHeader,
}: {
  payload: string;
  signatureHeader: string | null;
}) {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET?.trim();

  if (!secret || !signatureHeader) {
    return false;
  }

  const signature = parsePaymongoSignature(signatureHeader);

  if (!signature) {
    return false;
  }

  const timestamp = Number(signature.t);
  const tenMinutes = 10 * 60;

  if (
    !Number.isFinite(timestamp) ||
    Math.abs(Date.now() / 1000 - timestamp) > tenMinutes
  ) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(`${signature.t}.${payload}`)
    .digest("hex");

  return (
    safeCompareHex(expected, signature.te) ||
    safeCompareHex(expected, signature.li)
  );
}
