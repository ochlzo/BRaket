import Link from "next/link";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Flag,
  History,
  ShieldCheck,
  UsersRound,
  Wrench,
} from "lucide-react";

import { AdminPlatformActivityChart } from "@/app/admin/_components/admin-platform-activity-chart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminDashboardData } from "@/server/admin/dashboard-data";

type AdminDashboardOverviewProps = {
  data: AdminDashboardData;
};

export function AdminDashboardOverview({ data }: AdminDashboardOverviewProps) {
  const verificationRate =
    data.talentUsers > 0
      ? Math.round((data.verifiedTalents / data.talentUsers) * 100)
      : 0;
  const cards = [
    {
      icon: UsersRound,
      label: "Users",
      meta: `${data.clientUsers} clients, ${data.talentUsers} talents`,
      value: data.totalUsers,
    },
    {
      icon: ShieldCheck,
      label: "Verified talents",
      meta: `${verificationRate}% of talent accounts`,
      value: data.verifiedTalents,
    },
    {
      icon: BriefcaseBusiness,
      label: "Bookings",
      meta: `${data.activeBookings} active, ${data.completedBookings} completed`,
      value: data.totalBookings,
    },
    {
      icon: Wrench,
      label: "Services",
      meta: "Bookable offers on BRaket",
      value: data.services,
    },
  ];

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      <AdminPlatformActivityChart series={data.platformActivity} />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-surface-soft)]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-[color:var(--brand-orange)]" />
              <CardTitle className="tracking-normal">Needs attention</CardTitle>
            </div>
            <CardDescription>
              Admin queues that can block trust, safety, or fulfillment.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <ActionRow
              count={data.pendingApprovals}
              href="/admin?view=talent-approval"
              icon={ClipboardList}
              label="Talent approvals pending"
            />
            <ActionRow
              count={data.pendingReports}
              href="/admin?view=user-reports"
              icon={Flag}
              label="Content reports pending"
            />
            <ActionRow
              count={data.activeBookings}
              href="/admin"
              icon={BriefcaseBusiness}
              label="Active bookings in progress"
            />
          </CardContent>
        </Card>

        <Card className="border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-surface-soft)]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-[color:var(--tone-green-deep)]" />
              <CardTitle className="tracking-normal">Recent activity</CardTitle>
            </div>
            <CardDescription>
              Latest users and pending reports entering the admin queue.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <ActivityList
              emptyText="No users have joined yet."
              items={data.recentUsers.map((user) => ({
                meta: `${user.role} - ${new Date(user.createdAt).toLocaleDateString()}`,
                title: user.name,
                value: user.email,
              }))}
              title="Newest users"
            />
            <ActivityList
              emptyText="No pending reports."
              items={data.recentReports.map((report) => ({
                meta: `${report.type} - ${new Date(report.createdAt).toLocaleDateString()}`,
                title: report.label,
                value: report.id,
              }))}
              title="Latest reports"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[var(--shadow-surface-soft)]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="size-5 text-[color:var(--brand-blue)]" />
            <CardTitle className="tracking-normal">Activity logs</CardTitle>
          </div>
          <CardDescription>
            A combined timeline of users, bookings, reports, and verifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {data.activityLogs.length === 0 ? (
            <p className="rounded-xl bg-[color:var(--surface-alt)] px-4 py-3 text-sm text-[color:var(--ink-muted)]">
              No platform activity yet.
            </p>
          ) : null}
          {data.activityLogs.map((log) => (
            <div
              className="grid gap-3 rounded-xl bg-[color:var(--surface-alt)] px-4 py-3 md:grid-cols-[7rem_minmax(0,1fr)_auto] md:items-center"
              key={log.id}
            >
              <Badge className="mx-auto bg-[color:var(--surface)] text-[color:var(--brand-blue)] md:mx-0">
                {log.kind}
              </Badge>
              <div className="min-w-0">
                <p className="break-words text-sm font-bold text-foreground">
                  {log.title}
                </p>
                <p className="mt-1 break-words text-xs text-[color:var(--ink-muted)]">
                  {log.detail}
                </p>
              </div>
              <time className="text-xs font-semibold text-[color:var(--ink-soft)]">
                {new Date(log.createdAt).toLocaleDateString()}
              </time>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  meta,
  value,
}: {
  icon: typeof UsersRound;
  label: string;
  meta: string;
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
          <div className="flex size-9 items-center justify-center rounded-lg bg-[color:var(--surface-alt)] text-[color:var(--brand-blue)]">
            <Icon className="size-4" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-xs font-medium text-[color:var(--ink-muted)]">
          {meta}
        </p>
      </CardContent>
    </Card>
  );
}

function ActionRow({
  count,
  href,
  icon: Icon,
  label,
}: {
  count: number;
  href: string;
  icon: typeof AlertTriangle;
  label: string;
}) {
  return (
    <Link
      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-[color:var(--surface-alt)] px-4 py-3 transition hover:bg-[color:var(--surface-hover)]"
      href={href}
    >
      <Icon className="size-4 text-[color:var(--brand-blue)]" />
      <span className="text-sm font-bold text-foreground">{label}</span>
      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-[color:var(--ink-muted)]">
        {count}
      </span>
    </Link>
  );
}

function ActivityList({
  emptyText,
  items,
  title,
}: {
  emptyText: string;
  items: Array<{ meta: string; title: string; value: string }>;
  title: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-black text-foreground">{title}</h3>
      <div className="mt-3 grid gap-2">
        {items.length === 0 ? (
          <p className="rounded-xl bg-[color:var(--surface-alt)] px-4 py-3 text-sm text-[color:var(--ink-muted)]">
            {emptyText}
          </p>
        ) : null}
        {items.map((item) => (
          <div
            className="rounded-xl bg-[color:var(--surface-alt)] px-4 py-3"
            key={`${item.title}-${item.value}`}
          >
            <p className="break-words text-sm font-bold text-foreground">
              {item.title}
            </p>
            <p className="mt-1 break-words text-xs text-[color:var(--ink-muted)]">
              {item.value}
            </p>
            <p className="mt-2 text-xs font-semibold text-[color:var(--ink-soft)]">
              {item.meta}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
