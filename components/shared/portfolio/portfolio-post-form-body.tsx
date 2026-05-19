"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TalentMediaUploadField } from "@/app/onboarding/talent/_components/talent-media-upload-field";

type PortfolioPostFormBodyProps = {
  cancelLabel?: string;
  description: string;
  descriptionPlaceholder: string;
  emptyDescription: string;
  existingMediaUrls: string[];
  files: File[];
  inputId: string;
  inputName: string;
  isRequired?: boolean;
  isSubmitting: boolean;
  mediaTitle: string;
  notice: string;
  portfolioId?: string;
  onCancel: () => void;
  onDescriptionChange: (value: string) => void;
  onExistingMediaUrlsChange?: (urls: string[]) => void;
  onFilesChange: (files: File[]) => void;
  onNoticeChange: (message: string) => void;
  onTitleChange: (value: string) => void;
  removableExistingMedia?: boolean;
  statusMessage?: string;
  statusTone?: "error" | "success";
  submitLabel: string;
  submitPendingLabel: string;
  title: string;
  titlePlaceholder: string;
};

function StatusMessage({
  message,
  tone,
}: {
  message: string;
  tone: "error" | "success";
}) {
  return (
    <p
      className={`rounded-xl px-4 py-3 text-sm font-medium ${
        tone === "success"
          ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
          : "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]"
      }`}
      role={tone === "success" ? "status" : "alert"}
    >
      {message}
    </p>
  );
}

export function PortfolioPostFormBody({
  cancelLabel = "Cancel",
  description,
  descriptionPlaceholder,
  emptyDescription,
  existingMediaUrls,
  files,
  inputId,
  inputName,
  isRequired = true,
  isSubmitting,
  mediaTitle,
  notice,
  portfolioId,
  onCancel,
  onDescriptionChange,
  onExistingMediaUrlsChange,
  onFilesChange,
  onNoticeChange,
  onTitleChange,
  removableExistingMedia = false,
  statusMessage,
  statusTone = "error",
  submitLabel,
  submitPendingLabel,
  title,
  titlePlaceholder,
}: PortfolioPostFormBodyProps) {
  return (
    <>
      {portfolioId ? <input name="portfolioId" type="hidden" value={portfolioId} /> : null}
      <input
        name="existingMediaUrls"
        type="hidden"
        value={JSON.stringify(existingMediaUrls)}
      />
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
              onChange={(event) => onTitleChange(event.currentTarget.value)}
              placeholder={titlePlaceholder}
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
              onChange={(event) =>
                onDescriptionChange(event.currentTarget.value)
              }
              placeholder={descriptionPlaceholder}
              required
              rows={4}
              value={description}
            />
          </div>
        </div>
        <Separator />
        <TalentMediaUploadField
          emptyDescription={emptyDescription}
          existingMediaUrls={existingMediaUrls}
          files={files}
          inputId={inputId}
          inputName={inputName}
          isRequired={isRequired}
          onExistingMediaUrlsChange={onExistingMediaUrlsChange}
          onFilesChange={onFilesChange}
          onNoticeChange={onNoticeChange}
          removableExistingMedia={removableExistingMedia}
          title={mediaTitle}
        />
        {notice ? (
          <p
            className="rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3 text-sm text-[color:var(--ink-soft)]"
            role="status"
          >
            {notice}
          </p>
        ) : null}
        {statusMessage ? (
          <StatusMessage message={statusMessage} tone={statusTone} />
        ) : null}
      </div>

      <div className="sticky bottom-0 z-10 shrink-0 border-t border-[color:var(--line-strong)] bg-[color:var(--surface)] px-4 py-4 sm:px-5">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button className="rounded-xl" onClick={onCancel} type="button" variant="outline">
            {cancelLabel}
          </Button>
          <Button className="rounded-xl" disabled={isSubmitting} type="submit">
            {isSubmitting ? submitPendingLabel : submitLabel}
          </Button>
        </div>
      </div>
    </>
  );
}
