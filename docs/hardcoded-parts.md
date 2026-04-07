# Hardcoded Parts Inventory

This file lists codebase areas that currently rely on hardcoded values, static arrays, or in-file constants.

## 1) Mock domain data and in-memory data access

- `lib/mock-data.ts`
  - Contains hardcoded categories, talents, clients, services, bookings, and reviews.
  - Contains helper selectors (`getTalentByUsername`, `getBookingsByClient`, etc.) that query in-memory arrays.
  - Contains hardcoded current user/profile values (`mockCurrentUser`, `mockCurrentClientProfile`, `mockCurrentTalentProfile`).

- Pages that directly consume this mock layer:
  - `app/browse/page.tsx`
  - `app/talent/[username]/page.tsx`
  - `app/book/[serviceId]/page.tsx`
  - `app/dashboard/admin/page.tsx`
  - `app/dashboard/client/page.tsx`
  - `app/dashboard/client/bookings/page.tsx`
  - `app/dashboard/profile/page.tsx`
  - `app/dashboard/talent/page.tsx`
  - `app/dashboard/talent/bookings/page.tsx`
  - `app/dashboard/talent/services/page.tsx`
  - `app/dashboard/talent/services/new/page.tsx`
  - `app/settings/page.tsx`

## 2) Hardcoded page-level content/config arrays

- `app/page.tsx`
  - `categories`
  - `featureCards`
  - Static marketing copy, metrics, and CTA labels in JSX.

- `app/how-it-works/page.tsx`
  - `clientSteps`
  - `talentSteps`
  - `features`

- `app/services/page.tsx`
  - `services`

- `app/post-project/page.tsx`
  - `categoryOptions`
  - `skillSuggestions`
  - `budgetRanges`
  - `timelineOptions`
  - `urgencyLevels`

- `app/onboarding/talent/page.tsx`
  - `availableSkills`
  - `proficiencyLevels`

## 3) Hardcoded navigation and footer content

- `lib/content/navigation.ts`
  - `homeNavigation`
  - `appNavigation`

- `lib/content/footer.ts`
  - `footerColumns`
  - `legalLinks`
  - `footerBrandDescription`

## 4) Hardcoded theme tokens and utility class maps

- `lib/theme/palette.ts`
  - Static palette hex values and semantic token mappings.

- `lib/theme/semantic.ts`
  - Static semantic class presets (buttons, text, borders, panels).

- `lib/theme/tailwind.ts`
  - Static tone style map (`toneStyles`) for UI color variants.

## 5) Hardcoded client session key and auth/session shape (localStorage)

- Key used across app: `"braket_session"`

- Write/update sites:
  - `components/shared/auth/auth-form.tsx`
  - `app/onboarding/talent/page.tsx`
  - `app/dashboard/profile/page.tsx`

- Read/remove sites:
  - `components/shared/layout/site-header.tsx`
  - `app/settings/page.tsx`
  - `app/dashboard/profile/page.tsx`

## 6) Notes

- Some hardcoding is intentional for the current MVP/demo setup (especially `lib/mock-data.ts` and page-level arrays).
- When moving to dynamic data, prioritize replacing section 1 and section 5 first (data/auth), then section 2 and section 3 (content configuration).
