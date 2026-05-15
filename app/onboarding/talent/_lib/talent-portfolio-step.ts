export const TALENT_PORTFOLIO_MEDIA_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const TALENT_PORTFOLIO_MEDIA_MAX_IMAGES = 10;
export const TALENT_PORTFOLIO_MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export type TalentPortfolioStepInput = {
  description: string;
  existingMediaCount?: number;
  files: File[];
  portfolioId?: string;
  title: string;
};

export type TalentPortfolioStepInitialValues = {
  description: string;
  existingMediaUrls: string[];
  portfolioId: string;
  title: string;
};

export type TalentPortfolioStepState = {
  fieldErrors?: {
    description?: string;
    media?: string;
    title?: string;
  };
  message: string;
  ok: boolean;
  successToken?: string;
};

export type TalentPortfolioStepDirtyField =
  | "description"
  | "media"
  | "title";

export function parseTalentPortfolioStepFormData(
  formData: FormData,
): TalentPortfolioStepInput {
  const portfolioId = formData.get("portfolioId");
  const title = formData.get("title");
  const description = formData.get("description");
  const files = formData
    .getAll("media")
    .filter((entry): entry is File => entry instanceof File);

  return {
    description: typeof description === "string" ? description.trim() : "",
    files,
    portfolioId: typeof portfolioId === "string" ? portfolioId.trim() : "",
    title: typeof title === "string" ? title.trim() : "",
  };
}

type TalentPortfolioStepSource = {
  description: string;
  talent_portfolio_id: string;
  TalentPortfolioMedia: { media_url: string }[];
  title: string;
} | null;

export function buildTalentPortfolioStepInitialValues(
  portfolio: TalentPortfolioStepSource,
): TalentPortfolioStepInitialValues {
  if (!portfolio) {
    return {
      description: "",
      existingMediaUrls: [],
      portfolioId: "",
      title: "",
    };
  }

  return {
    description: portfolio.description,
    existingMediaUrls: portfolio.TalentPortfolioMedia.map(
      (media) => media.media_url,
    ),
    portfolioId: portfolio.talent_portfolio_id,
    title: portfolio.title,
  };
}

export function getTalentPortfolioStepDirtyFields(
  initialValues: TalentPortfolioStepInitialValues,
  input: Pick<TalentPortfolioStepInput, "description" | "files" | "title">,
): TalentPortfolioStepDirtyField[] {
  const dirtyFields: TalentPortfolioStepDirtyField[] = [];

  if (initialValues.title !== input.title) {
    dirtyFields.push("title");
  }

  if (initialValues.description !== input.description) {
    dirtyFields.push("description");
  }

  if (input.files.length > 0) {
    dirtyFields.push("media");
  }

  return dirtyFields;
}

export function isTalentPortfolioMediaType(type: string) {
  return TALENT_PORTFOLIO_MEDIA_ACCEPTED_TYPES.includes(type);
}

export function isTalentPortfolioMediaSize(size: number) {
  return size <= TALENT_PORTFOLIO_MEDIA_MAX_BYTES;
}

export function getTalentPortfolioFileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function formatTalentPortfolioFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateTalentPortfolioStepInput(
  input: TalentPortfolioStepInput,
): TalentPortfolioStepState {
  const fieldErrors: TalentPortfolioStepState["fieldErrors"] = {};
  const totalMediaCount = input.files.length + (input.existingMediaCount ?? 0);

  if (!input.title) {
    fieldErrors.title = "Portfolio title is required.";
  }

  if (!input.description) {
    fieldErrors.description = "Description is required.";
  }

  if (totalMediaCount === 0) {
    fieldErrors.media = "Add at least one portfolio image.";
  } else if (totalMediaCount > TALENT_PORTFOLIO_MEDIA_MAX_IMAGES) {
    fieldErrors.media = `You can upload at most ${TALENT_PORTFOLIO_MEDIA_MAX_IMAGES} images per portfolio.`;
  } else if (
    input.files.some((file) => !isTalentPortfolioMediaType(file.type))
  ) {
    fieldErrors.media = "Only JPG, PNG, and WebP images are supported.";
  } else if (
    input.files.some((file) => !isTalentPortfolioMediaSize(file.size))
  ) {
    fieldErrors.media = "Keep each image under 5 MB.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: Object.values(fieldErrors)[0] ?? "Check your portfolio details.",
      ok: false,
    };
  }

  return {
    message: "",
    ok: true,
  };
}
