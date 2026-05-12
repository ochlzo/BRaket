"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

import type { ClientProfilePortfolioItem } from "@/lib/client-profile/types";

type ClientPortfolioCollageProps = {
  item: ClientProfilePortfolioItem;
  onPreview: (media: { alt: string; src: string }) => void;
};

function MediaTile({
  alt,
  className,
  hiddenCount,
  onPreview,
  src,
}: {
  alt: string;
  className: string;
  hiddenCount?: number;
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

      {hiddenCount && hiddenCount > 0 ? (
        <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-2xl font-black tracking-[-0.04em] text-white">
          +{hiddenCount}
        </span>
      ) : null}
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

export function ClientPortfolioCollage({
  item,
  onPreview,
}: ClientPortfolioCollageProps) {
  const media = item.media.slice(0, 5);
  const hiddenCount = Math.max(0, item.media.length - media.length);

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
    <CollageFrame>
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
        <MediaTile
          alt={item.title}
          className="row-span-2 h-full min-h-0"
          onPreview={onPreview}
          src={media[0].url}
        />
        {media.slice(1, 5).map((entry, index) => (
          <MediaTile
            key={entry.id}
            alt={item.title}
            className="h-full min-h-0"
            hiddenCount={
              index === 3 && hiddenCount > 0 ? hiddenCount : undefined
            }
            onPreview={onPreview}
            src={entry.url}
          />
        ))}
      </div>
    </CollageFrame>
  );
}
