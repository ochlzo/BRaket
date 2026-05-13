import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const skills = [
  "UI/UX Design",
  "Graphic Design",
  "Brand Identity",
  "Illustration",
  "Motion Graphics",
  "Video Editing",
  "Photography",
  "Copywriting",
  "Content Writing",
  "Social Media Management",
  "Digital Marketing",
  "SEO",
  "Frontend Development",
  "Backend Development",
  "Full-Stack Development",
  "Mobile App Development",
  "Web Design",
  "WordPress Development",
  "Database Design",
  "API Integration",
  "Data Analysis",
  "Project Management",
  "Virtual Assistance",
  "Customer Support",
  "Research",
  "Translation",
  "Transcription",
  "Accounting",
  "Bookkeeping",
  "Business Planning",
];

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed skills.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.skill.createMany({
    data: skills.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log(`Seeded ${result.count} new skill record(s).`);
}

main()
  .catch((error) => {
    console.error("Failed to seed skills.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
