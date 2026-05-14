import "server-only";

import { prisma } from "@/lib/prisma";

export type CategoryOption = {
  categoryId: string;
  name: string;
};

export async function getCategoryOptions(): Promise<CategoryOption[]> {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      categoryId: true,
      name: true,
    },
  });
}
