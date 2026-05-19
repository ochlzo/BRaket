"use client";

import type { ReactNode } from "react";

import { PortfolioPostDialogFrame } from "@/components/shared/portfolio/portfolio-post-dialog-frame";

type TalentDialogFrameProps = {
  children: ReactNode;
  description: string;
  headerAction?: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

export function TalentDialogFrame({
  children,
  description,
  headerAction,
  onOpenChange,
  open,
  title,
}: TalentDialogFrameProps) {
  return (
    <PortfolioPostDialogFrame
      description={description}
      headerAction={headerAction}
      onOpenChange={onOpenChange}
      open={open}
      title={title}
    >
      {children}
    </PortfolioPostDialogFrame>
  );
}
