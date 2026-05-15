import assert from "node:assert/strict";
import test from "node:test";

const { getNavUserProfileMenu } = (await import(
  new URL("./nav-user-menu.ts", import.meta.url).href
)) as typeof import("./nav-user-menu");

test("shows a client profile switch on talent dashboard pages", () => {
  assert.deepEqual(getNavUserProfileMenu({ isTalent: true, role: "talent" }), {
    icon: "user",
    label: "Client Profile",
    href: "/dashboard/client",
    resolvesTalentRegistration: false,
  });
});

test("keeps the talent profile action on client dashboard pages for talents", () => {
  assert.deepEqual(getNavUserProfileMenu({ isTalent: true, role: "client" }), {
    icon: "user",
    label: "Talent Profile",
    href: null,
    resolvesTalentRegistration: true,
  });
});

test("keeps the registration action on client dashboard pages for non-talents", () => {
  assert.deepEqual(getNavUserProfileMenu({ isTalent: false, role: "client" }), {
    icon: "user-plus",
    label: "Register Talent",
    href: null,
    resolvesTalentRegistration: true,
  });
});
