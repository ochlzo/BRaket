"use client";

import { useState } from "react";
import Image from "next/image";
import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import {
  talents,
  clients,
  services,
  getPendingTalents,
  getAllUsers,
} from "@/lib/mock-data";
import type { TalentProfile, ClientProfile } from "@/lib/types";

const statusColors: Record<string, string> = {
  pending: "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]",
  approved: "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]",
  rejected: "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]",
};

type AdminTab = "overview" | "approvals" | "users";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [pendingList, setPendingList] = useState<TalentProfile[]>(getPendingTalents());
  const [userList, setUserList] = useState<(TalentProfile | ClientProfile)[]>(getAllUsers());
  const [flaggedUsers, setFlaggedUsers] = useState<Set<string>>(new Set());

  const totalUsers = userList.length;
  const pendingApprovals = pendingList.length;
  const activeServices = services.filter((s) => s.status === "published").length;

  const handleApprove = (id: string) => {
    setPendingList((prev) => prev.filter((t) => t.id !== id));
  };
  const handleReject = (id: string) => {
    setPendingList((prev) => prev.filter((t) => t.id !== id));
  };
  const handleRemoveUser = (userId: string) => {
    setUserList((prev) => prev.filter((u) => u.userId !== userId));
  };

  const handleFlagUser = (userId: string) => {
    setFlaggedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const tabs: { value: AdminTab; label: string; emoji: string }[] = [
    { value: "overview", label: "Overview", emoji: "📊" },
    { value: "approvals", label: "Pending Approvals", emoji: "✅" },
    { value: "users", label: "All Users", emoji: "👥" },
  ];

  return (
    <DashboardLayout role="client" title="Operations Dashboard" subtitle="Platform management and moderation">
      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === tab.value
                ? "bg-[color:var(--brand-orange)] !text-white shadow-md"
                : "bg-white border border-[color:var(--line-strong)] text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-alt)]"
            }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
            {tab.value === "approvals" && pendingApprovals > 0 && (
              <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {pendingApprovals}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Total Users", value: totalUsers, emoji: "👥", bg: "from-[color:var(--tone-sky-soft)] to-white" },
              { label: "Pending Approvals", value: pendingApprovals, emoji: "⏳", bg: "from-[color:var(--tone-amber-soft)] to-white" },
              { label: "Active Services", value: activeServices, emoji: "🛠️", bg: "from-[color:var(--tone-green-soft)] to-white" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`flex items-center justify-between rounded-2xl border border-[color:var(--line-strong)] bg-gradient-to-br ${stat.bg} p-6 transition-all hover:-translate-y-0.5 hover:shadow-sm`}
              >
                <div>
                  <p className="text-3xl font-extrabold leading-none tracking-[-0.03em] text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[color:var(--ink-muted)]">
                    {stat.label}
                  </p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/60 opacity-90 shadow-sm">
                  <span className="text-3xl">{stat.emoji}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick summary */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
              <h3 className="mb-4 text-lg font-bold tracking-[-0.02em] text-foreground">
                User Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
                  <span className="text-sm text-[color:var(--ink-muted)]">Student Providers</span>
                  <span className="text-sm font-bold text-foreground">{talents.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
                  <span className="text-sm text-[color:var(--ink-muted)]">Clients</span>
                  <span className="text-sm font-bold text-foreground">{clients.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
                  <span className="text-sm text-[color:var(--ink-muted)]">Verified Providers</span>
                  <span className="text-sm font-bold text-[color:var(--tone-green-deep)]">
                    {talents.filter((t) => t.verified).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
              <h3 className="mb-4 text-lg font-bold tracking-[-0.02em] text-foreground">
                Platform Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
                  <span className="text-sm text-[color:var(--ink-muted)]">Active Services</span>
                  <span className="text-sm font-bold text-foreground">{activeServices}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
                  <span className="text-sm text-[color:var(--ink-muted)]">Draft Services</span>
                  <span className="text-sm font-bold text-foreground">
                    {services.filter((s) => s.status === "draft").length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
                  <span className="text-sm text-[color:var(--ink-muted)]">Total Listings</span>
                  <span className="text-sm font-bold text-foreground">{services.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Approvals */}
      {activeTab === "approvals" && (
        <div>
          <p className="mb-4 text-sm text-[color:var(--ink-muted)]">
            Showing <span className="font-semibold text-foreground">{pendingList.length}</span> pending
            provider{pendingList.length !== 1 ? "s" : ""}
          </p>

          {pendingList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-16 text-center">
              <p className="text-4xl">✅</p>
              <p className="mt-4 text-lg font-bold text-foreground">All caught up!</p>
              <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
                No pending provider approvals at the moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingList.map((talent) => (
                <div
                  key={talent.id}
                  className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6 transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        alt={`${talent.firstName} ${talent.lastName}`}
                        className="h-full w-full object-cover"
                        height={112}
                        src={talent.avatarUrl}
                        width={112}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-foreground">
                            {talent.firstName} {talent.lastName}
                          </h3>
                          <p className="mt-0.5 text-sm text-[color:var(--ink-muted)]">
                            {talent.headline} · {talent.email}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${statusColors.pending}`}>
                          Pending Review
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-body)]">
                        {talent.bio}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {talent.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill.name}
                            className="rounded-full bg-[color:var(--surface-alt)] px-3 py-1 text-xs font-medium text-[color:var(--ink-body)]"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(talent.id)}
                          className="rounded-lg bg-[color:var(--tone-green-base)] px-5 py-2 text-xs font-bold text-white transition hover:bg-[color:var(--tone-green-deep)]"
                        >
                          ✓ Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(talent.id)}
                          className="rounded-lg border border-[color:var(--tone-red-base)]/30 bg-[color:var(--tone-red-soft)] px-5 py-2 text-xs font-bold text-[color:var(--tone-red-deep)] transition hover:bg-[color:var(--tone-red-base)]/20"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Registered Users */}
      {activeTab === "users" && (
        <div>
          <p className="mb-4 text-sm text-[color:var(--ink-muted)]">
            Showing <span className="font-semibold text-foreground">{userList.length}</span> registered
            user{userList.length !== 1 ? "s" : ""}
          </p>

          <div className="overflow-hidden rounded-2xl border border-[color:var(--line-strong)] bg-white">
            {userList.map((user, index) => (
              <div
                key={user.userId}
                className={`flex items-center gap-4 px-6 py-4 transition hover:bg-[color:var(--surface-alt)] ${
                  index < userList.length - 1 ? "border-b border-[color:var(--line)]" : ""
                }`}
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-full w-full object-cover"
                    height={80}
                    src={user.avatarUrl}
                    width={80}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-[color:var(--ink-muted)]">{user.email}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    user.role === "talent"
                      ? "bg-[color:var(--tone-indigo-soft)] text-[color:var(--tone-indigo-deep)]"
                      : "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]"
                  }`}
                >
                  {user.role === "talent" ? "Provider" : "Client"}
                </span>
                {user.role === "talent" && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      (user as TalentProfile).verified
                        ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
                        : "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]"
                    }`}
                  >
                    {(user as TalentProfile).verified ? "Verified" : "Pending"}
                  </span>
                )}
                {flaggedUsers.has(user.userId) && (
                  <span className="rounded-full bg-[color:var(--tone-red-soft)] px-3 py-1 text-xs font-bold text-[color:var(--tone-red-deep)]">
                    Flagged
                  </span>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleFlagUser(user.userId)}
                    className="rounded-lg border border-[color:var(--tone-amber-base)]/30 px-4 py-1.5 text-xs font-bold text-[color:var(--tone-amber-base)] transition hover:bg-[color:var(--tone-amber-soft)]"
                  >
                    {flaggedUsers.has(user.userId) ? "Unflag" : "Flag"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.userId)}
                    className="rounded-lg border border-[color:var(--tone-red-base)]/30 px-4 py-1.5 text-xs font-bold text-[color:var(--tone-red-base)] transition hover:bg-[color:var(--tone-red-soft)]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
