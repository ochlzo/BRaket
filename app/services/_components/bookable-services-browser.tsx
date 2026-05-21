"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Fuse from "fuse.js";

import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, useComboboxAnchor } from "@/components/ui/combobox";
import type { BookableServiceCard } from "@/lib/bookings/types";
import { ServiceCard } from "./service-card";

type BookableServicesBrowserProps = { services: BookableServiceCard[] };

const MIN_PRESETS = [500, 1000, 2000, 3000, 4000, 5000, 7500, 10000];
const MAX_PRESETS = [1000, 2000, 3000, 4000, 5000, 7500, 10000, 15000, 20000, 30000, 50000];

export function BookableServicesBrowser({ services }: BookableServicesBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");
  const anchorRef = useComboboxAnchor();

  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(h);
  }, [searchTerm]);

  const categories = useMemo(() => Array.from(new Set(services.flatMap((s) => s.categories))).sort((a, b) => a.localeCompare(b)), [services]);

  const filteredCategoriesOptions = categories.filter((cat) => cat.toLowerCase().includes(categorySearch.toLowerCase()));

  const fuse = useMemo(() => new Fuse(services, {
    keys: [{ name: "title", weight: 1.0 }, { name: "categories", weight: 0.5 }, { name: "talent.displayName", weight: 0.4 }, { name: "description", weight: 0.2 }],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
  }), [services]);

  const filteredServices = useMemo(() => {
    const filter = (s: BookableServiceCard) =>
      (selectedCategories.length === 0 || s.categories.some((c) => selectedCategories.includes(c))) &&
      (minPrice === null || s.minPrice >= minPrice) &&
      (maxPrice === null || s.minPrice <= maxPrice);

    return debouncedSearchTerm.trim()
      ? fuse.search(debouncedSearchTerm).filter((r) => filter(r.item)).map((r) => r.item)
      : services.filter(filter);
  }, [services, fuse, debouncedSearchTerm, selectedCategories, minPrice, maxPrice]);

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

          <div className="mx-auto max-w-3xl">
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
                <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink-muted)]">
                  Categories:
                  <Combobox
                    inputValue={categorySearch}
                    itemToStringLabel={(cat) => cat}
                    itemToStringValue={(cat) => cat}
                    multiple
                    onInputValueChange={setCategorySearch}
                    onValueChange={(val) => {
                      if (Array.isArray(val)) {
                        setSelectedCategories(val);
                      }
                    }}
                    value={selectedCategories}
                  >
                    <ComboboxChips
                      className="min-h-9 max-h-16 w-80 sm:w-96 overflow-y-auto rounded-lg border border-[color:var(--line-strong)] bg-white px-2 py-1"
                      ref={anchorRef}
                    >
                      {selectedCategories.map((cat) => (
                        <ComboboxChip
                          className="rounded-full bg-[color:var(--tone-indigo-soft)] px-2 py-0.5 text-[color:var(--tone-indigo-deep)] text-xs font-semibold"
                          key={cat}
                        >
                          {cat}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        className="text-xs placeholder:text-[color:var(--ink-muted)]"
                        placeholder={
                          selectedCategories.length > 0
                            ? "Filter categories..."
                            : "All Categories"
                        }
                      />
                    </ComboboxChips>
                    <ComboboxContent
                      anchor={anchorRef}
                      className="rounded-lg border border-[color:var(--line-strong)] bg-white shadow-[var(--shadow-menu)]"
                    >
                      <ComboboxList>
                        {filteredCategoriesOptions.map((cat) => (
                          <ComboboxItem
                            key={cat}
                            value={cat}
                          >
                            {cat}
                          </ComboboxItem>
                        ))}
                        <ComboboxEmpty>
                          No matching categories.
                        </ComboboxEmpty>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink-muted)]">
                  <span>Price Range:</span>
                  <Combobox
                    value={minPrice === null ? "" : String(minPrice)}
                    onValueChange={(val) => {
                      if (typeof val === "string") {
                        const num = val ? Number(val) : null;
                        setMinPrice(num);
                        setMinInput(num !== null ? `PHP ${num.toLocaleString()}` : "");
                      }
                    }}
                    inputValue={minInput}
                    onInputValueChange={(val) => {
                      setMinInput(val);
                      const numeric = val.replace(/\D/g, "");
                      setMinPrice(numeric ? Number(numeric) : null);
                    }}
                  >
                    <ComboboxInput
                      className="w-32 h-9 rounded-lg border border-[color:var(--line-strong)] bg-white text-xs text-foreground outline-none"
                      placeholder="Min Price"
                      showTrigger
                      showClear={minPrice !== null}
                    />
                    <ComboboxContent className="rounded-lg border border-[color:var(--line-strong)] bg-white shadow-[var(--shadow-menu)] min-w-[140px]">
                      <ComboboxList className="max-h-60 overflow-y-auto">
                        <ComboboxItem value="">Any</ComboboxItem>
                        {MIN_PRESETS.map((p) => (
                          <ComboboxItem key={p} value={String(p)}>
                            PHP {p.toLocaleString()}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  <span>to</span>
                  <Combobox
                    value={maxPrice === null ? "" : String(maxPrice)}
                    onValueChange={(val) => {
                      if (typeof val === "string") {
                        const num = val ? Number(val) : null;
                        setMaxPrice(num);
                        setMaxInput(num !== null ? `PHP ${num.toLocaleString()}` : "");
                      }
                    }}
                    inputValue={maxInput}
                    onInputValueChange={(val) => {
                      setMaxInput(val);
                      const numeric = val.replace(/\D/g, "");
                      setMaxPrice(numeric ? Number(numeric) : null);
                    }}
                  >
                    <ComboboxInput
                      className="w-32 h-9 rounded-lg border border-[color:var(--line-strong)] bg-white text-xs text-foreground outline-none"
                      placeholder="Max Price"
                      showTrigger
                      showClear={maxPrice !== null}
                    />
                    <ComboboxContent className="rounded-lg border border-[color:var(--line-strong)] bg-white shadow-[var(--shadow-menu)] min-w-[140px]">
                      <ComboboxList className="max-h-60 overflow-y-auto">
                        <ComboboxItem value="">Any</ComboboxItem>
                        {MAX_PRESETS.map((p) => (
                          <ComboboxItem key={p} value={String(p)}>
                            PHP {p.toLocaleString()}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                <button
                  className="typo-label-sm rounded-full px-3 py-1.5 text-[color:var(--ink-soft)] transition hover:bg-[color:var(--surface-hover)] hover:text-foreground"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategories([]);
                    setCategorySearch("");
                    setMinPrice(null);
                    setMaxPrice(null);
                    setMinInput("");
                    setMaxInput("");
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
                <ServiceCard key={service.id} service={service} />
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
