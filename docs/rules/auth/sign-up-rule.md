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
- For Google or other OAuth providers, start the flow with `supabase.auth.signInWithOAuth(...)` from the client and finish the code exchange in a dedicated route handler such as `app/auth/callback/route.ts`.
- Keep OAuth redirect URLs on the Supabase allow list and route any post-provider session shaping through a small auth-specific completion screen instead of scattering callback logic across random pages.
- If sign-up must reject existing emails before `supabase.auth.signUp`, keep the duplicate-email check in `server/auth/` and expose it through a dedicated client-callable Server Function file before the client auth request.
- Prefer checking `auth.users` on the server for duplicate-email validation instead of duplicating that logic in the client UI.
- Keep forgot-password email requests client-side with `supabase.auth.resetPasswordForEmail(...)` unless a server-only requirement appears.
- In the login flow, prefer a local forgot-password panel or form instead of navigating to a separate request page.
- Keep the UI thin and move reusable auth state/logic into a hook or helper when the form starts mixing concerns.

## Session Handling

- Keep Supabase session refresh wiring in `proxy.ts` and `lib/supabase/proxy.ts`.
- Use `lib/supabase/server.ts` for server-side Supabase access in server components or route handlers.
- Keep session-shaping helpers in `lib/auth/session.ts`.
- For password recovery, send users to a dedicated reset page such as `/update-password` and finish the password change with `supabase.auth.updateUser(...)`.

## User Record Creation

- If sign-up needs to create a row in your own `users` table, put the insert logic in `server/`.
- Prefer server-side execution for any privileged write, authorization check, or follow-up business rule.
- If the row must always exist, prefer a database trigger or other server-side guarantee over client-side follow-up logic.

## Signup Email Validation

- Keep email-availability logic in `server/auth/`.
- Keep pure auth lookup/business logic separate from the dedicated client-callable Server Function wrapper.
- If a client component needs to trigger the check, import only the dedicated Server Function file, not arbitrary server-only modules.
- Return a UI-safe message from the server check when the email already exists or the lookup fails.
- Surface that message through the existing auth form error state instead of introducing a separate auth API route.

## Forgot Password

- Add the `Forgot password` trigger directly on the login password field area.
- Keep the reset-email request form inside the existing login flow when possible.
- Use a neutral success message after `resetPasswordForEmail(...)` so the UI does not reveal whether an email exists.
- Keep the new-password form on a dedicated reset page and validate password length and confirmation before calling `updateUser(...)`.

## Rules To Follow

- Reuse existing auth helpers before creating new ones.
- Keep auth-related code centralized and easy to find.
- Avoid scattering Supabase calls across unrelated components.
- Keep route files focused on routing concerns.
