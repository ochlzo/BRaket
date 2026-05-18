import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("public talent hero renders email and contact number", () => {
  const source = readFileSync(
    "app/talent/[username]/_components/public-talent-profile-hero.tsx",
    "utf8",
  );

  assert.match(source, /profile\.email/);
  assert.match(source, /profile\.contactNum/);
});

test("talent quick stats show reputation score after services offered", () => {
  const source = readFileSync(
    "app/dashboard/talent/profile/_components/talent-quick-stats.tsx",
    "utf8",
  );
  const servicesIndex = source.indexOf('label: "Services Offered"');
  const reputationIndex = source.indexOf('label: "Reputation Score"');
  const reviewsIndex = source.indexOf('label: "Total Reviews"');

  assert.ok(servicesIndex > -1);
  assert.ok(reputationIndex > servicesIndex);
  assert.ok(reviewsIndex > reputationIndex);
});
