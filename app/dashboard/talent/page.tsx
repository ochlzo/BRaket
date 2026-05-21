import type { BookingStatus } from "@prisma/client";
import {
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import Link from "next/link";

import { TalentActivityChart } from "@/app/dashboard/talent/_components/talent-activity-chart";
import { ProfileQuickActions } from "@/app/dashboard/profile/_components/profile-quick-actions";
import { TalentDashboardLayout } from "@/components/shared/layout/talent-dashboard-layout";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BookingListItem } from "@/lib/bookings/types";
import {
  getBookingsForUser,
  getServicesForTalent,
} from "@/server/bookings/data";
import { requireCurrentAppUser } from "@/server/users/current-user";

const activeStatuses = new Set<BookingStatus>([
  "ACCEPTED",
  "IN_PROGRESS",
  "WORK_SUBMITTED",
]);

function getTalentStats(
  bookings: BookingListItem[],
  publishedServices: number,
) {
  const activeBookings = bookings.filter((booking) =>
    activeStatuses.has(booking.status),
  ).length;
  const pendingRequests = bookings.filter(
    (booking) => booking.status === "PENDING",
  ).length;
  const completedProjects = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  ).length;

  return [
    {
      description: "Accepted, in-progress, or submitted commissions.",
      icon: BriefcaseBusiness,
      label: "Active Bookings",
      value: activeBookings,
    },
    {
      description: "Requests waiting for your response.",
      icon: CalendarClock,
      label: "Pending Requests",
      value: pendingRequests,
    },
    {
      description: "Services currently available to clients.",
      icon: Wrench,
      label: "Published Services",
      value: publishedServices,
    },
    {
      description: "Bookings completed through BRaket.",
      icon: CheckCircle2,
      label: "Completed Projects",
      value: completedProjects,
    },
  ];
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
  value: number;
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

export default async function TalentDashboardPage() {
  const user = await requireCurrentAppUser("talent");
  const [bookings, services] = await Promise.all([
    getBookingsForUser(user, "talent"),
    getServicesForTalent(user),
  ]);
  const talentStats = getTalentStats(bookings, services.length);
  const titleName = user.firstName || user.displayName || user.username;

  return (
    <TalentDashboardLayout
      action={
        <Link
          href="/dashboard/talent/services/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--brand-orange)] px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
        >
          New Service
        </Link>
      }
      subtitle="This account now starts clean. New service requests and commissions will appear here once you publish real work."
      title={`Welcome back, ${titleName}`}
    >
      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {talentStats.map((stat) => (
          <StatCard
            description={stat.description}
            icon={stat.icon}
            key={stat.label}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>

      <div className="mb-8">
        <ProfileQuickActions isClient={false} />
      </div>

      <div className="space-y-5">
        <TalentActivityChart bookings={bookings} />

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-12 text-center">
            <p className="text-lg font-semibold text-foreground">
              No live commission activity yet
            </p>
            <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
              Demo requests are gone for new accounts. Finish your profile,
              publish a service, and your real commission activity will show up
              here.
            </p>
          </div>
        ) : null}
      </div>
    </TalentDashboardLayout>
  );
}
