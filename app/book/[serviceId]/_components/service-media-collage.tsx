"use client";

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
import { getServiceMediaCollageLayout } from "@/lib/bookings/media-collage";
import type { BookingServiceMediaItem } from "@/lib/bookings/types";

type ServiceMediaCollageProps = {
  media: BookingServiceMediaItem[];
  title: string;
};

function MediaTile({
  className,
  index,
  onOpen,
  src,
  title,
}: {
  className: string;
  index: number;
  onOpen: () => void;
  src: string;
  title: string;
}) {
  return (
    <button
      className={`group relative block w-full overflow-hidden rounded-[1.1rem] bg-[color:var(--surface-alt)] ${className}`}
      onClick={onOpen}
      type="button"
    >
      <Image
        alt={`${title} image ${index + 1}`}
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
      aria-label={`View ${count} more service images`}
      className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-[1.1rem] bg-black/75 text-2xl font-black tracking-normal text-white transition duration-300 hover:bg-black/80"
      onClick={onOpen}
      type="button"
    >
      +{count}
    </button>
  );
}

function GalleryDialog({
  media,
  onOpenChange,
  open,
  title,
}: ServiceMediaCollageProps & {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(88vh,860px)] max-w-[min(1100px,calc(100%-1.5rem))] overflow-hidden border-[color:var(--line-strong)] bg-[color:var(--surface)] p-0 shadow-[var(--shadow-lg)]">
        <DialogHeader className="border-b border-[color:var(--line-strong)] px-4 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold tracking-normal">
            <ImageIcon className="size-4 text-[color:var(--brand-orange)]" />
            Service images
          </DialogTitle>
          <DialogDescription className="text-sm text-[color:var(--ink-muted)]">
            {title}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(min(88vh,860px)-88px)] space-y-4 overflow-y-auto px-4 pb-4">
          {media.map((entry, index) => (
            <div
              className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.1rem] bg-black"
              key={entry.id}
            >
              <Image
                alt={`${title} image ${index + 1}`}
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

export function ServiceMediaCollage({
  media,
  title,
}: ServiceMediaCollageProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { hiddenCount, visibleImageCount } = getServiceMediaCollageLayout(
    media.length,
  );
  const visibleMedia = media.slice(0, visibleImageCount);
  const openGallery = () => setGalleryOpen(true);

  if (visibleMedia.length === 0) {
    return null;
  }

  if (visibleMedia.length === 1) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[color:var(--line-strong)] bg-white p-4 shadow-[var(--shadow-surface-soft)]">
        <MediaTile
          className="aspect-[16/9]"
          index={0}
          onOpen={openGallery}
          src={visibleMedia[0].url}
          title={title}
        />
        <GalleryDialog
          media={media}
          onOpenChange={setGalleryOpen}
          open={galleryOpen}
          title={title}
        />
      </div>
    );
  }

  if (visibleMedia.length === 4 && hiddenCount === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[color:var(--line-strong)] bg-white p-4 shadow-[var(--shadow-surface-soft)]">
        <div className="grid h-[260px] grid-cols-2 grid-rows-2 gap-2 sm:h-[320px]">
          {visibleMedia.map((entry, index) => (
            <MediaTile
              className="h-full min-h-0"
              index={index}
              key={entry.id}
              onOpen={openGallery}
              src={entry.url}
              title={title}
            />
          ))}
        </div>
        <GalleryDialog
          media={media}
          onOpenChange={setGalleryOpen}
          open={galleryOpen}
          title={title}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--line-strong)] bg-white p-4 shadow-[var(--shadow-surface-soft)]">
      <div className="grid h-[260px] grid-cols-2 grid-rows-2 gap-2 sm:h-[320px]">
        <MediaTile
          className="row-span-2 h-full"
          index={0}
          onOpen={openGallery}
          src={visibleMedia[0].url}
          title={title}
          />
        {visibleMedia.slice(1).map((entry, index) => (
          <MediaTile
            className={
              visibleMedia.length === 2 && hiddenCount === 0
                ? "row-span-2 h-full"
                : "h-full min-h-0"
            }
            index={index + 1}
            key={entry.id}
            onOpen={openGallery}
            src={entry.url}
            title={title}
          />
        ))}
        {hiddenCount > 0 ? (
          <GalleryOverlayTile count={hiddenCount} onOpen={openGallery} />
        ) : null}
      </div>
      <GalleryDialog
        media={media}
        onOpenChange={setGalleryOpen}
        open={galleryOpen}
        title={title}
      />
    </div>
  );
}
