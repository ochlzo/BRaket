"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ChangeEmailDialog } from "./change-email-dialog";
import { accountFieldClassName } from "./account-field-classes";
import { type ChangeEmailUserContext } from "./use-change-email-dialog";

type AccountEmailFieldProps = {
  currentUser: ChangeEmailUserContext;
  error?: string;
  isEditing: boolean;
  value: string;
};

export function AccountEmailField({
  currentUser,
  error,
  isEditing,
  value,
}: AccountEmailFieldProps) {
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [changeEmailDialogKey, setChangeEmailDialogKey] = useState(0);

  function handleChangeEmailOpenChange(open: boolean) {
    if (open) {
      setChangeEmailDialogKey((current) => current + 1);
    }

    setIsChangeEmailOpen(open);
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold" htmlFor="email">
        Email
      </Label>

      <div className="relative">
        <Input
          aria-invalid={Boolean(error)}
          autoComplete="email"
          className={`${accountFieldClassName(error)} ${isEditing ? "pr-32" : ""}`}
          disabled
          id="email"
          name="email"
          readOnly
          type="email"
          value={value}
        />

        {isEditing ? (
          <Button
            className="absolute right-1 top-1/2 h-7 -translate-y-1/2 rounded-lg border-[color:var(--line-strong)] bg-white px-2 text-[11px] font-semibold text-[color:var(--ink-muted)] shadow-none hover:bg-[color:var(--surface-alt)] active:translate-y-0 sm:right-1.5 sm:h-8 sm:px-3 sm:text-xs"
            onClick={() => {
              handleChangeEmailOpenChange(true);
            }}
            type="button"
            variant="outline"
          >
            Change email
          </Button>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs font-medium text-[color:var(--tone-red-base)]">
          {error}
        </p>
      ) : null}

      <Dialog
        open={isChangeEmailOpen}
        onOpenChange={handleChangeEmailOpenChange}
      >
        <DialogContent className="sm:max-w-md">
          <ChangeEmailDialog
            key={changeEmailDialogKey}
            currentEmail={value}
            currentUser={currentUser}
            onOpenChange={handleChangeEmailOpenChange}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
