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
import type { ClientProfilePortfolioItem } from "@/lib/client-profile/types";

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

function PortfolioImageGrid({
  item,
  onPreview,
}: {
  item: ClientProfilePortfolioItem;
  onPreview: (media: { alt: string; src: string }) => void;
}) {
  const media = item.media.slice(0, 3);

  if (media.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-[1.1rem] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-center">
        <div>
          <ImageIcon className="mx-auto size-5 text-[color:var(--brand-orange)]" />
          <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">
            No media attached
          </p>
          <p className="mt-1 text-xs text-[color:var(--ink-muted)]">
            This brief only has text right now.
          </p>
        </div>
      </div>
    );
  }

  if (media.length === 1) {
    return (
      <button
        className="group relative aspect-[16/9] overflow-hidden rounded-[1.1rem] bg-[color:var(--surface-alt)]"
        onClick={() => onPreview({ alt: item.title, src: media[0].url })}
        type="button"
      >
        <Image alt={item.title} className="object-cover transition duration-300 group-hover:scale-[1.03]" fill sizes="(max-width: 768px) 100vw, 70vw" src={media[0].url} />
      </button>
    );
  }

  if (media.length === 2) {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {media.map((entry) => (
          <button
            key={entry.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-[color:var(--surface-alt)]"
            onClick={() => onPreview({ alt: item.title, src: entry.url })}
            type="button"
          >
            <Image alt={item.title} className="object-cover transition duration-300 group-hover:scale-[1.03]" fill sizes="(max-width: 768px) 100vw, 35vw" src={entry.url} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-[1.15fr_0.85fr]">
      <button
        className="group relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-[color:var(--surface-alt)]"
        onClick={() => onPreview({ alt: item.title, src: media[0].url })}
        type="button"
      >
        <Image alt={item.title} className="object-cover transition duration-300 group-hover:scale-[1.03]" fill sizes="(max-width: 768px) 100vw, 55vw" src={media[0].url} />
      </button>
      <div className="grid gap-2">
        {media.slice(1).map((entry) => (
          <button
            key={entry.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-[color:var(--surface-alt)]"
            onClick={() => onPreview({ alt: item.title, src: entry.url })}
            type="button"
          >
            <Image alt={item.title} className="object-cover transition duration-300 group-hover:scale-[1.03]" fill sizes="(max-width: 768px) 100vw, 30vw" src={entry.url} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ClientPortfolioFeed({ portfolio }: ClientPortfolioFeedProps) {
  const [viewer, setViewer] = useState<ViewerState>(null);

  return (
    <>
      <Card className="border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-panel-soft)]">
        <CardHeader className="relative flex flex-col gap-3 pr-0 sm:flex-row sm:items-start sm:justify-between sm:pr-28">
          <div>
            <CardTitle className="typo-card-title-xl">Client portfolio</CardTitle>
            <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
              Project briefs and visual references attached to this client account.
            </p>
          </div>
          <span className="pointer-events-none inline-flex w-fit items-center gap-1.5 self-start rounded-full bg-[color:var(--tone-orange-pale)] px-3 py-1.5 text-xs font-semibold text-[color:var(--tone-orange-deep)] sm:absolute sm:right-5 sm:top-5 sm:self-auto">
            <ImageIcon className="size-3.5" />
            {portfolio.length} post{portfolio.length === 1 ? "" : "s"}
          </span>
        </CardHeader>
        <CardContent className="space-y-4 px-4 pb-4 sm:px-5 sm:pb-5">
          {portfolio.length > 0 ? (
            portfolio.map((item) => (
              <article
                key={item.id}
                className="rounded-[1.2rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-3 shadow-[var(--shadow-surface-soft)] sm:p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-muted)]">
                      <CalendarDays className="mr-1 inline size-3.5" />
                      {formatDate(item.createdAt)}
                    </p>
                    <h3 className="mt-1 text-base font-bold tracking-[-0.03em] text-[color:var(--foreground)] sm:text-lg">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[color:var(--ink-muted)] sm:text-sm">
                    {item.media.length} media item{item.media.length === 1 ? "" : "s"}
                  </p>
                </div>

                <PortfolioImageGrid item={item} onPreview={(next) => setViewer(next)} />

                <p className="mt-4 text-sm leading-7 text-[color:var(--ink-body)]">
                  {item.description || "No project description provided yet."}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-[1.2rem] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-8 text-center sm:px-5 sm:py-10">
              <p className="text-base font-semibold text-[color:var(--foreground)]">
                No portfolio posts yet
              </p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[color:var(--ink-muted)]">
                Add the first project brief, image set, or work sample to make the client profile feel active and ready for talents to browse.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(viewer)} onOpenChange={(open) => !open && setViewer(null)}>
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
