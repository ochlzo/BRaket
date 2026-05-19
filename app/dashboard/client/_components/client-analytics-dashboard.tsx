import type { BookingStatus } from "@prisma/client";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Search,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BookingListItem } from "@/lib/bookings/types";
import { ClientActivityChart } from "./client-activity-chart";

type ClientAnalyticsDashboardProps = {
  bookings: BookingListItem[];
  userId: string;
};

const activeStatuses = new Set<BookingStatus>([
  "ACCEPTED",
  "IN_PROGRESS",
  "WORK_SUBMITTED",
]);

const statusLabels: Record<BookingStatus, string> = {
  ACCEPTED: "Accepted",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  DECLINED: "Declined",
  IN_PROGRESS: "In progress",
  PENDING: "Pending",
  WORK_SUBMITTED: "Work submitted",
};

const statusBadgeStyles: Record<BookingStatus, string> = {
  ACCEPTED:
    "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]",
  CANCELLED:
    "bg-[color:var(--surface-alt)] text-[color:var(--ink-muted)]",
  COMPLETED:
    "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  DECLINED: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
  IN_PROGRESS:
    "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]",
  PENDING:
    "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-orange-deep)]",
  WORK_SUBMITTED:
    "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
};

const trackedStatuses: BookingStatus[] = [
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "WORK_SUBMITTED",
  "COMPLETED",
  "CANCELLED",
  "DECLINED",
];

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  maximumFractionDigits: 0,
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function calculateDashboardData(bookings: BookingListItem[]) {
  const active = bookings.filter((booking) =>
    activeStatuses.has(booking.status),
  ).length;
  const pending = bookings.filter((booking) => booking.status === "PENDING")
    .length;
  const completed = bookings.filter((booking) => booking.status === "COMPLETED")
    .length;
  return {
    active,
    completed,
    pending,
    total: bookings.length,
  };
}

function StatCard({
  description,
  icon: Icon,
  label,
  value,
}: {
  description: string;
  icon: typeof BriefcaseBusiness;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-surface-soft)]">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl font-bold tracking-normal text-foreground">
          {value}
        </CardTitle>
        <CardAction>
          <div className="flex size-9 items-center justify-center rounded-lg bg-[color:var(--surface-alt)] text-[color:var(--brand-orange)]">
            <Icon className="size-4" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-xs font-medium text-[color:var(--ink-muted)]">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function EmptyActivity() {
  return (
    <div className="rounded-lg border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface)] px-6 py-10 text-center">
      <p className="text-base font-semibold text-foreground">
        No project activity yet
      </p>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink-muted)]">
        Your dashboard will fill with real requests, bookings, and project
        updates as you start working with talent.
      </p>
    </div>
  );
}

function RecentBookings({ bookings }: { bookings: BookingListItem[] }) {
  if (bookings.length === 0) {
    return <EmptyActivity />;
  }

  return (
    <div className="divide-y divide-[color:var(--line)]">
      {bookings.slice(0, 5).map((booking) => (
        <div
          className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
          key={booking.id}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={statusBadgeStyles[booking.status]}>
                {statusLabels[booking.status]}
              </Badge>
              <span className="text-xs font-medium text-[color:var(--ink-muted)]">
                {dateFormatter.format(new Date(booking.createdAt))}
              </span>
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-foreground">
              {booking.service.title}
            </p>
            <p className="mt-1 truncate text-xs text-[color:var(--ink-muted)]">
              Talent: {booking.talent.displayName}
            </p>
          </div>
          <div className="text-sm font-bold text-[color:var(--brand-orange)] sm:text-right">
            {booking.budget === null ? "Budget TBD" : formatCurrency(booking.budget)}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusOverview({ bookings }: { bookings: BookingListItem[] }) {
  const total = Math.max(bookings.length, 1);

  return (
    <div className="space-y-4">
      {trackedStatuses.map((status) => {
        const count = bookings.filter((booking) => booking.status === status)
          .length;
        const width = `${Math.round((count / total) * 100)}%`;

        return (
          <div className="space-y-2" key={status}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-foreground">
                {statusLabels[status]}
              </span>
              <span className="text-sm font-bold text-[color:var(--ink-muted)]">
                {count}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[color:var(--surface-alt)]">
              <div
                className="h-full rounded-full bg-[color:var(--brand-orange)]"
                style={{ width }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ClientAnalyticsDashboard({
  bookings,
  userId,
}: ClientAnalyticsDashboardProps) {
  const data = calculateDashboardData(bookings);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          description="Accepted, in-progress, or submitted work."
          icon={BriefcaseBusiness}
          label="Active projects"
          value={data.active}
        />
        <StatCard
          description="Requests waiting for talent response."
          icon={CalendarClock}
          label="Pending requests"
          value={data.pending}
        />
        <StatCard
          description="All requests and bookings on this account."
          icon={ClipboardList}
          label="Total bookings"
          value={data.total}
        />
        <StatCard
          description="Bookings completed through BRaket."
          icon={CheckCircle2}
          label="Completed"
          value={data.completed}
        />
      </div>

      <ClientActivityChart bookings={bookings} userId={userId} />

      <Card className="border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-surface-soft)]">
        <CardHeader>
          <CardTitle className="tracking-normal">Quick actions</CardTitle>
          <CardDescription>
            Jump back into the client workflows that create dashboard activity.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            className="bg-[color:var(--brand-orange)] !text-white hover:bg-[color:var(--brand-orange-strong)]"
            nativeButton={false}
            render={<Link href="/browse" />}
          >
            <Search className="size-4" />
            Browse talents
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/client/bookings" />}
            variant="outline"
          >
            <ClipboardList className="size-4" />
            View bookings
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/how-it-works" />}
            variant="outline"
          >
            <ArrowUpRight className="size-4" />
            How it works
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <Card className="border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-surface-soft)]">
          <CardHeader>
            <CardTitle className="tracking-normal">Recent activity</CardTitle>
            <CardDescription>
              Latest bookings and request updates for this client account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentBookings bookings={bookings} />
          </CardContent>
        </Card>

        <Card className="border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-surface-soft)]">
          <CardHeader>
            <CardTitle className="tracking-normal">Status overview</CardTitle>
            <CardDescription>{data.total} total bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusOverview bookings={bookings} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
