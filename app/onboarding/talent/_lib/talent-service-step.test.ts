import assert from "node:assert/strict";
import test from "node:test";

const serviceStepModule = await import(
  new URL("./talent-service-step.ts", import.meta.url).href,
);
const serviceCategoriesModule = await import(
  new URL("./talent-service-categories.ts", import.meta.url).href,
);

const {
  buildTalentServiceStepInitialValues,
  getTalentServiceStepDirtyFields,
  parseTalentServiceStepFormData,
  validateTalentServiceStepInput,
} = serviceStepModule;
const { validateTalentServiceCategorySelection } = serviceCategoriesModule;

function createImageFile(name: string, type: string, size: number) {
  return new File([new Uint8Array(size)], name, { type });
}

test("parses talent service form data with categories, prices, unit, and files", () => {
  const formData = new FormData();
  const files = [
    createImageFile("one.png", "image/png", 2 * 1024 * 1024),
    createImageFile("two.webp", "image/webp", 3 * 1024 * 1024),
  ];

  formData.set("serviceId", " service-1 ");
  formData.set("title", "  Event poster design  ");
  formData.set("description", "  Poster package with source files.  ");
  formData.set("categoryIds", JSON.stringify(["category-1", "category-2"]));
  formData.set("minPrice", " 500 ");
  formData.set("maxPrice", " 1500 ");
  formData.set("priceUnit", "PER_PROJECT");
  files.forEach((file) => formData.append("serviceMedia", file));

  const result = parseTalentServiceStepFormData(formData);

  assert.equal(result.serviceId, "service-1");
  assert.equal(result.title, "Event poster design");
  assert.equal(result.description, "Poster package with source files.");
  assert.deepEqual(result.categoryIds, ["category-1", "category-2"]);
  assert.equal(result.minPrice, "500");
  assert.equal(result.maxPrice, "1500");
  assert.equal(result.priceUnit, "PER_PROJECT");
  assert.deepEqual(result.files, files);
});

test("ignores empty native file input entries when no service media is selected", () => {
  const formData = new FormData();

  formData.append("serviceMedia", new File([], "", { type: "application/octet-stream" }));

  const result = parseTalentServiceStepFormData(formData);

  assert.deepEqual(result.files, []);
});

test("rejects missing required talent service fields", () => {
  const result = validateTalentServiceStepInput({
    categoryIds: ["category-1"],
    description: "",
    files: [],
    maxPrice: "",
    minPrice: "",
    priceUnit: "",
    title: "",
  });

  assert.equal(result.ok, false);
  assert.equal(result.fieldErrors?.title, "Service title is required.");
  assert.equal(result.fieldErrors?.description, "Description is required.");
  assert.equal(result.fieldErrors?.minPrice, "Minimum price is required.");
  assert.equal(result.fieldErrors?.maxPrice, "Maximum price is required.");
  assert.equal(result.fieldErrors?.priceUnit, "Select a price unit.");
});

test("rejects no selected categories", () => {
  const result = validateTalentServiceStepInput({
    categoryIds: [],
    description: "Poster package with source files.",
    files: [],
    maxPrice: "1500",
    minPrice: "500",
    priceUnit: "PER_PROJECT",
    title: "Event poster design",
  });

  assert.equal(result.ok, false);
  assert.equal(result.fieldErrors?.categories, "Select at least 1 category.");
});

test("rejects more than three selected categories", () => {
  const result = validateTalentServiceStepInput({
    categoryIds: ["category-1", "category-2", "category-3", "category-4"],
    description: "Poster package with source files.",
    files: [],
    maxPrice: "1500",
    minPrice: "500",
    priceUnit: "PER_PROJECT",
    title: "Event poster design",
  });

  assert.equal(result.ok, false);
  assert.equal(result.fieldErrors?.categories, "Select up to 3 categories.");
});

test("rejects category values that are not existing category ids", () => {
  const result = validateTalentServiceCategorySelection(
    {
      categoryIds: ["category-1", "free form category"],
      description: "Poster package with source files.",
      files: [],
      maxPrice: "1500",
      minPrice: "500",
      priceUnit: "PER_PROJECT",
      title: "Event poster design",
    },
    ["category-1", "category-2"],
  );

  assert.equal(result.ok, false);
  assert.equal(
    result.fieldErrors?.categories,
    "Select a category from the available options.",
  );
});

test("rejects invalid service price ranges", () => {
  const result = validateTalentServiceStepInput({
    categoryIds: ["category-1"],
    description: "Poster package with source files.",
    files: [],
    maxPrice: "500",
    minPrice: "500",
    priceUnit: "PER_PROJECT",
    title: "Event poster design",
  });

  assert.equal(result.ok, false);
  assert.equal(result.fieldErrors?.priceRange, "Min price must be less than max price.");
});

test("rejects unsupported service image types", () => {
  const result = validateTalentServiceStepInput({
    categoryIds: ["category-1"],
    description: "Poster package with source files.",
    files: [createImageFile("notes.txt", "text/plain", 1024)],
    maxPrice: "1500",
    minPrice: "500",
    priceUnit: "PER_PROJECT",
    title: "Event poster design",
  });

  assert.equal(result.ok, false);
  assert.equal(result.fieldErrors?.media, "Only JPG, PNG, and WebP images are supported.");
});

test("accepts service images larger than 1 MB up to the configured image limit", () => {
  const result = validateTalentServiceStepInput({
    categoryIds: ["category-1"],
    description: "Poster package with source files.",
    files: [createImageFile("large.png", "image/png", 4 * 1024 * 1024)],
    maxPrice: "1500",
    minPrice: "500",
    priceUnit: "PER_PROJECT",
    title: "Event poster design",
  });

  assert.equal(result.ok, true);
});

test("builds empty service step values without existing data", () => {
  const result = buildTalentServiceStepInitialValues(null);

  assert.deepEqual(result, {
    categoryIds: [],
    description: "",
    existingMediaUrls: [],
    maxPrice: "",
    minPrice: "",
    priceUnit: "",
    serviceId: "",
    title: "",
  });
});

test("builds service step prefill values from existing service data", () => {
  const result = buildTalentServiceStepInitialValues({
    ServiceCategories: [
      { categoryId: "category-1" },
      { categoryId: "category-2" },
    ],
    ServiceMedia: [
      { mediaUrl: "https://example.com/one.png" },
      { mediaUrl: "https://example.com/two.png" },
    ],
    description: "Poster package with source files.",
    maxPrice: { toString: () => "1500.00" },
    minPrice: { toString: () => "500.00" },
    priceUnit: "PER_PROJECT",
    serviceId: "service-1",
    title: "Event poster design",
  });

  assert.deepEqual(result, {
    categoryIds: ["category-1", "category-2"],
    description: "Poster package with source files.",
    existingMediaUrls: [
      "https://example.com/one.png",
      "https://example.com/two.png",
    ],
    maxPrice: "1500.00",
    minPrice: "500.00",
    priceUnit: "PER_PROJECT",
    serviceId: "service-1",
    title: "Event poster design",
  });
});

test("tracks dirty talent service fields against initial values", () => {
  const initialValues = buildTalentServiceStepInitialValues({
    ServiceCategories: [
      { categoryId: "category-1" },
      { categoryId: "category-2" },
    ],
    ServiceMedia: [{ mediaUrl: "https://example.com/one.png" }],
    description: "Poster package with source files.",
    maxPrice: { toString: () => "1500" },
    minPrice: { toString: () => "500" },
    priceUnit: "PER_PROJECT",
    serviceId: "service-1",
    title: "Event poster design",
  });
  const file = createImageFile("new.png", "image/png", 1024);

  assert.deepEqual(
    getTalentServiceStepDirtyFields(initialValues, {
      categoryIds: ["category-2", "category-1"],
      description: initialValues.description,
      files: [],
      maxPrice: initialValues.maxPrice,
      minPrice: initialValues.minPrice,
      priceUnit: initialValues.priceUnit,
      title: initialValues.title,
    }),
    [],
  );
  assert.deepEqual(
    getTalentServiceStepDirtyFields(initialValues, {
      categoryIds: initialValues.categoryIds,
      description: initialValues.description,
      files: [file],
      maxPrice: "1800",
      minPrice: initialValues.minPrice,
      priceUnit: initialValues.priceUnit,
      title: "Updated event poster design",
    }),
    ["title", "maxPrice", "media"],
  );
});
