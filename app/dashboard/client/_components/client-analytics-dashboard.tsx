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
import {
  RecentBookings,
  StatusOverview,
} from "./client-dashboard-panels";

type ClientAnalyticsDashboardProps = {
  bookings: BookingListItem[];
};

const activeStatuses = new Set<BookingStatus>([
  "ACCEPTED",
  "IN_PROGRESS",
  "WORK_SUBMITTED",
]);

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

export function ClientAnalyticsDashboard({
  bookings,
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
        <div className="xl:col-span-2">
          <ClientActivityChart bookings={bookings} />
        </div>

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
