import { expect, type Page, type TestInfo } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";

loadEnv({ path: "../../../.env" });
loadEnv({ override: true, path: "../../../.env.local" });

export const TEST_PASSWORD = "ArmentaService123!";
export const CATEGORY_NAME = "Graphic Design";

const SKILL_NAMES = ["Graphic Design", "Brand Identity", "UI/UX Design"];
const MOCK_DOMAIN = "@mock.braket.local";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: requireEnv("DATABASE_URL") }),
});

const supabaseAdmin = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export type TestAccount = {
  authId: string;
  email: string;
  talentProfileId?: string;
  username: string;
};

export type TestService = {
  serviceId: string;
  title: string;
};

export function buildEmail(label: string) {
  return `armenta.service.${label}.e2e${MOCK_DOMAIN}`;
}

export function buildUsername(label: string) {
  return `armenta-service-${label}-e2e`;
}

export async function createTalentAccount(label: string): Promise<TestAccount> {
  const email = buildEmail(label);
  const username = buildUsername(label);
  const talentProfileId = `e2e-armenta-${label}-talent-profile`;

  await resetTestAccount(email, username);
  const authId = await createAuthUser(email, username, "talent");
  await ensureCategory(CATEGORY_NAME);
  const skills = await Promise.all(SKILL_NAMES.map(ensureSkill));

  await prisma.user.create({
    data: {
      authId,
      email,
      firstName: "Armenta",
      initials: "AT",
      is_talent: true,
      is_verified: true,
      lastName: "Tester",
      userId: authId,
      username,
    },
  });
  await prisma.talentProfile.create({
    data: {
      bio:
        "Dedicated test profile for service listing CRUD automation. " +
        "This profile has realistic student talent information for tests. " +
        "It is intentionally long enough to satisfy onboarding checks while " +
        "remaining isolated from manual demo accounts.",
      bu_email: `${username}@bicol-u.edu.ph`,
      college: "Bicol University",
      course: "Information Technology",
      headline: "Service Listing Quality Assurance Tester",
      talent_profile_id: talentProfileId,
      updatedAt: new Date(),
      user_id: authId,
      year_level: 4,
    },
  });
  await prisma.talentSkill.createMany({
    data: skills.map((skill, index) => ({
      proficiencyLevel: index === 0 ? "ADVANCED" : "INTERMEDIATE",
      skillId: skill.skillId,
      talentProfileId,
    })),
  });

  return { authId, email, talentProfileId, username };
}

export async function createClientAccount(label: string): Promise<TestAccount> {
  const email = buildEmail(`client-${label}`);
  const username = buildUsername(`client-${label}`);

  await resetTestAccount(email, username);
  const authId = await createAuthUser(email, username, "client");
  await prisma.user.create({
    data: {
      authId,
      email,
      firstName: "Client",
      initials: "CT",
      is_talent: false,
      is_verified: true,
      lastName: "Tester",
      userId: authId,
      username,
    },
  });

  return { authId, email, username };
}

export async function createDbService(
  account: TestAccount,
  label: string,
): Promise<TestService> {
  if (!account.talentProfileId) throw new Error("Talent profile is required.");

  const category = await ensureCategory(CATEGORY_NAME);
  const serviceId = `e2e-armenta-service-${label}-${Date.now()}`;
  const title = `Armenta QA Existing Service ${label}`;

  await prisma.service.create({
    data: {
      ServiceCategories: {
        create: {
          categoryId: category.categoryId,
          serviceCategoryId: `${serviceId}-category`,
        },
      },
      description: "Seeded service listing for advanced Playwright testing.",
      maxPrice: 6800,
      minPrice: 2500,
      priceUnit: "PER_PROJECT",
      serviceId,
      talentProfileId: account.talentProfileId,
      title,
    },
  });

  return { serviceId, title };
}

export async function loginAs(page: Page, email: string) {
  await page.goto("/login?callbackUrl=/dashboard/talent/services");
  await page.getByLabel("Email Address").fill(email);
  await page.locator('input[name="password"]').fill(TEST_PASSWORD);
  await page.getByRole("button", { exact: true, name: "Sign In" }).click();
}

export async function attachScreenshot(
  testInfo: TestInfo,
  page: Page,
  name: string,
) {
  const body = await page.screenshot({ fullPage: true });
  await testInfo.attach(name, { body, contentType: "image/png" });
}

export async function expectServiceInDb(title: string) {
  const service = await prisma.service.findFirst({ where: { title } });
  expect(service, `Expected service "${title}" to exist in DB.`).not.toBeNull();
  return service;
}

export async function expectNoServiceInDb(title: string) {
  const service = await prisma.service.findFirst({ where: { title } });
  expect(service, `Expected service "${title}" to be absent in DB.`).toBeNull();
}

export async function resetTestAccount(email: string, username: string) {
  const users = await prisma.user.findMany({
    select: { authId: true, userId: true },
    where: { OR: [{ email }, { username }] },
  });

  await prisma.user.deleteMany({
    where: { OR: [{ email }, { username }] },
  });
  await Promise.all(users.map((user) => deleteAuthUser(user.authId)));
  await deleteAuthUserByEmail(email);
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for Playwright E2E tests.`);
  return value;
}

async function createAuthUser(
  email: string,
  username: string,
  role: "client" | "talent",
) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    password: TEST_PASSWORD,
    user_metadata: {
      display_name: "Armenta Service Tester",
      first_name: "Armenta",
      last_name: "Tester",
      role,
      username,
    },
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Could not create Supabase test user.");
  }

  return data.user.id;
}

async function ensureCategory(name: string) {
  const existing = await prisma.category.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.category.create({ data: { name } });
}

async function ensureSkill(name: string) {
  return prisma.skill.upsert({
    create: { name },
    update: {},
    where: { name },
  });
}

async function deleteAuthUser(authId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(authId);
  if (error && !error.message.toLowerCase().includes("not found")) throw error;
}

async function deleteAuthUserByEmail(email: string) {
  for (let page = 1; ; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw error;

    const user = data.users.find(
      (candidate) => candidate.email?.toLowerCase() === email,
    );
    if (user) await deleteAuthUser(user.id);
    if (user || data.users.length < 1000) return;
  }
}
