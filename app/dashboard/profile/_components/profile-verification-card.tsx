import { Button } from "@/components/ui/button";

import {
  AcademicCapIcon,
  ShieldCheckIcon,
} from "@/app/dashboard/profile/_components/profile-icons";

type ProfileVerificationCardProps = {
  handleVerify: () => void;
  isVerified: boolean;
  verifying: boolean;
};

export function ProfileVerificationCard({
  handleVerify,
  isVerified,
  verifying,
}: ProfileVerificationCardProps) {
  return (
    <div
      className={`rounded-xl border-2 px-4 py-3 transition-all ${
        isVerified
          ? "border-[color:var(--tone-green-base)]/30 bg-[color:var(--tone-green-soft)]"
          : "border-dashed border-[color:var(--brand-orange)]/40 bg-gradient-to-r from-[color:var(--tone-orange-soft)] to-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            isVerified
              ? "bg-[color:var(--tone-green-base)] text-white"
              : "bg-[color:var(--brand-orange)]/15 text-[color:var(--brand-orange)]"
          }`}
        >
          {isVerified ? (
            <ShieldCheckIcon className="size-4" />
          ) : (
            <AcademicCapIcon className="size-4" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-bold text-foreground">
            {isVerified
              ? "BU Student Verified ✅"
              : "Register & Verify as BU Student"}
          </h3>
          <p className="mt-0.5 max-w-xl text-[11px] leading-snug text-[color:var(--ink-muted)]">
            {isVerified
              ? "Your Bicol University student identity has been authenticated. You can now post projects and access all platform features."
              : "Authenticate your Bicol University student identity to unlock project posting, enhanced trust badges, and priority access to talent commissions."}
          </p>
          {!isVerified ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Button
                className="h-7 rounded-md bg-[color:var(--brand-orange)] px-3 text-[11px] font-semibold !text-white shadow-sm shadow-[color:var(--brand-orange)]/25 transition hover:bg-[color:var(--brand-orange-strong)] disabled:opacity-60"
                disabled={verifying}
                onClick={handleVerify}
              >
                {verifying ? (
                  <>
                    <span className="mr-1.5 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <AcademicCapIcon className="mr-1 size-3" />
                    Verify with BU Email
                  </>
                )}
              </Button>
              <p className="text-[10px] text-[color:var(--ink-soft)]">
                Requires a valid <span className="font-semibold">@bicol-u.edu.ph</span>{" "}
                email address
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
