"use client";

import type { CSSProperties } from "react";
import { X } from "lucide-react";

import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";

export function buildCoverBackgroundStyle(value: string) {
  if (/gradient\(/i.test(value)) {
    return { background: value };
  }

  return {
    backgroundImage: `linear-gradient(120deg, rgba(255,107,53,.12), rgba(79,195,247,.24)), url(${value})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
}

type RemovePhotoButtonProps = {
  label: string;
  onRemove: () => void;
  showRemove: boolean;
};

function RemovePhotoButton({
  label,
  onRemove,
  showRemove,
}: RemovePhotoButtonProps) {
  if (!showRemove) {
    return null;
  }

  return (
    <Button
      className="ml-auto h-10 rounded-full px-3 text-xs font-semibold text-[color:var(--tone-red-deep)] hover:bg-[color:var(--tone-red-soft)] hover:text-[color:var(--tone-red-deep)] md:hidden"
      onClick={onRemove}
      type="button"
      variant="ghost"
    >
      {label}
    </Button>
  );
}

type ProfilePicturePanelProps = {
  displayName: string;
  initials: string;
  previewUrl: string | null;
  showRemove: boolean;
  onChoose: () => void;
  onRemove: () => void;
};

export function ProfilePicturePanel({
  displayName,
  initials,
  previewUrl,
  showRemove,
  onChoose,
  onRemove,
}: ProfilePicturePanelProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] p-4">
      <div className="space-y-1.5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          Profile picture
        </p>
        <p className="text-sm text-[color:var(--ink-body)]">
          Stored in the `avatars` folder for your user id.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-surface-soft)]"
          onClick={onChoose}
          type="button"
          variant="outline"
        >
          Choose picture
        </Button>
        <RemovePhotoButton
          label="Remove photo"
          onRemove={onRemove}
          showRemove={showRemove}
        />
      </div>

      <div className="flex justify-center">
        <div className="group relative">
          <UserAvatar
            alt={displayName}
            className="mt-1 h-40 w-40 rounded-none border-[3px] border-white bg-[color:var(--surface)] shadow-[var(--shadow-panel-soft)] after:rounded-none sm:h-44 sm:w-44"
            fallbackClassName="rounded-none bg-[color:var(--surface)] text-4xl font-black tracking-[-0.06em] text-[color:var(--ink-muted)]"
            imageClassName="rounded-none"
            initials={initials}
            src={previewUrl}
          />
          {showRemove ? (
            <Button
              aria-label="Remove profile picture"
              className="absolute -right-3 -top-3 h-8 w-8 rounded-full border border-white bg-[color:var(--surface)] text-[color:var(--foreground)] opacity-0 shadow-[var(--shadow-panel-soft)] transition-opacity group-hover:opacity-100 hover:bg-[color:var(--tone-red-soft)] hover:text-[color:var(--tone-red-deep)]"
              onClick={onRemove}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

type ProfileBackgroundPanelProps = {
  previewStyle: CSSProperties;
  showRemove: boolean;
  onChoose: () => void;
  onRemove: () => void;
};

export function ProfileBackgroundPanel({
  previewStyle,
  showRemove,
  onChoose,
  onRemove,
}: ProfileBackgroundPanelProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] p-4">
      <div className="space-y-1.5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          Background photo
        </p>
        <p className="text-sm text-[color:var(--ink-body)]">
          Stored in the `backgrounds` folder for your user id.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-surface-soft)]"
          onClick={onChoose}
          type="button"
          variant="outline"
        >
          Choose background
        </Button>
        <RemovePhotoButton
          label="Remove photo"
          onRemove={onRemove}
          showRemove={showRemove}
        />
      </div>

      <div className="group relative">
        <div
          className="relative h-32 overflow-hidden rounded-2xl border border-[color:var(--line-strong)]"
          style={previewStyle}
        />
        {showRemove ? (
          <Button
            aria-label="Remove background photo"
            className="absolute -right-3 -top-3 h-8 w-8 rounded-full border border-white bg-[color:var(--surface)] text-[color:var(--foreground)] opacity-0 shadow-[var(--shadow-panel-soft)] transition-opacity group-hover:opacity-100 hover:bg-[color:var(--tone-red-soft)] hover:text-[color:var(--tone-red-deep)]"
            onClick={onRemove}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
    </section>
  );
}
