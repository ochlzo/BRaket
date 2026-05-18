import "server-only";

import { prisma } from "@/lib/prisma";

export function countActionedProfileReportsForUser(userId: string) {
  return prisma.contentReport.count({
    where: {
      status: "ACTIONED",
      targetId: userId,
      targetType: "PROFILE",
    },
  });
}
