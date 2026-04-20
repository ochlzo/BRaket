# Architecture Compliance Cleanup Design

**Date:** 2026-04-20

## Goal

Bring the repo closer to its documented architecture and file-size rules without changing app behavior, while leaving `features/` untouched for future Redux work.

## Scope

- Update architecture and auth rules to match the intended Next.js App Router patterns.
- Add missing rule coverage for shared page shells, content sources, and typography utilities.
- Fix the current auth boundary conflict around client-invoked server functions.
- Replace the known hardcoded theme hex in the post-project page.
- Split oversized route files into thin route entrypoints with route-local private modules.
- Split `lib/mock-data.ts` into smaller focused modules.

## Non-Goals

- No Redux expansion.
- No behavior changes to flows, copy, or routing.
- No redesign of shared layout patterns.
- No migration away from mock data.

## Context

The current repo already follows several strong conventions:

- shared public-page scaffolding through `PageShell`
- shared dashboard scaffolding through `DashboardLayout`
- centralized navigation and footer content in `lib/content/*`
- theme token utilities in `lib/theme/*`

However, the current rules do not fully describe those conventions, and several route files are too large to satisfy the repo's own size rule. The architecture docs also conflict with the auth docs around client usage of server-side signup email checks.

## Architecture Decisions

### 1. Keep route entrypoints thin

Each oversized route keeps its `page.tsx` entrypoint, but large local constants and UI sections move into colocated private modules such as `_components` and `_data.ts`.

This follows current Next.js App Router guidance:

- colocated non-route files inside `app` are safe
- private folders like `_components` help separate route logic from local implementation details

### 2. Keep shared patterns shared

Only route-local code moves into route-private modules. Existing reusable layout and marketing components stay in:

- `components/shared/layout/*`
- `components/shared/marketing/*`
- `components/shared/icons/*`

### 3. Keep auth duplicate-email checking server-backed

The signup email availability check remains server-backed and stays under `server/auth/`. The rules will be updated to explicitly allow dedicated `use server` entrypoints to be invoked from client components, while preserving the general rule that client components must not import arbitrary server-only modules.

### 4. Leave `features/` alone

`features/` remains untouched in this pass. The audit finding about underuse is informational only for now.

### 5. Split mock data by domain

`lib/mock-data.ts` will be broken into focused modules so the repo no longer concentrates multiple datasets and selectors in one oversized file.

## Planned File Organization

### Rules and docs

- `docs/rules/architecture/architecture-rule.md`
- `docs/rules/auth/sign-up-rule.md`
- `docs/rules/frontend/theme-conventions-rule.md`

### Auth boundary

- `components/shared/auth/use-otp-auth.ts`
- dedicated client-callable server action file under `server/auth/`

### Oversized route targets

- `app/page.tsx`
- `app/post-project/page.tsx`
- `app/dashboard/profile/page.tsx`
- `app/dashboard/admin/page.tsx`
- `app/onboarding/talent/page.tsx`
- `app/talent/[username]/page.tsx`

Each route may gain:

- `_components/*.tsx`
- `_data.ts`
- route-local helper/types files when needed

### Mock data

- split `lib/mock-data.ts` into smaller modules under `lib/mock-data/`

## Verification

- `npm run lint`
- re-check touched file lengths
- confirm no raw `<img>` usage was introduced
- confirm no new hardcoded theme hex values were introduced in app/component class strings

