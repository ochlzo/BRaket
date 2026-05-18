"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ClientProfilePortfolioItem } from "@/lib/client-profile/types";

type ClientPortfolioCollageProps = {
  item: ClientProfilePortfolioItem;
  onPreview: (media: { alt: string; src: string }) => void;
};

function MediaTile({
  alt,
  className,
  onPreview,
  src,
}: {
  alt: string;
  className: string;
  onPreview: (media: { alt: string; src: string }) => void;
  src: string;
}) {
  return (
    <button
      className={`group relative block w-full overflow-hidden rounded-[1.1rem] bg-[color:var(--surface-alt)] ${className}`}
      onClick={() => onPreview({ alt, src })}
      type="button"
    >
      <Image
        alt={alt}
        className="object-cover transition duration-300 group-hover:scale-[1.03]"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        src={src}
      />
    </button>
  );
}

function CollageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-[280px] overflow-hidden rounded-[1.1rem] sm:h-[360px] lg:h-[420px]">
      {children}
    </div>
  );
}

function EmptyMediaState() {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-[1.1rem] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-center sm:h-[360px] lg:h-[420px]">
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
      className="group relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-[1.1rem] bg-black/75 text-2xl font-black tracking-[-0.04em] text-white transition duration-300 hover:bg-black/80"
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
  item: ClientProfilePortfolioItem;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(88vh,860px)] max-w-[min(1100px,calc(100%-1.5rem))] overflow-hidden border-[color:var(--line-strong)] bg-[color:var(--surface)] p-0 shadow-[var(--shadow-lg)]">
        <DialogHeader className="border-b border-[color:var(--line-strong)] px-4 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold tracking-[-0.03em]">
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
      </DialogContent>
    </Dialog>
  );
}

export function ClientPortfolioCollage({
  item,
  onPreview,
}: ClientPortfolioCollageProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const media = item.media.slice(0, 5);

  if (media.length === 0) {
    return <EmptyMediaState />;
  }

  if (media.length === 1) {
    return (
      <CollageFrame>
        <MediaTile
          alt={item.title}
          className="h-full"
          onPreview={onPreview}
          src={media[0].url}
        />
      </CollageFrame>
    );
  }

  if (media.length === 2) {
    return (
      <CollageFrame>
        <div className="grid h-full grid-cols-2 gap-2">
          {media.map((entry) => (
            <MediaTile
              key={entry.id}
              alt={item.title}
              className="h-full min-h-0"
              onPreview={onPreview}
              src={entry.url}
            />
          ))}
        </div>
      </CollageFrame>
    );
  }

  if (media.length === 3) {
    return (
      <CollageFrame>
        <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
          <MediaTile
            alt={item.title}
            className="row-span-2 h-full min-h-0"
            onPreview={onPreview}
            src={media[0].url}
          />
          <MediaTile
            alt={item.title}
            className="h-full min-h-0"
            onPreview={onPreview}
            src={media[1].url}
          />
          <MediaTile
            alt={item.title}
            className="h-full min-h-0"
            onPreview={onPreview}
            src={media[2].url}
          />
        </div>
      </CollageFrame>
    );
  }

  if (media.length === 4) {
    return (
      <CollageFrame>
        <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
          {media.map((entry) => (
            <MediaTile
              key={entry.id}
              alt={item.title}
              className="h-full min-h-0"
              onPreview={onPreview}
              src={entry.url}
            />
          ))}
        </div>
      </CollageFrame>
    );
  }

  return (
    <>
      <CollageFrame>
        <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
          <MediaTile
            alt={item.title}
            className="row-span-2 h-full min-h-0"
            onPreview={onPreview}
            src={media[0].url}
          />
          <MediaTile
            alt={item.title}
            className="h-full min-h-0"
            onPreview={onPreview}
            src={media[1].url}
          />
          <GalleryOverlayTile
            count={item.media.length - 2}
            onOpen={() => setGalleryOpen(true)}
          />
        </div>
      </CollageFrame>
      <PortfolioGalleryDialog
        item={item}
        onOpenChange={setGalleryOpen}
        open={galleryOpen}
      />
    </>
  );
}
