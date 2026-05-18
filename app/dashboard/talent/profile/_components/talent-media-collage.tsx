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
import type { TalentProfileMediaItem } from "@/lib/talent-profile/types";

type TalentMediaCollageProps = {
  dialogTitle: string;
  frameClassName?: string;
  media: TalentProfileMediaItem[];
  title: string;
};

function MediaTile({
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
        sizes="(max-width: 768px) 100vw, 50vw"
        src={src}
      />
    </button>
  );
}

function CollageFrame({
  children,
  className = "h-[220px] sm:h-[260px]",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-[1.1rem] ${className}`}>
      {children}
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
      aria-label={`View ${count} more images`}
      className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-[1.1rem] bg-black/75 text-2xl font-black tracking-[-0.04em] text-white transition duration-300 hover:bg-black/80"
      onClick={onOpen}
      type="button"
    >
      +{count}
    </button>
  );
}

function MediaGalleryDialog({
  dialogTitle,
  media,
  onOpenChange,
  open,
  title,
}: TalentMediaCollageProps & {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(88vh,860px)] max-w-[min(1100px,calc(100%-1.5rem))] overflow-hidden border-[color:var(--line-strong)] bg-[color:var(--surface)] p-0 shadow-[var(--shadow-lg)]">
        <DialogHeader className="border-b border-[color:var(--line-strong)] px-4 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold tracking-[-0.03em]">
            <ImageIcon className="size-4 text-[color:var(--brand-orange)]" />
            {dialogTitle}
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

export function TalentMediaCollage({
  dialogTitle,
  frameClassName,
  media,
  title,
}: TalentMediaCollageProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const visibleMedia = media.slice(0, 5);
  const openGallery = () => setGalleryOpen(true);

  if (visibleMedia.length === 0) {
    return null;
  }

  if (visibleMedia.length === 1) {
    return (
      <>
        <CollageFrame className={frameClassName}>
          <MediaTile
            alt={title}
            className="h-full"
            onOpen={openGallery}
            src={visibleMedia[0].url}
          />
        </CollageFrame>
        <MediaGalleryDialog
          dialogTitle={dialogTitle}
          media={media}
          onOpenChange={setGalleryOpen}
          open={galleryOpen}
          title={title}
        />
      </>
    );
  }

  if (visibleMedia.length === 2) {
    return (
      <>
        <CollageFrame className={frameClassName}>
          <div className="grid h-full grid-cols-2 gap-2">
            {visibleMedia.map((entry) => (
              <MediaTile
                key={entry.id}
                alt={title}
                className="h-full min-h-0"
                onOpen={openGallery}
                src={entry.url}
              />
            ))}
          </div>
        </CollageFrame>
        <MediaGalleryDialog
          dialogTitle={dialogTitle}
          media={media}
          onOpenChange={setGalleryOpen}
          open={galleryOpen}
          title={title}
        />
      </>
    );
  }

  if (visibleMedia.length === 4) {
    return (
      <>
        <CollageFrame className={frameClassName}>
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
            {visibleMedia.map((entry) => (
              <MediaTile
                key={entry.id}
                alt={title}
                className="h-full min-h-0"
                onOpen={openGallery}
                src={entry.url}
              />
            ))}
          </div>
        </CollageFrame>
        <MediaGalleryDialog
          dialogTitle={dialogTitle}
          media={media}
          onOpenChange={setGalleryOpen}
          open={galleryOpen}
          title={title}
        />
      </>
    );
  }

  return (
    <>
      <CollageFrame className={frameClassName}>
        <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
          <MediaTile
            alt={title}
            className="row-span-2 h-full min-h-0"
            onOpen={openGallery}
            src={visibleMedia[0].url}
          />
          <MediaTile
            alt={title}
            className="h-full min-h-0"
            onOpen={openGallery}
            src={visibleMedia[1].url}
          />
          {visibleMedia.length >= 5 ? (
            <GalleryOverlayTile
              count={media.length - 2}
              onOpen={openGallery}
            />
          ) : (
            <MediaTile
              alt={title}
              className="h-full min-h-0"
              onOpen={openGallery}
              src={visibleMedia[2].url}
            />
          )}
        </div>
      </CollageFrame>
      <MediaGalleryDialog
        dialogTitle={dialogTitle}
        media={media}
        onOpenChange={setGalleryOpen}
        open={galleryOpen}
        title={title}
      />
    </>
  );
}
