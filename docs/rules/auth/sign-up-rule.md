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
- Treat new signups as `client` by default and do not expose a local account-type picker in the auth form.
- After normal sign-up or login completes without a `callbackUrl`, redirect directly to `/browse`; keep talent onboarding outside the auth completion path.
- For Google or other OAuth providers, start the flow with `supabase.auth.signInWithOAuth(...)` from the client and finish the code exchange in a dedicated route handler such as `app/auth/callback/route.ts`.
- Keep OAuth redirect URLs on the Supabase allow list and route any post-provider session shaping through a small auth-specific completion screen instead of scattering callback logic across random pages.
- If Google-authenticated users must create an email/password sign-in, do the provider check on the server inside the OAuth callback flow and route missing-password users through a dedicated create-password screen before `/auth/complete`.
- If Supabase does not materialize the `email` identity after OAuth users set a password, finish the link on a trusted server with `supabase.auth.admin.updateUserById(..., { email })` before redirecting to `/auth/complete`.
- For account email changes, keep the duplicate-email check in `server/auth/`, send the confirmation with client-side `supabase.auth.signUp(...)` using the Confirm sign up template, verify the OTP with `supabase.auth.verifyOtp({ type: "signup" })`, and finalize on a trusted server by migrating the existing app user row to the new Supabase auth user while deleting the old auth user.
- When the account email flow creates a replacement auth user, store the old app user id and old auth id in auth metadata so the finalize route can reconcile the row safely.
- If sign-up must reject existing emails before `supabase.auth.signUp`, keep the duplicate-email check in `server/auth/` and expose it through a dedicated client-callable Server Function file before the client auth request.
- Prefer checking `auth.users` on the server for duplicate-email validation instead of duplicating that logic in the client UI.
- Keep forgot-password email requests client-side with `supabase.auth.resetPasswordForEmail(...)` unless a server-only requirement appears.
- In the login flow, prefer a local forgot-password panel or form instead of navigating to a separate request page.
- Keep the UI thin and move reusable auth state/logic into a hook or helper when the form starts mixing concerns.

## Session Handling

- Keep Supabase session refresh wiring in `middleware.ts` and `lib/supabase/proxy.ts`.
- Use `lib/supabase/server.ts` for server-side Supabase access in server components or route handlers.
- Keep session-shaping helpers in `lib/auth/session.ts`.
- For password recovery, send users to a dedicated reset page such as `/update-password` and finish the password change with `supabase.auth.updateUser(...)`.

## User Record Creation

- If sign-up needs to create a row in your own `users` table, put the insert logic in `server/`.
- Prefer server-side execution for any privileged write, authorization check, or follow-up business rule.
- If the row must always exist, prefer a database trigger or other server-side guarantee over client-side follow-up logic.
- If `avatarUrl` is blank on signup, keep it empty server-side and persist a separate `initials` field from the auth display name or email so avatar fallbacks can render from stored initials instead of a synthetic URL.
- Account-scoped dashboard and settings pages must resolve the authenticated user from Supabase + your real app user record; do not fall back to mock "current user" data for signed-in experiences.
- When onboarding enriches the user profile, persist the canonical profile fields server-side and keep auth metadata in sync only as a transport/helper layer.
- Talent BU verification must be handled through a dedicated Server Function that validates the signed-in Supabase user, requires a confirmed `@bicol-u.edu.ph` auth email, uploads the BU ID image to the configured private Supabase Storage bucket (`NEXT_PUBLIC_SUPABASE_BU_ID_BUCKET`), and creates a `TalentVerificationRequest`.
- Do not mark `User.is_verified` from the applicant flow. Only the protected admin review flow may approve a `TalentVerificationRequest` and set `User.is_verified = true`.
- Admin verification access must require an authenticated Supabase user whose email appears in `BRAKET_ADMIN_EMAILS`.
- Admin routes must use the dedicated admin session guard. `/admin` redirects non-admin sessions to `/admin/login`, and `/admin/login` redirects valid admin sessions back to `/admin`.

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
