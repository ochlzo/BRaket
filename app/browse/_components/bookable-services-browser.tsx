"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import { ReportButton } from "@/components/shared/moderation/report-button";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { BookableServiceCard } from "@/lib/bookings/types";

type BookableServicesBrowserProps = {
  services: BookableServiceCard[];
};

function serviceCategories(service: BookableServiceCard) {
  return service.categories.length > 0
    ? service.categories.slice(0, 3)
    : ["Service"];
}

export function BookableServicesBrowser({
  services,
}: BookableServicesBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const categories = useMemo(
    () =>
      Array.from(
        new Set(services.flatMap((service) => service.categories)),
      ).sort((a, b) => a.localeCompare(b)),
    [services],
  );
  const filteredServices = services.filter((service) => {
    const search = searchTerm.toLowerCase();
    const searchMatch =
      service.title.toLowerCase().includes(search) ||
      service.talent.displayName.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search);
    const categoryMatch =
      activeCategory === "all" || service.categories.includes(activeCategory);
    const priceMatch = maxPrice === null || service.minPrice <= maxPrice;

    return searchMatch && categoryMatch && priceMatch;
  });

  return (
    <>
      <section className="px-5 pb-12 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="typo-page-title mb-4 text-foreground">
              Find the Perfect{" "}
              <span className="text-[color:var(--brand-orange)]">Service</span>
            </h1>
            <p className="typo-body-xl mx-auto max-w-2xl text-[color:var(--ink-soft)]">
              Browse real services from BU student professionals and send a
              booking request when you find the right fit.
            </p>
          </div>

          <div className="mx-auto mb-8 max-w-3xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--ink-muted)]" />
              <input
                className="w-full rounded-full border-2 border-[color:var(--line-strong)] bg-white py-3.5 pl-12 pr-4 text-base text-foreground outline-none transition placeholder:text-[color:var(--ink-muted)] focus:border-[color:var(--brand-blue)]"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search for a service or provider..."
                type="text"
                value={searchTerm}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              className={`typo-meta rounded-full border px-4 py-2 transition ${
                activeCategory === "all"
                  ? "border-[color:var(--brand-blue)] bg-[color:var(--brand-blue)] text-white"
                  : "border-[color:var(--line-strong)] bg-white text-[color:var(--ink-body)] hover:border-[color:var(--brand-blue)]"
              }`}
              onClick={() => setActiveCategory("all")}
              type="button"
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                className={`typo-meta rounded-full border px-4 py-2 transition ${
                  activeCategory === category
                    ? "border-[color:var(--brand-blue)] bg-[color:var(--brand-blue)] text-white"
                    : "border-[color:var(--line-strong)] bg-white text-[color:var(--ink-body)] hover:border-[color:var(--brand-blue)]"
                }`}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-2xl border border-[color:var(--line-strong)] bg-white p-4 shadow-[var(--shadow-surface-soft)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-5 w-5 text-[color:var(--ink-muted)]" />
                <span className="typo-label-sm text-foreground">Filters</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink-muted)]">
                  Max Price:
                  <select
                    className="rounded-lg border border-[color:var(--line-strong)] bg-white px-3 py-1.5 text-sm font-medium text-foreground outline-none"
                    onChange={(event) =>
                      setMaxPrice(
                        event.target.value === "any"
                          ? null
                          : Number(event.target.value),
                      )
                    }
                    value={maxPrice === null ? "any" : maxPrice}
                  >
                    <option value="any">Any Price</option>
                    <option value="1000">Up to PHP 1,000</option>
                    <option value="3000">Up to PHP 3,000</option>
                    <option value="5000">Up to PHP 5,000</option>
                    <option value="10000">Up to PHP 10,000</option>
                  </select>
                </label>

                <button
                  className="typo-label-sm rounded-full px-3 py-1.5 text-[color:var(--ink-soft)] transition hover:bg-[color:var(--surface-hover)] hover:text-foreground"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("all");
                    setMaxPrice(null);
                  }}
                  type="button"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <p className="typo-meta mb-6 text-[color:var(--ink-soft)]">
            Showing{" "}
            <span className="typo-label-sm text-foreground">
              {filteredServices.length}
            </span>{" "}
            services
          </p>

          {filteredServices.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredServices.map((service) => (
                <article
                  className="flex flex-col rounded-2xl border border-[color:var(--line-strong)] bg-white p-5 shadow-[var(--shadow-surface-soft)] transition hover:-translate-y-1 hover:shadow-lg"
                  key={service.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid min-w-0 flex-1 grid-cols-2 gap-1.5">
                      {serviceCategories(service).map((category, index) => (
                        <span
                          className={`min-w-0 rounded-full bg-[color:var(--tone-indigo-soft)] px-3 py-1 text-center text-xs font-bold text-[color:var(--tone-indigo-deep)] ${
                            index === 2 ? "col-span-2 w-fit max-w-full" : ""
                          }`}
                          key={category}
                        >
                          <span className="block truncate">{category}</span>
                        </span>
                      ))}
                    </div>
                    <ReportButton
                      label="Report"
                      targetId={service.id}
                      targetLabel={`${service.title} by ${service.talent.displayName}`}
                      targetPath={`/book/${service.id}`}
                      targetType="SERVICE"
                    />
                  </div>
                  <h2 className="mt-4 line-clamp-2 text-lg font-extrabold tracking-normal text-foreground">
                    {service.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[color:var(--ink-muted)]">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <UserAvatar
                      alt={service.talent.displayName}
                      className="h-10 w-10"
                      initials={service.talent.initials}
                      src={service.talent.avatarUrl}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">
                        {service.talent.displayName}
                      </p>
                      <p className="truncate text-xs text-[color:var(--ink-muted)]">
                        {service.talent.headline}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                    <span className="text-base font-extrabold text-[color:var(--brand-orange)]">
                      {service.priceLabel}
                    </span>
                    <Link
                      className="rounded-full bg-[color:var(--brand-blue)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[color:var(--brand-blue-strong)]"
                      href={`/book/${service.id}`}
                    >
                      Book
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[color:var(--line-strong)] bg-white px-8 py-16 text-center">
              <p className="text-lg font-semibold text-foreground">
                No services found
              </p>
              <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
