import assert from "node:assert/strict";
import test from "node:test";

const finalizationModule = await import(
  new URL("./talent-finalization.ts", import.meta.url).href,
);

const { validateTalentOnboardingFinalization } = finalizationModule;

const validProfile = {
  bio: "I create polished visual identity systems, social media campaigns, and event materials for student organizations and small teams that need clear, practical design support.",
  college: "College of Science",
  course: "BS Information Technology",
  headline: "Brand designer and frontend builder for student teams",
  TalentSkills: [
    { proficiencyLevel: "ADVANCED", Skill: { name: "Brand Design" } },
    { proficiencyLevel: "INTERMEDIATE", Skill: { name: "React" } },
    { proficiencyLevel: "INTERMEDIATE", Skill: { name: "Copywriting" } },
  ],
  website: null,
  year_level: 3,
};

test("allows talent onboarding finalization after step 1 without portfolio or service data", () => {
  const result = validateTalentOnboardingFinalization(validProfile);

  assert.equal(result.ok, true);
});

test("rejects talent onboarding finalization without a completed step 1 profile", () => {
  const result = validateTalentOnboardingFinalization(null);

  assert.equal(result.ok, false);
  assert.equal(result.message, "Complete step 1 before finalizing onboarding.");
});

test("rejects talent onboarding finalization with incomplete step 1 fields", () => {
  const result = validateTalentOnboardingFinalization({
    ...validProfile,
    bio: "Too short.",
  });

  assert.equal(result.ok, false);
  assert.equal(result.message, "Complete step 1 before finalizing onboarding.");
});
