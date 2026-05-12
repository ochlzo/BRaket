export const ACCOUNT_SOCIAL_LINK_OPTIONS = [
  { field: "facebookUrl", label: "Facebook" },
  { field: "linkedinUrl", label: "LinkedIn" },
  { field: "xUrl", label: "X" },
  { field: "githubUrl", label: "GitHub" },
  { field: "instagramUrl", label: "Instagram" },
] as const;

export type AccountSocialLinkField =
  (typeof ACCOUNT_SOCIAL_LINK_OPTIONS)[number]["field"];

export type AccountSettingsFieldName =
  | "address"
  | "contactNum"
  | "email"
  | "firstName"
  | "githubUrl"
  | "instagramUrl"
  | "lastName"
  | "linkedinUrl"
  | "username"
  | "xUrl"
  | "facebookUrl";

export type AccountSettingsFormValues = {
  address: string;
  contactNum: string;
  email: string;
  facebookUrl: string;
  firstName: string;
  githubUrl: string;
  instagramUrl: string;
  lastName: string;
  linkedinUrl: string;
  username: string;
  xUrl: string;
};

export type AccountSettingsPageSource = {
  address: string | null;
  contactNum: string | null;
  email: string;
  facebook_url: string | null;
  firstName: string | null;
  github_url: string | null;
  instagram_url: string | null;
  lastName: string | null;
  linkedin_url: string | null;
  username: string | null;
  x_url: string | null;
};

export type UpdateAccountSettingsState = {
  fieldErrors?: Partial<Record<AccountSettingsFieldName, string>>;
  message: string;
  ok: boolean;
  values?: AccountSettingsFormValues;
};

export type AccountSettingsValidationOptions = {
  contactNumTaken?: boolean;
  usernameTaken?: boolean;
};

const EMPTY_STATE: UpdateAccountSettingsState = {
  message: "",
  ok: false,
};

function compactText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function readTextField(formData: FormData, key: keyof AccountSettingsFormValues) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeContactNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function parseAccountSettingsFormData(
  formData: FormData,
): AccountSettingsFormValues {
  return {
    address: readTextField(formData, "address"),
    contactNum: normalizeContactNumber(readTextField(formData, "contactNum")),
    email: readTextField(formData, "email"),
    facebookUrl: readTextField(formData, "facebookUrl"),
    firstName: readTextField(formData, "firstName"),
    githubUrl: readTextField(formData, "githubUrl"),
    instagramUrl: readTextField(formData, "instagramUrl"),
    lastName: readTextField(formData, "lastName"),
    linkedinUrl: readTextField(formData, "linkedinUrl"),
    username: normalizeUsername(readTextField(formData, "username")),
    xUrl: readTextField(formData, "xUrl"),
  };
}

export function buildAccountSettingsFormValues(
  source: AccountSettingsPageSource,
): AccountSettingsFormValues {
  return {
    address: compactText(source.address),
    contactNum: compactText(source.contactNum),
    email: compactText(source.email),
    facebookUrl: compactText(source.facebook_url),
    firstName: compactText(source.firstName),
    githubUrl: compactText(source.github_url),
    instagramUrl: compactText(source.instagram_url),
    lastName: compactText(source.lastName),
    linkedinUrl: compactText(source.linkedin_url),
    username: compactText(source.username),
    xUrl: compactText(source.x_url),
  };
}

export function buildVisibleSocialLinkFields(values: AccountSettingsFormValues) {
  return ACCOUNT_SOCIAL_LINK_OPTIONS.filter(
    (option) => values[option.field].trim().length > 0,
  ).map((option) => option.field);
}

export function buildSocialLinkHref(
  field: AccountSocialLinkField,
  value: string,
) {
  const raw = compactText(value);

  if (!raw) {
    return "";
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  const handle = raw.replace(/^@/, "");

  switch (field) {
    case "facebookUrl":
      return `https://www.facebook.com/${handle}`;
    case "githubUrl":
      return `https://github.com/${handle}`;
    case "instagramUrl":
      return `https://www.instagram.com/${handle}`;
    case "linkedinUrl":
      return `https://www.linkedin.com/in/${handle}`;
    case "xUrl":
      return `https://x.com/${handle}`;
    default:
      return raw;
  }
}

export function validateAccountSettingsInput(
  input: AccountSettingsFormValues,
  options: AccountSettingsValidationOptions = {},
): UpdateAccountSettingsState {
  const fieldErrors: Partial<Record<AccountSettingsFieldName, string>> = {};

  if (!input.username.trim()) {
    fieldErrors.username = "Username is required.";
  }

  if (!input.contactNum.trim()) {
    fieldErrors.contactNum = "Contact number is required.";
  } else if (!/^09\d{9}$/.test(input.contactNum.trim())) {
    fieldErrors.contactNum =
      "Contact number must start with 09 and contain 11 digits.";
  }

  if (!input.address.trim()) {
    fieldErrors.address = "Address is required.";
  }

  if (options.usernameTaken && input.username.trim()) {
    fieldErrors.username = "Username is already taken.";
  }

  if (options.contactNumTaken && input.contactNum.trim()) {
    fieldErrors.contactNum = "Contact number is already in use.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please fix the highlighted fields.",
      ok: false,
    };
  }

  return {
    ...EMPTY_STATE,
    ok: true,
  };
}
