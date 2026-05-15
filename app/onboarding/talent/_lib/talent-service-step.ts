export const TALENT_SERVICE_MEDIA_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const TALENT_SERVICE_MEDIA_MAX_IMAGES = 10;
export const TALENT_SERVICE_MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export const TALENT_SERVICE_PRICE_UNITS = [
  "FIXED",
  "HOURLY",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "PER_PROJECT",
  "PER_TASK",
  "PER_SESSION",
] as const;

export type TalentServicePriceUnit = (typeof TALENT_SERVICE_PRICE_UNITS)[number];

export type TalentServiceStepInput = {
  categoryIds: string[];
  description: string;
  existingMediaCount?: number;
  files: File[];
  maxPrice: string;
  minPrice: string;
  priceUnit: string;
  serviceId?: string;
  title: string;
};

export type TalentServiceStepInitialValues = {
  categoryIds: string[];
  description: string;
  existingMediaUrls: string[];
  maxPrice: string;
  minPrice: string;
  priceUnit: string;
  serviceId: string;
  title: string;
};

export type TalentServiceStepState = {
  fieldErrors?: {
    categories?: string;
    description?: string;
    maxPrice?: string;
    media?: string;
    minPrice?: string;
    priceRange?: string;
    priceUnit?: string;
    title?: string;
  };
  message: string;
  ok: boolean;
  successToken?: string;
};

export type TalentServiceStepDirtyField =
  | "categoryIds"
  | "description"
  | "maxPrice"
  | "media"
  | "minPrice"
  | "priceUnit"
  | "title";

type TalentServiceStepSource = {
  description: string;
  maxPrice: { toString: () => string };
  minPrice: { toString: () => string };
  priceUnit: string;
  ServiceCategories: { categoryId: string }[];
  ServiceMedia: { mediaUrl: string }[];
  serviceId: string;
  title: string;
} | null;

const EMPTY_INITIAL_VALUES: TalentServiceStepInitialValues = {
  categoryIds: [],
  description: "",
  existingMediaUrls: [],
  maxPrice: "",
  minPrice: "",
  priceUnit: "",
  serviceId: "",
  title: "",
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function parseCategoryIds(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((categoryId) =>
        typeof categoryId === "string" ? categoryId.trim() : "",
      )
      .filter(Boolean);
  } catch {
    return [];
  }
}

function areStringSetsEqual(first: string[], second: string[]) {
  const normalizedFirst = [...first].sort();
  const normalizedSecond = [...second].sort();

  return JSON.stringify(normalizedFirst) === JSON.stringify(normalizedSecond);
}

export function parseTalentServiceStepFormData(
  formData: FormData,
): TalentServiceStepInput {
  const files = formData
    .getAll("serviceMedia")
    .filter(
      (entry): entry is File => entry instanceof File && entry.size > 0,
    );

  return {
    categoryIds: parseCategoryIds(formData.get("categoryIds")),
    description: readText(formData, "description"),
    files,
    maxPrice: readText(formData, "maxPrice"),
    minPrice: readText(formData, "minPrice"),
    priceUnit: readText(formData, "priceUnit"),
    serviceId: readText(formData, "serviceId"),
    title: readText(formData, "title"),
  };
}

export function buildTalentServiceStepInitialValues(
  service: TalentServiceStepSource,
): TalentServiceStepInitialValues {
  if (!service) {
    return EMPTY_INITIAL_VALUES;
  }

  return {
    categoryIds: service.ServiceCategories.map(
      (category) => category.categoryId,
    ),
    description: service.description,
    existingMediaUrls: service.ServiceMedia.map((media) => media.mediaUrl),
    maxPrice: service.maxPrice.toString(),
    minPrice: service.minPrice.toString(),
    priceUnit: service.priceUnit,
    serviceId: service.serviceId,
    title: service.title,
  };
}

export function getTalentServiceStepDirtyFields(
  initialValues: TalentServiceStepInitialValues,
  input: Omit<TalentServiceStepInput, "existingMediaCount" | "serviceId">,
): TalentServiceStepDirtyField[] {
  const dirtyFields: TalentServiceStepDirtyField[] = [];

  for (const field of [
    "title",
    "description",
    "minPrice",
    "maxPrice",
    "priceUnit",
  ] as const) {
    if (initialValues[field] !== input[field]) {
      dirtyFields.push(field);
    }
  }

  if (!areStringSetsEqual(initialValues.categoryIds, input.categoryIds)) {
    dirtyFields.push("categoryIds");
  }

  if (input.files.length > 0) {
    dirtyFields.push("media");
  }

  return dirtyFields;
}

export function getTalentServicePriceRangeError(
  minPrice: string,
  maxPrice: string,
) {
  if (!minPrice || !maxPrice) {
    return "";
  }

  return Number(minPrice) >= Number(maxPrice)
    ? "Min price must be less than max price."
    : "";
}

export function isTalentServiceMediaType(type: string) {
  return TALENT_SERVICE_MEDIA_ACCEPTED_TYPES.includes(type);
}

export function isTalentServiceMediaSize(size: number) {
  return size <= TALENT_SERVICE_MEDIA_MAX_BYTES;
}

export function validateTalentServiceStepInput(
  input: TalentServiceStepInput,
): TalentServiceStepState {
  const fieldErrors: TalentServiceStepState["fieldErrors"] = {};
  const totalMediaCount = input.files.length + (input.existingMediaCount ?? 0);
  const minPrice = Number(input.minPrice);
  const maxPrice = Number(input.maxPrice);

  if (!input.title) {
    fieldErrors.title = "Service title is required.";
  }

  if (!input.description) {
    fieldErrors.description = "Description is required.";
  }

  if (input.categoryIds.length === 0) {
    fieldErrors.categories = "Select at least 1 category.";
  }

  if (!input.minPrice) {
    fieldErrors.minPrice = "Minimum price is required.";
  } else if (!Number.isFinite(minPrice) || minPrice <= 0) {
    fieldErrors.minPrice = "Enter a valid minimum price.";
  }

  if (!input.maxPrice) {
    fieldErrors.maxPrice = "Maximum price is required.";
  } else if (!Number.isFinite(maxPrice) || maxPrice <= 0) {
    fieldErrors.maxPrice = "Enter a valid maximum price.";
  }

  if (
    input.minPrice &&
    input.maxPrice &&
    Number.isFinite(minPrice) &&
    Number.isFinite(maxPrice) &&
    minPrice >= maxPrice
  ) {
    fieldErrors.priceRange = "Min price must be less than max price.";
  }

  if (!TALENT_SERVICE_PRICE_UNITS.includes(input.priceUnit as never)) {
    fieldErrors.priceUnit = "Select a price unit.";
  }

  if (totalMediaCount > TALENT_SERVICE_MEDIA_MAX_IMAGES) {
    fieldErrors.media = `You can upload at most ${TALENT_SERVICE_MEDIA_MAX_IMAGES} images per service.`;
  } else if (input.files.some((file) => !isTalentServiceMediaType(file.type))) {
    fieldErrors.media = "Only JPG, PNG, and WebP images are supported.";
  } else if (input.files.some((file) => !isTalentServiceMediaSize(file.size))) {
    fieldErrors.media = "Keep each image under 5 MB.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: Object.values(fieldErrors)[0] ?? "Check your service details.",
      ok: false,
    };
  }

  return {
    message: "",
    ok: true,
  };
}
