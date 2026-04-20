# Architecture Compliance Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the repo with its documented architecture and size rules without changing behavior, while keeping `features/` untouched.

**Architecture:** Keep `page.tsx` files as thin route entrypoints and move bulky route-local UI/data into private colocated modules. Preserve existing shared shells and theme/content systems, and clarify the auth server-function boundary in docs and code.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Supabase, Redux Toolkit, Prisma

---

### Task 1: Update rules and design-system guidance

**Files:**
- Modify: `docs/rules/architecture/architecture-rule.md`
- Modify: `docs/rules/auth/sign-up-rule.md`

- [ ] Add explicit guidance for client-callable dedicated Server Functions.
- [ ] Add shared shell/content/typography conventions to the rules.
- [ ] Keep the wording aligned with current repo patterns instead of adding new architecture.
- [ ] Re-read the updated rule docs for consistency.

### Task 2: Fix the auth server-function boundary

**Files:**
- Modify: `components/shared/auth/use-otp-auth.ts`
- Create or modify: `server/auth/*`

- [ ] Keep the duplicate-email check in `server/auth/`.
- [ ] Move the client-callable boundary to a clearly named dedicated server-function file.
- [ ] Ensure client code no longer imports an arbitrary mixed-responsibility server module.
- [ ] Re-run lint on the touched auth files.

### Task 3: Fix the theme-token miss

**Files:**
- Modify: `app/post-project/page.tsx`
- Modify if needed: `app/globals.css`
- Modify if needed: `lib/theme/palette.ts`

- [ ] Replace the hardcoded hex with an existing token when possible.
- [ ] Only add a new token if no current token fits.
- [ ] Confirm no new hardcoded hex values are introduced.

### Task 4: Split oversized route files

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/post-project/page.tsx`
- Modify: `app/dashboard/profile/page.tsx`
- Modify: `app/dashboard/admin/page.tsx`
- Modify: `app/onboarding/talent/page.tsx`
- Modify: `app/talent/[username]/page.tsx`
- Create: route-local `_components/*.tsx`
- Create: route-local `_data.ts`

- [ ] Keep each `page.tsx` focused on assembly and routing concerns.
- [ ] Move large local constants out first.
- [ ] Move large route-specific sections into private local components.
- [ ] Only promote modules into shared components when they are genuinely reusable.
- [ ] Keep touched files under 300 lines.

### Task 5: Split mock data into focused modules

**Files:**
- Modify: `lib/mock-data.ts`
- Create: `lib/mock-data/*`

- [ ] Break the file by domain and helper responsibility.
- [ ] Preserve the public import surface with minimal caller churn.
- [ ] Keep each new module under 300 lines.

### Task 6: Verify the refactor

**Files:**
- Verify all touched files

- [ ] Run `npm run lint`.
- [ ] Re-check line counts for touched route and lib files.
- [ ] Confirm no raw `<img>` usage was added.
- [ ] Confirm no new hardcoded theme hex values were added.
- [ ] Summarize remaining rule gaps, if any.
