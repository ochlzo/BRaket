"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TalentProfileSectionActionProps = {
  children: ReactNode;
  label: string;
  onClick: () => void;
};

export function TalentProfileSectionAction({
  children,
  label,
  onClick,
}: TalentProfileSectionActionProps) {
  return (
    <Button
      aria-label={label}
      className={cn(
        "rounded-full bg-[color:var(--surface)] text-[color:var(--brand-orange)]",
        "border-[color:var(--line-strong)] shadow-[var(--shadow-surface-soft)]",
        "hover:bg-[color:var(--surface-alt)] hover:text-[color:var(--brand-orange-strong)]",
      )}
      onClick={onClick}
      size="icon-sm"
      title={label}
      type="button"
      variant="outline"
    >
      {children}
      <span className="sr-only">{label}</span>
    </Button>
  );
}
