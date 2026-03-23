"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/lib/mock-data";

export default function CreateServicePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const isValid = title.trim() && description.trim().length > 0 && category && Number(price) > 0;

  return (
    <DashboardLayout role="talent" title="Create New Service" subtitle="Add a new service listing to attract clients">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-8">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {/* Service Title */}
            <div className="space-y-2">
              <Label htmlFor="service-title" className="text-sm font-semibold text-foreground">
                Service Title <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Input
                id="service-title"
                type="text"
                placeholder="e.g. Complete UI/UX Design Package"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-12 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="service-desc" className="text-sm font-semibold text-foreground">
                Description <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <Textarea
                id="service-desc"
                rows={6}
                placeholder="Describe what's included in this service, your process, deliverables, and what makes you the right choice..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] text-sm focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Category <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categories.slice(0, 9).map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setCategory(cat.slug)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-xs font-semibold transition-all ${
                      category === cat.slug
                        ? "border-[color:var(--brand-orange)] bg-[color:var(--brand-orange)]/10 text-[color:var(--brand-orange)] ring-1 ring-[color:var(--brand-orange)]/30"
                        : "border-[color:var(--line-strong)] bg-white text-[color:var(--ink-body)] hover:bg-[color:var(--surface-alt)]"
                    }`}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="service-price" className="text-sm font-semibold text-foreground">
                Price (₱) <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[color:var(--ink-muted)]">₱</span>
                <Input
                  id="service-price"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="h-12 rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-8 text-sm focus-visible:border-[color:var(--brand-orange)] focus-visible:ring-[color:var(--brand-orange)]/20"
                />
              </div>
              <p className="text-xs text-[color:var(--ink-soft)]">
                Set a fixed price for this service. Make it competitive!
              </p>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link
                href="/dashboard/talent/services"
                className="inline-flex items-center justify-center rounded-xl border border-[color:var(--line-strong)] bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
              >
                Cancel
              </Link>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-xl border-[color:var(--line-strong)] px-6 py-3 text-sm font-semibold"
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="rounded-xl bg-[color:var(--brand-orange)] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)] disabled:opacity-50"
                >
                  Publish Service
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
