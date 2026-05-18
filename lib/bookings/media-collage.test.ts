import assert from "node:assert/strict";
import test from "node:test";

const { getServiceMediaCollageLayout } = (await import(
  new URL("./media-collage.ts", import.meta.url).href
)) as typeof import("./media-collage");

test("shows first two images plus remaining count for larger service galleries", () => {
  assert.deepEqual(getServiceMediaCollageLayout(6), {
    hiddenCount: 4,
    visibleImageCount: 2,
  });
});

test("shows all images directly for smaller service galleries", () => {
  assert.deepEqual(getServiceMediaCollageLayout(4), {
    hiddenCount: 0,
    visibleImageCount: 4,
  });
});
