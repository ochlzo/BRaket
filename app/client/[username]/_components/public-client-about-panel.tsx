import type { ReactNode } from "react";
import { ExternalLink, Globe, Mail, MapPin, Phone, Users } from "lucide-react";

import type { ClientProfilePageData } from "@/lib/client-profile/types";

type PublicClientAboutPanelProps = {
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
    <div className="flex items-start gap-3 rounded-[1.1rem] border border-[color:var(--line)] bg-[color:var(--surface-alt)] px-4 py-3">
      <div className="mt-0.5 text-[color:var(--brand-orange)]">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          {label}
        </p>
        <div className="mt-1 break-words text-sm font-semibold text-[color:var(--foreground)]">
          {value || "-"}
        </div>
      </div>
    </div>
  );
}

function EmailLink({ email }: { email: string }) {
  return email ? (
    <a className="hover:underline" href={`mailto:${email}`}>
      {email}
    </a>
  ) : (
    "-"
  );
}

export function PublicClientAboutPanel({
  profile,
}: PublicClientAboutPanelProps) {
  return (
    <section className="rounded-none border-0 bg-transparent sm:rounded-[1.2rem] sm:border sm:border-[color:var(--line-strong)] sm:bg-[color:var(--surface)] sm:shadow-[var(--shadow-panel-soft)]">
      <div className="border-b border-[color:var(--line-strong)] px-4 py-4 sm:px-5">
        <h2 className="typo-card-title-xl">About / Organization</h2>
        <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
          Public client details for talents reviewing the request.
        </p>
      </div>
      <div className="space-y-4 px-4 py-4 sm:px-5">
        <p className="whitespace-pre-line text-sm leading-7 text-[color:var(--ink-body)]">
          {profile.about || "No client bio yet."}
        </p>
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
        </div>
      </div>
    </section>
  );
}
