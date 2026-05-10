type UpdateAuthUserById = (
  userId: string,
  attributes: { email: string },
) => Promise<{ error: { message?: string } | null }>;

export type LinkOAuthEmailProviderResult =
  | { ok: true }
  | { message: string; ok: false };

type LinkOAuthEmailProviderInput = {
  email: string;
  updateUserById: UpdateAuthUserById;
  userId: string;
};

export async function linkOAuthEmailProvider({
  email,
  updateUserById,
  userId,
}: LinkOAuthEmailProviderInput): Promise<LinkOAuthEmailProviderResult> {
  const normalizedUserId = userId.trim();
  const normalizedEmail = email.trim();

  if (!normalizedUserId || !normalizedEmail) {
    return {
      ok: false,
      message: "We could not confirm your email sign-in yet.",
    };
  }

  const { error } = await updateUserById(normalizedUserId, {
    email: normalizedEmail,
  });

  if (error) {
    return {
      ok: false,
      message:
        error.message ??
        "We could not finish adding email sign-in yet. Please try again.",
    };
  }

  return { ok: true };
}
