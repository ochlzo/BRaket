import Link from "next/link";
import {
  BriefcaseBusiness,
  ChevronRight,
  CircleHelp,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const settingsSections = [
  {
    description: "Update account details, contact info, and username basics.",
    href: "/settings/account",
    icon: UserRound,
    isActive: true,
    label: "Account",
  },
  {
    description: "Manage bio, and portfolio details.",
    icon: BriefcaseBusiness,
    isActive: false,
    label: "Profile & Portfolio",
  },
  {
    description: "Review password controls, login safety, and access.",
    icon: ShieldCheck,
    isActive: false,
    label: "Security",
  },
  {
    description: "Find docs, support options, and common account guidance.",
    icon: CircleHelp,
    isActive: false,
    label: "Help",
  },
] as const;

export function SettingsHub() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav
        aria-label="Settings menu"
        className="rounded-3xl border border-[color:var(--line-strong)] bg-white p-4 sm:p-5"
      >
        <div className="border-b border-[color:var(--line)] px-2 pb-4">
          <p className="text-sm font-bold text-foreground">Sections</p>
          <p className="mt-1 text-xs text-[color:var(--ink-muted)]">
            Choose a settings area to manage.
          </p>
        </div>

        <div className="mt-4 space-y-2">
          {settingsSections.map((section) => {
            const Icon = section.icon;

            const content = (
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[color:var(--brand-orange)] shadow-sm">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">
                    {section.label}
                  </p>
                  <p className="mt-0.5 text-sm leading-5 text-[color:var(--ink-muted)]">
                    {section.description}
                  </p>
                </div>
                {section.isActive ? (
                  <ChevronRight className="mt-1 size-4 text-[color:var(--ink-muted)] transition group-hover:translate-x-0.5 group-hover:text-[color:var(--brand-orange)]" />
                ) : (
                  <span className="mt-1 rounded-full bg-[color:var(--surface)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--ink-muted)]">
                    Coming soon
                  </span>
                )}
              </div>
            );

            const className =
              "group block rounded-2xl border border-[color:var(--line-strong)] px-4 py-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-orange)]/30";

            return section.isActive ? (
              <Link
                key={section.label}
                className={`${className} bg-[color:var(--surface-alt)] hover:border-[color:var(--brand-orange)] hover:bg-white`}
                href={section.href}
              >
                {content}
              </Link>
            ) : (
              <div
                key={section.label}
                className={`${className} cursor-default bg-[color:var(--surface-alt)] opacity-90`}
              >
                {content}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
