"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  getTalentAvailability,
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
      dot: "bg-[color:var(--tone-orange-base)]",
      pill: "bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)]",
    };
  }

  if (status === "UNAVAILABLE") {
    return {
      dot: "bg-[color:var(--tone-red-base)]",
      pill: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-base)]",
    };
  }

  return {
    dot: "bg-[color:var(--tone-green-base)]",
    pill: "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
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
  const availability = getTalentAvailability(savedStatus);
  const styles = availabilityBadgeStyles(savedStatus);

  function handleSubmit(formData: FormData) {
    const nextStatus = String(formData.get("availabilityStatus") ?? "");

    if (!isTalentAvailabilityStatus(nextStatus)) {
      setMessage("Choose a valid status.");
      return;
    }

    startTransition(() => {
      setMessage("");
      void updateTalentAvailabilityAction(formData)
        .then((result) => {
          setSavedStatus(result.availabilityStatus);
          setDraftStatus(result.availabilityStatus);
          setMessage("Status saved.");
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
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${styles.pill}`}
      >
        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
        {availability.label}
      </span>
      <form action={handleSubmit} className="flex flex-wrap items-center gap-2">
        <label
          className="text-xs font-bold uppercase tracking-normal text-[color:var(--ink-muted)]"
          htmlFor="talent-availability-status"
        >
          Availability
        </label>
        <select
          className="h-10 rounded-full border border-[color:var(--line-strong)] bg-white px-3 text-sm font-semibold text-foreground outline-none transition focus:border-[color:var(--brand-blue)]"
          id="talent-availability-status"
          name="availabilityStatus"
          onChange={(event) => {
            if (isTalentAvailabilityStatus(event.target.value)) {
              setDraftStatus(event.target.value);
            }
          }}
          value={draftStatus}
        >
          {talentAvailabilityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          className="h-10 rounded-full bg-[color:var(--brand-orange)] px-4 text-sm font-bold text-white transition hover:bg-[color:var(--brand-orange-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending || draftStatus === savedStatus}
          type="submit"
        >
          {isPending ? "Saving..." : "Save status"}
        </button>
      </form>
      {message ? (
        <span className="text-xs font-semibold text-[color:var(--ink-muted)]">
          {message}
        </span>
      ) : null}
    </div>
  );
}
