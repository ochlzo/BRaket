"use client";

import { useState, type FormEvent } from "react";

import { TalentFormSectionHeading } from "@/app/onboarding/talent/_components/talent-form-section-heading";
import { TalentMediaUploadField } from "@/app/onboarding/talent/_components/talent-media-upload-field";
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

const currencyInputClassName =
  "h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pr-4 text-sm sm:h-11 sm:rounded-xl";

function getPriceRangeError(minPrice: string, maxPrice: string) {
  if (!minPrice || !maxPrice) {
    return "";
  }

  if (Number(minPrice) >= Number(maxPrice)) {
    return "Min price must be less than max price.";
  }

  return "";
}

export function TalentServiceOnboardingForm() {
  const [title, setTitle] = useState("");
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
            <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground sm:text-2xl">
              Create Your First Service
            </h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
              Define a service clients can book from your talent profile.
            </p>
          </div>

          <TalentFormSectionHeading step={3} title="Service Details" />

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
                  <CurrencyField
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
                  <CurrencyField
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
          title="Sample Work Images"
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

type CurrencyFieldProps = {
  ariaLabel: string;
  describedBy?: string;
  id: string;
  isInvalid: boolean;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function CurrencyField({
  ariaLabel,
  describedBy,
  id,
  isInvalid,
  name,
  onChange,
  placeholder,
  value,
}: CurrencyFieldProps) {
  return (
    <div className="relative min-w-0">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[color:var(--ink-muted)] sm:left-4 sm:text-sm">
        PHP
      </span>
      <Input
        aria-describedby={describedBy}
        aria-invalid={isInvalid}
        aria-label={ariaLabel}
        className={`${currencyInputClassName} pl-12 sm:pl-14`}
        id={id}
        min="1"
        name={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        step="0.01"
        type="number"
        value={value}
      />
    </div>
  );
}
