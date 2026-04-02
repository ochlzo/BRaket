"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FilterIcon } from "@/components/icons/marketing-icons";
import { PageShell } from "@/components/layout/page-shell";
import { FilterChip } from "@/components/marketing/filter-chip";
import { appNavigation } from "@/content/navigation";
import { semantic } from "@/theme/semantic";
import { services, talents, getCategoryLabel, categories } from "@/lib/mock-data";

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const publishedServices = services.filter((s) => s.status === "published");

  const filteredServices = publishedServices.filter((service) => {
    // Search match
    const talent = talents.find((t) => t.id === service.talentId);
    const searchMatch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent?.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    // Category match
    const categoryMatch =
      activeCategory === "all" || service.category === activeCategory;

    // Price match
    const priceMatch = maxPrice === null || service.price <= maxPrice;

    return searchMatch && categoryMatch && priceMatch;
  });

  return (
    <PageShell
      activeHref="/browse"
      className="bg-[linear-gradient(180deg,var(--tone-sky-pale)_0%,#FFFFFF_44%)]"
      ctaHref="/#cta"
      items={appNavigation}
      signInHref="/#cta"
    >
      <section className="px-5 pb-12 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="typo-page-title mb-4 text-foreground">
              Find the Perfect <span className="text-[color:var(--brand-orange)]">Service</span>
            </h1>
            <p className="typo-body-xl mx-auto max-w-2xl text-[color:var(--ink-soft)]">
              Browse through verified BU student professionals ready to bring your projects to life.
            </p>
          </div>

          <div className="mx-auto mb-8 max-w-3xl">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                className="text-base w-full rounded-full border-2 border-[color:var(--line-strong)] bg-white py-3.5 pl-12 pr-4 text-foreground outline-none transition placeholder:text-[color:var(--ink-muted)] focus:border-[color:var(--brand-blue)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a service or provider..."
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory("all")}
              className={`typo-meta rounded-full border px-4 py-2 transition ${
                activeCategory === "all"
                  ? "border-[color:var(--brand-blue)] bg-[color:var(--brand-blue)] text-white"
                  : "border-[color:var(--line-strong)] bg-white text-[color:var(--ink-body)] hover:border-[color:var(--brand-blue)] hover:text-foreground"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={`typo-meta rounded-full border px-4 py-2 transition ${
                  activeCategory === category.slug
                    ? "border-[color:var(--brand-blue)] bg-[color:var(--brand-blue)] text-white"
                    : "border-[color:var(--line-strong)] bg-white text-[color:var(--ink-body)] hover:border-[color:var(--brand-blue)] hover:text-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-2xl border border-[color:var(--line-strong)] bg-white p-4 shadow-[0_16px_36px_rgba(34,46,69,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FilterIcon />
                <span className="typo-label-sm text-foreground">Filters</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[color:var(--ink-muted)]">Max Price:</span>
                  <select
                    className="rounded-lg border border-[color:var(--line-strong)] bg-white px-3 py-1.5 text-sm font-medium text-foreground outline-none"
                    value={maxPrice === null ? "any" : maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value === "any" ? null : Number(e.target.value))}
                  >
                    <option value="any">Any Price</option>
                    <option value="1000">Up to ₱1,000</option>
                    <option value="3000">Up to ₱3,000</option>
                    <option value="5000">Up to ₱5,000</option>
                    <option value="10000">Up to ₱10,000</option>
                  </select>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("all");
                    setMaxPrice(null);
                  }}
                  className="typo-label-sm rounded-full px-3 py-1.5 text-[color:var(--ink-soft)] transition hover:bg-[#F5F7FA] hover:text-foreground"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="typo-meta text-[color:var(--ink-soft)]">
              Showing <span className="typo-label-sm text-foreground">{filteredServices.length}</span> services
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => {
              const talent = talents.find((t) => t.id === service.talentId);
              if (!talent) return null;

              return (
                <div key={service.id} className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-[color:var(--line-strong)] bg-white transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-48 bg-gradient-to-br from-[color:var(--tone-sky-soft)] to-[color:var(--tone-indigo-soft)] p-6 flex flex-col justify-between">
                    <span className="self-start rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[color:var(--tone-indigo-deep)] shadow-sm backdrop-blur-md">
                      {getCategoryLabel(service.category)}
                    </span>
                    <div className="flex items-end justify-between">
                      <div className="h-14 w-14 overflow-hidden rounded-xl border-2 border-white bg-white shadow-md">
                        <Image alt={talent.firstName} src={talent.avatarUrl} width={56} height={56} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur-md">
                        <span className="text-[color:var(--brand-orange)]">★</span> {talent.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight tracking-[-0.02em] text-foreground">
                      {service.title}
                    </h3>
                    <p className="mb-4 text-sm font-medium text-[color:var(--ink-muted)]">
                      by {talent.firstName} {talent.lastName} {talent.verified && "✓"}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="text-xl font-extrabold text-[color:var(--brand-orange)]">
                        ₱{service.price.toLocaleString()}
                      </span>
                      <Link
                        href={`/book/${service.id}`}
                        className="rounded-full bg-[color:var(--brand-blue)] px-4 py-2 text-sm font-bold text-white transition hover:bg-[color:var(--brand-blue-strong)]"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-4xl">🔍</p>
              <h3 className="mt-4 text-xl font-bold text-foreground">No services found</h3>
              <p className="mt-2 text-[color:var(--ink-muted)]">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
