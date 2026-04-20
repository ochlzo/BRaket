"use client";

import { useState, useSyncExternalStore } from "react";

import { ProfileAccountFooter } from "@/app/dashboard/profile/_components/profile-account-footer";
import { ProfileHeroCard } from "@/app/dashboard/profile/_components/profile-hero-card";
import { ProfileQuickActions } from "@/app/dashboard/profile/_components/profile-quick-actions";
import { ProfileStatsGrid } from "@/app/dashboard/profile/_components/profile-stats-grid";
import { ProfileTalentDetails } from "@/app/dashboard/profile/_components/profile-talent-details";
import { ProfileVerificationCard } from "@/app/dashboard/profile/_components/profile-verification-card";
import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import {
  getBookingsByClient,
  getBookingsByTalent,
  getServicesByTalent,
  mockCurrentClientProfile,
  mockCurrentTalentProfile,
} from "@/lib/mock-data";
import type { UserRole } from "@/lib/types";

export default function ProfilePage() {
  const role = useSyncExternalStore<UserRole>(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const handler = () => onStoreChange();
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    () => {
      const session = localStorage.getItem("braket_session");
      if (!session) {
        return "client";
      }

      try {
        const parsed = JSON.parse(session);
        return parsed.type === "talent" ? "talent" : "client";
      } catch {
        return "client";
      }
    },
    () => "client",
  );
  const [isVerified, setIsVerified] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const session = localStorage.getItem("braket_session");
    if (!session) {
      return false;
    }

    try {
      const parsed = JSON.parse(session);
      return Boolean(parsed.verified);
    } catch {
      return false;
    }
  });
  const [verifying, setVerifying] = useState(false);

  const isClient = role === "client";
  const profile = isClient ? mockCurrentClientProfile : mockCurrentTalentProfile;
  const bookings = isClient
    ? getBookingsByClient(profile.id)
    : getBookingsByTalent(profile.id);
  const talentProfile = isClient ? null : mockCurrentTalentProfile;
  const talentServices = talentProfile
    ? getServicesByTalent(talentProfile.id)
    : [];
  const activeBookings = bookings.filter(
    (booking) => booking.status === "in-progress" || booking.status === "accepted",
  );
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed",
  );
  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function handleVerify() {
    setVerifying(true);
    setTimeout(() => {
      setIsVerified(true);
      setVerifying(false);
      const session = localStorage.getItem("braket_session");

      if (!session) {
        return;
      }

      try {
        const parsed = JSON.parse(session);
        parsed.verified = true;
        localStorage.setItem("braket_session", JSON.stringify(parsed));
      } catch {
        // Ignore invalid local test session state.
      }
    }, 1500);
  }

  return (
    <DashboardLayout
      noScroll
      role={role}
      subtitle="View and manage your profile details"
      title="My Profile"
    >
      <div className="flex h-full flex-col gap-2.5 overflow-hidden">
        <ProfileHeroCard
          isClient={isClient}
          isVerified={isVerified}
          joinDate={joinDate}
          profile={profile}
          talentProfile={talentProfile}
        />
        {isClient ? (
          <ProfileVerificationCard
            handleVerify={handleVerify}
            isVerified={isVerified}
            verifying={verifying}
          />
        ) : null}
        <ProfileStatsGrid
          activeBookings={activeBookings.length}
          bookingsCount={bookings.length}
          completedBookings={completedBookings.length}
          isClient={isClient}
          profile={profile}
          talentProfile={talentProfile}
          talentServicesCount={talentServices.length}
        />
        {isClient && mockCurrentClientProfile.company ? (
          <div className="rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--tone-sky-soft)] text-sm">
                🏢
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {mockCurrentClientProfile.company}
                </p>
                <p className="text-[10px] text-[color:var(--ink-soft)]">
                  Organization
                </p>
              </div>
            </div>
          </div>
        ) : null}
        {talentProfile ? <ProfileTalentDetails talentProfile={talentProfile} /> : null}
        <ProfileQuickActions isClient={isClient} />
        <ProfileAccountFooter
          joinDate={joinDate}
          profileId={profile.id}
          role={role}
        />
      </div>
    </DashboardLayout>
  );
}
