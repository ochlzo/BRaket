"use client";

import { useRef, type ChangeEvent } from "react";
import { ImageIcon, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_COUNT = 10;

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

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
  files,
  inputId,
  inputName,
  isRequired = false,
  onFilesChange,
  onNoticeChange,
  title,
}: TalentMediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function updateFiles(nextFiles: File[]) {
    const validFiles = nextFiles.filter((file) =>
      ACCEPTED_IMAGE_TYPES.includes(file.type),
    );
    const seen = new Set<string>();
    const mergedFiles = [...files, ...validFiles].filter((file) => {
      const key = getFileKey(file);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
    const cappedFiles = mergedFiles.slice(0, MAX_IMAGE_COUNT);

    if (validFiles.length !== nextFiles.length) {
      onNoticeChange("Only JPG, PNG, and WebP images are attached.");
    } else if (mergedFiles.length > MAX_IMAGE_COUNT) {
      onNoticeChange(`Only the first ${MAX_IMAGE_COUNT} images are attached.`);
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
            JPG, PNG, or WebP. Up to {MAX_IMAGE_COUNT} files.
          </p>
        </div>
        <Badge className="rounded-full border-0 bg-[color:var(--tone-orange-pale)] px-3 py-1.5 text-[color:var(--tone-orange-deep)]">
          <ImageIcon className="size-3.5" />
          {files.length}/{MAX_IMAGE_COUNT}
        </Badge>
      </div>

      <input
        ref={inputRef}
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
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
        {files.length > 0 ? (
          files.map((file, index) => (
            <div
              className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--line-strong)] bg-white px-3 py-2.5"
              key={getFileKey(file)}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-[color:var(--ink-muted)]">
                  {formatFileSize(file.size)}
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
          ))
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
