import type { ReactNode } from "react";
import { ExternalLink, Globe, Mail, MapPin, Phone, Users } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ClientProfilePageData } from "@/lib/client-profile/types";
import { ClientOrganizationDetailsEditor } from "./client-organization-details-editor";

type ClientProfileDetailsProps = {
  profile: ClientProfilePageData;
};

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-none border-0 bg-transparent px-0 py-0 sm:rounded-2xl sm:border sm:border-[color:var(--line)] sm:bg-[color:var(--surface-alt)] sm:px-4 sm:py-3">
      <div className="mt-0.5 text-[color:var(--brand-orange)]">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          {label}
        </p>
        <div className="mt-1 text-sm font-semibold text-[color:var(--foreground)]">
          {value || "-"}
        </div>
      </div>
    </div>
  );
}

function EmailLink({ email }: { email: string }) {
  return email ? (
    <a className="break-words hover:underline" href={`mailto:${email}`}>
      {email}
    </a>
  ) : (
    "-"
  );
}

export function ClientProfileDetails({ profile }: ClientProfileDetailsProps) {
  return (
    <Card className="gap-0 rounded-none border-0 bg-transparent py-0 shadow-none ring-0 sm:gap-4 sm:rounded-xl sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:py-4 sm:shadow-[var(--shadow-panel-soft)] sm:ring-1 sm:ring-foreground/10">
      <CardHeader className="gap-2 sm:gap-3">
        <div>
          <CardTitle className="typo-card-title-xl">
            Organization details
          </CardTitle>
          <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
            Basic organization details and contact information.
          </p>
        </div>
        <CardAction className="pt-0 sm:pt-1">
          <ClientOrganizationDetailsEditor
            key={`${profile.organizationName}|${profile.businessAddress}|${profile.website}|${profile.email}`}
            profile={profile}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="grid gap-3 md:grid-cols-2">
          <DetailRow
            icon={<Users className="size-4" />}
            label="Organization"
            value={profile.organizationName}
          />
          <DetailRow
            icon={<MapPin className="size-4" />}
            label="Business address"
            value={profile.businessAddress}
          />
          <DetailRow
            icon={<Globe className="size-4" />}
            label="Website"
            value={
              profile.website ? (
                <a
                  className="inline-flex items-center gap-1 hover:underline"
                  href={profile.website}
                  rel="noreferrer"
                  target="_blank"
                >
                  {profile.website}
                  <ExternalLink className="size-3.5" />
                </a>
              ) : (
                ""
              )
            }
          />
          <DetailRow
            icon={<Mail className="size-4" />}
            label="User email"
            value={<EmailLink email={profile.email} />}
          />
          <DetailRow
            icon={<Phone className="size-4" />}
            label="Contact number"
            value={profile.contactNum}
          />
          <DetailRow
            icon={<Users className="size-4" />}
            label="Joined"
            value={profile.joinedLabel}
          />
        </div>
      </CardContent>
    </Card>
  );
}
