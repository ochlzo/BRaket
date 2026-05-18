import assert from "node:assert/strict";
import test from "node:test";

const routeModule = await import(
  new URL("./registration-route.ts", import.meta.url).href,
);

const {
  getAllowedTalentOnboardingStep,
  getTalentRegistrationPath,
  getTalentVerificationMaybeLaterPath,
  shouldForceTalentVerification,
} = routeModule;

test("routes unverified non-talent users to verification", () => {
  assert.equal(
    getTalentRegistrationPath({
      isTalent: false,
      isVerified: false,
    }),
    "/onboarding/talent/verification",
  );
});

test("routes pending non-talent applicants to talent profile setup", () => {
  assert.equal(
    getTalentRegistrationPath({
      isTalent: false,
      isVerified: false,
      verificationStatus: "pending",
    }),
    "/onboarding/talent?step=1",
  );
});

test("routes verified non-talent users to the next onboarding step", () => {
  assert.equal(
    getTalentRegistrationPath({
      isTalent: false,
      isVerified: true,
    }),
    "/onboarding/talent?step=1",
  );
});

test("routes unverified talent users to verification", () => {
  assert.equal(
    getTalentRegistrationPath({
      isTalent: true,
      isVerified: false,
    }),
    "/onboarding/talent/verification",
  );
});

test("routes verified talent users to the talent profile", () => {
  assert.equal(
    getTalentRegistrationPath({
      isTalent: true,
      isVerified: true,
    }),
    "/dashboard/talent/profile",
  );
});

test("allows supported onboarding steps", () => {
  assert.equal(getAllowedTalentOnboardingStep("1"), 1);
  assert.equal(getAllowedTalentOnboardingStep("2"), 2);
  assert.equal(getAllowedTalentOnboardingStep("3"), 3);
});

test("uses the first onboarding step for missing or invalid steps", () => {
  assert.equal(getAllowedTalentOnboardingStep(undefined), 1);
  assert.equal(getAllowedTalentOnboardingStep("nope"), 1);
  assert.equal(getAllowedTalentOnboardingStep("4"), 1);
});

test("does not force verification on onboarding pages for unverified non-talent users", () => {
  assert.equal(
    shouldForceTalentVerification({
      isTalent: false,
      isVerified: false,
    }),
    false,
  );
});

test("forces verification on onboarding pages for unverified talent users", () => {
  assert.equal(
    shouldForceTalentVerification({
      isTalent: true,
      isVerified: false,
    }),
    true,
  );
});

test("sends users to the main app when skipping verification outside dashboard", () => {
  assert.equal(getTalentVerificationMaybeLaterPath(true), "/browse");
  assert.equal(getTalentVerificationMaybeLaterPath(false), "/browse");
});

test("sends existing talents to the talent dashboard from dashboard source", () => {
  assert.equal(
    getTalentVerificationMaybeLaterPath(true, "dashboard"),
    "/dashboard/talent",
  );
});

test("sends non-talents back to talent onboarding from dashboard source", () => {
  assert.equal(
    getTalentVerificationMaybeLaterPath(false, "dashboard"),
    "/onboarding/talent?step=1",
  );
});
