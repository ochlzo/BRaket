"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { ProfileImageForm } from "./profile-image-form";

type ProfileImageEditorProps = {
  initials: string;
  avatarUrl: string;
  backgroundImageUrl: string;
  displayName: string;
  trigger: ReactNode;
  triggerClassName?: string;
};

export function ProfileImageEditor({
  initials,
  avatarUrl,
  backgroundImageUrl,
  displayName,
  trigger,
  triggerClassName,
}: ProfileImageEditorProps) {
  const [open, setOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          setFormSession((value) => value + 1);
        }
      }}
    >
      <DialogTrigger
        render={
          <button
            aria-label="Update profile images"
            className={triggerClassName}
            title="Edit profile images"
            type="button"
          />
        }
      >
        {trigger}
      </DialogTrigger>

      <DialogContent
        className="!w-[min(56rem,calc(100vw-1.5rem))] !max-w-[min(56rem,calc(100vw-1.5rem))] overflow-hidden border-[color:var(--line-strong)] bg-[color:var(--surface)] p-0 shadow-[var(--shadow-lg)]"
        showCloseButton={false}
      >
        <ProfileImageForm
          key={formSession}
          initials={initials}
          avatarUrl={avatarUrl}
          backgroundImageUrl={backgroundImageUrl}
          displayName={displayName}
          onClose={() => {
            setOpen(false);
            setFormSession((value) => value + 1);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
