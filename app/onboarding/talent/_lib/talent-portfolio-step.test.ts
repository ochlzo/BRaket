import assert from "node:assert/strict";
import test from "node:test";

const portfolioStepModule = await import(
  new URL("./talent-portfolio-step.ts", import.meta.url).href,
);

const {
  buildTalentPortfolioStepInitialValues,
  parseTalentPortfolioStepFormData,
  validateTalentPortfolioStepInput,
} = portfolioStepModule;

function createImageFile(name: string, type: string, size: number) {
  return new File([new Uint8Array(size)], name, { type });
}

test("parses talent portfolio form data with multiple images", () => {
  const formData = new FormData();
  const files = [
    createImageFile("one.png", "image/png", 2 * 1024 * 1024),
    createImageFile("two.webp", "image/webp", 3 * 1024 * 1024),
  ];

  formData.set("title", "  Campus branding kit  ");
  formData.set("description", "  Visual identity and launch assets.  ");
  files.forEach((file) => formData.append("media", file));

  const result = parseTalentPortfolioStepFormData(formData);

  assert.equal(result.title, "Campus branding kit");
  assert.equal(result.description, "Visual identity and launch assets.");
  assert.deepEqual(result.files, files);
});

test("builds initial portfolio step values from existing portfolio data", () => {
  const result = buildTalentPortfolioStepInitialValues({
    description: "Visual identity and launch assets.",
    talent_portfolio_id: "portfolio-1",
    TalentPortfolioMedia: [
      { media_url: "https://example.com/one.png" },
      { media_url: "https://example.com/two.png" },
    ],
    title: "Campus branding kit",
  });

  assert.deepEqual(result, {
    description: "Visual identity and launch assets.",
    existingMediaUrls: [
      "https://example.com/one.png",
      "https://example.com/two.png",
    ],
    portfolioId: "portfolio-1",
    title: "Campus branding kit",
  });
});

test("builds empty portfolio step values without existing data", () => {
  const result = buildTalentPortfolioStepInitialValues(null);

  assert.deepEqual(result, {
    description: "",
    existingMediaUrls: [],
    portfolioId: "",
    title: "",
  });
});

test("accepts images larger than 1 MB up to the configured image limit", () => {
  const result = validateTalentPortfolioStepInput({
    description: "Visual identity and launch assets.",
    files: [createImageFile("large.png", "image/png", 4 * 1024 * 1024)],
    title: "Campus branding kit",
  });

  assert.equal(result.ok, true);
});

test("accepts existing media without requiring new files", () => {
  const result = validateTalentPortfolioStepInput({
    description: "Visual identity and launch assets.",
    existingMediaCount: 2,
    files: [],
    title: "Campus branding kit",
  });

  assert.equal(result.ok, true);
});

test("rejects missing required talent portfolio fields", () => {
  const result = validateTalentPortfolioStepInput({
    description: "",
    files: [createImageFile("one.png", "image/png", 1024)],
    title: "",
  });

  assert.equal(result.ok, false);
  assert.equal(result.fieldErrors?.title, "Portfolio title is required.");
  assert.equal(result.fieldErrors?.description, "Description is required.");
});

test("rejects missing, unsupported, oversized, and too many images", () => {
  assert.equal(
    validateTalentPortfolioStepInput({
      description: "Visual identity and launch assets.",
      files: [],
      title: "Campus branding kit",
    }).fieldErrors?.media,
    "Add at least one portfolio image.",
  );

  assert.equal(
    validateTalentPortfolioStepInput({
      description: "Visual identity and launch assets.",
      files: [createImageFile("notes.txt", "text/plain", 1024)],
      title: "Campus branding kit",
    }).fieldErrors?.media,
    "Only JPG, PNG, and WebP images are supported.",
  );

  assert.equal(
    validateTalentPortfolioStepInput({
      description: "Visual identity and launch assets.",
      files: [createImageFile("huge.png", "image/png", 6 * 1024 * 1024)],
      title: "Campus branding kit",
    }).fieldErrors?.media,
    "Keep each image under 5 MB.",
  );

  assert.equal(
    validateTalentPortfolioStepInput({
      description: "Visual identity and launch assets.",
      files: Array.from({ length: 11 }, (_, index) =>
        createImageFile(`${index}.png`, "image/png", 1024),
      ),
      title: "Campus branding kit",
    }).fieldErrors?.media,
    "You can upload at most 10 images per portfolio.",
  );
});
