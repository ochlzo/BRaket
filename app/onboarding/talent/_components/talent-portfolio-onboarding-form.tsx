"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ImageIcon, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const TALENT_PORTFOLIO_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const TALENT_PORTFOLIO_MAX_IMAGES = 10;

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

export function TalentPortfolioOnboardingForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState("");

  function updateFiles(nextFiles: File[]) {
    const validFiles = nextFiles.filter((file) =>
      TALENT_PORTFOLIO_ACCEPTED_TYPES.includes(file.type),
    );
    const seen = new Set<string>();
    const mergedFiles = [...selectedFiles, ...validFiles].filter((file) => {
      const key = getFileKey(file);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
    const cappedFiles = mergedFiles.slice(0, TALENT_PORTFOLIO_MAX_IMAGES);

    if (validFiles.length !== nextFiles.length) {
      setNotice("Only JPG, PNG, and WebP images are attached.");
    } else if (mergedFiles.length > TALENT_PORTFOLIO_MAX_IMAGES) {
      setNotice(
        `Only the first ${TALENT_PORTFOLIO_MAX_IMAGES} images are attached.`,
      );
    } else {
      setNotice("");
    }

    setSelectedFiles(cappedFiles);
    syncInputFiles(inputRef.current, cappedFiles);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    updateFiles(Array.from(event.target.files ?? []));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    setNotice("Portfolio creation is UI-only for now.");
  }

  function clearFiles() {
    setSelectedFiles([]);
    setNotice("");
    syncInputFiles(inputRef.current, []);
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
                onClick={() => setNotice("Portfolio step skipped for now.")}
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
                placeholder="e.g. Campus event branding kit"
                required
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
                placeholder="Describe the project, your role, tools used, and result."
                required
                rows={4}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-foreground">
                Portfolio Media
              </p>
              <p className="mt-1 text-xs leading-5 text-[color:var(--ink-muted)]">
                JPG, PNG, or WebP. Up to {TALENT_PORTFOLIO_MAX_IMAGES} files.
              </p>
            </div>
            <Badge className="rounded-full border-0 bg-[color:var(--tone-orange-pale)] px-3 py-1.5 text-[color:var(--tone-orange-deep)]">
              <ImageIcon className="size-3.5" />
              {selectedFiles.length}/{TALENT_PORTFOLIO_MAX_IMAGES}
            </Badge>
          </div>

          <input
            ref={inputRef}
            accept={TALENT_PORTFOLIO_ACCEPTED_TYPES.join(",")}
            className="sr-only"
            id="portfolio-media"
            multiple
            name="media"
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
            {selectedFiles.length > 0 ? (
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
            {selectedFiles.length > 0 ? (
              selectedFiles.map((file, index) => (
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
                    onClick={() => {
                      const nextFiles = selectedFiles.filter(
                        (_, current) => current !== index,
                      );
                      setSelectedFiles(nextFiles);
                      syncInputFiles(inputRef.current, nextFiles);
                    }}
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
                  Media is optional for this UI-only step.
                </p>
              </div>
            )}
          </div>
        </div>

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
            Create portfolio
          </Button>
        </div>
      </form>
    </div>
  );
}
