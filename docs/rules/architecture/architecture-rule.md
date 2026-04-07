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

Route files only. Put `page.tsx`, `layout.tsx`, route handlers, loading/error files, and route-local UI here. Keep non-routing code outside `app`.

### /components

Shared presentational components. Use:

- `ui/` for design-system primitives
- `shared/` for reusable app components

### /features

Feature-scoped client code. Each feature owns its Redux slice, selectors, hooks, types, and feature-specific components.

### /lib

Shared infrastructure and reusable modules.

- `prisma.ts` = singleton Prisma client
- `supabase/` = browser/server/proxy clients
- `redux/` = store factory, typed hooks, provider
- `validations/` = input schemas
- `utils/` = pure helpers

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

## Import Rules

- Route files may import from `components`, `features`, `lib`, and `server`.
- Client components must not import from `server`.
- Shared UI in `components` must stay framework-light and business-logic-light.
- Infrastructure setup belongs in `lib`, not inside route files.

## Goal

Keep routing thin, infrastructure centralized, server logic isolated, and feature code easy to find.
