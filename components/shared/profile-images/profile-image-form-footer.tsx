"use client";

import { Button } from "@/components/ui/button";

type ProfileImageFormFooterProps = {
  isPending: boolean;
  isSaveDisabled: boolean;
  onCancel: () => void;
};

export function ProfileImageFormFooter({
  isPending,
  isSaveDisabled,
  onCancel,
}: ProfileImageFormFooterProps) {
  return (
    <div className="border-t border-[color:var(--line-strong)] bg-[color:var(--surface)] px-5 py-4">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          className="rounded-xl"
          onClick={onCancel}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="rounded-xl"
          disabled={isSaveDisabled}
          type="submit"
        >
          {isPending ? "Uploading..." : "Save images"}
        </Button>
      </div>
    </div>
  );
}
