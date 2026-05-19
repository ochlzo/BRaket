"use client";

import { useState } from "react";
import { PencilLine } from "lucide-react";

import { PortfolioPostDialogFrame } from "@/components/shared/portfolio/portfolio-post-dialog-frame";
import type { ClientProfilePortfolioItem } from "@/lib/client-profile/types";

import { ClientPortfolioComposerForm } from "./client-portfolio-composer-form";

type ClientPortfolioEditDialogProps = {
  item: ClientProfilePortfolioItem;
};

export function ClientPortfolioEditDialog({
  item,
}: ClientPortfolioEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);

  return (
    <>
      <button
        aria-label={`Edit ${item.title}`}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface)] text-[color:var(--brand-orange)] shadow-[var(--shadow-surface-soft)] transition hover:bg-[color:var(--surface-alt)]"
        onClick={() => {
          setFormSession((value) => value + 1);
          setOpen(true);
        }}
        type="button"
      >
        <PencilLine className="size-4" />
      </button>

      <PortfolioPostDialogFrame
        description="Update this portfolio post using the same fields and validation as talent onboarding."
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setFormSession((value) => value + 1);
          }
          setOpen(nextOpen);
        }}
        open={open}
        title={`Edit ${item.title}`}
      >
        <ClientPortfolioComposerForm
          key={`${item.id}-${formSession}`}
          item={item}
          mode="edit"
          onCancel={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            setFormSession((value) => value + 1);
          }}
        />
      </PortfolioPostDialogFrame>
    </>
  );
}
