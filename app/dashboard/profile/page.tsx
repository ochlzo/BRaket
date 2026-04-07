"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  mockCurrentClientProfile,
  mockCurrentTalentProfile,
  getBookingsByClient,
  getBookingsByTalent,
  getServicesByTalent,
} from "@/lib/mock-data";
import type { UserRole } from "@/lib/types";

/* ── Icons ── */
function ShieldCheckIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75"
      />
    </svg>
  );
}
function EnvelopeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
      />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4 fill-current"
      viewBox="0 0 24 24"
      strokeWidth={0}
      stroke="none"
    >
      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" />
    </svg>
  );
}
function AcademicCapIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
      />
    </svg>
  );
}

export default function ProfilePage() {
  const role = useSyncExternalStore<UserRole>(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const handler = () => onStoreChange();
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    () => {
      const session = localStorage.getItem("braket_session");
      if (!session) return "client";
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
    if (typeof window === "undefined") return false;
    const session = localStorage.getItem("braket_session");
    if (!session) return false;
    try {
      const parsed = JSON.parse(session);
      return !!parsed.verified;
    } catch {
      return false;
    }
  });
  const [verifying, setVerifying] = useState(false);

  const isClient = role === "client";
  const profile = isClient
    ? mockCurrentClientProfile
    : mockCurrentTalentProfile;
  const bookings = isClient
    ? getBookingsByClient(profile.id)
    : getBookingsByTalent(profile.id);
  const talentProfile = !isClient ? mockCurrentTalentProfile : null;
  const talentServices = talentProfile
    ? getServicesByTalent(talentProfile.id)
    : [];

  const activeBookings = bookings.filter(
    (b) => b.status === "in-progress" || b.status === "accepted",
  );
  const completedBookings = bookings.filter((b) => b.status === "completed");

  function handleVerify() {
    setVerifying(true);
    setTimeout(() => {
      setIsVerified(true);
      setVerifying(false);
      const session = localStorage.getItem("braket_session");
      if (session) {
        try {
          const parsed = JSON.parse(session);
          parsed.verified = true;
          localStorage.setItem("braket_session", JSON.stringify(parsed));
        } catch {
          /* ignore */
        }
      }
    }, 1500);
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <DashboardLayout
      role={role}
      title="My Profile"
      subtitle="View and manage your profile details"
      noScroll
    >
      <div className="flex h-full flex-col gap-2.5 overflow-hidden">
        {/* ═══ Profile Hero Card ═══ */}
        <div className="overflow-hidden rounded-xl border border-[color:var(--line-strong)] bg-white">
          {/* Gradient banner */}
          <div className="relative h-16 bg-gradient-to-r from-[color:var(--brand-orange)] via-[color:var(--brand-orange-accent)] to-[color:var(--brand-blue)]">
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10" />
            <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/[0.07]" />
          </div>

          <div className="relative px-5 pb-3">
            {/* Avatar and Profile Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="-mt-8 h-16 w-16 shrink-0 overflow-hidden rounded-xl border-[3px] border-white bg-white shadow-md">
                  <Image
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="h-full w-full object-cover"
                    height={128}
                    src={profile.avatarUrl}
                    width={128}
                  />
                </div>
                <div className="mt-1.5 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground leading-none">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    {isVerified && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-[color:var(--tone-green-soft)] px-2 py-px text-[10px] font-bold text-[color:var(--tone-green-deep)]">
                        <ShieldCheckIcon className="size-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[color:var(--ink-muted)] leading-none">
                    @{profile.username}
                    {!isClient && talentProfile && (
                      <span className="ml-1.5 text-[color:var(--ink-soft)]">
                        · {talentProfile.headline}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Link
                href="/settings"
                className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-[color:var(--line-strong)] bg-white px-2.5 py-1 text-[11px] font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
              >
                ✏️ Edit Profile
              </Link>
            </div>

            {/* Bio */}
            <p className="text-xs leading-relaxed text-[color:var(--ink-body)]">
              {profile.bio}
            </p>

            {/* Meta row */}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[color:var(--ink-muted)]">
              <span className="flex items-center gap-1">
                <EnvelopeIcon /> {profile.email}
              </span>
              {!isClient && talentProfile && (
                <span className="flex items-center gap-1">
                  <MapPinIcon /> {talentProfile.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <CalendarIcon /> Joined {joinDate}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[color:var(--tone-sky-soft)] px-2 py-px text-[10px] font-bold text-[color:var(--tone-sky-deep)]">
                {isClient ? "Client" : "Talent"}
              </span>
            </div>
          </div>
        </div>

        {/* ═══ BU Student Verification Card (Client only) ═══ */}
        {isClient && (
          <div
            className={`rounded-xl border-2 px-4 py-3 transition-all ${
              isVerified
                ? "border-[color:var(--tone-green-base)]/30 bg-[color:var(--tone-green-soft)]"
                : "border-dashed border-[color:var(--brand-orange)]/40 bg-gradient-to-r from-[color:var(--tone-orange-soft)] to-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  isVerified
                    ? "bg-[color:var(--tone-green-base)] text-white"
                    : "bg-[color:var(--brand-orange)]/15 text-[color:var(--brand-orange)]"
                }`}
              >
                {isVerified ? (
                  <ShieldCheckIcon className="size-4" />
                ) : (
                  <AcademicCapIcon className="size-4" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-foreground">
                  {isVerified
                    ? "BU Student Verified ✅"
                    : "Register & Verify as BU Student"}
                </h3>
                <p className="mt-0.5 max-w-xl text-[11px] leading-snug text-[color:var(--ink-muted)]">
                  {isVerified
                    ? "Your Bicol University student identity has been authenticated. You can now post projects and access all platform features."
                    : "Authenticate your Bicol University student identity to unlock project posting, enhanced trust badges, and priority access to talent commissions."}
                </p>
                {!isVerified && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Button
                      onClick={handleVerify}
                      disabled={verifying}
                      className="h-7 rounded-md bg-[color:var(--brand-orange)] px-3 text-[11px] font-semibold !text-white shadow-sm shadow-[color:var(--brand-orange)]/25 transition hover:bg-[color:var(--brand-orange-strong)] disabled:opacity-60"
                    >
                      {verifying ? (
                        <>
                          <span className="mr-1.5 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Verifying…
                        </>
                      ) : (
                        <>
                          <AcademicCapIcon className="mr-1 size-3" />
                          Verify with BU Email
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-[color:var(--ink-soft)]">
                      Requires a valid{" "}
                      <span className="font-semibold">@bicol-u.edu.ph</span>{" "}
                      email address
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ Stats Grid ═══ */}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {(isClient
            ? [
                {
                  label: "Active Bookings",
                  value: activeBookings.length,
                  emoji: "🔥",
                  bg: "from-[color:var(--tone-orange-soft)] to-white",
                },
                {
                  label: "Completed",
                  value: completedBookings.length,
                  emoji: "✅",
                  bg: "from-[color:var(--tone-green-soft)] to-white",
                },
                {
                  label: "Total Bookings",
                  value: bookings.length,
                  emoji: "📋",
                  bg: "from-[color:var(--tone-sky-soft)] to-white",
                },
                {
                  label: "Projects Posted",
                  value: (profile as typeof mockCurrentClientProfile)
                    .projectsPosted,
                  emoji: "📝",
                  bg: "from-[color:var(--tone-amber-soft)] to-white",
                },
              ]
            : [
                {
                  label: "Active Bookings",
                  value: activeBookings.length,
                  emoji: "🔥",
                  bg: "from-[color:var(--tone-orange-soft)] to-white",
                },
                {
                  label: "Completed",
                  value: talentProfile!.completedProjects,
                  emoji: "✅",
                  bg: "from-[color:var(--tone-green-soft)] to-white",
                },
                {
                  label: "Services",
                  value: talentServices.length,
                  emoji: "🛠️",
                  bg: "from-[color:var(--tone-sky-soft)] to-white",
                },
                {
                  label: "Reviews",
                  value: talentProfile!.reviewCount,
                  emoji: "⭐",
                  bg: "from-[color:var(--tone-amber-soft)] to-white",
                },
              ]
          ).map((stat) => (
            <div
              key={stat.label}
              className={`flex items-center justify-between rounded-xl border border-[color:var(--line-strong)] bg-gradient-to-br ${stat.bg} px-3 py-2 transition-all hover:-translate-y-0.5 hover:shadow-sm`}
            >
              <div>
                <p className="text-xl font-extrabold leading-none tracking-[-0.03em] text-foreground">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] font-medium leading-none text-[color:var(--ink-muted)]">
                  {stat.label}
                </p>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center opacity-80">
                <span className="text-xl leading-none">{stat.emoji}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ Talent-specific: Skills & Rates ═══ */}
        {!isClient && talentProfile && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Skills */}
            <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
              <h3 className="mb-4 text-base font-bold text-foreground">
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {talentProfile.skills.map((skill) => {
                  const levelColor =
                    skill.level === "expert"
                      ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
                      : skill.level === "intermediate"
                        ? "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]"
                        : "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]";
                  return (
                    <span
                      key={skill.name}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${levelColor}`}
                    >
                      {skill.name}
                      <span className="opacity-60">·</span>
                      <span className="capitalize opacity-80">
                        {skill.level}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Rates & Rating */}
            <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
              <h3 className="mb-4 text-base font-bold text-foreground">
                Rates & Rating
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
                  <span className="text-sm font-medium text-[color:var(--ink-muted)]">
                    Hourly Rate
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    ₱{talentProfile.minRate} – ₱{talentProfile.maxRate}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
                  <span className="text-sm font-medium text-[color:var(--ink-muted)]">
                    Rating
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                    <StarIcon />
                    <span className="text-[color:var(--tone-orange-base)]">
                      {talentProfile.rating}
                    </span>
                    <span className="font-normal text-[color:var(--ink-soft)]">
                      ({talentProfile.reviewCount} reviews)
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-alt)] px-4 py-3">
                  <span className="text-sm font-medium text-[color:var(--ink-muted)]">
                    Availability
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-bold ${talentProfile.available ? "text-[color:var(--tone-green-deep)]" : "text-[color:var(--tone-red-base)]"}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${talentProfile.available ? "bg-[color:var(--tone-green-base)]" : "bg-[color:var(--tone-red-base)]"}`}
                    />
                    {talentProfile.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Client-specific: Company ═══ */}
        {isClient && (profile as typeof mockCurrentClientProfile).company && (
          <div className="rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--tone-sky-soft)] text-sm">
                🏢
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {(profile as typeof mockCurrentClientProfile).company}
                </p>
                <p className="text-[10px] text-[color:var(--ink-soft)]">
                  Organization
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Quick Actions ═══ */}
        <div className="rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-2.5">
          <h3 className="mb-1.5 text-xs font-bold text-foreground">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {isClient ? (
              <>
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-1 rounded-md bg-[color:var(--brand-orange)] px-3 py-1.5 text-[11px] font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
                >
                  🔍 Browse Talents
                </Link>
                <Link
                  href="/post-project"
                  className="inline-flex items-center gap-1 rounded-md border border-[color:var(--line-strong)] bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
                >
                  📝 Post a Project
                </Link>
                <Link
                  href="/dashboard/client/bookings"
                  className="inline-flex items-center gap-1 rounded-md border border-[color:var(--line-strong)] bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
                >
                  📋 View Bookings
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/talent/services/new"
                  className="inline-flex items-center gap-1 rounded-md bg-[color:var(--brand-orange)] px-3 py-1.5 text-[11px] font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
                >
                  + New Service
                </Link>
                <Link
                  href="/dashboard/talent/services"
                  className="inline-flex items-center gap-1 rounded-md border border-[color:var(--line-strong)] bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
                >
                  🛠️ My Services
                </Link>
                <Link
                  href="/dashboard/talent/bookings"
                  className="inline-flex items-center gap-1 rounded-md border border-[color:var(--line-strong)] bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
                >
                  📋 View Bookings
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ═══ Account Info Footer ═══ */}
        <div className="rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--ink-soft)]">
                Account ID
              </p>
              <p className="font-mono text-xs text-foreground">{profile.id}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--ink-soft)]">
                Account Type
              </p>
              <p className="text-xs font-semibold capitalize text-foreground">
                {role}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--ink-soft)]">
                Member Since
              </p>
              <p className="text-xs text-foreground">{joinDate}</p>
            </div>
            <Link
              href="/settings"
              className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--line-strong)] bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground transition hover:bg-white/80"
            >
              ⚙️ Account Settings
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
