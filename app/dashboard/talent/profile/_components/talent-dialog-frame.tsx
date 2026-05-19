"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { semantic } from "@/lib/theme/semantic";
import { cn } from "@/lib/utils";

type TalentDialogFrameProps = {
  children: ReactNode;
  description: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

export function TalentDialogFrame({
  children,
  description,
  onOpenChange,
  open,
  title,
}: TalentDialogFrameProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          semantic.panel.card,
          "flex max-h-[calc(100dvh-0.75rem)] w-[calc(100vw-0.75rem)] max-w-[calc(100vw-0.75rem)] flex-col overflow-hidden p-0 shadow-[var(--shadow-lg)] sm:max-h-[calc(100vh-1rem)] sm:w-[min(42rem,calc(100vw-1rem))] sm:max-w-[min(42rem,calc(100vw-1rem))]",
        )}
      >
        <DialogHeader
          className={`sticky top-0 z-10 shrink-0 border-b bg-[color:var(--surface)] px-4 py-4 sm:px-5 ${semantic.border.strong}`}
        >
          <DialogTitle
            className={`text-lg font-bold tracking-normal sm:text-xl ${semantic.text.heading}`}
          >
            {title}
          </DialogTitle>
          <DialogDescription
            className={`max-w-xl text-sm ${semantic.text.muted}`}
          >
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
