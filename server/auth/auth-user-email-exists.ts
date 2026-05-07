import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuthUserRow = { id: string };

export async function authUserEmailExists(email: string) {
  const rows = await prisma.$queryRaw<AuthUserRow[]>(Prisma.sql`
    SELECT id
    FROM auth.users
    WHERE lower(email) = ${email}
    LIMIT 1
  `);

  return rows.length > 0;
}
