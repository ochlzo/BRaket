# Auth Rules

## Scope

Use this rule set for login, sign-up, OTP, session refresh, and post-auth user provisioning.

## Folder Split

- `components/shared/auth/` for auth UI, forms, and client interaction.
- `lib/supabase/` for browser/server/proxy Supabase clients.
- `lib/auth/` for shared auth/session helpers such as role normalization, usernames, and client session storage.
- `server/` for server-only auth logic, authorization rules, and privileged writes.

## Sign-Up And Login

- Keep the basic sign-up and login flow client-side unless you have a server-only requirement.
- Do not add an API route for plain sign-up, login, or OTP verification.
- Use Supabase auth directly from the client for the interactive flow.
- Keep the UI thin and move reusable auth state/logic into a hook or helper when the form starts mixing concerns.

## Session Handling

- Keep Supabase session refresh wiring in `proxy.ts` and `lib/supabase/proxy.ts`.
- Use `lib/supabase/server.ts` for server-side Supabase access in server components or route handlers.
- Keep session-shaping helpers in `lib/auth/session.ts`.

## User Record Creation

- If sign-up needs to create a row in your own `users` table, put the insert logic in `server/`.
- Prefer server-side execution for any privileged write, authorization check, or follow-up business rule.
- If the row must always exist, prefer a database trigger or other server-side guarantee over client-side follow-up logic.

## Rules To Follow

- Reuse existing auth helpers before creating new ones.
- Keep auth-related code centralized and easy to find.
- Avoid scattering Supabase calls across unrelated components.
- Keep route files focused on routing concerns.
