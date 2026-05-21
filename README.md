# BRaket

BRaket is a platform that connects Bicol University students with opportunities to showcase their talents, offer services, and manage commission-based work.

## Test Documentation

Testing documents and supporting evidence are organized in the [docs/test-docs directory](docs/test-docs/).

| Member                   | Area Handled                                  |
| ------------------------ | --------------------------------------------- |
| Chenie Buergo            | Login and Authentication + Documentation Lead |
| Dan Emanuel Pispis       | Registration / Profile Creation               |
| Sean Dylan Armenta       | Service Listings                              |
| Angelica Lita            | Search, Filter, and Browse Talents/Services   |
| John Benedict Candelaria | Booking / Commission Flow                     |

## Architecture

BRaket follows a Next.js App Router structure with route entrypoints kept in `app/`, shared UI in `components/`, reusable infrastructure in `lib/`, server-only business logic in `server/`, and database schema assets in `prisma/`.

```shell
braket-nextjs/
|-- app/          # Pages, layouts, route handlers, and route-local UI
|-- components/   # Shared UI primitives and reusable app components
|-- features/     # Feature-scoped client state, hooks, and components
|-- lib/          # Shared auth, Supabase, Redux, content, and utilities
|-- server/       # Server actions, services, authorization, and DB logic
`-- prisma/       # Prisma schema, migrations, and seed scripts
```

```shell
Browser
  |
  v
app/ routes and layouts
  |
  +--> components/ and features/   # UI composition and client interaction
  |
  +--> lib/                        # Shared helpers and infrastructure
          |
          v
       server/                     # Business rules and protected writes
          |
          +--> Prisma              # Relational data access
          `--> Supabase            # Authentication, sessions, and storage
```
