"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { TalentMediaCollage } from "@/app/dashboard/talent/_components/talent-media-collage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TalentProfileMediaItem } from "@/lib/talent-profile/types";

type TalentServiceMediaShowcaseProps = {
  media: TalentProfileMediaItem[];
  title: string;
};

function DesktopImageTile({
  onOpen,
  media,
  title,
}: {
  onOpen: () => void;
  media: TalentProfileMediaItem;
  title: string;
}) {
  return (
    <button
      className="group flex max-h-32 max-w-48 items-center justify-center overflow-hidden rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)]"
      onClick={onOpen}
      type="button"
    >
      <Image
        alt={title}
        className="max-h-32 max-w-48 object-contain transition duration-300 group-hover:scale-[1.03]"
        height={128}
        width={192}
        src={media.url}
      />
    </button>
  );
}

function DesktopServiceMediaRows({
  media,
  onSelect,
  title,
}: TalentServiceMediaShowcaseProps & {
  onSelect: (media: TalentProfileMediaItem) => void;
}) {
  return (
    <div className="mt-5 hidden flex-wrap gap-3 lg:flex">
      {media.map((entry) => (
        <DesktopImageTile
          key={entry.id}
          media={entry}
          onOpen={() => onSelect(entry)}
          title={title}
        />
      ))}
    </div>
  );
}

function DesktopImageDialog({
  onOpenChange,
  open,
  selectedMedia,
  title,
}: TalentServiceMediaShowcaseProps & {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  selectedMedia: TalentProfileMediaItem | null;
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
          {selectedMedia ? (
            <div
              className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black"
              key={selectedMedia.id}
            >
              <Image
                alt={title}
                className="object-contain"
                fill
                sizes="90vw"
                src={selectedMedia.url}
              />
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TalentServiceMediaShowcase({
  media,
  title,
}: TalentServiceMediaShowcaseProps) {
  const [selectedMedia, setSelectedMedia] =
    useState<TalentProfileMediaItem | null>(null);

  if (media.length === 0) {
    return null;
  }

  return (
    <>
      <div className="lg:hidden">
        <TalentMediaCollage
          dialogTitle="Service images"
          frameClassName="h-[180px] sm:h-[220px]"
          media={media}
          title={title}
        />
      </div>
      <DesktopServiceMediaRows
        media={media}
        onSelect={setSelectedMedia}
        title={title}
      />
      <DesktopImageDialog
        media={media}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMedia(null);
          }
        }}
        open={selectedMedia !== null}
        selectedMedia={selectedMedia}
        title={title}
      />
    </>
  );
}
