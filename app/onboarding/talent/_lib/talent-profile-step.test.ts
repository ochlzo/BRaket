import assert from "node:assert/strict";
import test from "node:test";

const profileStepModule = await import(
  new URL("./talent-profile-step.ts", import.meta.url).href,
);

const {
  buildTalentProfileStepInitialValues,
  getTalentProfileStepDirtyFields,
  parseTalentProfileStepFormData,
  validateTalentProfileStepInput,
} = profileStepModule;

test("parses talent profile step form data with trimmed values", () => {
  const formData = new FormData();
  formData.set("headline", "  UI/UX Designer & Prototyping Specialist  ");
  formData.set("website", " portfolio.example.com ");
  formData.set("bio", "  ".padEnd(152, "A"));
  formData.set("college", "  College of Science  ");
  formData.set("course", "  BS Information Technology  ");
  formData.set("yearLevel", "3");
  formData.set(
    "skills",
    JSON.stringify([
      { name: "  Figma  ", level: "ADVANCED" },
      { name: "React", level: "INTERMEDIATE" },
      { name: "Writing", level: "BEGINNER" },
    ]),
  );

  const result = parseTalentProfileStepFormData(formData);

  assert.equal(result.headline, "UI/UX Designer & Prototyping Specialist");
  assert.equal(result.website, "https://portfolio.example.com");
  assert.equal(result.bio.length, 150);
  assert.equal(result.college, "College of Science");
  assert.equal(result.course, "BS Information Technology");
  assert.equal(result.yearLevel, "3");
  assert.deepEqual(result.skills, [
    { name: "Figma", level: "ADVANCED" },
    { name: "React", level: "INTERMEDIATE" },
    { name: "Writing", level: "BEGINNER" },
  ]);
});

test("rejects missing required talent profile fields", () => {
  const result = validateTalentProfileStepInput({
    bio: "",
    college: "",
    course: "",
    headline: "",
    skills: [
      { name: "Figma", level: "ADVANCED" },
      { name: "React", level: "INTERMEDIATE" },
      { name: "Writing", level: "BEGINNER" },
    ],
    website: "",
    yearLevel: "1",
  });

  assert.equal(result.ok, false);
  assert.equal(result.fieldErrors?.headline, "Headline is required.");
  assert.equal(result.fieldErrors?.bio, "Bio is required.");
  assert.equal(result.fieldErrors?.college, "College is required.");
  assert.equal(result.fieldErrors?.course, "Course is required.");
});

test("rejects invalid year levels", () => {
  const result = validateTalentProfileStepInput({
    bio: "A".repeat(150),
    college: "College of Science",
    course: "BS Information Technology",
    headline: "UI/UX Designer & Prototyping Specialist",
    skills: [
      { name: "Figma", level: "ADVANCED" },
      { name: "React", level: "INTERMEDIATE" },
      { name: "Writing", level: "BEGINNER" },
    ],
    website: "",
    yearLevel: "5",
  });

  assert.equal(result.ok, false);
  assert.equal(result.fieldErrors?.yearLevel, "Select a valid year level.");
});

test("rejects fewer than 3 skills", () => {
  const result = validateTalentProfileStepInput({
    bio: "A".repeat(150),
    college: "College of Science",
    course: "BS Information Technology",
    headline: "UI/UX Designer & Prototyping Specialist",
    skills: [
      { name: "Figma", level: "ADVANCED" },
      { name: "React", level: "INTERMEDIATE" },
    ],
    website: "",
    yearLevel: "3",
  });

  assert.equal(result.ok, false);
  assert.equal(result.fieldErrors?.skills, "Select at least 3 skills.");
});

test("accepts optional blank website", () => {
  const result = validateTalentProfileStepInput({
    bio: "A".repeat(150),
    college: "College of Science",
    course: "BS Information Technology",
    headline: "UI/UX Designer & Prototyping Specialist",
    skills: [
      { name: "Figma", level: "ADVANCED" },
      { name: "React", level: "INTERMEDIATE" },
      { name: "Writing", level: "BEGINNER" },
    ],
    website: "",
    yearLevel: "3",
  });

  assert.deepEqual(result, {
    message: "",
    ok: true,
  });
});

test("builds initial talent profile step values from existing profile data", () => {
  const result = buildTalentProfileStepInitialValues({
    bio: "Existing bio",
    college: "College of Science",
    course: "BS Information Technology",
    headline: "Existing headline",
    TalentSkills: [
      {
        proficiencyLevel: "ADVANCED",
        Skill: { name: "Figma" },
      },
      {
        proficiencyLevel: "INTERMEDIATE",
        Skill: { name: "React" },
      },
    ],
    website: "https://portfolio.example.com",
    year_level: 4,
  });

  assert.deepEqual(result, {
    bio: "Existing bio",
    college: "College of Science",
    course: "BS Information Technology",
    headline: "Existing headline",
    skills: [
      { name: "Figma", level: "ADVANCED" },
      { name: "React", level: "INTERMEDIATE" },
    ],
    website: "https://portfolio.example.com",
    yearLevel: "4",
  });
});

test("builds empty initial talent profile step values without a profile", () => {
  assert.deepEqual(buildTalentProfileStepInitialValues(null), {
    bio: "",
    college: "",
    course: "",
    headline: "",
    skills: [],
    website: "",
    yearLevel: "",
  });
});

test("tracks dirty talent profile fields against initial values", () => {
  const initialValues = buildTalentProfileStepInitialValues({
    bio: "A".repeat(150),
    college: "College of Science",
    course: "BS Information Technology",
    headline: "UI/UX Designer & Prototyping Specialist",
    TalentSkills: [
      { proficiencyLevel: "ADVANCED", Skill: { name: "Figma" } },
      { proficiencyLevel: "INTERMEDIATE", Skill: { name: "React" } },
      { proficiencyLevel: "BEGINNER", Skill: { name: "Writing" } },
    ],
    website: "https://portfolio.example.com",
    year_level: 3,
  });

  assert.deepEqual(
    getTalentProfileStepDirtyFields(initialValues, initialValues),
    [],
  );
  assert.deepEqual(
    getTalentProfileStepDirtyFields(initialValues, {
      ...initialValues,
      headline: "Updated UI/UX Designer & Prototyping Specialist",
      skills: [
        { name: "Figma", level: "ADVANCED" },
        { name: "React", level: "ADVANCED" },
        { name: "Writing", level: "BEGINNER" },
      ],
    }),
    ["headline", "skills"],
  );
});
