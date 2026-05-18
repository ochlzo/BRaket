import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { DashboardLayout } from "@/components/shared/layout/dashboard-layout";
import { buttonVariants } from "@/components/ui/button";
import {
  getSettingsHref,
  parseSettingsSource,
} from "@/lib/dashboard/settings-source";
import { requireCurrentAppUser } from "@/server/users/current-user";
import { getAccountSettingsPageData } from "@/server/account-settings/get-account-settings-page-data";

import { AccountSettingsForm } from "./_components/account-settings-form";

type AccountSettingsPageProps = {
  searchParams: Promise<{
    source?: string | string[];
  }>;
};

export default async function AccountSettingsPage({
  searchParams,
}: AccountSettingsPageProps) {
  const [user, params] = await Promise.all([
    requireCurrentAppUser(),
    searchParams,
  ]);
  const initialValues = await getAccountSettingsPageData(user.id);
  const sourceRole = parseSettingsSource(params.source, user.role);

  if (!initialValues) {
    redirect("/login");
  }

  return (
    <DashboardLayout
      role={sourceRole}
      subtitle="Edit the account details linked to your login."
      title="Account"
    >
      <div className="space-y-4">
        <Link
          className={`${buttonVariants({
            size: "sm",
            variant: "outline",
          })} rounded-full md:hidden`}
          href={getSettingsHref(sourceRole)}
        >
          <ArrowLeft />
          Back
        </Link>
        <AccountSettingsForm
          currentUser={{
            authId: user.authId,
            firstName: user.firstName,
            id: user.id,
            lastName: user.lastName,
            role: user.role,
            username: user.username,
          }}
          initialValues={initialValues}
        />
      </div>
    </DashboardLayout>
  );
}
