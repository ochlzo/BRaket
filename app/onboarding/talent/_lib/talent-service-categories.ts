import type {
  TalentServiceStepInput,
  TalentServiceStepState,
} from "./talent-service-step";

export function validateTalentServiceCategorySelection(
  input: Pick<TalentServiceStepInput, "categoryIds">,
  availableCategoryIds: string[],
): TalentServiceStepState {
  const availableIds = new Set(availableCategoryIds);
  const hasUnknownCategory = input.categoryIds.some(
    (categoryId) => !availableIds.has(categoryId),
  );

  if (!hasUnknownCategory) {
    return { message: "", ok: true };
  }

  return {
    fieldErrors: {
      categories: "Select a category from the available options.",
    },
    message: "Select a category from the available options.",
    ok: false,
  };
}
