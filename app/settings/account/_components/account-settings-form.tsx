"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { Check, Pencil, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { updateAccountSettingsAction } from "../_actions/update-account-settings-action";
import { AccountEmailField } from "./account-email-field";
import { AccountSocialLinksSection } from "./account-social-links-section";
import {
  buildVisibleSocialLinkFields,
  normalizeUsername,
  validateAccountSettingsInput,
  type AccountSettingsFieldName,
  type AccountSettingsFormValues,
  type AccountSocialLinkField,
} from "../_lib/account-settings";

type AccountSettingsFormProps = {
  initialValues: AccountSettingsFormValues;
};

function fieldWrapperClassName(error?: string) {
  return error
    ? "h-11 rounded-xl border-[color:var(--tone-red-base)] bg-white text-sm"
    : "h-11 rounded-xl border-[color:var(--line-strong)] bg-white text-sm";
}

function textareaClassName(error?: string) {
  return error
    ? "rounded-xl border-[color:var(--tone-red-base)] bg-white text-sm"
    : "rounded-xl border-[color:var(--line-strong)] bg-white text-sm";
}

function AccountTextField({
  disabled = false,
  error,
  label,
  name,
  onChange,
  placeholder,
  readOnly = false,
  type = "text",
  value,
}: {
  disabled?: boolean;
  error?: string;
  label: string;
  name: Exclude<AccountSettingsFieldName, "contactNum"> | "email";
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold" htmlFor={name}>
        {label}
      </Label>
      <Input
        aria-invalid={Boolean(error)}
        autoComplete={name}
        className={fieldWrapperClassName(error)}
        disabled={disabled}
        id={name}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        type={type}
        value={value}
      />
      {error ? (
        <p className="text-xs font-medium text-[color:var(--tone-red-base)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function AccountAddressField({
  error,
  readOnly = false,
  onChange,
  value,
}: {
  error?: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold" htmlFor="address">
        Address
      </Label>
      <Textarea
        aria-invalid={Boolean(error)}
        autoComplete="street-address"
        className={textareaClassName(error)}
        id="address"
        name="address"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Street, city, province"
        rows={3}
        readOnly={readOnly}
        value={value}
      />
      {error ? (
        <p className="text-xs font-medium text-[color:var(--tone-red-base)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AccountSettingsForm({
  initialValues,
}: AccountSettingsFormProps) {
  const router = useRouter();
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
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    setMessage("");
    setIsEditing(false);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setFieldErrors({});
    setIsSaving(true);

    const localValidation = validateAccountSettingsInput(values);

    if (!localValidation.ok) {
      setFieldErrors(localValidation.fieldErrors ?? {});
      setMessage(localValidation.message);
      setIsSaving(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const result = await updateAccountSettingsAction(formData);

    setIsSaving(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors ?? {});
      setMessage(result.message);
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
    setMessage(result.message);
    setIsEditing(false);
    router.refresh();
  }

  const subtitle = isEditing
    ? "Make changes and save them to update your account."
    : "Switch to edit mode to update your account details.";

  return (
    <form className="space-y-6" onSubmit={handleSave}>
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
                  setMessage("");
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

        {message ? (
          <div
            className={`mt-5 rounded-2xl px-4 py-3 text-sm font-medium ${
              fieldErrors && Object.keys(fieldErrors).length > 0
                ? "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]"
                : "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
            }`}
          >
            {message}
          </div>
        ) : null}

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

          <AccountEmailField
            error={fieldErrors.email}
            isEditing={isEditing}
            value={values.email}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold" htmlFor="contactNum">
                Contact Number
              </Label>
              <Input
                aria-invalid={Boolean(fieldErrors.contactNum)}
                autoComplete="tel"
                className={fieldWrapperClassName(fieldErrors.contactNum)}
                id="contactNum"
                inputMode="numeric"
                maxLength={11}
                name="contactNum"
                onChange={(event) =>
                  updateField(
                    "contactNum",
                    event.target.value.replace(/[^\d]/g, "").slice(0, 11),
                  )
                }
                placeholder="09123456789"
                readOnly={!isEditing}
                type="text"
                value={values.contactNum}
              />
              {fieldErrors.contactNum ? (
                <p className="text-xs font-medium text-[color:var(--tone-red-base)]">
                  {fieldErrors.contactNum}
                </p>
              ) : null}
            </div>
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
