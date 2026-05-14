"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { saveTalentPortfolioStepAction } from "@/app/onboarding/talent/_actions/save-talent-portfolio-step-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TalentMediaUploadField } from "@/app/onboarding/talent/_components/talent-media-upload-field";
import {
  type TalentPortfolioStepInitialValues,
  validateTalentPortfolioStepInput,
} from "@/app/onboarding/talent/_lib/talent-portfolio-step";

type TalentPortfolioOnboardingFormProps = {
  initialValues: TalentPortfolioStepInitialValues;
  onBack: () => void;
  onComplete: () => void;
};

export function TalentPortfolioOnboardingForm({
  initialValues,
  onBack,
  onComplete,
}: TalentPortfolioOnboardingFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function showValidationToast(message: string) {
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

    const validation = validateTalentPortfolioStepInput({
      description,
      existingMediaCount: initialValues.existingMediaUrls.length,
      files: selectedFiles,
      title,
    });

    if (!validation.ok) {
      showValidationToast(validation.message);
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("portfolioId", initialValues.portfolioId);

    try {
      setIsSubmitting(true);
      const result = await saveTalentPortfolioStepAction(formData);

      if (!result.ok) {
        showValidationToast(result.message);
        return;
      }

      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-4 sm:p-8">
      <form className="space-y-5 sm:space-y-7" onSubmit={handleSubmit}>
        <div>
          <div className="mb-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground sm:text-2xl">
                Create Your First Portfolio
              </h2>
              <Button
                className="mt-0.5 rounded-full text-xs font-semibold text-[color:var(--brand-orange)] sm:rounded-xl sm:text-sm"
                onClick={onComplete}
                size="xs"
                type="button"
                variant="ghost"
              >
                <span className="sm:hidden">Skip</span>
                <span className="hidden sm:inline">Skip for now</span>
              </Button>
            </div>
            <div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
                Add one sample project now, or skip this step and finish it
                later.
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                className="text-sm font-semibold"
                htmlFor="portfolio-title"
              >
                Portfolio Title{" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Input
                className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl"
                id="portfolio-title"
                name="title"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Campus event branding kit"
                required
                value={title}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label
                className="text-sm font-semibold"
                htmlFor="portfolio-description"
              >
                Description{" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Textarea
                className="min-h-28 rounded-2xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3 text-sm sm:rounded-xl"
                id="portfolio-description"
                name="description"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the project, your role, tools used, and result."
                required
                rows={4}
                value={description}
              />
            </div>
          </div>
        </div>

        <Separator />

        <TalentMediaUploadField
          emptyDescription="Add at least 1 image to continue."
          existingMediaUrls={initialValues.existingMediaUrls}
          files={selectedFiles}
          inputId="portfolio-media"
          inputName="media"
          isRequired
          onFilesChange={setSelectedFiles}
          onNoticeChange={setNotice}
          title="Portfolio Media"
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
            {isSubmitting ? "Saving..." : "Create portfolio"}
          </Button>
        </div>
      </form>
    </div>
  );
}
