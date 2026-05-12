"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  checkChangeEmailAvailabilityAction,
} from "../_actions/check-change-email-availability-action";

function fieldWrapperClassName(error?: string) {
  return error
    ? "h-11 rounded-xl border-[color:var(--tone-red-base)] bg-white text-sm"
    : "h-11 rounded-xl border-[color:var(--line-strong)] bg-white text-sm";
}

type AccountEmailFieldProps = {
  error?: string;
  isEditing: boolean;
  value: string;
};

function ChangeEmailDialog({
  currentEmail,
  onOpenChange,
}: {
  currentEmail: string;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState<"email" | "password">("email");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmailError, setNewEmailError] = useState("");
  const [isChecking, startTransition] = useTransition();

  function resetDialog() {
    setStep("email");
    setNewEmail("");
    setPassword("");
    setNewEmailError("");
  }

  function handleClose() {
    resetDialog();
    onOpenChange(false);
  }

  function handleCheckNewEmail() {
    setNewEmailError("");

    startTransition(async () => {
      const formData = new FormData();
      formData.set("newEmail", newEmail);

      const result = await checkChangeEmailAvailabilityAction(
        { message: "", ok: false },
        formData,
      );

      if (!result.ok) {
        setNewEmailError(result.fieldErrors?.newEmail ?? result.message);
        return;
      }

      setStep("password");
    });
  }

  return (
    <>
      {step === "email" ? (
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold" htmlFor="current-email">
              Current email
            </Label>
            <Input
              className={fieldWrapperClassName()}
              disabled
              id="current-email"
              readOnly
              type="email"
              value={currentEmail}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold" htmlFor="new-email">
              New email
            </Label>
            <Input
              aria-invalid={Boolean(newEmailError)}
              autoComplete="email"
              className={fieldWrapperClassName(newEmailError)}
              id="new-email"
              onChange={(event) => setNewEmail(event.target.value)}
              type="email"
              value={newEmail}
            />
            {newEmailError ? (
              <p className="text-xs font-medium text-[color:var(--tone-red-base)]">
                {newEmailError}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              className="rounded-xl"
              onClick={handleClose}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl"
              disabled={isChecking}
              onClick={handleCheckNewEmail}
              type="button"
            >
              {isChecking ? "Checking..." : "Change"}
            </Button>
          </DialogFooter>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold" htmlFor="password">
              Password
            </Label>
            <Input
              autoComplete="current-password"
              className={fieldWrapperClassName()}
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </div>

          <DialogFooter>
            <Button
              className="rounded-xl"
              onClick={handleClose}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl"
              onClick={handleClose}
              type="button"
            >
              Confirm
            </Button>
          </DialogFooter>
        </div>
      )}
    </>
  );
}

export function AccountEmailField({
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
          className={`${fieldWrapperClassName(error)} ${isEditing ? "pr-32" : ""}`}
          disabled
          id="email"
          name="email"
          readOnly
          type="email"
          value={value}
        />

        {isEditing ? (
          <Button
            onClick={() => {
              handleChangeEmailOpenChange(true);
            }}
            className="absolute right-1 top-1/2 h-7 -translate-y-1/2 rounded-lg border-[color:var(--line-strong)] bg-white px-2 text-[11px] font-semibold text-[color:var(--ink-muted)] shadow-none hover:bg-[color:var(--surface-alt)] active:translate-y-0 sm:right-1.5 sm:h-8 sm:px-3 sm:text-xs"
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

      <Dialog open={isChangeEmailOpen} onOpenChange={handleChangeEmailOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change email</DialogTitle>
            <DialogDescription>
              Review your current email, then enter a new one to continue.
            </DialogDescription>
          </DialogHeader>

          <ChangeEmailDialog
            key={changeEmailDialogKey}
            currentEmail={value}
            onOpenChange={handleChangeEmailOpenChange}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
