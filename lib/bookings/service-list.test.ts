import assert from "node:assert/strict";
import test from "node:test";

const { buildTalentServiceListItem } = (await import(
  new URL("./service-list.ts", import.meta.url).href
)) as typeof import("./service-list");

test("maps service media into talent service list items", () => {
  const item = buildTalentServiceListItem({
    ServiceCategories: [
      { Category: { name: "Photography" } },
      { Category: { name: "Events" } },
    ],
    ServiceMedia: [
      {
        mediaUrl: "https://example.com/one.jpg",
        serviceDetailId: "media-1",
      },
      {
        mediaUrl: "https://example.com/two.jpg",
        serviceDetailId: "media-2",
      },
    ],
    createdAt: new Date("2026-05-01T00:00:00.000Z"),
    description: "Coverage for student events.",
    maxPrice: { toString: () => "1500" },
    minPrice: { toString: () => "1000" },
    serviceId: "service-1",
    title: "Event Coverage",
  });

  assert.deepEqual(item.media, [
    { id: "media-1", url: "https://example.com/one.jpg" },
    { id: "media-2", url: "https://example.com/two.jpg" },
  ]);
});
