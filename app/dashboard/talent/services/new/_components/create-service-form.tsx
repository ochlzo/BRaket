"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  Camera,
  Clapperboard,
  Laptop,
  LucideIcon,
  Megaphone,
  Monitor,
  Music,
  Palette,
  PenLine,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { saveTalentServiceStepAction } from "@/app/onboarding/talent/_actions/save-talent-service-step-action";
import type { CategoryOption } from "@/app/onboarding/talent/_lib/get-category-options";
import { TALENT_SERVICE_MAX_CATEGORIES } from "@/app/onboarding/talent/_lib/talent-service-step";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type CreateServiceFormProps = {
  availableCategories: CategoryOption[];
};

const SERVICE_DIRTY_FIELDS = [
  "title",
  "description",
  "categoryIds",
  "minPrice",
  "maxPrice",
  "priceUnit",
];

const categoryIconByName: Record<string, LucideIcon> = {
  "accounting & bookkeeping": Calculator,
  "business consulting": BriefcaseBusiness,
  "business planning": BriefcaseBusiness,
  "content writing": PenLine,
  "digital marketing": Megaphone,
  "graphic design": Palette,
  "music & audio": Music,
  photography: Camera,
  "social media": Smartphone,
  "ui/ux design": Monitor,
  "video editing": Clapperboard,
  "web development": Laptop,
};

function getCategoryIcon(categoryName: string) {
  return categoryIconByName[categoryName.toLowerCase()] ?? BookOpen;
}

export function CreateServiceForm({
  availableCategories,
}: CreateServiceFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasValidCategoryCount =
    selectedCategoryIds.length > 0 &&
    selectedCategoryIds.length <= TALENT_SERVICE_MAX_CATEGORIES;
  const isValid =
    title.trim() &&
    description.trim().length > 0 &&
    hasValidCategoryCount &&
    Number(price) > 0;

  function toggleCategory(categoryId: string) {
    setSelectedCategoryIds((currentCategoryIds) => {
      if (currentCategoryIds.includes(categoryId)) {
        return currentCategoryIds.filter((id) => id !== categoryId);
      }

      if (currentCategoryIds.length >= TALENT_SERVICE_MAX_CATEGORIES) {
        toast.error(
          `Select up to ${TALENT_SERVICE_MAX_CATEGORIES} categories.`,
        );
        return currentCategoryIds;
      }

      return [...currentCategoryIds, categoryId];
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || !isValid) {
      return;
    }

    const formData = new FormData();
    formData.set("serviceId", "");
    formData.set("title", title);
    formData.set("description", description);
    formData.set("categoryIds", JSON.stringify(selectedCategoryIds));
    formData.set("minPrice", price);
    formData.set("maxPrice", price);
    formData.set("priceUnit", "FIXED");
    formData.set("dirtyFields", JSON.stringify(SERVICE_DIRTY_FIELDS));

    try {
      setIsSubmitting(true);
      const result = await saveTalentServiceStepAction(formData);

      if (!result.ok) {
        toast.error(result.message || "We could not publish your service.");
        return;
      }

      toast.success("Service published.");
      router.push("/dashboard/talent/services");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-[color:var(--line-strong)] bg-white p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label
              htmlFor="service-title"
              className="text-sm font-semibold text-foreground"
            >
              Service Title{" "}
              <span className="text-[color:var(--tone-red-base)]">*</span>
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

          <div className="space-y-2">
            <Label
              htmlFor="service-desc"
              className="text-sm font-semibold text-foreground"
            >
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

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-semibold text-foreground">
                Categories{" "}
                <span className="text-[color:var(--tone-red-base)]">*</span>
              </Label>
              <span className="text-xs font-semibold text-[color:var(--ink-muted)]">
                {selectedCategoryIds.length}/{TALENT_SERVICE_MAX_CATEGORIES}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availableCategories.map((category) => {
                const Icon = getCategoryIcon(category.name);
                const isSelected = selectedCategoryIds.includes(
                  category.categoryId,
                );
                const isDisabled =
                  !isSelected &&
                  selectedCategoryIds.length >= TALENT_SERVICE_MAX_CATEGORIES;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`flex min-h-14 items-center gap-2 rounded-xl border px-3 py-3 text-left text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                      isSelected
                        ? "border-[color:var(--brand-orange)] bg-[color:var(--brand-orange)]/10 text-[color:var(--brand-orange)] ring-1 ring-[color:var(--brand-orange)]/30"
                        : "border-[color:var(--line-strong)] bg-white text-[color:var(--ink-body)] hover:bg-[color:var(--surface-alt)]"
                    }`}
                    disabled={isDisabled}
                    key={category.categoryId}
                    onClick={() => toggleCategory(category.categoryId)}
                    type="button"
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[color:var(--ink-soft)]">
              Select 1 to {TALENT_SERVICE_MAX_CATEGORIES} categories for this
              service.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label
              htmlFor="service-price"
              className="text-sm font-semibold text-foreground"
            >
              Price (₱) <span className="text-[color:var(--tone-red-base)]">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[color:var(--ink-muted)]">
                ₱
              </span>
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

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/dashboard/talent/services"
              className="inline-flex items-center justify-center rounded-xl border border-[color:var(--line-strong)] bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-[color:var(--surface-alt)]"
            >
              Cancel
            </Link>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-[color:var(--line-strong)] px-6 py-3 text-sm font-semibold"
                disabled
              >
                Save as Draft
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="rounded-xl bg-[color:var(--brand-orange)] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[color:var(--brand-orange-strong)] disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : "Publish Service"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
