"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PencilLine, Plus } from "lucide-react";
import { toast } from "sonner";

import { deleteTalentServiceAction } from "@/app/onboarding/talent/_actions/delete-talent-service-action";
import { saveTalentServiceStepAction } from "@/app/onboarding/talent/_actions/save-talent-service-step-action";
import { TalentMediaUploadField } from "@/app/onboarding/talent/_components/talent-media-upload-field";
import { TalentServiceCategorySelector } from "@/app/onboarding/talent/_components/talent-service-category-selector";
import { TalentServiceCurrencyField } from "@/app/onboarding/talent/_components/talent-service-currency-field";
import { TalentServicePriceUnitField } from "@/app/onboarding/talent/_components/talent-service-price-unit-field";
import type { CategoryOption } from "@/app/onboarding/talent/_lib/get-category-options";
import {
  buildTalentServiceStepInitialValues,
  getTalentServicePriceRangeError,
  getTalentServiceStepDirtyFields,
  validateTalentServiceStepInput,
} from "@/app/onboarding/talent/_lib/talent-service-step";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { TalentProfileServiceItem } from "@/lib/talent-profile/types";

import { TalentDialogFrame } from "./talent-dialog-frame";
import { TalentDeleteDialogAction } from "./talent-delete-dialog-action";
import { TalentProfileSectionAction } from "./talent-profile-section-action";

type TalentServiceDialogProps = {
  availableCategories: CategoryOption[];
  service?: TalentProfileServiceItem;
};

export function TalentServiceDialog({
  availableCategories,
  service,
}: TalentServiceDialogProps) {
  const router = useRouter();
  const editLabel = service ? `Edit ${service.title}` : "Edit service";
  const initialValues = buildTalentServiceStepInitialValues(
    service
      ? {
          description: service.description,
          maxPrice: service.maxPrice,
          minPrice: service.minPrice,
          priceUnit: service.priceUnit,
          ServiceCategories: service.categoryIds.map((categoryId) => ({
            categoryId,
          })),
          ServiceMedia: service.mediaUrls.map((mediaUrl) => ({ mediaUrl })),
          serviceId: service.id,
          title: service.title,
        }
      : null,
  );
  const [open, setOpen] = useState(false);
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
  const isEditMode = Boolean(service);
  const priceRangeError = getTalentServicePriceRangeError(minPrice, maxPrice);

  function resetDraft() {
    setTitle(initialValues.title);
    setDescription(initialValues.description);
    setSelectedCategoryIds(initialValues.categoryIds);
    setMinPrice(initialValues.minPrice);
    setMaxPrice(initialValues.maxPrice);
    setPriceUnit(initialValues.priceUnit);
    setExistingMediaUrls(initialValues.existingMediaUrls);
    setSampleFiles([]);
    setNotice("");
  }

  function showToastError(message: string) {
    const toastId = toast.error(message, {
      action: { label: "x", onClick: () => toast.dismiss(toastId) },
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !event.currentTarget.reportValidity()) return;

    const input = {
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
    };
    const validation = validateTalentServiceStepInput(input);
    if (!validation.ok) {
      showToastError(validation.message);
      return;
    }

    const dirtyFields = getTalentServiceStepDirtyFields(initialValues, input);
    if (dirtyFields.length === 0) {
      setOpen(false);
      return;
    }

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
      toast.success(isEditMode ? "Service updated." : "Service added.");
      router.refresh();
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {isEditMode ? (
        <button
          aria-label={editLabel}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface)] text-[color:var(--brand-orange)] shadow-[var(--shadow-surface-soft)] transition hover:bg-[color:var(--surface-alt)]"
          onClick={() => {
            resetDraft();
            setOpen(true);
          }}
          type="button"
        >
          <PencilLine className="size-4" />
        </button>
      ) : (
        <TalentProfileSectionAction
          label="Add service"
          onClick={() => {
            resetDraft();
            setOpen(true);
          }}
        >
          <Plus className="size-4" />
        </TalentProfileSectionAction>
      )}
      <TalentDialogFrame
        description={
          isEditMode
            ? "Update this service using the same fields and validation as talent onboarding."
            : "Publish a service using the same fields and validation as talent onboarding."
        }
        headerAction={
          isEditMode ? (
            <TalentDeleteDialogAction
              confirmDescription="This will permanently delete this service, its images, and related saved reports/bookings data tied to it."
              confirmLabel="Delete service"
              confirmTitle="Delete this service?"
              onConfirm={() => deleteTalentServiceAction(initialValues.serviceId)}
              onDeleted={() => {
                resetDraft();
                setOpen(false);
                router.refresh();
              }}
              triggerLabel="Delete service"
            />
          ) : undefined
        }
        open={open}
        onOpenChange={setOpen}
        title={isEditMode ? "Edit service" : "Add service"}
      >
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-5">
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
                  onChange={(event) => setTitle(event.currentTarget.value)}
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
                  onChange={(event) => setDescription(event.currentTarget.value)}
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
              <ServicePriceFields
                maxPrice={maxPrice}
                minPrice={minPrice}
                priceRangeError={priceRangeError}
                priceUnit={priceUnit}
                setMaxPrice={setMaxPrice}
                setMinPrice={setMinPrice}
                setPriceUnit={setPriceUnit}
              />
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
              removableExistingMedia={isEditMode}
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
          </div>
          <div className="sticky bottom-0 z-10 shrink-0 border-t border-[color:var(--line-strong)] bg-[color:var(--surface)] px-4 py-4 sm:px-5">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button className="rounded-xl" onClick={() => setOpen(false)} type="button" variant="outline">
                Cancel
              </Button>
              <Button className="rounded-xl" disabled={isSubmitting} type="submit">
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Save changes"
                    : "Create service"}
              </Button>
            </div>
          </div>
        </form>
      </TalentDialogFrame>
    </>
  );
}

function ServicePriceFields({
  maxPrice,
  minPrice,
  priceRangeError,
  priceUnit,
  setMaxPrice,
  setMinPrice,
  setPriceUnit,
}: {
  maxPrice: string;
  minPrice: string;
  priceRangeError: string;
  priceUnit: string;
  setMaxPrice: (value: string) => void;
  setMinPrice: (value: string) => void;
  setPriceUnit: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start">
      <div className="space-y-1.5 sm:space-y-2">
        <Label className="text-sm font-semibold" htmlFor="service-min-price">
          Price Range <span className="text-[color:var(--tone-red-base)]">*</span>
        </Label>
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <TalentServiceCurrencyField
            ariaLabel="Minimum price"
            describedBy={priceRangeError ? "service-price-range-error" : undefined}
            id="service-min-price"
            isInvalid={Boolean(priceRangeError)}
            name="minPrice"
            onChange={setMinPrice}
            placeholder="Min"
            value={minPrice}
          />
          <span className="text-sm font-semibold text-[color:var(--ink-muted)]">-</span>
          <TalentServiceCurrencyField
            ariaLabel="Maximum price"
            describedBy={priceRangeError ? "service-price-range-error" : undefined}
            id="service-max-price"
            isInvalid={Boolean(priceRangeError)}
            name="maxPrice"
            onChange={setMaxPrice}
            placeholder="Max"
            value={maxPrice}
          />
        </div>
        {priceRangeError ? (
          <p className="text-xs text-[color:var(--tone-red-base)]" id="service-price-range-error">
            {priceRangeError}
          </p>
        ) : null}
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label className="text-sm font-semibold" htmlFor="service-unit">
          Price Unit <span className="text-[color:var(--tone-red-base)]">*</span>
        </Label>
        <TalentServicePriceUnitField onChange={setPriceUnit} value={priceUnit} />
      </div>
    </div>
  );
}
