"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ClientPortfolioComposerForm } from "./client-portfolio-composer-form";

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
        <ClientPortfolioComposerForm
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

