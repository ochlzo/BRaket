import Link from "next/link";

import { BookingRequestForm } from "@/app/book/[serviceId]/_components/booking-request-form";
import { ServiceMediaCollage } from "@/app/book/[serviceId]/_components/service-media-collage";
import { ReportButton } from "@/components/shared/moderation/report-button";
import { ProfileReviewsPanel } from "@/components/shared/profile-reviews/profile-reviews-panel";
import { Separator } from "@/components/ui/separator";
import { PageShell } from "@/components/shared/layout/page-shell";
import { UserAvatar } from "@/components/shared/user-avatar";
import { appNavigation } from "@/lib/content/navigation";
import { getBookingServiceSummary } from "@/server/bookings/data";

type Props = { params: Promise<{ serviceId: string }> };

function serviceCategories(categories: string[]) {
  return categories.length > 0 ? categories.slice(0, 3) : ["Service"];
}

export default async function BookingRequestPage({ params }: Props) {
  const { serviceId } = await params;
  const service = await getBookingServiceSummary(serviceId);

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
          {!service ? (
            <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-16 text-center">
              <p className="text-lg font-semibold text-foreground">
                Service unavailable
              </p>
              <p className="mx-auto mt-2 max-w-lg text-sm text-[color:var(--ink-muted)]">
                This booking link does not point to a real published service yet.
                Browse available talent or create a service from the talent dashboard.
              </p>
              <Link
                className="mt-5 inline-flex items-center rounded-xl bg-[color:var(--brand-orange)] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)]"
                href="/browse"
              >
                Browse Talent
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                <div className="space-y-5">
                  <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-8">
                    <h1 className="text-2xl font-extrabold tracking-normal text-foreground">
                      Book This Service
                    </h1>
                    <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
                      Send a clear request so the talent can accept, decline, or
                      ask follow-up questions.
                    </p>

                    <Separator className="my-6" />

                    <BookingRequestForm
                      cancelHref="/browse"
                      serviceId={service.id}
                    />
                  </div>

                  <ServiceMediaCollage
                    media={service.media}
                    title={service.title}
                  />
                </div>

                <aside className="space-y-5">
                  <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-6">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h2 className="typo-card-title-lg text-foreground">
                        Service Summary
                      </h2>
                      <ReportButton
                        label="Report service"
                        targetId={service.id}
                        targetLabel={`${service.title} by ${service.talent.displayName}`}
                        targetPath={`/book/${service.id}`}
                        targetType="SERVICE"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-1.5">
                        {serviceCategories(service.categories).map((category, index) => (
                          <span
                            className={`min-w-0 rounded-full bg-[color:var(--tone-indigo-soft)] px-3 py-1 text-center text-xs font-semibold text-[color:var(--tone-indigo-deep)] ${
                              index === 2 ? "col-span-2 w-fit max-w-full" : ""
                            }`}
                            key={category}
                          >
                            <span className="block truncate">{category}</span>
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        {service.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[color:var(--ink-muted)]">
                        {service.description}
                      </p>
                      <Separator />
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-[color:var(--ink-muted)]">
                          Price
                        </span>
                        <span className="text-right text-lg font-extrabold text-[color:var(--brand-orange)]">
                          {service.priceLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    className="block rounded-2xl border border-[color:var(--line-strong)] bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-panel-soft)]"
                    href={service.talent.profileHref}
                  >
                    <h2 className="typo-card-title-lg mb-4 text-foreground">
                      About the Talent
                    </h2>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        alt={service.talent.displayName}
                        className="h-12 w-12 rounded-xl"
                        fallbackClassName="rounded-xl bg-[color:var(--tone-orange-soft)] text-[color:var(--tone-orange-deep)]"
                        imageClassName="rounded-xl"
                        initials={service.talent.initials}
                        src={service.talent.avatarUrl}
                      />
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {service.talent.displayName}
                        </p>
                        <p className="text-xs text-[color:var(--ink-muted)]">
                          {service.talent.headline}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <ProfileReviewsPanel
                    averageRating={service.averageRating}
                    emptyLabel="No reviews for this service yet"
                    id="service-reviews"
                    initialVisibleCount={2}
                    reputationLabel={service.reputationLabel}
                    reviews={service.reviews}
                    title="Client Reviews"
                  />
                </aside>
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
