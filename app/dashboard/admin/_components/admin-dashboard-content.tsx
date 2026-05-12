"use client";

import { useState } from "react";

import { AdminApprovals } from "@/app/dashboard/admin/_components/admin-approvals";
import { AdminOverview } from "@/app/dashboard/admin/_components/admin-overview";
import { AdminTabs } from "@/app/dashboard/admin/_components/admin-tabs";
import { AdminUserList } from "@/app/dashboard/admin/_components/admin-user-list";
import { type AdminTab } from "@/app/dashboard/admin/_data";
import {
  getAllUsers,
  getPendingTalents,
  services,
} from "@/lib/mock-data";
import type { ClientProfile, TalentProfile } from "@/lib/types";

export function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [pendingList, setPendingList] = useState<TalentProfile[]>(
    getPendingTalents(),
  );
  const [userList, setUserList] = useState<(TalentProfile | ClientProfile)[]>(
    getAllUsers(),
  );
  const [flaggedUsers, setFlaggedUsers] = useState<Set<string>>(new Set());

  const totalUsers = userList.length;
  const pendingApprovals = pendingList.length;
  const activeServices = services.filter(
    (service) => service.status === "published",
  ).length;

  const handleApprove = (id: string) => {
    setPendingList((prev) => prev.filter((talent) => talent.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingList((prev) => prev.filter((talent) => talent.id !== id));
  };

  const handleRemoveUser = (userId: string) => {
    setUserList((prev) => prev.filter((user) => user.userId !== userId));
  };

  const handleFlagUser = (userId: string) => {
    setFlaggedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  return (
    <>
      <AdminTabs
        activeTab={activeTab}
        pendingApprovals={pendingApprovals}
        setActiveTab={setActiveTab}
      />
      {activeTab === "overview" ? (
        <AdminOverview
          activeServices={activeServices}
          pendingApprovals={pendingApprovals}
          totalUsers={totalUsers}
        />
      ) : null}
      {activeTab === "approvals" ? (
        <AdminApprovals
          handleApprove={handleApprove}
          handleReject={handleReject}
          pendingList={pendingList}
        />
      ) : null}
      {activeTab === "users" ? (
        <AdminUserList
          flaggedUsers={flaggedUsers}
          handleFlagUser={handleFlagUser}
          handleRemoveUser={handleRemoveUser}
          userList={userList}
        />
      ) : null}
    </>
  );
}
