import { useState } from "react";

import type { CategoryOption } from "@/app/onboarding/talent/_lib/get-category-options";
import { TALENT_SERVICE_MAX_CATEGORIES } from "@/app/onboarding/talent/_lib/talent-service-step";
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
  const hasReachedCategoryLimit =
    selectedCategoryIds.length >= TALENT_SERVICE_MAX_CATEGORIES;

  function handleCategorySearchChange(value: string) {
    setCategorySearch(value);

    if (!hasReachedCategoryLimit) {
      setCategoryError("");
    }
  }

  function handleCategoryValueChange(value: string[]) {
    if (value.length > TALENT_SERVICE_MAX_CATEGORIES) {
      setCategoryError(
        `Select up to ${TALENT_SERVICE_MAX_CATEGORIES} categories.`,
      );
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
            placeholder={
              selectedCategoryIds.length > 0
                ? "Search categories..."
                : "Find categories..."
            }
          />
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
              No matching categories.
            </ComboboxEmpty>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <div className="space-y-1">
        <p className="text-xs text-[color:var(--tone-red-base)]">
          ({selectedCategoryIds.length}/{TALENT_SERVICE_MAX_CATEGORIES}{" "}
          selected, minimum 1)
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
