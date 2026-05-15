"use client";

import { useRouter } from "next/navigation";

import { ProfileVerificationCard } from "@/app/dashboard/profile/_components/profile-verification-card";
import { Button } from "@/components/ui/button";

type ProfileVerificationPanelProps = {
  authId: string;
  isVerified: boolean;
};

export function ProfileVerificationPanel({
  authId,
  isVerified,
}: ProfileVerificationPanelProps) {
  const router = useRouter();
  void authId;

  return (
    <div className="space-y-2">
      <ProfileVerificationCard isVerified={isVerified} showAction={false} />
      {!isVerified ? (
        <div className="rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground">
                Admin review required
              </p>
              <p className="mt-0.5 text-[11px] text-[color:var(--ink-muted)]">
                Submit your BU email and student ID for manual verification.
              </p>
            </div>
            <Button
              className="h-8 rounded-md bg-[color:var(--brand-blue)] px-3 text-[11px] font-semibold !text-white transition hover:bg-[color:var(--brand-blue-strong)]"
              onClick={() =>
                router.push("/talent/verify?step=form&source=dashboard")
              }
              type="button"
            >
              Open verification
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
