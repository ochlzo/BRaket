# Architecture Rules

Use this structure:

app/
components/
features/
lib/
server/
prisma/

## Directory Rules

### /app

Route entrypoints and route-local modules only. Put `page.tsx`, `layout.tsx`, route handlers, loading/error files, and route-local UI here. Keep shared non-routing code outside `app`.

- Keep `page.tsx` thin and focused on route assembly.
- For large routes, colocate route-private modules such as `_components/`, `_data.ts`, `_lib.ts`, and `_types.ts` inside the route segment.
- Use private folders like `_components` to keep route-local files clearly non-routable.
- Safe colocation inside `app` is allowed for route-local implementation details; only shared modules should move outside `app`.

### /components

Shared presentational components. Use:

- `ui/` for design-system primitives
- `shared/` for reusable app components

Prefer existing shared shells and scaffolds before creating new page chrome:

- `components/shared/layout/page-shell.tsx` for public site pages
- `components/shared/layout/dashboard-layout.tsx` for dashboard pages

Keep shared component APIs small and composable. If a component is only used by one route, prefer keeping it route-local in that route's private folder instead of promoting it here too early.

### /features

Feature-scoped client code. Each feature owns its Redux slice, selectors, hooks, types, and feature-specific components.

### /lib

Shared infrastructure and reusable modules.

- `prisma.ts` = singleton Prisma client
- `supabase/` = browser/server/proxy clients
- `redux/` = store factory, typed hooks, provider
- `content/` = shared navigation/footer/content configuration
- `validations/` = input schemas
- `utils/` = pure helpers

Keep shared navigation and footer content in `lib/content/navigation.ts` and `lib/content/footer.ts`.

### /server

Server-only business logic. Put services, server actions, and authorization rules here. Do not import this code into client components.

### prisma

Database schema, migrations, and seed scripts only.

## Implementation Rules

- Use the Next.js App Router and keep routing concerns inside `/app`.
- Default to Server Components. Add `"use client"` only for interactivity, browser APIs, or React client state.
- Keep Redux for client/UI state, not primary server data.
- Create the Redux store per request and provide it through a small client `providers.tsx`.
- Use Prisma for relational database access.
- Use Supabase for auth/session handling and related client/server auth helpers.
- Centralize DB access and business logic; do not scatter Prisma or Supabase calls across random components.
- Validate all external input at the boundary before business logic or database writes.
- Prefer feature-based organization over type-based sprawl.
- Prefer typography utilities from `app/globals.css` (for example `typo-*`) instead of repeating large inline typography class strings.

## Import Rules

- Route files may import from `components`, `features`, `lib`, and `server`.
- Client components must not import arbitrary server-only modules from `server`.
- Client components may call dedicated Server Functions from files marked with top-level `"use server"` when that file is the intended client-callable boundary.
- Shared UI in `components` must stay framework-light and business-logic-light.
- Infrastructure setup belongs in `lib`, not inside route files.

## Goal

Keep routing thin, infrastructure centralized, server logic isolated, and feature code easy to find.
