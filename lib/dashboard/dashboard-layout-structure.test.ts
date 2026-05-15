import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

test("talent dashboard routes use the talent dashboard layout wrapper", () => {
  const files = [
    "app/dashboard/talent/page.tsx",
    "app/dashboard/talent/bookings/page.tsx",
    "app/dashboard/talent/profile/page.tsx",
    "app/dashboard/talent/services/page.tsx",
    "app/dashboard/talent/services/new/page.tsx",
  ];

  for (const file of files) {
    const source = read(file);

    assert.match(source, /TalentDashboardLayout/);
    assert.doesNotMatch(source, /role="talent"/);
    assert.doesNotMatch(source, /import\s+\{\s*DashboardLayout\s*\}/);
    assert.doesNotMatch(source, /<DashboardLayout\b/);
  }
});

test("client dashboard routes use the client dashboard layout wrapper", () => {
  const files = [
    "app/dashboard/client/page.tsx",
    "app/dashboard/client/bookings/page.tsx",
    "app/dashboard/client/profile/page.tsx",
  ];

  for (const file of files) {
    const source = read(file);

    assert.match(source, /ClientDashboardLayout/);
    assert.doesNotMatch(source, /role="client"/);
    assert.doesNotMatch(source, /import\s+\{\s*DashboardLayout\s*\}/);
    assert.doesNotMatch(source, /<DashboardLayout\b/);
  }
});
