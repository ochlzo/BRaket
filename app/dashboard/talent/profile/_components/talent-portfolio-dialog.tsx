"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PencilLine, Plus } from "lucide-react";
import { toast } from "sonner";

import { deleteTalentPortfolioAction } from "@/app/onboarding/talent/_actions/delete-talent-portfolio-action";
import { saveTalentPortfolioStepAction } from "@/app/onboarding/talent/_actions/save-talent-portfolio-step-action";
import {
  buildTalentPortfolioStepInitialValues,
  getTalentPortfolioStepDirtyFields,
  validateTalentPortfolioStepInput,
} from "@/app/onboarding/talent/_lib/talent-portfolio-step";
import { PortfolioPostFormBody } from "@/components/shared/portfolio/portfolio-post-form-body";
import type { TalentProfilePortfolioItem } from "@/lib/talent-profile/types";

import { TalentDialogFrame } from "./talent-dialog-frame";
import { TalentDeleteDialogAction } from "./talent-delete-dialog-action";
import { TalentProfileSectionAction } from "./talent-profile-section-action";

type TalentPortfolioDialogProps = {
  item?: TalentProfilePortfolioItem;
};

export function TalentPortfolioDialog({ item }: TalentPortfolioDialogProps) {
  const router = useRouter();
  const editLabel = item ? `Edit ${item.title}` : "Edit portfolio item";
  const initialValues = buildTalentPortfolioStepInitialValues(
    item
      ? {
          description: item.description,
          talent_portfolio_id: item.id,
          TalentPortfolioMedia: item.mediaUrls.map((media_url) => ({ media_url })),
          title: item.title,
        }
      : null,
  );
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [existingMediaUrls, setExistingMediaUrls] = useState(
    initialValues.existingMediaUrls,
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(item);

  function resetDraft() {
    setTitle(initialValues.title);
    setDescription(initialValues.description);
    setExistingMediaUrls(initialValues.existingMediaUrls);
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
      existingMediaCount: existingMediaUrls.length,
      existingMediaUrls,
      files: selectedFiles,
      removedExistingMediaUrls: initialValues.existingMediaUrls.filter(
        (url) => !existingMediaUrls.includes(url),
      ),
      title,
    });
    if (!validation.ok) {
      showValidationToast(validation.message);
      return;
    }

    const dirtyFields = getTalentPortfolioStepDirtyFields(initialValues, {
      description,
      existingMediaUrls,
      files: selectedFiles,
      removedExistingMediaUrls: initialValues.existingMediaUrls.filter(
        (url) => !existingMediaUrls.includes(url),
      ),
      title,
    });
    if (dirtyFields.length === 0) {
      setOpen(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("portfolioId", initialValues.portfolioId);
    formData.set("existingMediaUrls", JSON.stringify(existingMediaUrls));
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
      const result = await saveTalentPortfolioStepAction(formData);
      if (!result.ok) {
        showValidationToast(result.message);
        return;
      }
      toast.success(isEditMode ? "Portfolio post updated." : "Portfolio post added.");
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
          label="Add portfolio post"
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
            ? "Update this portfolio post using the same fields and validation as talent onboarding."
            : "Add a portfolio post using the same fields and validation as talent onboarding."
        }
        headerAction={
          isEditMode ? (
            <TalentDeleteDialogAction
              confirmDescription="This will permanently delete this portfolio post and all of its images from storage."
              confirmLabel="Delete post"
              confirmTitle="Delete this portfolio post?"
              onConfirm={() =>
                deleteTalentPortfolioAction(initialValues.portfolioId)
              }
              onDeleted={() => {
                resetDraft();
                setOpen(false);
                router.refresh();
              }}
              triggerLabel="Delete portfolio post"
            />
          ) : undefined
        }
        open={open}
        onOpenChange={setOpen}
        title={isEditMode ? "Edit portfolio post" : "Add portfolio post"}
      >
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <PortfolioPostFormBody
            cancelLabel="Cancel"
            description={description}
            descriptionPlaceholder="Describe the project, your role, tools used, and result."
            emptyDescription="Add at least 1 image to continue."
            existingMediaUrls={existingMediaUrls}
            files={selectedFiles}
            inputId="portfolio-media"
            inputName="media"
            isRequired
            isSubmitting={isSubmitting}
            mediaTitle="Portfolio Media"
            notice={notice}
            onCancel={() => setOpen(false)}
            onDescriptionChange={setDescription}
            onExistingMediaUrlsChange={setExistingMediaUrls}
            onFilesChange={setSelectedFiles}
            onNoticeChange={setNotice}
            onTitleChange={setTitle}
            removableExistingMedia={isEditMode}
            submitLabel={isEditMode ? "Save changes" : "Create portfolio"}
            submitPendingLabel="Saving..."
            title={title}
            titlePlaceholder="e.g. Campus event branding kit"
          />
        </form>
      </TalentDialogFrame>
    </>
  );
}
