import Link from "next/link";
import {
  BriefcaseBusiness,
  ChevronRight,
  CircleHelp,
  Settings2,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const settingsSections = [
  {
    description: "Update account details, contact info, and username basics.",
    href: "#account",
    icon: UserRound,
    label: "Account",
  },
  {
    description: "Manage bio, headline, skills, and portfolio details.",
    href: "#profile-portfolio",
    icon: BriefcaseBusiness,
    label: "Profile & Portfolio",
  },
  {
    description: "Review password controls, login safety, and access.",
    href: "#security",
    icon: ShieldCheck,
    label: "Security",
  },
  {
    description: "Find docs, support options, and common account guidance.",
    href: "#help",
    icon: CircleHelp,
    label: "Help",
  },
] as const;

export function SettingsHub() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl border border-[color:var(--line-strong)] bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--surface-alt)] text-[color:var(--brand-orange)]">
            <Settings2 className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] text-foreground">
              Settings
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink-muted)]">
              Use the menu to jump between account controls, profile and
              portfolio details, security options, and help resources.
            </p>
          </div>
        </div>
      </div>

      <nav
        aria-label="Settings menu"
        className="rounded-3xl border border-[color:var(--line-strong)] bg-white p-4 sm:p-5"
      >
        <div className="mt-4 space-y-2">
          {settingsSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.label}
                className="group block rounded-2xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-4 py-3 transition hover:border-[color:var(--brand-orange)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-orange)]/30"
                href={section.href}
              >
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
                  <ChevronRight className="mt-1 size-4 text-[color:var(--ink-muted)] transition group-hover:translate-x-0.5 group-hover:text-[color:var(--brand-orange)]" />
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
