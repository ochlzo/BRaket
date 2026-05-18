# Profile Verification Panel Reference

This file preserves the BU student verification UI so it can be reintroduced later with the same design tokens.

## Placement

- Original placement: `app/dashboard/profile/page.tsx`
- Current visibility: hidden for `client` profiles, retained for non-client profiles

## Structure

1. Primary verification card
   - Component: `ProfileVerificationCard`
   - Purpose: show verification status and trigger BU email verification

2. BU ID upload block
   - Wrapper: `rounded-xl border border-[color:var(--line-strong)] bg-white px-4 py-3`
   - Layout: `flex flex-col gap-3 sm:flex-row sm:items-center`
   - Left text block: `min-w-0 flex-1`
   - File picker button: `inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] px-3 text-[11px] font-semibold text-[color:var(--ink-body)] transition hover:bg-white`
   - Upload button: `h-8 rounded-md bg-[color:var(--brand-blue)] px-3 text-[11px] font-semibold !text-white transition hover:bg-[color:var(--brand-blue)]/90 disabled:opacity-60`

3. Helper text tokens
   - Title: `text-xs font-bold text-foreground`
   - Secondary copy: `mt-0.5 text-[11px] text-[color:var(--ink-muted)]`
   - Selected file line: `mt-2 truncate text-[11px] text-[color:var(--ink-soft)]`

4. Message states
   - Error: `bg-[color:var(--tone-red-soft)] text-[color:var(--tone-red-deep)]`
   - Success: `bg-[color:var(--tone-green-soft)] text-[color:var(--tone-green-deep)]`
   - Message container: `mt-2 rounded-lg px-3 py-2 text-xs`

## Behavior

- Verification sends users to `/talent/verify`, where a Server Action checks
  the signed-in Supabase user, requires a confirmed `@bicol-u.edu.ph` email,
  uploads the BU ID image to the private configured Supabase bucket, and creates
  a `TalentVerificationRequest`.
- The profile panel must not mark verification directly. Only `/admin` approval
  may set `User.is_verified = true`.

## Reuse Notes

- Keep the same token set if this UI returns to another dashboard.
- The current implementation lives in `app/dashboard/profile/_components/profile-verification-panel.tsx`.
- The verification action lives in `app/dashboard/profile/_actions/verify-bu-email-action.ts`.
