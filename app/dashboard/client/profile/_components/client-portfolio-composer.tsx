"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateClientPortfolioPostState } from "@/lib/client-profile/types";
import {
  CLIENT_PORTFOLIO_MEDIA_ACCEPTED_TYPES,
  CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES,
} from "@/lib/supabase/storage";
import { createClientPortfolioPostAction } from "@/server/client-profile/create-client-portfolio-post";

const INITIAL_STATE: CreateClientPortfolioPostState = {
  message: "",
  ok: false,
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function syncInputFiles(input: HTMLInputElement | null, files: File[]) {
  if (!input) {
    return;
  }

  const dataTransfer = new DataTransfer();

  files.forEach((file) => {
    dataTransfer.items.add(file);
  });

  input.files = dataTransfer.files;
}

function getFileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function mergeFiles(existing: File[], incoming: File[]) {
  const merged: File[] = [];
  const seen = new Set<string>();

  for (const file of [...existing, ...incoming]) {
    const key = getFileKey(file);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    merged.push(file);
  }

  return merged.slice(0, CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES);
}

function ComposerForm({ onSuccess }: { onSuccess: () => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    createClientPortfolioPostAction,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.ok) {
      onSuccess();
    }
  }, [onSuccess, state.ok]);

  function updateFiles(nextFiles: File[]) {
    const validFiles = nextFiles.filter((file) =>
      CLIENT_PORTFOLIO_MEDIA_ACCEPTED_TYPES.includes(file.type),
    );
    const mergedFiles = mergeFiles(selectedFiles, validFiles);

    if (nextFiles.length === 0) {
      setNotice(null);
    } else if (validFiles.length !== nextFiles.length) {
      setNotice("Only JPG, PNG, and WebP images are attached.");
    } else if (
      selectedFiles.length + validFiles.length >
      CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES
    ) {
      setNotice(
        `Only the first ${CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES} images are attached.`,
      );
    } else {
      setNotice(null);
    }

    setSelectedFiles(mergedFiles);
    syncInputFiles(inputRef.current, mergedFiles);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    updateFiles(Array.from(event.target.files ?? []));
  }

  return (
    <form
      action={formAction}
      className="flex max-h-[calc(100vh-1.5rem)] flex-col overflow-y-auto"
    >
      <DialogHeader className="sticky top-0 z-10 border-b border-[color:var(--line-strong)] bg-[color:var(--surface)] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <DialogTitle className="text-xl font-bold tracking-[-0.04em]">
              New portfolio post
            </DialogTitle>
          </div>

          <DialogClose
            render={
              <Button
                aria-label="Close modal"
                className="shrink-0"
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <X className="size-4" />
          </DialogClose>
        </div>
      </DialogHeader>

      <div className="flex-1 space-y-4 px-5 py-5">
        <div className="grid gap-4">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]"
                htmlFor="portfolio-title"
              >
                Title
              </label>
              <Input
                className="h-10 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] focus-visible:bg-white"
                id="portfolio-title"
                name="title"
                placeholder="Untitled post"
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]"
                htmlFor="portfolio-description"
              >
                Description
              </label>
              <Textarea
                className="min-h-32 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] focus-visible:bg-white"
                id="portfolio-description"
                name="description"
                placeholder="Share context, progress notes, or the story behind the images."
              />
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                  Images
                </p>
                <p className="mt-1 text-sm text-[color:var(--ink-body)]">
                  JPG, PNG, or WebP. Up to {CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES}{" "}
                  files.
                </p>
              </div>
              <Badge
                className="rounded-full border-0 bg-[color:var(--tone-orange-pale)] px-3 py-1.5 text-[color:var(--tone-orange-deep)]"
                variant="outline"
              >
                <ImageIcon className="size-3.5" />
                {selectedFiles.length}/{CLIENT_PORTFOLIO_MEDIA_MAX_IMAGES}
              </Badge>
            </div>

            <input
              ref={inputRef}
              accept={CLIENT_PORTFOLIO_MEDIA_ACCEPTED_TYPES.join(",")}
              className="sr-only"
              id="portfolio-media"
              multiple
              name="media"
              onChange={handleFileChange}
              required
              type="file"
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-surface-soft)]"
                onClick={() => inputRef.current?.click()}
                type="button"
                variant="outline"
              >
                <ImageIcon className="size-4" />
                Select images
              </Button>
              {selectedFiles.length > 0 ? (
                <div className="ml-auto">
                  <Button
                    className="rounded-xl"
                    onClick={() => {
                      setSelectedFiles([]);
                      setNotice(null);
                      syncInputFiles(inputRef.current, []);
                    }}
                    type="button"
                    variant="ghost"
                  >
                    Clear images
                  </Button>
                </div>
              ) : null}
            </div>

            {notice ? (
              <p className="mt-3 rounded-xl bg-[color:var(--tone-amber-soft)] px-4 py-3 text-sm font-medium text-[color:var(--tone-orange-deep)]">
                {notice}
              </p>
            ) : null}

            <div className="mt-4 grid gap-2">
              {selectedFiles.length > 0 ? (
                selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface)] px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[color:var(--foreground)]">
                        {file.name}
                      </p>
                      <p className="text-xs text-[color:var(--ink-muted)]">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      aria-label={`Remove ${file.name}`}
                      className="shrink-0"
                      onClick={() => {
                        const nextFiles = selectedFiles.filter(
                          (_, current) => current !== index,
                        );
                        setSelectedFiles(nextFiles);
                        syncInputFiles(inputRef.current, nextFiles);
                        setNotice(null);
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
                <div className="rounded-xl border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface)] px-4 py-5 text-center">
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    No images selected yet
                  </p>
                  <p className="mt-1 text-xs leading-6 text-[color:var(--ink-muted)]">
                    Pick at least one image to publish the post.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {state.message ? (
          <p
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              state.ok
                ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
                : "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]"
            }`}
            role={state.ok ? "status" : "alert"}
          >
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="sticky bottom-0 z-10 border-t border-[color:var(--line-strong)] bg-[color:var(--surface)] px-5 py-4">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            className="rounded-xl"
            disabled={isPending || selectedFiles.length === 0}
            type="submit"
          >
            {isPending ? "Publishing..." : "Create post"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function ClientPortfolioComposer() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setFormSession((value) => value + 1);
        }
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger
        render={
          <Button
            className="h-8 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface)] px-3 text-xs font-semibold shadow-[var(--shadow-surface-soft)]"
            size="sm"
            variant="outline"
          />
        }
      >
        <Plus className="size-3.5" />
        Add post
      </DialogTrigger>

      <DialogContent
        className="!w-[min(1120px,calc(100vw-1.5rem))] !max-w-[min(1120px,calc(100vw-1.5rem))] overflow-hidden border-[color:var(--line-strong)] bg-[color:var(--surface)] p-0 shadow-[var(--shadow-lg)] sm:!max-w-[1120px]"
        showCloseButton={false}
      >
        <ComposerForm
          key={formSession}
          onSuccess={() => {
            setOpen(false);
            setFormSession((value) => value + 1);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
