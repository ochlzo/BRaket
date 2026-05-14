import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const categories = [
  "Web & App Development",
  "UI/UX Design",
  "Graphic Design",
  "Photography",
  "Video Production",
  "Content Writing",
  "Social Media",
  "Music & Audio",
  "Digital Marketing",
  "Business Consulting",
  "Data & Analytics",
  "Virtual Assistance",
  "Research & Academic Support",
  "Translation & Transcription",
  "Accounting & Bookkeeping",
];

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed categories.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existingCategories = await prisma.category.findMany({
    select: { name: true },
    where: { name: { in: categories } },
  });
  const existingNames = new Set(existingCategories.map(({ name }) => name));
  const missingCategories = categories.filter((name) => !existingNames.has(name));

  if (missingCategories.length === 0) {
    console.log("No new category records to seed.");
    return;
  }

  const result = await prisma.category.createMany({
    data: missingCategories.map((name) => ({ name })),
  });

  console.log(`Seeded ${result.count} new category record(s).`);
}

main()
  .catch((error) => {
    console.error("Failed to seed categories.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
