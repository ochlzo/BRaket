type AuthMetadata = Record<string, unknown>;

function readText(metadata: AuthMetadata, keys: string[]) {
  for (const key of keys) {
    const value = metadata[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
}

function splitDisplayName(value: string) {
  const compact = value.trim().replace(/\s+/g, " ");

  if (!compact) {
    return { firstName: "", lastName: "" };
  }

  const parts = compact.split(" ");

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function resolveNamePartsFromMetadata(metadata: AuthMetadata) {
  const explicitFirstName = readText(metadata, [
    "firstName",
    "firstname",
    "first_name",
    "given_name",
  ]);
  const explicitLastName = readText(metadata, [
    "lastName",
    "lastname",
    "last_name",
    "family_name",
  ]);
  const displayName = readText(metadata, [
    "full_name",
    "name",
    "display_name",
    "displayName",
  ]);
  const displayParts = splitDisplayName(displayName);

  return {
    firstName: explicitFirstName || displayParts.firstName,
    lastName: explicitLastName || displayParts.lastName,
  };
}
