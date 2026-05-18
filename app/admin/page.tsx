import {
  LayoutDashboard,
  FileWarning,
  ShieldCheck,
  Star,
  UserCheck,
  UsersRound,
  Wrench,
} from "lucide-react";

import { AdminDashboardOverview } from "@/app/admin/_components/admin-dashboard-overview";
import { AdminModerationConsole } from "@/app/admin/_components/admin-moderation-console";
import {
  AdminSidebar,
  type AdminSidebarGroup,
  type AdminSidebarItem,
} from "@/app/admin/_components/admin-sidebar";
import { AdminUserManagementConsole } from "@/app/admin/_components/admin-user-management-console";
import { AdminVerificationConsole } from "@/app/admin/_components/admin-verification-console";
import { adminViewCopy, resolveAdminView } from "@/app/admin/_lib/admin-view";
import { BrandMark } from "@/components/shared/branding/brand-mark";
import { getAdminVerificationDashboardData } from "@/server/talent-verification/admin-data";
import { getAdminContentReports } from "@/server/moderation/admin-data";
import { requireAdminUser } from "@/server/admin/access";
import { getAdminDashboardData } from "@/server/admin/dashboard-data";
import { getAdminManagedUsers } from "@/server/admin/users-data";

type AdminPageProps = {
  searchParams: Promise<{
    view?: string;
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const admin = await requireAdminUser();
  const { view } = await searchParams;
  const activeView = resolveAdminView(view);
  const [dashboardData, data, reports, clients, talents] = await Promise.all([
    getAdminDashboardData(),
    getAdminVerificationDashboardData(),
    getAdminContentReports(),
    getAdminManagedUsers("client"),
    getAdminManagedUsers("talent"),
  ]);
  const serviceReports = reports.filter((report) => report.targetType === "SERVICE");
  const userReports = reports.filter((report) => report.targetType === "PROFILE");
  const reviewReports = reports.filter((report) => report.targetType === "REVIEW");
  const talentReports = userReports.filter(
    (report) => report.targetAudience === "talent",
  );
  const clientReports = userReports.filter(
    (report) => report.targetAudience === "client",
  );
  const stats = [
    {
      icon: UsersRound,
      label: "Users",
      value: data.totalUsers,
    },
    {
      icon: ShieldCheck,
      label: "Verified talents",
      value: data.verifiedTalents,
    },
    {
      icon: Wrench,
      label: "Services",
      value: data.activeServices,
    },
  ];
  const approvalItems: AdminSidebarItem[] = [
    {
      count: data.pendingRequests.length,
      href: "/admin?view=talent-approval",
      icon: ShieldCheck,
      label: "Verification queue",
      view: "talent-approval",
    },
  ];
  const userItems: AdminSidebarItem[] = [
    {
      count: clients.length,
      href: "/admin?view=clients",
      icon: UsersRound,
      label: "Clients",
      view: "clients",
    },
    {
      count: talents.length,
      href: "/admin?view=talents",
      icon: UserCheck,
      label: "Talents",
      view: "talents",
    },
  ];
  const reportItems: AdminSidebarItem[] = [
    {
      count: serviceReports.length,
      href: "/admin?view=service-reports",
      icon: Wrench,
      label: "Service reports",
      view: "service-reports",
    },
    {
      count: userReports.length,
      href: "/admin?view=user-reports",
      icon: UsersRound,
      label: "User reports",
      view: "user-reports",
    },
    {
      count: reviewReports.length,
      href: "/admin?view=review-reports",
      icon: Star,
      label: "Review reports",
      view: "review-reports",
    },
    {
      count: talentReports.length,
      href: "/admin?view=talent-reports",
      icon: UserCheck,
      label: "Talent reports",
      view: "talent-reports",
    },
    {
      count: clientReports.length,
      href: "/admin?view=client-reports",
      icon: FileWarning,
      label: "Client reports",
      view: "client-reports",
    },
  ];
  const navGroups: AdminSidebarGroup[] = [
    {
      count: dashboardData.pendingApprovals + dashboardData.pendingReports,
      href: "/admin",
      icon: LayoutDashboard,
      items: [],
      label: "Dashboard",
      showCount: false,
      view: "dashboard",
    },
    {
      count: data.pendingRequests.length,
      icon: ShieldCheck,
      items: approvalItems,
      label: "Talent Approval",
    },
    {
      count: clients.length + talents.length,
      icon: UsersRound,
      items: userItems,
      label: "Users",
    },
    {
      count: reports.length,
      icon: FileWarning,
      items: reportItems,
      label: "Reports",
    },
  ];
  const activeCopy = adminViewCopy[activeView];

  return (
    <main className="min-h-screen bg-[color:var(--surface-alt)] text-foreground lg:pl-72">
      <AdminSidebar activeView={activeView} groups={navGroups} />

      <header className="border-b border-[color:var(--line-strong)] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <BrandMark href="/admin" subtitle="Admin" />
          <div className="rounded-full border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-2 text-xs font-semibold text-[color:var(--ink-muted)]">
            Signed in as {admin.email}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--brand-orange)]">
                {activeCopy.eyebrow}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                {activeCopy.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink-muted)]">
                {activeCopy.body}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  className="rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-3"
                  key={stat.label}
                >
                  <div className="flex items-center gap-2 text-[color:var(--ink-muted)]">
                    <stat.icon className="size-4" />
                    <span className="text-xs font-semibold">{stat.label}</span>
                  </div>
                  <p className="mt-2 text-2xl font-black tracking-[-0.03em]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {activeView === "dashboard" ? (
            <AdminDashboardOverview data={dashboardData} />
          ) : null}
          {activeView === "talent-approval" ? (
            <AdminVerificationConsole requests={data.pendingRequests} />
          ) : null}
          {activeView === "clients" ? (
            <AdminUserManagementConsole role="client" users={clients} />
          ) : null}
          {activeView === "talents" ? (
            <AdminUserManagementConsole role="talent" users={talents} />
          ) : null}
          {activeView === "service-reports" ? (
            <AdminModerationConsole reports={serviceReports} />
          ) : null}
          {activeView === "user-reports" ? (
            <AdminModerationConsole reports={userReports} />
          ) : null}
          {activeView === "review-reports" ? (
            <AdminModerationConsole reports={reviewReports} />
          ) : null}
          {activeView === "talent-reports" ? (
            <AdminModerationConsole reports={talentReports} />
          ) : null}
          {activeView === "client-reports" ? (
            <AdminModerationConsole reports={clientReports} />
          ) : null}
        </div>
      </section>
    </main>
  );
}
