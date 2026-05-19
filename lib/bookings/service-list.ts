import type { TalentServiceListItem } from "@/lib/bookings/types";

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  maximumFractionDigits: 0,
  style: "currency",
});

type TalentServiceListItemSource = {
  ServiceCategories: Array<{
    categoryId: string;
    Category: { name: string };
  }>;
  ServiceMedia: Array<{
    mediaUrl: string;
    serviceDetailId: string;
  }>;
  createdAt: Date;
  description: string;
  maxPrice: { toString: () => string };
  minPrice: { toString: () => string };
  priceUnit: string;
  serviceId: string;
  title: string;
};

function priceLabel(
  minPrice: { toString: () => string },
  maxPrice: { toString: () => string },
) {
  const min = Number(minPrice.toString());
  const max = Number(maxPrice.toString());

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return "Price on request";
  }

  if (min === max) {
    return pesoFormatter.format(min);
  }

  return `${pesoFormatter.format(min)} - ${pesoFormatter.format(max)}`;
}

export function buildTalentServiceListItem(
  service: TalentServiceListItemSource,
): TalentServiceListItem {
  const minPrice = Number(service.minPrice.toString());
  const maxPrice = Number(service.maxPrice.toString());

  return {
    categories: service.ServiceCategories.map((entry) => entry.Category.name),
    categoryIds: service.ServiceCategories.map((entry) => entry.categoryId),
    createdAt: service.createdAt.toISOString(),
    description: service.description,
    id: service.serviceId,
    maxPrice,
    media: service.ServiceMedia.map((media) => ({
      id: media.serviceDetailId,
      url: media.mediaUrl,
    })),
    mediaUrls: service.ServiceMedia.map((media) => media.mediaUrl),
    minPrice,
    priceLabel: priceLabel(service.minPrice, service.maxPrice),
    priceUnit: service.priceUnit,
    title: service.title,
  };
}
