"use client";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { accountFieldClassName } from "./account-field-classes";
import {
  type ChangeEmailUserContext,
  useChangeEmailDialog,
} from "./use-change-email-dialog";

type ChangeEmailDialogProps = {
  currentEmail: string;
  currentUser: ChangeEmailUserContext;
  onOpenChange: (open: boolean) => void;
};

export function ChangeEmailDialog({
  currentEmail,
  currentUser,
  onOpenChange,
}: ChangeEmailDialogProps) {
  const dialog = useChangeEmailDialog({
    currentEmail,
    currentUser,
    onOpenChange,
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Change email</DialogTitle>
        <DialogDescription>{dialog.subtitle}</DialogDescription>
      </DialogHeader>

      {dialog.step === "email" ? (
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold" htmlFor="current-email">
              Current email
            </Label>
            <Input
              className={accountFieldClassName()}
              disabled
              id="current-email"
              readOnly
              type="email"
              value={dialog.currentEmail}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold" htmlFor="new-email">
              New email
            </Label>
            <Input
              aria-invalid={Boolean(dialog.newEmailError)}
              autoComplete="email"
              className={accountFieldClassName(dialog.newEmailError)}
              id="new-email"
              onChange={(event) => dialog.setNewEmail(event.target.value)}
              type="email"
              value={dialog.newEmail}
            />
            {dialog.newEmailError ? (
              <p className="text-xs font-medium text-[color:var(--tone-red-base)]">
                {dialog.newEmailError}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              className="rounded-xl"
              onClick={dialog.closeDialog}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl"
              disabled={dialog.isCheckingEmail}
              onClick={dialog.handleCheckNewEmail}
              type="button"
            >
              {dialog.isCheckingEmail ? "Checking..." : "Change"}
            </Button>
          </DialogFooter>
        </div>
      ) : dialog.step === "password" ? (
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold" htmlFor="password">
              Verify password
            </Label>
            <Input
              aria-invalid={Boolean(dialog.passwordError)}
              autoComplete="current-password"
              className={accountFieldClassName(dialog.passwordError)}
              id="password"
              onChange={(event) => dialog.setPassword(event.target.value)}
              type="password"
              value={dialog.password}
            />
            {dialog.passwordError ? (
              <p className="text-xs font-medium text-[color:var(--tone-red-base)]">
                {dialog.passwordError}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              className="rounded-xl"
              onClick={dialog.closeDialog}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl"
              disabled={dialog.isSubmittingPassword}
              onClick={() => void dialog.handleVerifyPassword()}
              type="button"
            >
              {dialog.isSubmittingPassword ? "Checking..." : "Confirm"}
            </Button>
          </DialogFooter>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold" htmlFor="otp-code">
              OTP
            </Label>
            <Input
              aria-invalid={Boolean(dialog.otpError)}
              autoComplete="one-time-code"
              className={accountFieldClassName(dialog.otpError)}
              id="otp-code"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => dialog.setOtpCode(event.target.value)}
              value={dialog.otpCode}
            />
            {dialog.otpError ? (
              <p className="text-xs font-medium text-[color:var(--tone-red-base)]">
                {dialog.otpError}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              className="rounded-xl"
              onClick={dialog.closeDialog}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl"
              disabled={dialog.isSubmittingOtp}
              onClick={() => void dialog.handleVerifyOtp()}
              type="button"
            >
              {dialog.isSubmittingOtp ? "Checking..." : "Confirm"}
            </Button>
          </DialogFooter>
        </div>
      )}
    </>
  );
}
