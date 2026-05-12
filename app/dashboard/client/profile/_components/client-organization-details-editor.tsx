"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
} from "react";
import { useRouter } from "next/navigation";
import { PencilLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildOrganizationDetailsEditorValues } from "@/lib/client-profile/organization-details";
import type { ClientProfilePageData } from "@/lib/client-profile/types";
import { semantic } from "@/lib/theme/semantic";
import { toneStyles } from "@/lib/theme/tailwind";
import { cn } from "@/lib/utils";
import { updateClientOrganizationDetailsAction } from "@/server/client-profile/update-client-organization-details";
import type { UpdateOrganizationDetailsState } from "@/lib/client-profile/organization-details";

type ClientOrganizationDetailsEditorProps = {
  profile: ClientProfilePageData;
};

const INITIAL_STATE: UpdateOrganizationDetailsState = {
  message: "",
  ok: false,
};

function Field({
  disabled = false,
  error,
  label,
  name,
  placeholder,
  onChange,
  value,
}: {
  disabled?: boolean;
  error?: string;
  label: string;
  name: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        className={`text-xs font-bold uppercase tracking-[0.14em] ${semantic.text.muted}`}
        htmlFor={name}
      >
        {label}
      </Label>
      <Input
        className={cn(
          "h-10 rounded-xl bg-[color:var(--surface-alt)] text-sm focus-visible:bg-white disabled:bg-[color:var(--surface-alt)] disabled:opacity-100",
          semantic.border.strong,
          semantic.text.heading,
          `disabled:${semantic.text.muted}`,
        )}
        disabled={disabled}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        readOnly={disabled}
      />
      {error ? (
        <p className={`text-xs font-medium ${toneStyles.red.text}`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ClientOrganizationDetailsEditor({
  profile,
}: ClientOrganizationDetailsEditorProps) {
  const router = useRouter();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const editorValues = buildOrganizationDetailsEditorValues(profile);
  const [formValues, setFormValues] = useState(editorValues);
  const [state, formAction, isPending] = useActionState(
    updateClientOrganizationDetailsAction,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (!state.successToken) {
      return;
    }

    router.refresh();
    closeButtonRef.current?.click();
  }, [router, state.successToken]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            aria-label="Edit organization details"
            className={cn(
              "rounded-full bg-[color:var(--surface)] text-[color:var(--brand-orange)] shadow-[var(--shadow-surface-soft)] hover:bg-[color:var(--surface-alt)]",
              semantic.border.strong,
            )}
            onClick={() => setFormValues(editorValues)}
            size="icon-sm"
            title="Edit organization details"
            variant="outline"
          />
        }
      >
        <PencilLine className="size-4" />
        <span className="sr-only">Edit organization details</span>
      </DialogTrigger>

      <DialogContent
        className={cn(
          semantic.panel.card,
          "max-h-[calc(100vh-1rem)] max-w-[min(42rem,calc(100%-1rem))] overflow-hidden p-0 shadow-[var(--shadow-lg)]",
        )}
      >
        <DialogClose
          render={
            <button
              ref={closeButtonRef}
              aria-hidden="true"
              className="hidden"
              tabIndex={-1}
              type="button"
            />
          }
        />
        <form
          action={formAction}
          className="flex max-h-[calc(100vh-1rem)] flex-col"
        >
          <DialogHeader className={`border-b px-5 py-4 ${semantic.border.strong}`}>
            <DialogTitle
              className={`text-xl font-bold tracking-[-0.04em] ${semantic.text.heading}`}
            >
              Edit organization details
            </DialogTitle>
            <DialogDescription
              className={`max-w-xl text-sm ${semantic.text.muted}`}
            >
              Update the organization name, business address, and website. Email
              and Contact Number stays read-only because it is managed through
              the account change-email flow.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="grid gap-4">
              <Field
                error={state.fieldErrors?.organizationName}
                label="Organization name"
                name="organizationName"
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    organizationName: event.currentTarget.value,
                  }))
                }
                value={formValues.organizationName}
              />
              <Field
                label="Business address"
                name="businessAddress"
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    businessAddress: event.currentTarget.value,
                  }))
                }
                value={formValues.businessAddress}
              />
              <Field
                label="Website"
                name="website"
                placeholder="https://example.com"
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    website: event.currentTarget.value,
                  }))
                }
                value={formValues.website}
              />
            </div>

            {state.message ? (
              <p
                className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                  state.ok
                    ? `${toneStyles.green.card} ${toneStyles.green.text}`
                    : `${toneStyles.red.card} ${toneStyles.red.text}`
                }`}
                role={state.ok ? "status" : "alert"}
              >
                {state.message}
              </p>
            ) : null}
          </div>

          <div className={`border-t bg-[color:var(--surface)] px-5 py-4 ${semantic.border.strong}`}>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DialogClose
                render={
                  <Button
                    className="rounded-xl"
                    type="button"
                    variant="outline"
                  />
                }
              >
                Cancel
              </DialogClose>
              <Button className="rounded-xl" disabled={isPending} type="submit">
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
