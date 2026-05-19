"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { finalizeTalentOnboardingAction } from "@/app/onboarding/talent/_actions/finalize-talent-onboarding-action";
import { saveTalentServiceStepAction } from "@/app/onboarding/talent/_actions/save-talent-service-step-action";
import { TalentServiceCategorySelector } from "@/app/onboarding/talent/_components/talent-service-category-selector";
import { TalentServiceCurrencyField } from "@/app/onboarding/talent/_components/talent-service-currency-field";
import { TalentServiceFormHeader } from "@/app/onboarding/talent/_components/talent-service-form-header";
import { TalentMediaUploadField } from "@/app/onboarding/talent/_components/talent-media-upload-field";
import { TalentServicePriceUnitField } from "@/app/onboarding/talent/_components/talent-service-price-unit-field";
import type { CategoryOption } from "@/app/onboarding/talent/_lib/get-category-options";
import {
  getTalentServicePriceRangeError,
  getTalentServiceStepDirtyFields,
  type TalentServiceStepInitialValues,
  validateTalentServiceStepInput,
} from "@/app/onboarding/talent/_lib/talent-service-step";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type TalentServiceOnboardingFormProps = {
  availableCategories: CategoryOption[];
  initialValues: TalentServiceStepInitialValues;
  onBack: () => void;
  onComplete: () => void;
};

export function TalentServiceOnboardingForm({
  availableCategories,
  initialValues,
  onBack,
  onComplete,
}: TalentServiceOnboardingFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialValues.categoryIds,
  );
  const [minPrice, setMinPrice] = useState(initialValues.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialValues.maxPrice);
  const [priceUnit, setPriceUnit] = useState(initialValues.priceUnit);
  const [existingMediaUrls, setExistingMediaUrls] = useState(
    initialValues.existingMediaUrls,
  );
  const [sampleFiles, setSampleFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const priceRangeError = getTalentServicePriceRangeError(minPrice, maxPrice);

  function showToastError(message: string) {
    const toastId = toast.error(message, {
      action: {
        label: "x",
        onClick: () => toast.dismiss(toastId),
      },
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    const validation = validateTalentServiceStepInput({
      categoryIds: selectedCategoryIds,
      description,
      existingMediaCount: existingMediaUrls.length,
      existingMediaUrls,
      files: sampleFiles,
      maxPrice,
      minPrice,
      priceUnit,
      removedExistingMediaUrls: initialValues.existingMediaUrls.filter(
        (url) => !existingMediaUrls.includes(url),
      ),
      title,
    });

    if (!validation.ok) {
      showToastError(validation.message);
      return;
    }

    const dirtyFields = getTalentServiceStepDirtyFields(initialValues, {
      categoryIds: selectedCategoryIds,
      description,
      files: sampleFiles,
      maxPrice,
      minPrice,
      priceUnit,
      title,
    });

    const formData = new FormData(event.currentTarget);
    formData.set("serviceId", initialValues.serviceId);
    formData.set("categoryIds", JSON.stringify(selectedCategoryIds));
    formData.set("existingMediaUrls", JSON.stringify(existingMediaUrls));
    formData.set("priceUnit", priceUnit);
    formData.set(
      "removedExistingMediaUrls",
      JSON.stringify(
        initialValues.existingMediaUrls.filter(
          (url) => !existingMediaUrls.includes(url),
        ),
      ),
    );
    formData.set("dirtyFields", JSON.stringify(dirtyFields));

    try {
      setIsSubmitting(true);
      const result = await saveTalentServiceStepAction(formData);

      if (!result.ok) {
        showToastError(result.message);
        return;
      }

      toast.success(result.message || "Talent onboarding completed.");
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSkip() {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await finalizeTalentOnboardingAction();

      if (!result.ok) {
        showToastError(result.message);
        return;
      }

      toast.success(result.message || "Talent onboarding completed.");
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-4 sm:p-8">
      <form className="space-y-5 sm:space-y-7" onSubmit={handleSubmit}>
        <input name="categoryIds" type="hidden" />
        <input name="serviceId" type="hidden" />
        <div>
          <TalentServiceFormHeader
            isSubmitting={isSubmitting}
            onSkip={handleSkip}
          />

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
                <TalentServicePriceUnitField
                  onChange={setPriceUnit}
                  value={priceUnit}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <TalentMediaUploadField
          emptyDescription="Sample images are optional for this service."
          existingMediaUrls={existingMediaUrls}
          files={sampleFiles}
          inputId="service-sample-media"
          inputName="serviceMedia"
          onExistingMediaUrlsChange={setExistingMediaUrls}
          onFilesChange={setSampleFiles}
          onNoticeChange={setNotice}
          removableExistingMedia={initialValues.existingMediaUrls.length > 0}
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
            disabled={isSubmitting}
            onClick={onBack}
            type="button"
            variant="outline"
          >
            Back
          </Button>
          <Button
            className="min-h-11 rounded-full bg-[color:var(--brand-orange)] px-5 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)] sm:h-12 sm:rounded-xl sm:px-8"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Create service"}
          </Button>
        </div>
      </form>
    </div>
  );
}
