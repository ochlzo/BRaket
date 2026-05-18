"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function IdCardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm0 0H9.75"
      />
    </svg>
  );
}

type FileInputProps = {
  id: string;
  accept?: string;
  name?: string;
  required?: boolean;
};

export function FileInput({ id, accept, name, required }: FileInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fileName = selectedFile?.name ?? "No file chosen";
  const hasFile = selectedFile !== null;
  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
        <IdCardIcon />
      </div>

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        name={name}
        required={required}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setSelectedFile(file ?? null);
        }}
      />

      <div className="flex h-11 items-center gap-3 rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 pr-3 text-sm">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-7 items-center rounded-md border border-[color:var(--line-strong)] bg-white px-2.5 text-xs font-semibold text-[color:var(--ink-body)] transition-colors hover:bg-[color:var(--surface-alt)] active:bg-[color:var(--line-strong)]"
        >
          Choose File
        </button>

        <span className="flex-1 truncate text-[color:var(--ink-soft)]">
          {fileName}
        </span>

        {hasFile && (
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex h-7 items-center rounded-md border border-[color:var(--line-strong)] bg-white px-2.5 text-xs font-semibold text-[color:var(--ink-body)] transition-colors hover:bg-[color:var(--surface-alt)] active:bg-[color:var(--line-strong)]"
          >
            Preview
          </button>
        )}
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl p-5 lg:max-w-5xl">
          <DialogHeader>
            <DialogTitle>School ID Preview</DialogTitle>
            <DialogDescription>
              Preview of the uploaded image file.
            </DialogDescription>
          </DialogHeader>

          {previewUrl && (
            <div className="relative mt-4 w-full max-h-[70vh] min-h-[260px] sm:min-h-[320px] lg:mx-auto lg:min-h-0 lg:aspect-[4/3]">
              <Image
                src={previewUrl}
                alt={
                  selectedFile
                    ? `${selectedFile.name} preview`
                    : "Uploaded image preview"
                }
                fill
                sizes="(max-width: 1024px) 90vw, 1200px"
                className="rounded-xl object-cover"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
