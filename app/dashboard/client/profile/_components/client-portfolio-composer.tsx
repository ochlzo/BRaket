"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PortfolioPostDialogFrame } from "@/components/shared/portfolio/portfolio-post-dialog-frame";

import { ClientPortfolioComposerForm } from "./client-portfolio-composer-form";

export function ClientPortfolioComposer() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);

  return (
    <>
      <Button
        className="h-8 rounded-full border-[color:var(--line-strong)] bg-[color:var(--surface)] px-3 text-xs font-semibold shadow-[var(--shadow-surface-soft)]"
        onClick={() => setOpen(true)}
        size="sm"
        variant="outline"
      >
        <Plus className="size-3.5" />
        Add post
      </Button>

      <PortfolioPostDialogFrame
        description="Add a portfolio post using the same fields and validation as talent onboarding."
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setFormSession((value) => value + 1);
          }
          setOpen(nextOpen);
        }}
        open={open}
        title="Add portfolio post"
      >
        <ClientPortfolioComposerForm
          key={formSession}
          onCancel={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            setFormSession((value) => value + 1);
            router.refresh();
          }}
        />
      </PortfolioPostDialogFrame>
    </>
  );
}

