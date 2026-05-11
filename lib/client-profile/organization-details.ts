import type { ClientProfilePageData } from "./types";

export type OrganizationDetailsEditorValues = {
  businessAddress: string;
  email: string;
  organizationName: string;
  website: string;
};

export type OrganizationDetailsFormValues = {
  businessAddress: string;
  organizationName: string;
  website: string;
};

export type UpdateOrganizationDetailsState = {
  fieldErrors?: Partial<Record<keyof OrganizationDetailsFormValues, string>>;
  message: string;
  ok: boolean;
  successToken?: string;
};

const EMPTY_STATE: UpdateOrganizationDetailsState = {
  message: "",
  ok: false,
};

function compactText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeWebsiteUrl(value: string) {
  const url = compactText(value);

  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url.replace(/^\/\//, "")}`;
}

export function buildOrganizationDetailsEditorValues(
  profile: Pick<
    ClientProfilePageData,
    "businessAddress" | "email" | "organizationName" | "website"
  >,
): OrganizationDetailsEditorValues {
  return {
    businessAddress: profile.businessAddress,
    email: profile.email,
    organizationName: profile.organizationName,
    website: profile.website,
  };
}

export function parseOrganizationDetailsFormData(
  formData: FormData,
): OrganizationDetailsFormValues {
  const readText = (key: keyof OrganizationDetailsFormValues) => {
    const value = formData.get(key);

    if (typeof value !== "string") {
      return "";
    }

    return value.trim();
  };

  return {
    businessAddress: readText("businessAddress"),
    organizationName: readText("organizationName"),
    website: normalizeWebsiteUrl(readText("website")),
  };
}

export function validateOrganizationDetailsInput(
  input: OrganizationDetailsFormValues,
): UpdateOrganizationDetailsState {
  if (!input.organizationName.trim()) {
    return {
      fieldErrors: {
        organizationName: "Organization name is required.",
      },
      message: "Please fix the highlighted fields.",
      ok: false,
    };
  }

  return {
    ...EMPTY_STATE,
    ok: true,
  };
}
