"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { mockCurrentClientProfile, mockCurrentTalentProfile } from "@/lib/mock-data";

type Tab = "profile" | "account";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [role, setRole] = useState<"client" | "talent">("client");

  useEffect(() => {
    const session = localStorage.getItem("braket_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.type === "talent") setRole("talent");
      } catch { /* ignore */ }
    }
  }, []);

  const profileInfo = role === "client" ? mockCurrentClientProfile : mockCurrentTalentProfile;

  return (
    <DashboardLayout role={role} title="Settings" subtitle="Manage your account and profile">
      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {([
          { value: "profile" as Tab, label: "Profile" },
          { value: "account" as Tab, label: "Account" },
        ]).map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === tab.value
                ? "bg-[color:var(--brand-orange)] !text-white shadow-md"
                : "bg-white border border-[color:var(--line-strong)] text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-alt)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-2xl rounded-2xl border border-[color:var(--line-strong)] bg-white p-8">
        {activeTab === "profile" ? (
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <h2 className="text-lg font-bold text-foreground">Profile Information</h2>
            <p className="text-sm text-[color:var(--ink-muted)]">Update your public profile details.</p>

            <div className="space-y-2">
              <Label htmlFor="s-username" className="text-sm font-semibold">Username</Label>
              <Input id="s-username" defaultValue={profileInfo.username} className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="s-first" className="text-sm font-semibold">First Name</Label>
                <Input id="s-first" defaultValue={profileInfo.firstName} className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-last" className="text-sm font-semibold">Last Name</Label>
                <Input id="s-last" defaultValue={profileInfo.lastName} className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-bio" className="text-sm font-semibold">Bio</Label>
              <Textarea id="s-bio" rows={4} defaultValue={profileInfo.bio} className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
            </div>

            {role === "talent" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="s-skills" className="text-sm font-semibold">Skills</Label>
                  <Input id="s-skills" defaultValue={(profileInfo as typeof mockCurrentTalentProfile).skills?.map(s => s.name).join(", ")} placeholder="e.g. React, UI Design, Analytics" className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
                  <p className="text-xs text-[color:var(--ink-soft)]">Separate skills with commas.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="s-portfolio" className="text-sm font-semibold">Portfolio Gallery</Label>
                  <div className="flex flex-col gap-3">
                    <Input id="s-portfolio" type="file" multiple accept="image/*,application/pdf" className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pt-2.5 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-transparent file:text-sm file:font-semibold focus-visible:border-[color:var(--brand-blue)] focus-visible:ring-[color:var(--brand-blue)]/20" />
                    <p className="text-xs text-[color:var(--ink-soft)]">Upload images or PDFs to showcase your previous work.</p>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="rounded-xl bg-[color:var(--brand-orange)] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
              >
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <h2 className="text-lg font-bold text-foreground">Change Password</h2>
            <p className="text-sm text-[color:var(--ink-muted)]">Update your account password.</p>

            <div className="space-y-2">
              <Label htmlFor="s-current" className="text-sm font-semibold">Current Password</Label>
              <Input id="s-current" type="password" placeholder="Enter current password" className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-new" className="text-sm font-semibold">New Password</Label>
              <Input id="s-new" type="password" placeholder="Enter new password" className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
              <p className="text-xs text-[color:var(--ink-soft)]">Minimum 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-confirm" className="text-sm font-semibold">Confirm New Password</Label>
              <Input id="s-confirm" type="password" placeholder="Confirm new password" className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm" />
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="rounded-xl bg-[color:var(--brand-orange)] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
              >
                Update Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
