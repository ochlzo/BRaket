"use client";

import { useActionState, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { semantic } from "@/lib/theme/semantic";
import { cn } from "@/lib/utils";
import type { UpdateClientProfileAboutState } from "@/lib/client-profile/types";
import { updateClientProfileAboutAction } from "@/server/client-profile/update-client-profile-about";
import { useRouter } from "next/navigation";

type ClientProfileBioEditorProps = {
  about: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const INITIAL_STATE: UpdateClientProfileAboutState = {
  message: "",
  ok: false,
};

export function ClientProfileBioEditor({
  about,
  open,
  onOpenChange,
}: ClientProfileBioEditorProps) {
  const router = useRouter();
  const [draftAbout, setDraftAbout] = useState(about);
  const [state, formAction, isPending] = useActionState(
    updateClientProfileAboutAction,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (!state.ok) {
      return;
    }

    router.refresh();
    onOpenChange(false);
  }, [onOpenChange, router, state.ok]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          semantic.panel.card,
          "max-h-[calc(100dvh-0.75rem)] w-[calc(100vw-0.75rem)] max-w-[calc(100vw-0.75rem)] overflow-hidden p-0 shadow-[var(--shadow-lg)] sm:max-h-[calc(100vh-1rem)] sm:w-[min(42rem,calc(100vw-1rem))] sm:max-w-[min(42rem,calc(100vw-1rem))]",
        )}
      >
        <form action={formAction} className="flex max-h-[calc(100dvh-0.75rem)] flex-col sm:max-h-[calc(100vh-1rem)]">
          <DialogHeader className={`border-b px-4 py-4 sm:px-5 ${semantic.border.strong}`}>
            <DialogTitle className={`text-lg font-bold tracking-[-0.04em] sm:text-xl ${semantic.text.heading}`}>
              Edit bio
            </DialogTitle>
            <DialogDescription className={`max-w-xl text-sm ${semantic.text.muted}`}>
              Update the short bio shown on your client profile.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            <div className="space-y-1.5">
              <Label
                className={`text-xs font-bold uppercase tracking-[0.14em] ${semantic.text.muted}`}
                htmlFor="about"
              >
                Bio
              </Label>
              <Textarea
                className="min-h-44 rounded-xl bg-[color:var(--surface-alt)] text-sm focus-visible:bg-white sm:min-h-40"
                id="about"
                name="about"
                onChange={(event) => setDraftAbout(event.currentTarget.value)}
                placeholder="Write a short bio for your client profile."
                value={draftAbout}
              />
            </div>

            {state.message ? (
              <p
                className={`rounded-xl px-4 py-3 text-sm font-medium ${state.ok ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]" : "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]"}`}
                role={state.ok ? "status" : "alert"}
              >
                {state.message}
              </p>
            ) : null}
          </div>

          <div className={`border-t bg-[color:var(--surface)] px-4 py-4 sm:px-5 ${semantic.border.strong}`}>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DialogClose
                render={
                  <Button className="w-full rounded-xl sm:w-auto" type="button" variant="outline" />
                }
              >
                Cancel
              </DialogClose>
              <Button className="w-full rounded-xl sm:w-auto" disabled={isPending} type="submit">
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
