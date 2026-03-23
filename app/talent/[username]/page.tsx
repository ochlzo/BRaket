import Image from "next/image";
import { PageShell } from "@/components/layout/page-shell";
import { appNavigation } from "@/content/navigation";
import { getTalentByUsername, getServicesByTalent, getCategoryLabel } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import {
  MapPinIcon,
  StarIcon,
  BriefcaseIcon,
} from "@/components/icons/marketing-icons";

type Props = { params: Promise<{ username: string }> };

export default async function TalentProfilePage({ params }: Props) {
  const { username } = await params;
  const talent = getTalentByUsername(username);
  if (!talent) return notFound();

  const talentServices = getServicesByTalent(talent.id);

  return (
    <PageShell
      activeHref="/browse"
      ctaHref="/post-project"
      ctaLabel="Post a Project"
      homeHref="/"
      items={appNavigation}
      signInHref="/login"
    >
      {/* ── Hero / Header ── */}
      <section className="relative overflow-hidden px-5 pb-0 pt-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,var(--tone-sky-pale)_0%,#FFFFFF_50%,var(--tone-orange-pale)_100%)]" />

        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-32 w-32 overflow-hidden rounded-3xl border-4 border-white shadow-lg sm:h-40 sm:w-40">
                <Image
                  alt={`${talent.firstName} ${talent.lastName}`}
                  className="h-full w-full object-cover"
                  height={400}
                  src={talent.avatarUrl}
                  width={400}
                />
              </div>
              {talent.available && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--tone-green-base)] px-3 py-1 text-xs font-bold text-white shadow-md">
                  Available
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4 pb-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl">
                  {talent.firstName} {talent.lastName}
                </h1>
                <p className="mt-1 text-lg font-medium text-[color:var(--ink-muted)]">
                  {talent.headline}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--ink-muted)]">
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="h-4 w-4" />
                  {talent.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[color:var(--brand-orange)]">
                    <StarIcon className="h-4 w-4 fill-current" />
                  </span>
                  <span className="font-semibold text-foreground">{talent.rating.toFixed(1)}</span>
                  ({talent.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <BriefcaseIcon className="h-4 w-4" />
                  {talent.completedProjects} projects completed
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[color:var(--tone-sky-soft)] px-4 py-2 text-sm font-semibold text-[color:var(--tone-sky-deep)]">
                  ₱{talent.minRate} – ₱{talent.maxRate}/hr
                </span>
                <a
                  href={`/book/${talentServices[0]?.id ?? ""}`}
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--brand-orange)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-orange-strong)]"
                >
                  Book Service
                </a>
                <a
                  href="/post-project"
                  className="inline-flex items-center justify-center rounded-full border-2 border-[color:var(--line-strong)] px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
                >
                  Post a Project
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="px-5 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div className="space-y-10">
            {/* About */}
            <div>
              <h2 className="typo-card-title-2xl mb-4 text-foreground">About</h2>
              <p className="text-base leading-7 text-[color:var(--ink-body)]">{talent.bio}</p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="typo-card-title-2xl mb-4 text-foreground">Skills</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {talent.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between rounded-2xl border border-[color:var(--line-strong)] bg-white px-5 py-3.5"
                  >
                    <span className="text-sm font-semibold text-foreground">{skill.name}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        skill.level === "expert"
                          ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
                          : skill.level === "intermediate"
                            ? "bg-[color:var(--tone-amber-soft)] text-[color:var(--tone-amber-deep)]"
                            : "bg-[color:var(--tone-sky-soft)] text-[color:var(--tone-sky-deep)]"
                      }`}
                    >
                      {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="typo-card-title-2xl mb-4 text-foreground">Services</h2>
              {talentServices.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-8 py-12 text-center">
                  <p className="text-sm text-[color:var(--ink-muted)]">No published services yet.</p>
                </div>
              ) : (
                <div className="grid gap-5">
                  {talentServices.map((service) => (
                    <div
                      key={service.id}
                      className="group rounded-2xl border border-[color:var(--line-strong)] bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <span className="mb-2 inline-block rounded-full bg-[color:var(--tone-indigo-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--tone-indigo-deep)]">
                            {getCategoryLabel(service.category)}
                          </span>
                          <h3 className="text-lg font-bold tracking-[-0.02em] text-foreground">
                            {service.title}
                          </h3>
                        </div>
                        <span className="shrink-0 text-lg font-extrabold text-[color:var(--brand-orange)]">
                          ₱{service.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="mb-5 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                        {service.description}
                      </p>
                      <a
                        href={`/book/${service.id}`}
                        className="inline-flex items-center justify-center rounded-full bg-[color:var(--brand-blue)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-blue-strong)]"
                      >
                        Book This Service
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Quick stats */}
            <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
              <h3 className="typo-card-title-lg mb-5 text-foreground">Quick Stats</h3>
              <div className="space-y-4">
                {[
                  { label: "Projects Completed", value: talent.completedProjects },
                  { label: "Services Offered", value: talent.servicesCount },
                  { label: "Total Reviews", value: talent.reviewCount },
                  { label: "Rating", value: `${talent.rating.toFixed(1)} / 5.0` },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-sm text-[color:var(--ink-muted)]">{stat.label}</span>
                    <span className="text-sm font-bold text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
              <h3 className="typo-card-title-lg mb-3 text-foreground">Availability</h3>
              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                  talent.available
                    ? "bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]"
                    : "bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${talent.available ? "bg-[color:var(--tone-green-base)]" : "bg-[color:var(--tone-red-base)]"}`} />
                {talent.available ? "Open for commissions" : "Currently unavailable"}
              </div>
            </div>

            {/* Rate card */}
            <div className="rounded-2xl border border-[color:var(--line-strong)] bg-gradient-to-br from-[color:var(--tone-orange-soft)] to-white p-6">
              <h3 className="typo-card-title-lg mb-2 text-foreground">Hourly Rate</h3>
              <p className="text-2xl font-extrabold tracking-[-0.03em] text-[color:var(--brand-orange)]">
                ₱{talent.minRate} – ₱{talent.maxRate}
              </p>
              <p className="mt-1 text-xs text-[color:var(--ink-muted)]">
                Final rate depends on project scope
              </p>
            </div>

            {/* CTA */}
            <a
              href={`/book/${talentServices[0]?.id ?? ""}`}
              className="block w-full rounded-2xl bg-gradient-to-r from-[color:var(--brand-orange)] to-[#FF9252] px-6 py-4 text-center text-sm font-bold text-white shadow-[0_8px_24px_rgba(255,107,53,0.3)] transition-all hover:shadow-[0_12px_32px_rgba(255,107,53,0.4)] hover:brightness-105 active:scale-[0.98]"
            >
              Book {talent.firstName}&apos;s Services
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
