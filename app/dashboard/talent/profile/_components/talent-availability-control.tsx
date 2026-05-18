"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  isTalentAvailabilityStatus,
  talentAvailabilityOptions,
  type TalentAvailabilityStatus,
} from "@/lib/talent-profile/availability";

import { updateTalentAvailabilityAction } from "../_actions/update-talent-availability-action";

type TalentAvailabilityControlProps = {
  initialStatus: TalentAvailabilityStatus;
};

function availabilityBadgeStyles(status: TalentAvailabilityStatus) {
  if (status === "BUSY") {
    return {
      select:
        "border-[color:var(--tone-orange-soft)] bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)]",
    };
  }

  if (status === "UNAVAILABLE") {
    return {
      select:
        "border-[color:var(--tone-red-soft)] bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-base)]",
    };
  }

  return {
    select:
      "border-[color:var(--tone-green-soft)] bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  };
}

export function TalentAvailabilityControl({
  initialStatus,
}: TalentAvailabilityControlProps) {
  const router = useRouter();
  const [draftStatus, setDraftStatus] = useState(initialStatus);
  const [savedStatus, setSavedStatus] = useState(initialStatus);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const styles = availabilityBadgeStyles(draftStatus);

  function saveStatus(nextStatus: string) {
    if (!isTalentAvailabilityStatus(nextStatus)) {
      setMessage("Choose a valid status.");
      return;
    }

    setDraftStatus(nextStatus);

    if (nextStatus === savedStatus) {
      setMessage("");
      return;
    }

    startTransition(() => {
      const formData = new FormData();

      formData.set("availabilityStatus", nextStatus);
      setMessage("");
      void updateTalentAvailabilityAction(formData)
        .then((result) => {
          setSavedStatus(result.availabilityStatus);
          setDraftStatus(result.availabilityStatus);
          router.refresh();
        })
        .catch(() => {
          setDraftStatus(savedStatus);
          setMessage("Status was not saved. Please try again.");
        });
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <label
          className="sr-only"
          htmlFor="talent-availability-status"
        >
          Availability
        </label>
        <select
          aria-label="Availability status"
          className={`h-9 rounded-full border px-3 text-sm font-bold outline-none transition focus:border-[color:var(--brand-blue)] disabled:opacity-70 ${styles.select}`}
          disabled={isPending}
          id="talent-availability-status"
          name="availabilityStatus"
          onChange={(event) => saveStatus(event.target.value)}
          value={draftStatus}
        >
          {talentAvailabilityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {isPending ? (
        <span className="text-xs font-semibold text-[color:var(--ink-muted)]">
          Saving...
        </span>
      ) : message ? (
        <span className="text-xs font-semibold text-[color:var(--tone-red-base)]">
          {message}
        </span>
      ) : null}
    </div>
  );
}
