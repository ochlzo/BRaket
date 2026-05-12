import type { MutableRefObject, Dispatch, SetStateAction } from "react";

import type { AccountSettingsFormValues } from "../_lib/account-settings";

type CommitEmailChangeArgs = {
  committedValuesRef: MutableRefObject<AccountSettingsFormValues>;
  email: string;
  setFieldErrors: Dispatch<SetStateAction<Partial<Record<"email", string>>>>;
  setValues: Dispatch<SetStateAction<AccountSettingsFormValues>>;
};

export function commitEmailChange({
  committedValuesRef,
  email,
  setFieldErrors,
  setValues,
}: CommitEmailChangeArgs) {
  const normalizedEmail = email.trim();

  committedValuesRef.current = {
    ...committedValuesRef.current,
    email: normalizedEmail,
  };
  setValues((current) => ({
    ...current,
    email: normalizedEmail,
  }));
  setFieldErrors((current) => {
    if (!current.email) {
      return current;
    }

    const next = { ...current };
    delete next.email;
    return next;
  });
}
