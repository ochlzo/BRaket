"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { saveTalentPortfolioStepAction } from "@/app/onboarding/talent/_actions/save-talent-portfolio-step-action";
import { TalentMediaUploadField } from "@/app/onboarding/talent/_components/talent-media-upload-field";
import {
  buildTalentPortfolioStepInitialValues,
  getTalentPortfolioStepDirtyFields,
  validateTalentPortfolioStepInput,
} from "@/app/onboarding/talent/_lib/talent-portfolio-step";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { TalentDialogFrame } from "./talent-dialog-frame";
import { TalentProfileSectionAction } from "./talent-profile-section-action";

const initialValues = buildTalentPortfolioStepInitialValues(null);

export function TalentPortfolioDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetDraft() {
    setTitle("");
    setDescription("");
    setSelectedFiles([]);
    setNotice("");
  }

  function showValidationToast(message: string) {
    const toastId = toast.error(message, {
      action: { label: "x", onClick: () => toast.dismiss(toastId) },
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !event.currentTarget.reportValidity()) return;

    const validation = validateTalentPortfolioStepInput({
      description,
      existingMediaCount: 0,
      files: selectedFiles,
      title,
    });
    if (!validation.ok) {
      showValidationToast(validation.message);
      return;
    }

    const dirtyFields = getTalentPortfolioStepDirtyFields(initialValues, {
      description,
      files: selectedFiles,
      title,
    });
    const formData = new FormData(event.currentTarget);
    formData.set("portfolioId", "");
    formData.set("dirtyFields", JSON.stringify(dirtyFields));

    try {
      setIsSubmitting(true);
      const result = await saveTalentPortfolioStepAction(formData);
      if (!result.ok) {
        showValidationToast(result.message);
        return;
      }
      toast.success("Portfolio post added.");
      router.refresh();
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <TalentProfileSectionAction
        label="Add portfolio post"
        onClick={() => {
          resetDraft();
          setOpen(true);
        }}
      >
        <Plus className="size-4" />
      </TalentProfileSectionAction>
      <TalentDialogFrame
        description="Add a portfolio post using the same fields and validation as talent onboarding."
        open={open}
        onOpenChange={setOpen}
        title="Add portfolio post"
      >
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-5">
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm font-semibold" htmlFor="portfolio-title">
                  Portfolio Title{" "}
                  <span className="text-[color:var(--tone-red-base)]">*</span>
                </Label>
                <Input
                  className="h-10 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 text-sm sm:h-11 sm:rounded-xl"
                  id="portfolio-title"
                  name="title"
                  onChange={(event) => setTitle(event.currentTarget.value)}
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
                  onChange={(event) => setDescription(event.currentTarget.value)}
                  placeholder="Describe the project, your role, tools used, and result."
                  required
                  rows={4}
                  value={description}
                />
              </div>
            </div>
            <Separator />
            <TalentMediaUploadField
              emptyDescription="Add at least 1 image to continue."
              existingMediaUrls={[]}
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
          </div>
          <div className="sticky bottom-0 z-10 shrink-0 border-t border-[color:var(--line-strong)] bg-[color:var(--surface)] px-4 py-4 sm:px-5">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button className="rounded-xl" onClick={() => setOpen(false)} type="button" variant="outline">
                Cancel
              </Button>
              <Button className="rounded-xl" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Saving..." : "Create portfolio"}
              </Button>
            </div>
          </div>
        </form>
      </TalentDialogFrame>
    </>
  );
}
