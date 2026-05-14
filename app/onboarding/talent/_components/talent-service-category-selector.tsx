import { useState, type KeyboardEvent } from "react";

import type { CategoryOption } from "@/app/onboarding/talent/_lib/get-category-options";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";

const MIN_CATEGORY_NAME_LENGTH = 3;
const MAX_CATEGORY_SELECTIONS = 5;

type TalentServiceCategorySelectorProps = {
  availableCategories: CategoryOption[];
  selectedCategoryIds: string[];
  setSelectedCategoryIds: (categoryIds: string[]) => void;
};

export function TalentServiceCategorySelector({
  availableCategories,
  selectedCategoryIds,
  setSelectedCategoryIds,
}: TalentServiceCategorySelectorProps) {
  const [categoryError, setCategoryError] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const anchorRef = useComboboxAnchor();
  const categoryNameById = new Map(
    availableCategories.map((category) => [category.categoryId, category.name]),
  );
  const filteredCategories = availableCategories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );
  const trimmedCategorySearch = categorySearch.trim();
  const hasAddableCategorySearch =
    trimmedCategorySearch.length >= MIN_CATEGORY_NAME_LENGTH;
  const hasReachedCategoryLimit =
    selectedCategoryIds.length >= MAX_CATEGORY_SELECTIONS;

  function getCategoryToAdd(value: string) {
    const trimmedValue = value.trim();
    const matchingCategory = availableCategories.find(
      (category) => category.name.toLowerCase() === trimmedValue.toLowerCase(),
    );

    return matchingCategory?.categoryId ?? trimmedValue;
  }

  function getCategoryLabel(value: string) {
    return categoryNameById.get(value) ?? value;
  }

  function hasSelectedCategory(value: string) {
    const label = getCategoryLabel(value);

    return selectedCategoryIds.some(
      (categoryId) =>
        categoryId === value ||
        getCategoryLabel(categoryId).toLowerCase() === label.toLowerCase(),
    );
  }

  function addCategory(value: string) {
    const categoryToAdd = getCategoryToAdd(value);

    if (hasReachedCategoryLimit) {
      setCategoryError(`Select up to ${MAX_CATEGORY_SELECTIONS} categories.`);
      return;
    }

    if (hasSelectedCategory(categoryToAdd)) {
      setCategorySearch("");
      return;
    }

    setSelectedCategoryIds([...selectedCategoryIds, categoryToAdd]);
    setCategorySearch("");
  }

  function tryAddCategory(value: string) {
    const trimmedValue = value.trim();

    if (trimmedValue.length < MIN_CATEGORY_NAME_LENGTH) {
      setCategoryError(
        `Enter at least ${MIN_CATEGORY_NAME_LENGTH} characters to add a category.`,
      );
      return;
    }

    addCategory(trimmedValue);
    setCategoryError("");
  }

  function handleCategorySearchChange(value: string) {
    setCategorySearch(value);

    if (
      value.trim().length >= MIN_CATEGORY_NAME_LENGTH ||
      !hasReachedCategoryLimit
    ) {
      setCategoryError("");
    }
  }

  function handleCategorySearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    tryAddCategory(categorySearch);
  }

  function handleCategoryValueChange(value: string[]) {
    if (value.length > MAX_CATEGORY_SELECTIONS) {
      setCategoryError(`Select up to ${MAX_CATEGORY_SELECTIONS} categories.`);
      return;
    }

    setSelectedCategoryIds(value);
    setCategorySearch("");
    setCategoryError("");
  }

  return (
    <div className="space-y-1.5 sm:space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-sm font-semibold" htmlFor="service-categories">
          Categories{" "}
          <span className="text-[color:var(--tone-red-base)]">*</span>
        </Label>
        {selectedCategoryIds.length > 0 ? (
          <button
            className="shrink-0 text-xs font-semibold text-[color:var(--brand-orange)] transition hover:text-[color:var(--brand-orange-strong)] sm:text-sm"
            onClick={() => {
              setSelectedCategoryIds([]);
              setCategoryError("");
              setCategorySearch("");
            }}
            type="button"
          >
            Clear
          </button>
        ) : null}
      </div>

      <Combobox
        inputValue={categorySearch}
        itemToStringLabel={(categoryId) =>
          categoryNameById.get(categoryId) ?? ""
        }
        itemToStringValue={(categoryId) => categoryId}
        multiple
        onInputValueChange={handleCategorySearchChange}
        onValueChange={handleCategoryValueChange}
        required
        value={selectedCategoryIds}
      >
        <ComboboxChips
          className="min-h-10 rounded-2xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-3 py-2 sm:min-h-11 sm:rounded-xl"
          ref={anchorRef}
        >
          {selectedCategoryIds.map((categoryId) => (
            <ComboboxChip
              className="rounded-full bg-[color:var(--tone-orange-soft)] px-2.5 text-[color:var(--brand-orange-strong)] [&_[data-slot=combobox-chip-remove]]:!opacity-50 [&_[data-slot=combobox-chip-remove]:hover]:!bg-transparent [&_[data-slot=combobox-chip-remove]:hover]:!opacity-50"
              key={categoryId}
            >
              {categoryNameById.get(categoryId) ?? categoryId}
            </ComboboxChip>
          ))}
          <ComboboxChipsInput
            className="text-sm placeholder:text-[color:var(--ink-muted)]"
            id="service-categories"
            onKeyDown={handleCategorySearchKeyDown}
            placeholder={
              selectedCategoryIds.length > 0
                ? "Add another category..."
                : "Find or add categories..."
            }
          />
          {hasAddableCategorySearch ? (
            <button
              aria-disabled={hasReachedCategoryLimit}
              className="ml-auto shrink-0 rounded-full px-2.5 text-xs font-semibold text-[color:var(--brand-orange)] transition hover:bg-[color:var(--surface-alt)] sm:px-3"
              onClick={() => tryAddCategory(categorySearch)}
              onMouseDown={(event) => event.preventDefault()}
              type="button"
            >
              Add
            </button>
          ) : null}
        </ComboboxChips>
        <ComboboxContent
          anchor={anchorRef}
          className="rounded-xl border border-[color:var(--line-strong)] bg-white shadow-[var(--shadow-menu)]"
        >
          <ComboboxList>
            {filteredCategories.map((category) => (
              <ComboboxItem
                key={category.categoryId}
                value={category.categoryId}
              >
                {category.name}
              </ComboboxItem>
            ))}
            <ComboboxEmpty>
              Can&apos;t find the category? Use Add to include it.
            </ComboboxEmpty>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <div className="space-y-1">
        <p className="text-xs text-[color:var(--tone-red-base)]">
          ({selectedCategoryIds.length}/{MAX_CATEGORY_SELECTIONS} selected,
          minimum 1)
        </p>
        {categoryError ? (
          <p className="text-xs text-[color:var(--tone-red-base)]">
            {categoryError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
