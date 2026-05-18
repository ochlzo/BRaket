export type TalentAvailabilityStatus = "available" | "unavailable";

export type TalentAvailability = {
  isAvailable: boolean;
  label: string;
  status: TalentAvailabilityStatus;
};

export function getTalentAvailability(servicesCount: number): TalentAvailability {
  const isAvailable = servicesCount > 0;

  return {
    isAvailable,
    label: isAvailable ? "Available for bookings" : "Unavailable",
    status: isAvailable ? "available" : "unavailable",
  };
}
