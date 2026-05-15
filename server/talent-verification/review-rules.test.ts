import assert from "node:assert/strict";
import test from "node:test";
import { TalentVerificationStatus } from "@prisma/client";

const reviewRulesModule = await import(
  new URL("./review-rules.ts", import.meta.url).href
);

const {
  assertPendingVerificationRequest,
  buildApprovalReviewData,
  buildRejectionReviewData,
} = reviewRulesModule;

test("rejects review attempts for non-pending requests", () => {
  assert.throws(() => assertPendingVerificationRequest(null));
  assert.throws(() =>
    assertPendingVerificationRequest({
      status: TalentVerificationStatus.APPROVED,
    }),
  );
});

test("builds approval review data", () => {
  const reviewedAt = new Date("2026-05-15T00:00:00.000Z");

  assert.deepEqual(buildApprovalReviewData("admin@example.com", reviewedAt), {
    rejectionReason: null,
    reviewedAt,
    reviewedByEmail: "admin@example.com",
    status: TalentVerificationStatus.APPROVED,
  });
});

test("builds rejection review data with trimmed optional reason", () => {
  const reviewedAt = new Date("2026-05-15T00:00:00.000Z");

  assert.deepEqual(
    buildRejectionReviewData("admin@example.com", "  blurry ID  ", reviewedAt),
    {
      rejectionReason: "blurry ID",
      reviewedAt,
      reviewedByEmail: "admin@example.com",
      status: TalentVerificationStatus.REJECTED,
    },
  );
});
