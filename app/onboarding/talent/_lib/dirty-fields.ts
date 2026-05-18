export function parseDirtyFields<T extends string>(
  formData: FormData,
  allowedFields: readonly T[],
) {
  const value = formData.get("dirtyFields");

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    const allowed = new Set<string>(allowedFields);

    return parsed.filter(
      (field): field is T =>
        typeof field === "string" && allowed.has(field),
    );
  } catch {
    return [];
  }
}

export function hasDirtyField<T extends string>(
  dirtyFields: readonly T[],
  field: T,
) {
  return dirtyFields.includes(field);
}
