import type {
  TalentAvailabilityStatus as PrismaTalentAvailabilityStatus,
} from "@prisma/client";

export type TalentAvailabilityStatus = PrismaTalentAvailabilityStatus;

export type TalentAvailability = {
  isAvailable: boolean;
  label: string;
  status: TalentAvailabilityStatus;
};

export const talentAvailabilityOptions = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Busy", value: "BUSY" },
  { label: "Unavailable", value: "UNAVAILABLE" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: TalentAvailabilityStatus;
}>;

const availabilityStatuses = new Set<string>(
  talentAvailabilityOptions.map((option) => option.value),
);

export function isTalentAvailabilityStatus(
  value: string,
): value is TalentAvailabilityStatus {
  return availabilityStatuses.has(value);
}

export function getTalentAvailability(
  status: TalentAvailabilityStatus | null | undefined,
): TalentAvailability {
  const normalizedStatus = status ?? "AVAILABLE";

  if (normalizedStatus === "BUSY") {
    return {
      isAvailable: false,
      label: "Busy",
      status: normalizedStatus,
    };
  }

  if (normalizedStatus === "UNAVAILABLE") {
    return {
      isAvailable: false,
      label: "Unavailable",
      status: normalizedStatus,
    };
  }

  return {
    isAvailable: true,
    label: "Available",
    status: normalizedStatus,
  };
}
