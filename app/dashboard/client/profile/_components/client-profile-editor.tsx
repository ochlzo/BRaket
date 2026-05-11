"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PencilLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { buildClientProfileEditorValues } from "@/lib/client-profile/mappers";
import type {
  ClientProfilePageData,
  UpdateClientProfileState,
} from "@/lib/client-profile/types";
import {
  updateClientProfileAction,
} from "@/server/client-profile/update-client-profile";

type ClientProfileEditorProps = {
  profile: ClientProfilePageData;
  iconOnly?: boolean;
  triggerClassName?: string;
  triggerLabel: string;
};

const INITIAL_STATE: UpdateClientProfileState = {
  message: "",
  ok: false,
};

function Field({
  children,
  className,
  label,
  name,
  placeholder,
  required = false,
  type = "text",
  defaultValue,
}: {
  children?: ReactNode;
  className?: string;
  defaultValue?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`.trim()}>
      <Label
        className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]"
        htmlFor={name}
      >
        {label}
      </Label>
      {children ?? (
        <Input
          className="h-10 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] focus-visible:bg-white"
          defaultValue={defaultValue}
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          type={type}
        />
      )}
    </div>
  );
}

export function ClientProfileEditor({
  profile,
  iconOnly = false,
  triggerClassName,
  triggerLabel,
}: ClientProfileEditorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateClientProfileAction,
    INITIAL_STATE,
  );
  const editorValues = buildClientProfileEditorValues(profile);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
      window.setTimeout(() => setOpen(false), 0);
    }
  }, [router, state.ok]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            aria-label={triggerLabel}
            className={`shadow-[var(--shadow-brand-orange-sm)] ${triggerClassName ?? ""}`.trim()}
            size={iconOnly ? "icon-sm" : "sm"}
            title={triggerLabel}
          />
        }
      >
        <PencilLine className="size-4" />
        {iconOnly ? <span className="sr-only">{triggerLabel}</span> : triggerLabel}
      </SheetTrigger>

      <SheetContent className="w-full max-w-[min(44rem,100vw)] border-[color:var(--line-strong)] bg-[color:var(--surface)] p-0">
        <form action={formAction} className="flex h-full flex-col">
          <SheetHeader className="border-b border-[color:var(--line-strong)] px-5 py-4">
            <SheetTitle className="text-xl font-bold tracking-[-0.04em]">
              Edit client profile
            </SheetTitle>
            <SheetDescription className="max-w-xl text-sm text-[color:var(--ink-muted)]">
              Update the client-facing profile data stored in Prisma. Save changes to refresh the live dashboard view.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field defaultValue={editorValues.firstName} label="First name" name="firstName" />
              <Field defaultValue={editorValues.lastName} label="Last name" name="lastName" />
              <Field defaultValue={editorValues.username} label="Username" name="username" />
              <Field
                defaultValue={editorValues.contactNum}
                label="Contact number"
                name="contactNum"
                placeholder="Digits only"
              />
              <Field
                defaultValue={editorValues.organizationName}
                label="Organization name"
                name="organizationName"
                required
              />
              <Field
                className="md:col-span-2"
                defaultValue={editorValues.avatarUrl}
                label="Avatar URL"
                name="avatarUrl"
              />
              <Field
                className="md:col-span-2"
                defaultValue={editorValues.backgroundImageUrl}
                label="Cover image or gradient"
                name="backgroundImageUrl"
              />
              <Field
                className="md:col-span-2"
                defaultValue={editorValues.businessAddress}
                label="Business address"
                name="businessAddress"
              />
              <Field defaultValue={editorValues.website} label="Website" name="website" />
              <Field
                defaultValue={editorValues.facebookUrl}
                label="Facebook URL or handle"
                name="facebookUrl"
              />
              <Field
                defaultValue={editorValues.instagramUrl}
                label="Instagram URL or handle"
                name="instagramUrl"
              />
              <Field defaultValue={editorValues.xUrl} label="X URL or handle" name="xUrl" />
              <Field
                defaultValue={editorValues.githubUrl}
                label="GitHub URL or handle"
                name="githubUrl"
              />
              <Field
                defaultValue={editorValues.linkedinUrl}
                label="LinkedIn URL or handle"
                name="linkedinUrl"
              />
              <div className="space-y-1.5 md:col-span-2">
                <Label
                  className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]"
                  htmlFor="about"
                >
                  About
                </Label>
                <Textarea
                  className="min-h-32 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] focus-visible:bg-white"
                  defaultValue={editorValues.about}
                  id="about"
                  name="about"
                  placeholder="Describe what this client account usually commissions."
                />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                Notes
              </p>
              <p className="mt-1 text-sm leading-7 text-[color:var(--ink-body)]">
                Email remains read-only here because it is tied to the signed-in auth identity. Social fields accept either full URLs or handles.
              </p>
            </div>

            {state.message ? (
              <p
                className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                  state.ok
                    ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
                    : "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]"
                }`}
                role={state.ok ? "status" : "alert"}
              >
                {state.message}
              </p>
            ) : null}
          </div>

          <div className="border-t border-[color:var(--line-strong)] bg-[color:var(--surface)] px-5 py-4">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                className="rounded-xl"
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button className="rounded-xl" disabled={isPending} type="submit">
                {isPending ? "Saving..." : triggerLabel}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
