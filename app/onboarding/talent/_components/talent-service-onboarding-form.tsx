"use client";

import { useState, type FormEvent } from "react";

import { TalentServiceCategorySelector } from "@/app/onboarding/talent/_components/talent-service-category-selector";
import { TalentServiceCurrencyField } from "@/app/onboarding/talent/_components/talent-service-currency-field";
import { TalentMediaUploadField } from "@/app/onboarding/talent/_components/talent-media-upload-field";
import type { CategoryOption } from "@/app/onboarding/talent/_lib/get-category-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const priceUnitOptions = [
  { label: "Fixed", value: "FIXED" },
  { label: "Hourly", value: "HOURLY" },
  { label: "Daily", value: "DAILY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Per project", value: "PER_PROJECT" },
  { label: "Per task", value: "PER_TASK" },
  { label: "Per session", value: "PER_SESSION" },
];

function getPriceRangeError(minPrice: string, maxPrice: string) {
  if (!minPrice || !maxPrice) {
    return "";
  }

  if (Number(minPrice) >= Number(maxPrice)) {
    return "Min price must be less than max price.";
  }

  return "";
}

type TalentServiceOnboardingFormProps = {
  availableCategories: CategoryOption[];
  onBack: () => void;
  onSkip: () => void;
};

export function TalentServiceOnboardingForm({
  availableCategories,
  onBack,
  onSkip,
}: TalentServiceOnboardingFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("");
  const [sampleFiles, setSampleFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState("");
  const priceRangeError = getPriceRangeError(minPrice, maxPrice);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    if (selectedCategoryIds.length === 0) {
      setNotice("Select at least 1 category before creating your service.");
      return;
    }

    if (!priceUnit) {
      setNotice("Select a price unit before creating your service.");
      return;
    }

    if (priceRangeError) {
      setNotice("");
      return;
    }

    setNotice("Service creation is UI-only for now.");
  }

  return (
    <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-4 sm:p-8">
      <form className="space-y-5 sm:space-y-7" onSubmit={handleSubmit}>
        <div>
          <div className="mb-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground sm:text-2xl">
                Create Your First Service
              </h2>
              <Button
                className="mt-0.5 rounded-full text-xs font-semibold text-[color:var(--brand-orange)] sm:rounded-xl sm:text-sm"
                onClick={onSkip}
                size="xs"
                type="button"
                variant="ghost"
              >
                <span className="sm:hidden">Skip</span>
                <span className="hidden sm:inline">Skip for now</span>
              </Button>
            </div>
            <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
              Define a service clients can book from your talent profile.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm font-semibold" htmlFor="service-title">
                Service Title{" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Input
                className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl"
                id="service-title"
                name="title"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Event poster design package"
                required
                value={title}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label
                className="text-sm font-semibold"
                htmlFor="service-description"
              >
                Description{" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Textarea
                className="min-h-28 rounded-2xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3 text-sm sm:rounded-xl"
                id="service-description"
                name="description"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what clients will get, your process, timeline, and deliverables."
                required
                rows={4}
                value={description}
              />
            </div>

            <TalentServiceCategorySelector
              availableCategories={availableCategories}
              selectedCategoryIds={selectedCategoryIds}
              setSelectedCategoryIds={setSelectedCategoryIds}
            />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start">
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  className="text-sm font-semibold"
                  htmlFor="service-min-price"
                >
                  Price Range{" "}
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                  <TalentServiceCurrencyField
                    ariaLabel="Minimum price"
                    describedBy={
                      priceRangeError ? "service-price-range-error" : undefined
                    }
                    id="service-min-price"
                    isInvalid={Boolean(priceRangeError)}
                    name="minPrice"
                    onChange={setMinPrice}
                    placeholder="Min"
                    value={minPrice}
                  />
                  <span className="text-sm font-semibold text-[color:var(--ink-muted)]">
                    -
                  </span>
                  <TalentServiceCurrencyField
                    ariaLabel="Maximum price"
                    describedBy={
                      priceRangeError ? "service-price-range-error" : undefined
                    }
                    id="service-max-price"
                    isInvalid={Boolean(priceRangeError)}
                    name="maxPrice"
                    onChange={setMaxPrice}
                    placeholder="Max"
                    value={maxPrice}
                  />
                </div>
                {priceRangeError ? (
                  <p
                    className="text-xs text-[color:var(--tone-red-base)]"
                    id="service-price-range-error"
                  >
                    {priceRangeError}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold" htmlFor="service-unit">
                  Price Unit{" "}
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <Select
                  id="service-unit"
                  items={priceUnitOptions}
                  name="priceUnit"
                  onValueChange={(value) => setPriceUnit(value ?? "")}
                  required
                  value={priceUnit || null}
                >
                  <SelectTrigger className="!h-10 w-full rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:!h-11 sm:rounded-xl">
                    <SelectValue placeholder="Select pricing basis" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-[color:var(--line-strong)] bg-white shadow-[var(--shadow-menu)]">
                    {priceUnitOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <TalentMediaUploadField
          emptyDescription="Sample images are optional for this service."
          files={sampleFiles}
          inputId="service-sample-media"
          inputName="serviceMedia"
          onFilesChange={setSampleFiles}
          onNoticeChange={setNotice}
          title="Work Samples"
        />

        {notice ? (
          <p
            className="rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3 text-sm text-[color:var(--ink-soft)]"
            role="status"
          >
            {notice}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            className="min-h-11 rounded-full sm:h-12 sm:rounded-xl"
            onClick={onBack}
            type="button"
            variant="outline"
          >
            Back
          </Button>
          <Button
            className="min-h-11 rounded-full bg-[color:var(--brand-orange)] px-5 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)] sm:h-12 sm:rounded-xl sm:px-8"
            type="submit"
          >
            Create service
          </Button>
        </div>
      </form>
    </div>
  );
}
