type LoadAuthUserIdentityProviders = (
  userId: string,
) => Promise<readonly string[]>;

type AuthIdentityProviderRow = {
  provider: string | null;
};

export async function authUserHasEmailProvider(
  userId: string,
  loadProviders: LoadAuthUserIdentityProviders = async (nextUserId) => {
    const [{ Prisma }, { prisma }] = await Promise.all([
      import("@prisma/client"),
      import("@/lib/prisma"),
    ]);
    const rows = await prisma.$queryRaw<AuthIdentityProviderRow[]>(Prisma.sql`
      SELECT provider
      FROM auth.identities
      WHERE user_id = ${nextUserId}
    `);

    return rows.flatMap(({ provider }) =>
      typeof provider === "string" ? [provider] : [],
    );
  },
) {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    return false;
  }

  const providers = await loadProviders(normalizedUserId);
  return providers.includes("email");
}
