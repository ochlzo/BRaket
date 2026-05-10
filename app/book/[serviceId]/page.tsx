"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/shared/layout/page-shell";
import { appNavigation } from "@/lib/content/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { getServiceById, getTalentById, getCategoryLabel } from "@/lib/mock-data";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ serviceId: string }> };

export default function BookingRequestPage({ params }: Props) {
  const { serviceId } = use(params);
  const service = getServiceById(serviceId);
  if (!service) return notFound();

  const talent = getTalentById(service.talentId);
  if (!talent) return notFound();

  return (
    <PageShell
      activeHref="/browse"
      ctaHref="/browse"
      ctaLabel="Browse Talents"
      homeHref="/"
      items={appNavigation}
      signInHref="/login"
    >
      <section className="px-5 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href={`/talent/${talent.username}`} className="text-sm font-semibold text-[color:var(--brand-orange)] hover:underline">
              ← Back to {talent.firstName}&apos;s profile
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Left – Form */}
            <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-8">
              <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-foreground">
                Book This Service
              </h1>
              <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
                Fill in the details below to send a booking request to {talent.firstName}.
              </p>

              <Separator className="my-6" />

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                {/* Project Details */}
                <div className="space-y-2">
                  <Label htmlFor="project-details" className="text-sm font-semibold text-foreground">
                    Project Details <span className="text-[color:var(--tone-red-base)]">*</span>
                  </Label>
                  <Textarea
                    id="project-details"
                    rows={5}
                    placeholder="Describe your project in detail — what do you need, what's the desired outcome, any specific requirements..."
                    required
                    className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
                  />
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <Label htmlFor="booking-budget" className="text-sm font-semibold text-foreground">
                    Your Budget (₱) <span className="font-normal text-[color:var(--ink-soft)]">(optional)</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[color:var(--ink-muted)]">₱</span>
                    <Input
                      id="booking-budget"
                      type="number"
                      min="0"
                      placeholder={service.price.toString()}
                      className="h-12 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-8 text-sm focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
                    />
                  </div>
                  <p className="text-xs text-[color:var(--ink-soft)]">
                    Service listed at ₱{service.price.toLocaleString()}. You can propose a different budget.
                  </p>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="booking-notes" className="text-sm font-semibold text-foreground">
                    Additional Notes <span className="font-normal text-[color:var(--ink-soft)]">(optional)</span>
                  </Label>
                  <Textarea
                    id="booking-notes"
                    rows={3}
                    placeholder="Any preferences on communication, deadlines, or revisions..."
                    className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
                  />
                </div>

                <Separator />

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Link
                    href={`/talent/${talent.username}`}
                    className="inline-flex items-center justify-center rounded-xl border border-[color:var(--line-strong)] bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
                  >
                    Cancel
                  </Link>
                  <Button
                    type="submit"
                    className="rounded-xl bg-[color:var(--brand-orange)] px-8 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
                  >
                    Send Booking Request
                  </Button>
                </div>
              </form>
            </div>

            {/* Right – Service Summary */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
                <h3 className="typo-card-title-lg mb-4 text-foreground">Service Summary</h3>
                <div className="space-y-3">
                  <span className="inline-block rounded-full bg-[color:var(--tone-indigo-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--tone-indigo-deep)]">
                    {getCategoryLabel(service.category)}
                  </span>
                  <h4 className="text-lg font-bold text-foreground">{service.title}</h4>
                  <p className="text-sm leading-relaxed text-[color:var(--ink-muted)]">{service.description}</p>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[color:var(--ink-muted)]">Price</span>
                    <span className="text-xl font-extrabold text-[color:var(--brand-orange)]">
                      ₱{service.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Talent card */}
              <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
                <h3 className="typo-card-title-lg mb-4 text-foreground">About the Talent</h3>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl">
                    <Image
                      alt={`${talent.firstName} ${talent.lastName}`}
                      className="h-full w-full object-cover"
                      height={96}
                      src={talent.avatarUrl}
                      width={96}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {talent.firstName} {talent.lastName}
                    </p>
                    <p className="text-xs text-[color:var(--ink-muted)]">{talent.headline}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-[color:var(--ink-muted)]">
                  <span>⭐ {talent.rating.toFixed(1)} ({talent.reviewCount} reviews)</span>
                  <span>📍 {talent.location}</span>
                  <span>✅ {talent.completedProjects} projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
