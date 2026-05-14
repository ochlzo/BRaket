import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("shared user avatar keeps fallback mounted with an image source", () => {
  const source = readFileSync(
    new URL("./user-avatar.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /<AvatarImage\b/);
  assert.match(source, /<AvatarFallback\b/);
  assert.ok(
    source.indexOf("<AvatarImage") < source.indexOf("<AvatarFallback"),
  );
});

test("current user avatar surfaces use the shared avatar wrapper", () => {
  const files = [
    new URL("../../components/nav-user.tsx", import.meta.url),
    new URL(
      "../../app/dashboard/client/profile/_components/client-profile-hero.tsx",
      import.meta.url,
    ),
    new URL(
      "../../app/dashboard/client/profile/_components/client-profile-image-panels.tsx",
      import.meta.url,
    ),
    new URL(
      "../../app/dashboard/profile/_components/profile-hero-card.tsx",
      import.meta.url,
    ),
    new URL("./layout/site-header.tsx", import.meta.url),
  ];

  for (const file of files) {
    const source = readFileSync(file, "utf8");

    assert.match(source, /UserAvatar/);
    assert.doesNotMatch(source, /AvatarImage/);
  }
});
