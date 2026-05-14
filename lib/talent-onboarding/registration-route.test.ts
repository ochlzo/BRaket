import assert from "node:assert/strict";
import test from "node:test";

const routeModule = await import(
  new URL("./registration-route.ts", import.meta.url).href,
);

const { getTalentOnboardingStep, getTalentRegistrationPath } = routeModule;

test("routes unverified non-talent users to verification", () => {
  assert.equal(
    getTalentRegistrationPath({
      isTalent: false,
      isVerified: false,
      profileCompletion: 0,
    }),
    "/onboarding/talent/verification",
  );
});

test("routes verified non-talent users to the next onboarding step", () => {
  assert.equal(
    getTalentRegistrationPath({
      isTalent: false,
      isVerified: true,
      profileCompletion: 1,
    }),
    "/onboarding/talent?step=2",
  );
});

test("routes unverified talent users to verification", () => {
  assert.equal(
    getTalentRegistrationPath({
      isTalent: true,
      isVerified: false,
      profileCompletion: 2,
    }),
    "/onboarding/talent/verification",
  );
});

test("routes verified talent users to the talent profile", () => {
  assert.equal(
    getTalentRegistrationPath({
      isTalent: true,
      isVerified: true,
      profileCompletion: 3,
    }),
    "/dashboard/talent/profile",
  );
});

test("normalizes profile completion into supported onboarding steps", () => {
  assert.equal(getTalentOnboardingStep(null), 1);
  assert.equal(getTalentOnboardingStep(0), 1);
  assert.equal(getTalentOnboardingStep(1), 2);
  assert.equal(getTalentOnboardingStep(2), 3);
  assert.equal(getTalentOnboardingStep(3), 3);
});

