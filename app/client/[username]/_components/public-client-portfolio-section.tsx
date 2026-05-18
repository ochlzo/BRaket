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
import type { ClientProfilePortfolioItem } from "@/lib/client-profile/types";

type PublicClientPortfolioSectionProps = {
  portfolio: ClientProfilePortfolioItem[];
};

type GalleryState = ClientProfilePortfolioItem | null;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function PortfolioImage({
  alt,
  className,
  onOpen,
  src,
}: {
  alt: string;
  className: string;
  onOpen: () => void;
  src: string;
}) {
  return (
    <button
      className={`group relative block w-full overflow-hidden rounded-[1.1rem] bg-[color:var(--surface-alt)] ${className}`}
      onClick={onOpen}
      type="button"
    >
      <Image
        alt={alt}
        className="object-cover transition duration-300 group-hover:scale-[1.03]"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        src={src}
      />
    </button>
  );
}

function GalleryOverlayTile({
  count,
  onOpen,
}: {
  count: number;
  onOpen: () => void;
}) {
  return (
    <button
      aria-label={`View ${count} more portfolio images`}
      className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-[1.1rem] bg-black/75 text-2xl font-black tracking-normal text-white transition duration-300 hover:bg-black/80"
      onClick={onOpen}
      type="button"
    >
      +{count}
    </button>
  );
}

function PortfolioGalleryDialog({
  item,
  onOpenChange,
  open,
}: {
  item: ClientProfilePortfolioItem | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(88vh,860px)] max-w-[min(1100px,calc(100%-1.5rem))] overflow-hidden border-[color:var(--line-strong)] bg-[color:var(--surface)] p-0 shadow-[var(--shadow-lg)]">
        {item ? (
          <>
            <DialogHeader className="border-b border-[color:var(--line-strong)] px-4 py-4">
              <DialogTitle className="flex items-center gap-2 text-lg font-bold tracking-normal">
                <ImageIcon className="size-4 text-[color:var(--brand-orange)]" />
                Portfolio images
              </DialogTitle>
              <DialogDescription className="text-sm text-[color:var(--ink-muted)]">
                {item.title}
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[calc(min(88vh,860px)-88px)] space-y-4 overflow-y-auto px-4 pb-4">
              {item.media.map((entry, index) => (
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.1rem] bg-black"
                  key={entry.id}
                >
                  <Image
                    alt={`${item.title} image ${index + 1}`}
                    className="object-contain"
                    fill
                    sizes="(max-width: 768px) 100vw, 90vw"
                    src={entry.url}
                  />
                </div>
              ))}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function PortfolioCard({
  item,
  onOpenGallery,
}: {
  item: ClientProfilePortfolioItem;
  onOpenGallery: (item: ClientProfilePortfolioItem) => void;
}) {
  const visibleMedia = item.media.length >= 5
    ? item.media.slice(0, 2)
    : item.media.slice(0, 4);
  const hiddenCount = item.media.length >= 5 ? item.media.length - 2 : 0;
  const openGallery = () => onOpenGallery(item);

  return (
    <article className="rounded-[1.1rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-surface-soft)]">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-muted)]">
            <CalendarDays className="mr-1 inline size-3.5" />
            {formatDate(item.createdAt)}
          </p>
          <h3 className="mt-2 text-base font-bold tracking-normal text-[color:var(--foreground)] sm:text-lg">
            {item.title}
          </h3>
        </div>
        <span className="rounded-full bg-[color:var(--tone-orange-pale)] px-3 py-1.5 text-xs font-semibold text-[color:var(--tone-orange-deep)]">
          {item.media.length} image{item.media.length === 1 ? "" : "s"}
        </span>
      </div>

      {visibleMedia.length > 0 ? (
        <div className="grid h-[260px] grid-cols-2 grid-rows-2 gap-2 sm:h-[320px]">
          {visibleMedia.length === 1 ? (
            <PortfolioImage
              alt={item.title}
              className="col-span-2 row-span-2 h-full"
              onOpen={openGallery}
              src={visibleMedia[0].url}
            />
          ) : visibleMedia.length === 4 ? (
            visibleMedia.map((entry) => (
              <PortfolioImage
                alt={item.title}
                className="h-full min-h-0"
                key={entry.id}
                onOpen={openGallery}
                src={entry.url}
              />
            ))
          ) : (
            <>
              <PortfolioImage
                alt={item.title}
                className="row-span-2 h-full min-h-0"
                onOpen={openGallery}
                src={visibleMedia[0].url}
              />
              {visibleMedia.slice(1).map((entry) => (
                <PortfolioImage
                  alt={item.title}
                  className={
                    visibleMedia.length === 2 && hiddenCount === 0
                      ? "row-span-2 h-full min-h-0"
                      : "h-full min-h-0"
                  }
                  key={entry.id}
                  onOpen={openGallery}
                  src={entry.url}
                />
              ))}
              {hiddenCount > 0 ? (
                <GalleryOverlayTile
                  count={item.media.length - 2}
                  onOpen={openGallery}
                />
              ) : null}
            </>
          )}
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center rounded-[1.1rem] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-center">
          <div>
            <ImageIcon className="mx-auto size-5 text-[color:var(--brand-orange)]" />
            <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">
              No media attached
            </p>
          </div>
        </div>
      )}

      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[color:var(--ink-body)]">
        {item.description || "No project description provided yet."}
      </p>
    </article>
  );
}

export function PublicClientPortfolioSection({
  portfolio,
}: PublicClientPortfolioSectionProps) {
  const [galleryItem, setGalleryItem] = useState<GalleryState>(null);

  return (
    <>
      <section className="rounded-none border-0 bg-transparent sm:rounded-[1.2rem] sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:shadow-[var(--shadow-panel-soft)]">
        <div className="border-b border-[color:var(--line-strong)] px-4 py-4 sm:px-5">
          <h2 className="typo-card-title-xl">Client Portfolio</h2>
          <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
            Project briefs and references shared by this client.
          </p>
        </div>
        <div className="space-y-4 px-4 py-4 sm:px-5">
          {portfolio.length > 0 ? (
            portfolio.map((item) => (
              <PortfolioCard
                item={item}
                key={item.id}
                onOpenGallery={setGalleryItem}
              />
            ))
          ) : (
            <div className="rounded-[1.1rem] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-5 py-10 text-center">
              <p className="text-base font-semibold text-[color:var(--foreground)]">
                No portfolio posts yet
              </p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[color:var(--ink-muted)]">
                Portfolio posts will appear here when this client adds them.
              </p>
            </div>
          )}
        </div>
      </section>

      <PortfolioGalleryDialog
        item={galleryItem}
        onOpenChange={(open) => !open && setGalleryItem(null)}
        open={Boolean(galleryItem)}
      />
    </>
  );
}
