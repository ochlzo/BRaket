import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { requireCurrentAppUser } from "@/server/users/current-user";

export default async function SettingsPage() {
  const user = await requireCurrentAppUser();
  const rateRange =
    user.minRate && user.maxRate
      ? `PHP ${user.minRate} - PHP ${user.maxRate}`
      : "";

  return (
    <DashboardLayout
      role={user.role}
      subtitle="Review the live profile information attached to your account."
      title="Settings"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-8">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              Profile Information
            </h2>
            <p className="text-sm text-[color:var(--ink-muted)]">
              These fields now reflect your real authenticated account instead
              of mock data.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="s-username" className="text-sm font-semibold">
                Username
              </Label>
              <Input
                id="s-username"
                readOnly
                value={user.username}
                className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="s-first" className="text-sm font-semibold">
                  First Name
                </Label>
                <Input
                  id="s-first"
                  readOnly
                  value={user.firstName}
                  className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-last" className="text-sm font-semibold">
                  Last Name
                </Label>
                <Input
                  id="s-last"
                  readOnly
                  value={user.lastName}
                  className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-email" className="text-sm font-semibold">
                Email Address
              </Label>
              <Input
                id="s-email"
                readOnly
                value={user.email}
                className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-bio" className="text-sm font-semibold">
                Bio
              </Label>
              <Textarea
                id="s-bio"
                readOnly
                rows={4}
                value={user.bio}
                className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
              />
            </div>

            {user.role === "talent" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="s-headline" className="text-sm font-semibold">
                    Headline
                  </Label>
                  <Input
                    id="s-headline"
                    readOnly
                    value={user.headline}
                    className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="s-skills" className="text-sm font-semibold">
                    Skills
                  </Label>
                  <Input
                    id="s-skills"
                    readOnly
                    value={user.skills.map((skill) => skill.name).join(", ")}
                    className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="s-rates" className="text-sm font-semibold">
                    Rate Range
                  </Label>
                  <Input
                    id="s-rates"
                    readOnly
                    value={rateRange}
                    className="h-11 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm"
                  />
                </div>
              </>
            ) : null}

            <Separator />

            <div className="flex justify-end">
              <Button
                disabled
                type="button"
                className="rounded-xl bg-[color:var(--brand-orange)] px-6 py-3 text-sm font-semibold !text-white disabled:opacity-60"
              >
                Editing Coming Soon
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-8">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              Account Security
            </h2>
            <p className="text-sm text-[color:var(--ink-muted)]">
              Password changes still go through the existing auth recovery flow.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
