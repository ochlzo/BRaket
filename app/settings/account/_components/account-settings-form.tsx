"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { Check, Pencil, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { updateAccountSettingsAction } from "../_actions/update-account-settings-action";
import { commitEmailChange } from "./commit-email-change";
import { AccountEmailField } from "./account-email-field";
import {
  AccountAddressField,
  AccountContactNumberField,
  AccountTextField,
} from "./account-form-fields";
import { AccountSocialLinksSection } from "./account-social-links-section";
import {
  buildVisibleSocialLinkFields,
  normalizeUsername,
  validateAccountSettingsInput,
  type AccountSettingsFieldName,
  type AccountSettingsFormValues,
  type AccountSocialLinkField,
} from "../_lib/account-settings";
import type { ChangeEmailUserContext } from "./use-change-email-dialog";

type AccountSettingsFormProps = {
  initialValues: AccountSettingsFormValues;
  currentUser: ChangeEmailUserContext;
};

export function AccountSettingsForm({
  currentUser,
  initialValues,
}: AccountSettingsFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const committedValuesRef = useRef(initialValues);
  const committedVisibleFieldsRef = useRef(
    buildVisibleSocialLinkFields(initialValues),
  );
  const [values, setValues] = useState(initialValues);
  const [visibleFields, setVisibleFields] = useState<AccountSocialLinkField[]>(
    () => buildVisibleSocialLinkFields(initialValues),
  );
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<AccountSettingsFieldName, string>>
  >({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const shouldAutoSubmitRef = useRef(false);

  useEffect(() => { if (!shouldAutoSubmitRef.current || !isEditing || isSaving) return; shouldAutoSubmitRef.current = false; formRef.current?.requestSubmit(); }, [isEditing, isSaving, values.email]);

  function showToast(type: "error" | "success", message: string) {
    const toastFn = type === "error" ? toast.error : toast.success;
    const toastId = toastFn(message, {
      action: {
        label: "x",
        onClick: () => toast.dismiss(toastId),
      },
    });
  }

  function updateField(field: keyof AccountSettingsFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function addSocialLink(field: AccountSocialLinkField) {
    setVisibleFields((current) =>
      current.includes(field) ? current : [...current, field],
    );
    setIsEditing(true);
  }

  function removeSocialLink(field: AccountSocialLinkField) {
    setVisibleFields((current) => current.filter((item) => item !== field));
    setValues((current) => ({
      ...current,
      [field]: "",
    }));
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function resetDraft() {
    setValues(committedValuesRef.current);
    setVisibleFields(committedVisibleFieldsRef.current);
    setFieldErrors({});
    setIsEditing(false);
    shouldAutoSubmitRef.current = false;
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setIsSaving(true);

    const localValidation = validateAccountSettingsInput(values);

    if (!localValidation.ok) {
      setFieldErrors(localValidation.fieldErrors ?? {});
      showToast("error", localValidation.message);
      setIsSaving(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const result = await updateAccountSettingsAction(formData);

    setIsSaving(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors ?? {});
      showToast("error", result.message);
      return;
    }

    if (result.values) {
      committedValuesRef.current = result.values;
      committedVisibleFieldsRef.current = buildVisibleSocialLinkFields(
        result.values,
      );
      setValues(result.values);
      setVisibleFields(committedVisibleFieldsRef.current);
    }

    setFieldErrors({});
    showToast("success", result.message);
    setIsEditing(false);
    router.refresh();
  }

  const subtitle = isEditing
    ? "Make changes and save them to update your account."
    : "Switch to edit mode to update your account details.";

  return (
    <form ref={formRef} className="space-y-6" onSubmit={handleSave}>
      <div className="rounded-3xl border border-[color:var(--line-strong)] bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--ink-muted)]">
              Settings
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] text-foreground">
              Account
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink-muted)]">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isEditing ? (
              <>
                <Button
                  className="rounded-xl"
                  onClick={resetDraft}
                  type="button"
                  variant="outline"
                >
                  <RotateCcw />
                  Cancel
                </Button>
                <Button
                  className="rounded-xl bg-[color:var(--brand-orange)] !text-white hover:bg-[color:var(--brand-orange-strong)]"
                  disabled={isSaving}
                  type="submit"
                >
                  <Check />
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </>
            ) : (
              <Button
                className="rounded-xl"
                onClick={() => {
                  setFieldErrors({});
                  setIsEditing(true);
                }}
                type="button"
                variant="outline"
              >
                <Pencil />
                Edit account
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <AccountTextField
              error={fieldErrors.firstName}
              label="First Name"
              name="firstName"
              onChange={(value) => updateField("firstName", value)}
              placeholder="Jane"
              readOnly={!isEditing}
              value={values.firstName}
            />
            <AccountTextField
              error={fieldErrors.lastName}
              label="Last Name"
              name="lastName"
              onChange={(value) => updateField("lastName", value)}
              placeholder="Cruz"
              readOnly={!isEditing}
              value={values.lastName}
            />
          </div>

          <AccountTextField
            error={fieldErrors.username}
            label="Username"
            name="username"
            onChange={(value) =>
              updateField("username", normalizeUsername(value))
            }
            placeholder="jane-cruz"
            readOnly={!isEditing}
            value={values.username}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <AccountEmailField
              currentUser={currentUser}
              error={fieldErrors.email}
              onEmailCommitted={(email) => { commitEmailChange({ committedValuesRef, email, setFieldErrors, setValues }); shouldAutoSubmitRef.current = true; }}
              isEditing={isEditing}
              value={values.email}
            />
            <AccountTextField
              error={fieldErrors.buEmail}
              label="BU Email"
              name="buEmail"
              onChange={() => undefined}
              placeholder="-"
              readOnly
              value={values.buEmail}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AccountContactNumberField
              error={fieldErrors.contactNum}
              onChange={(value) => updateField("contactNum", value)}
              readOnly={!isEditing}
              value={values.contactNum}
            />
            <AccountAddressField
              error={fieldErrors.address}
              readOnly={!isEditing}
              onChange={(value) => updateField("address", value)}
              value={values.address}
            />
          </div>
        </div>
      </div>

      <AccountSocialLinksSection
        errors={fieldErrors}
        isEditing={isEditing}
        onAdd={addSocialLink}
        onChange={(field, value) => updateField(field, value)}
        onRemove={removeSocialLink}
        values={values}
        visibleFields={visibleFields}
      />

      {isEditing ? <Separator /> : null}
    </form>
  );
}
