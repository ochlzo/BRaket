"use client";

import { useState } from "react";
import { PencilLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { ProfileImageForm } from "./client-profile-image-form";

type ClientProfileImageEditorProps = {
  initials: string;
  avatarUrl: string;
  backgroundImageUrl: string;
  displayName: string;
  triggerClassName?: string;
};

export function ClientProfileImageEditor({
  initials,
  avatarUrl,
  backgroundImageUrl,
  displayName,
  triggerClassName,
}: ClientProfileImageEditorProps) {
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
          <Button
            aria-label="Edit profile images"
            className={`shadow-[var(--shadow-brand-orange-sm)] ${triggerClassName ?? ""}`.trim()}
            size="icon-sm"
            title="Edit profile images"
          />
        }
      >
        <PencilLine className="size-4" />
        <span className="sr-only">Edit profile images</span>
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
