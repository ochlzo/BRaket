"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TalentDeleteDialogActionProps = {
  confirmDescription: string;
  confirmLabel: string;
  confirmTitle: string;
  onConfirm: () => Promise<{ message: string; ok: boolean }>;
  onDeleted: () => void;
  triggerLabel: string;
};

export function TalentDeleteDialogAction({
  confirmDescription,
  confirmLabel,
  confirmTitle,
  onConfirm,
  onDeleted,
  triggerLabel,
}: TalentDeleteDialogActionProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    if (isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await onConfirm();

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpen(false);
      onDeleted();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button
        aria-label={triggerLabel}
        className="h-8 rounded-full border-[color:var(--tone-red-base)] px-3 text-[color:var(--tone-red-base)] hover:bg-[color:var(--tone-red-base)]/8"
        size="sm"
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-lg)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-normal text-[color:var(--foreground)]">
              {confirmTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-[color:var(--ink-muted)]">
              {confirmDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              className="rounded-xl"
              disabled={isDeleting}
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl bg-[color:var(--tone-red-base)] text-white hover:bg-[color:var(--tone-red-deep,#b42318)]"
              disabled={isDeleting}
              type="button"
              onClick={handleConfirm}
            >
              {isDeleting ? "Deleting..." : confirmLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
