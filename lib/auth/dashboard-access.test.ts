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

test("keeps client dashboard access role-based", () => {
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
    false,
  );
});

test("rejects talent dashboard access before talent onboarding finalization", () => {
  assert.equal(
    canAccessDashboardRole({
      expectedRole: "talent",
      isTalent: false,
      role: "client",
    }),
    false,
  );
});
