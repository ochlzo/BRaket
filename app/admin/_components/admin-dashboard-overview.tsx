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
      meta: "Bookable offers on Braket",
      value: data.services,
    },
  ];

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)]"
            key={card.label}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-xl bg-[color:var(--surface-alt)] p-3 text-[color:var(--brand-blue)]">
                <card.icon className="size-5" />
              </div>
              <p className="text-3xl font-black tracking-[-0.03em]">
                {card.value}
              </p>
            </div>
            <h2 className="mt-4 text-sm font-black text-foreground">
              {card.label}
            </h2>
            <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
              {card.meta}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-[color:var(--brand-orange)]" />
            <h2 className="text-lg font-black">Needs Attention</h2>
          </div>
          <div className="mt-4 grid gap-3">
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
              href="/dashboard/admin"
              icon={BriefcaseBusiness}
              label="Active bookings in progress"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[color:var(--tone-green-deep)]" />
            <h2 className="text-lg font-black">Recent Activity</h2>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)]">
        <div className="flex items-center gap-2">
          <History className="size-5 text-[color:var(--brand-blue)]" />
          <h2 className="text-lg font-black">Activity Logs</h2>
        </div>
        <div className="mt-4 grid gap-2">
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
              <span className="mx-auto w-fit rounded-full bg-white px-2.5 py-1 text-center text-xs font-black text-[color:var(--brand-blue)] md:mx-0">
                {log.kind}
              </span>
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
        </div>
      </section>
    </div>
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
