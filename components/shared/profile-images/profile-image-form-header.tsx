"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ProfileImageFormHeaderProps = {
  maxFileSizeLabel: string;
};

export function ProfileImageFormHeader({
  maxFileSizeLabel,
}: ProfileImageFormHeaderProps) {
  return (
    <DialogHeader className="border-b border-[color:var(--line-strong)] px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <DialogTitle className="text-xl font-bold tracking-[-0.04em]">
            Update profile images
          </DialogTitle>
          <DialogDescription className="mt-1 max-w-2xl text-sm text-[color:var(--ink-muted)]">
            Upload a new profile picture and background photo. JPG, PNG, and
            WebP images up to {maxFileSizeLabel} each are supported.
          </DialogDescription>
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
  );
}
