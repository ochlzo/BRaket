"use client";

import {
  ChevronDown,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ACCOUNT_SOCIAL_LINK_OPTIONS,
  buildSocialLinkHref,
  type AccountSettingsFieldName,
  type AccountSettingsFormValues,
  type AccountSocialLinkField,
} from "../_lib/account-settings";

type AccountSocialLinksSectionProps = {
  errors: Partial<Record<AccountSettingsFieldName, string>>;
  isEditing: boolean;
  onAdd: (field: AccountSocialLinkField) => void;
  onChange: (field: AccountSocialLinkField, value: string) => void;
  onRemove: (field: AccountSocialLinkField) => void;
  values: AccountSettingsFormValues;
  visibleFields: AccountSocialLinkField[];
};

const fieldByKey = new Map(
  ACCOUNT_SOCIAL_LINK_OPTIONS.map((option) => [option.field, option]),
);

export function AccountSocialLinksSection({
  errors,
  isEditing,
  onAdd,
  onChange,
  onRemove,
  values,
  visibleFields,
}: AccountSocialLinksSectionProps) {
  const availableOptions = ACCOUNT_SOCIAL_LINK_OPTIONS.filter(
    (option) => !visibleFields.includes(option.field),
  );

  return (
    <section className="rounded-3xl border border-[color:var(--line-strong)] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--ink-muted)]">
            Account
          </p>
          <h3 className="mt-1 text-lg font-bold tracking-[-0.02em] text-foreground">
            Social Links
          </h3>
          <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
            Add the social platforms you want to make visible on your profile.
          </p>
        </div>

        {isEditing ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  className="rounded-xl"
                  disabled={availableOptions.length === 0}
                  type="button"
                  variant="outline"
                />
              }
            >
              <Plus />
              Add link
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52">
              {availableOptions.map((option) => (
                <DropdownMenuItem
                  key={option.field}
                  onClick={() => onAdd(option.field)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      {!isEditing ? (
        visibleFields.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleFields.map((field) => {
              const option = fieldByKey.get(field);
              const value = values[field];

              if (!option || !value.trim()) {
                return null;
              }

              const href = buildSocialLinkHref(field, value);

              return (
                <a
                  key={field}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-3 py-1.5 text-xs font-semibold text-[color:var(--ink-body)] transition hover:border-[color:var(--brand-orange)] hover:text-[color:var(--brand-orange)]"
                  href={href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {option.label}
                  <ExternalLink className="size-3.5" />
                </a>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-[color:var(--ink-muted)]">
            No social links added yet.
          </p>
        )
      ) : (
        <div className="mt-4 space-y-3">
          {visibleFields.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3 text-sm text-[color:var(--ink-muted)]">
              Use the add button to include Facebook, LinkedIn, X, GitHub, or
              Instagram.
            </p>
          ) : null}

          {visibleFields.map((field) => {
            const option = fieldByKey.get(field);

            if (!option) {
              return null;
            }

            const error = errors[field];

            return (
              <div
                key={field}
                className="rounded-2xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <label
                        className="text-sm font-semibold text-foreground"
                        htmlFor={field}
                      >
                        {option.label}
                      </label>
                      <Button
                        aria-label={`Remove ${option.label}`}
                        className="shrink-0 text-[color:var(--ink-muted)] hover:text-[color:var(--tone-red-base)]"
                        onClick={() => onRemove(field)}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <Input
                      aria-invalid={Boolean(error)}
                      className="h-11 rounded-xl border-[color:var(--line-strong)] bg-white text-sm"
                      id={field}
                      name={field}
                      onChange={(event) => onChange(field, event.target.value)}
                      placeholder={`Enter ${option.label.toLowerCase()} handle or URL`}
                      value={values[field]}
                    />
                    {error ? (
                      <p className="text-xs font-medium text-[color:var(--tone-red-base)]">
                        {error}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
