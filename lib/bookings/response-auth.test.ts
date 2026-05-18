import assert from "node:assert/strict";
import test from "node:test";

const { canViewBookingResponse } = (await import(
  new URL("./response-auth.ts", import.meta.url).href
)) as typeof import("./response-auth");

test("allows the assigned talent to view the booking response page", () => {
  assert.equal(
    canViewBookingResponse({ id: "talent-1" }, { talentUserId: "talent-1" }),
    true,
  );
});

test("blocks signed out users from viewing the booking response page", () => {
  assert.equal(
    canViewBookingResponse(null, { talentUserId: "talent-1" }),
    false,
  );
});

test("blocks unrelated users from viewing the booking response page", () => {
  assert.equal(
    canViewBookingResponse({ id: "client-1" }, { talentUserId: "talent-1" }),
    false,
  );
});
