import assert from "node:assert/strict";
import test from "node:test";

const accessModule = await import(
  new URL("./dashboard-access.ts", import.meta.url).href,
);

const { canAccessDashboardRole } = accessModule;

test("allows talent dashboard access after talent onboarding finalization", () => {
  assert.equal(
    canAccessDashboardRole({
      expectedRole: "talent",
      isTalent: true,
      role: "client",
    }),
    true,
  );
});

test("allows authenticated users to access the client dashboard", () => {
  assert.equal(
    canAccessDashboardRole({
      expectedRole: "client",
      isTalent: true,
      role: "client",
    }),
    true,
  );
  assert.equal(
    canAccessDashboardRole({
      expectedRole: "client",
      isTalent: true,
      role: "talent",
    }),
    true,
  );
});

test("rejects talent dashboard access before talent onboarding finalization", () => {
  assert.equal(
    canAccessDashboardRole({
      expectedRole: "talent",
      hasTalentProfile: false,
      isTalent: false,
      role: "client",
    }),
    false,
  );
});

test("allows talent dashboard access when a talent profile already exists", () => {
  assert.equal(
    canAccessDashboardRole({
      expectedRole: "talent",
      hasTalentProfile: true,
      isTalent: false,
      role: "client",
    }),
    true,
  );
});
