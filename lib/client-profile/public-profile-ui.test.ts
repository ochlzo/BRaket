import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("public client page uses route-local public profile sections", () => {
  const source = readFileSync("app/client/[username]/page.tsx", "utf8");

  assert.match(source, /PublicClientProfileHero/);
  assert.match(source, /PublicClientProfileBody/);
});

test("public client body places portfolio left and reviews under quick stats", () => {
  const source = readFileSync(
    "app/client/[username]/_components/public-client-profile-body.tsx",
    "utf8",
  );
  const aboutIndex = source.indexOf("PublicClientAboutPanel");
  const portfolioIndex = source.indexOf("PublicClientPortfolioSection");
  const statsIndex = source.indexOf("<PublicClientQuickStats");
  const reviewsIndex = source.indexOf("<ProfileReviewsPanel");

  assert.ok(aboutIndex > -1);
  assert.ok(portfolioIndex > aboutIndex);
  assert.ok(statsIndex > -1);
  assert.ok(reviewsIndex > statsIndex);
});

test("public client portfolio has a clickable overflow gallery tile", () => {
  const source = readFileSync(
    "app/client/[username]/_components/public-client-portfolio-section.tsx",
    "utf8",
  );

  assert.match(source, /GalleryOverlayTile/);
  assert.match(source, /PortfolioGalleryDialog/);
  assert.match(source, /count=\{item\.media\.length - 2\}/);
});
