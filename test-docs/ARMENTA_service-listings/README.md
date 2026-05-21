# Armenta Service Listings Testing Evidence

Path:

`docs/testing-evidence/ARMENTA-service_listings`

## Contents

- `service-listings-create.spec.ts` - tests creating a service listing.
- `service-listings-edit.spec.ts` - tests editing an existing service listing.
- `service-listings-delete.spec.ts` - tests deleting a service listing.
- `service-listings-validation-security.spec.ts` - tests invalid price input, unauthenticated redirect, and client-role blocking.
- `service-listings.fixture.ts` - shared Supabase, Prisma, login, and database assertion helpers.
- `playwright.config.ts` - Playwright configuration for running the evidence scripts.
- `reports/` - generated HTML reports for each script.
- `armenta-service-listings-playwright.md` - written testing documentation.

## Run Commands

From this folder:

```bash
npm install
npm run test:e2e:create
npm run test:e2e:edit
npm run test:e2e:delete
npm run test:e2e:validation-security
```
