import "server-only";

import { prisma } from "@/lib/prisma";

export async function getSkillOptions() {
  const skills = await prisma.skill.findMany({
    orderBy: { name: "asc" },
    select: { name: true },
  });

  return skills.map((skill) => skill.name);
}
