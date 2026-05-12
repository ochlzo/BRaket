"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  accountFieldClassName,
  accountTextareaClassName,
} from "./account-field-classes";
import type { AccountSettingsFieldName } from "../_lib/account-settings";

export function AccountTextField({
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
        className={accountFieldClassName(error)}
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

export function AccountAddressField({
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
        className={accountTextareaClassName(error)}
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

export function AccountContactNumberField({
  error,
  onChange,
  readOnly = false,
  value,
}: {
  error?: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold" htmlFor="contactNum">
        Contact Number
      </Label>
      <Input
        aria-invalid={Boolean(error)}
        autoComplete="tel"
        className={accountFieldClassName(error)}
        id="contactNum"
        inputMode="numeric"
        maxLength={11}
        name="contactNum"
        onChange={(event) =>
          onChange(event.target.value.replace(/[^\d]/g, "").slice(0, 11))
        }
        placeholder="09123456789"
        readOnly={readOnly}
        type="text"
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
