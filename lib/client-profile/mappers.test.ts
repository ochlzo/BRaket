import assert from "node:assert/strict";
import test from "node:test";

const mappersModule = await import(
  new URL("./mappers.ts", import.meta.url).href,
);

const { mapClientProfilePageData } = mappersModule;

test("maps client profile records into a page model", () => {
  const result = mapClientProfilePageData({
    user: {
      address: "Legazpi City",
      authId: "auth-1",
      avatarUrl: "https://example.com/avatar.jpg",
      backgroundimg_img_url: "linear-gradient(120deg, #ff6b35 0%, #4fc3f7 100%)",
      contactNum: "639174821945",
      createdAt: new Date("2026-05-01T00:00:00.000Z"),
      email: "client@example.com",
      facebook_url: "braket.client",
      firstName: "John",
      github_url: "braket-client",
      instagram_url: "@braketclient",
      lastName: "Candelaria",
      linkedin_url: "braket-client-studio",
      initials: "JC",
      userId: "user-1",
      username: "jbbc2023",
      x_url: "@braketclient",
    },
    clientProfile: {
      about: "We build campus-friendly projects.",
      business_address: "Bicol University",
      client_avg_rating: 4.8,
      client_profile_id: "profile-1",
      client_reputation_score: 92,
      client_review_count: 18,
      completed_commissions_count: 12,
      createdAt: new Date("2026-05-02T00:00:00.000Z"),
      organization_name: "BRaket Creative Studio",
      updatedAt: new Date("2026-05-10T00:00:00.000Z"),
      website: "braket.example",
      ClientPortfolio: [
        {
          ClientPortfolioMedia: [
            { cportfolio_media_id: "m1", media_url: "https://example.com/1.jpg" },
            { cportfolio_media_id: "m2", media_url: "https://example.com/2.jpg" },
          ],
          client_portfolio_id: "post-1",
          createdAt: new Date("2026-05-03T00:00:00.000Z"),
          desciption: "A launch brief.",
          title: "Launch Campaign",
          updatedAt: new Date("2026-05-04T00:00:00.000Z"),
        },
      ],
    },
  });

  assert.equal(result.displayName, "John Candelaria");
  assert.equal(result.organizationName, "BRaket Creative Studio");
  assert.equal(result.backgroundImageUrl, "linear-gradient(120deg, #ff6b35 0%, #4fc3f7 100%)");
  assert.equal(result.businessAddress, "Bicol University");
  assert.equal(result.joinedLabel, "Joined May 2026");
  assert.equal(result.website, "https://braket.example");
  assert.equal(result.socialLinks[0].href, "https://www.facebook.com/braket.client");
  assert.equal(result.portfolio[0].description, "A launch brief.");
  assert.equal(result.portfolio[0].media.length, 2);
});
