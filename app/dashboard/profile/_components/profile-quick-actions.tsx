import Link from "next/link";

type ProfileQuickActionsProps = {
  isClient: boolean;
};

export function ProfileQuickActions({
  isClient,
}: ProfileQuickActionsProps) {
  return (
    <div className="rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-2.5">
      <h3 className="mb-1.5 text-xs font-bold text-foreground">
        Quick Actions
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {isClient ? (
          <>
            <Link
              className="inline-flex items-center gap-1 rounded-md bg-[color:var(--brand-orange)] px-3 py-1.5 text-[11px] font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
              href="/browse"
            >
              🔍 Browse Talents
            </Link>
            <Link
              className="inline-flex items-center gap-1 rounded-md border border-[color:var(--line-strong)] bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
              href="/how-it-works"
            >
              How it Works
            </Link>
            <Link
              className="inline-flex items-center gap-1 rounded-md border border-[color:var(--line-strong)] bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
              href="/dashboard/client/bookings"
            >
              📋 View Bookings
            </Link>
          </>
        ) : (
          <>
            <Link
              className="inline-flex items-center gap-1 rounded-md bg-[color:var(--brand-orange)] px-3 py-1.5 text-[11px] font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
              href="/dashboard/talent/services/new"
            >
              + New Service
            </Link>
            <Link
              className="inline-flex items-center gap-1 rounded-md border border-[color:var(--line-strong)] bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
              href="/dashboard/talent/services"
            >
              🛠️ My Services
            </Link>
            <Link
              className="inline-flex items-center gap-1 rounded-md border border-[color:var(--line-strong)] bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
              href="/dashboard/talent/bookings"
            >
              📋 View Bookings
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
