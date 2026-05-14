"use client";

import { useRef, type ChangeEvent } from "react";
import { ImageIcon, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatTalentPortfolioFileSize,
  getTalentPortfolioFileKey,
  isTalentPortfolioMediaSize,
  isTalentPortfolioMediaType,
  TALENT_PORTFOLIO_MEDIA_ACCEPTED_TYPES,
  TALENT_PORTFOLIO_MEDIA_MAX_BYTES,
  TALENT_PORTFOLIO_MEDIA_MAX_IMAGES,
} from "@/app/onboarding/talent/_lib/talent-portfolio-step";

function syncInputFiles(input: HTMLInputElement | null, files: File[]) {
  if (!input) {
    return;
  }

  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  input.files = dataTransfer.files;
}

type TalentMediaUploadFieldProps = {
  emptyDescription: string;
  existingMediaUrls?: string[];
  files: File[];
  inputId: string;
  inputName: string;
  isRequired?: boolean;
  onFilesChange: (files: File[]) => void;
  onNoticeChange: (message: string) => void;
  title: string;
};

export function TalentMediaUploadField({
  emptyDescription,
  existingMediaUrls = [],
  files,
  inputId,
  inputName,
  isRequired = false,
  onFilesChange,
  onNoticeChange,
  title,
}: TalentMediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mediaCount = existingMediaUrls.length + files.length;

  function updateFiles(nextFiles: File[]) {
    const validFiles = nextFiles.filter((file) =>
      isTalentPortfolioMediaType(file.type),
    );
    const allowedFiles = validFiles.filter((file) =>
      isTalentPortfolioMediaSize(file.size),
    );
    const seen = new Set<string>();
    const mergedFiles = [...files, ...allowedFiles].filter((file) => {
      const key = getTalentPortfolioFileKey(file);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
    const remainingSlots = Math.max(
      0,
      TALENT_PORTFOLIO_MEDIA_MAX_IMAGES - existingMediaUrls.length,
    );
    const cappedFiles = mergedFiles.slice(0, remainingSlots);

    if (validFiles.length !== nextFiles.length) {
      onNoticeChange("Only JPG, PNG, and WebP images are attached.");
    } else if (allowedFiles.length !== validFiles.length) {
      onNoticeChange(
        `Only images up to ${formatTalentPortfolioFileSize(
          TALENT_PORTFOLIO_MEDIA_MAX_BYTES,
        )} are attached.`,
      );
    } else if (
      existingMediaUrls.length + mergedFiles.length >
      TALENT_PORTFOLIO_MEDIA_MAX_IMAGES
    ) {
      onNoticeChange(
        `Only the first ${TALENT_PORTFOLIO_MEDIA_MAX_IMAGES} images are attached.`,
      );
    } else {
      onNoticeChange("");
    }

    onFilesChange(cappedFiles);
    syncInputFiles(inputRef.current, cappedFiles);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    updateFiles(Array.from(event.target.files ?? []));
  }

  function removeFile(index: number) {
    const nextFiles = files.filter((_, current) => current !== index);
    onFilesChange(nextFiles);
    syncInputFiles(inputRef.current, nextFiles);
  }

  function clearFiles() {
    onFilesChange([]);
    onNoticeChange("");
    syncInputFiles(inputRef.current, []);
  }

  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-foreground">
            {title}{" "}
            {isRequired ? (
              <span className="text-[color:var(--tone-red-base)]">*</span>
            ) : null}
          </p>
          <p className="mt-1 text-xs leading-5 text-[color:var(--ink-muted)]">
            {isRequired ? "At least 1 image is required. " : null}
            JPG, PNG, or WebP. Up to {TALENT_PORTFOLIO_MEDIA_MAX_IMAGES} files,{" "}
            {formatTalentPortfolioFileSize(TALENT_PORTFOLIO_MEDIA_MAX_BYTES)}{" "}
            each.
          </p>
        </div>
        <Badge className="rounded-full border-0 bg-[color:var(--tone-orange-pale)] px-3 py-1.5 text-[color:var(--tone-orange-deep)]">
          <ImageIcon className="size-3.5" />
          {mediaCount}/{TALENT_PORTFOLIO_MEDIA_MAX_IMAGES}
        </Badge>
      </div>

      <input
        ref={inputRef}
        accept={TALENT_PORTFOLIO_MEDIA_ACCEPTED_TYPES.join(",")}
        className="sr-only"
        id={inputId}
        multiple
        name={inputName}
        onChange={handleFileChange}
        type="file"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          className="rounded-full border-[color:var(--line-strong)] bg-white shadow-[var(--shadow-surface-soft)] sm:rounded-xl"
          onClick={() => inputRef.current?.click()}
          type="button"
          variant="outline"
        >
          <ImageIcon className="size-4" />
          Select images
        </Button>
        {files.length > 0 ? (
          <Button
            className="rounded-full sm:ml-auto sm:rounded-xl"
            onClick={clearFiles}
            type="button"
            variant="ghost"
          >
            Clear images
          </Button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-2">
        {existingMediaUrls.length > 0 || files.length > 0 ? (
          <>
            {existingMediaUrls.map((url, index) => (
              <div
                className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--line-strong)] bg-white px-3 py-2.5"
                key={url}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    Saved image {index + 1}
                  </p>
                  <p className="truncate text-xs text-[color:var(--ink-muted)]">
                    {url}
                  </p>
                </div>
              </div>
            ))}
            {files.map((file, index) => (
              <div
                className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--line-strong)] bg-white px-3 py-2.5"
                key={getTalentPortfolioFileKey(file)}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-[color:var(--ink-muted)]">
                    {formatTalentPortfolioFileSize(file.size)}
                  </p>
                </div>
                <Button
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFile(index)}
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ))}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-[color:var(--line-strong)] bg-white px-4 py-5 text-center">
            <p className="text-sm font-semibold text-foreground">
              No images selected yet
            </p>
            <p className="mt-1 text-xs leading-6 text-[color:var(--ink-muted)]">
              {emptyDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
