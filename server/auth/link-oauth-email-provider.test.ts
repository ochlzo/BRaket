import assert from "node:assert/strict";
import test from "node:test";

import { linkOAuthEmailProvider } from "./link-oauth-email-provider";

test("links the oauth user's email identity with the admin update", async () => {
  const calls: Array<{
    userId: string;
    attributes: { email: string };
  }> = [];

  const result = await linkOAuthEmailProvider({
    email: "person@example.com",
    userId: "user-1",
    updateUserById: async (userId, attributes) => {
      calls.push({ userId, attributes });
      return { error: null };
    },
  });

  assert.deepEqual(calls, [
    {
      userId: "user-1",
      attributes: { email: "person@example.com" },
    },
  ]);
  assert.deepEqual(result, { ok: true as const });
});
