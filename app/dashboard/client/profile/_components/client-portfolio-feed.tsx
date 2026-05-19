"use client";

import Image from "next/image";
import { useState } from "react";
import { CalendarDays, ImageIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ClientProfilePortfolioItem } from "@/lib/client-profile/types";
import { ClientPortfolioComposer } from "./client-portfolio-composer";
import { ClientPortfolioCollage } from "./client-portfolio-collage";
import { ClientPortfolioEditDialog } from "./client-portfolio-edit-dialog";

type ClientPortfolioFeedProps = {
  portfolio: ClientProfilePortfolioItem[];
};

type ViewerState = {
  alt: string;
  src: string;
} | null;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function ClientPortfolioFeed({ portfolio }: ClientPortfolioFeedProps) {
  const [viewer, setViewer] = useState<ViewerState>(null);

  return (
    <>
      <Card className="gap-0 rounded-none border-0 bg-transparent py-0 shadow-none ring-0 sm:gap-4 sm:rounded-xl sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:py-4 sm:shadow-[var(--shadow-panel-soft)] sm:ring-1 sm:ring-foreground/10">
        <CardHeader className="relative flex flex-col gap-3 pr-0 sm:flex-row sm:items-start sm:justify-between sm:pr-52">
          <div>
            <CardTitle className="typo-card-title-xl">
              Client portfolio
            </CardTitle>
            <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
              Project briefs and visual references attached to this client
              account.
            </p>
          </div>
          <div className="absolute right-4 top-0 z-20 flex items-center gap-2 sm:right-5 sm:top-5">
            <span className="pointer-events-none inline-flex w-fit items-center gap-1.5 rounded-full bg-[color:var(--tone-orange-pale)] px-3 py-1.5 text-xs font-semibold text-[color:var(--tone-orange-deep)]">
              <ImageIcon className="size-3.5" />
              {portfolio.length} post{portfolio.length === 1 ? "" : "s"}
            </span>
            <ClientPortfolioComposer />
          </div>
          <Separator className="mt-1 sm:hidden" />
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4 sm:px-5 sm:pb-5">
          <div className="pb-1 sm:hidden" />
          {portfolio.length > 0 ? (
            portfolio.map((item, index) => (
              <div key={item.id} className="pb-4 last:pb-0">
                <article className="mx-auto w-full max-w-[40rem] rounded-none border-0 bg-transparent p-0 shadow-none sm:rounded-[1.2rem] sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:p-4 sm:shadow-[var(--shadow-surface-soft)]">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-muted)]">
                        <CalendarDays className="mr-1 inline size-3.5" />
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                    <ClientPortfolioEditDialog item={item} />
                  </div>
                  <h3 className="text-base font-bold tracking-[-0.03em] text-[color:var(--foreground)] sm:text-lg">
                        {item.title}
                  </h3>

                  <ClientPortfolioCollage
                    item={item}
                    onPreview={(next) => setViewer(next)}
                  />

                  <p className="mt-4 text-sm leading-7 text-[color:var(--ink-body)]">
                    {item.description || "No project description provided yet."}
                  </p>
                </article>

                {index < portfolio.length - 1 ? (
                  <Separator className="mt-4 sm:hidden" />
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-none border-0 bg-transparent px-0 py-4 text-center sm:rounded-[1.2rem] sm:border sm:border-dashed sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface-alt)] sm:px-5 sm:py-10">
              <p className="text-base font-semibold text-[color:var(--foreground)]">
                No portfolio posts yet
              </p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[color:var(--ink-muted)]">
                Add sample work or organization details to make this client
                account more engaging.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(viewer)}
        onOpenChange={(open) => !open && setViewer(null)}
      >
        <DialogContent className="max-w-[min(1100px,calc(100%-1.5rem))] border-[color:var(--line-strong)] bg-[color:var(--surface)] p-0 shadow-[var(--shadow-lg)]">
          {viewer ? (
            <>
              <DialogHeader className="px-4 pt-4">
                <DialogTitle className="flex items-center gap-2 text-lg font-bold tracking-[-0.03em]">
                  <ImageIcon className="size-4 text-[color:var(--brand-orange)]" />
                  Portfolio preview
                </DialogTitle>
                <DialogDescription className="text-sm text-[color:var(--ink-muted)]">
                  {viewer.alt}
                </DialogDescription>
              </DialogHeader>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <Image
                  alt={viewer.alt}
                  className="object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, 90vw"
                  src={viewer.src}
                />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
