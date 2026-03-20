# App Route UI Rules

For all route pages under `app/`:

- Compose pages from shared components in `components/*` (layout, marketing, branding, icons) instead of in-file duplication.
- Keep shared navigation and footer data in `content/*`.
- Use the centralized theme (`theme/palette.ts`, `theme/semantic.ts`, `theme/tailwind.ts`) and CSS variables in `app/globals.css`.
- Use reusable typography scale classes (`typo-*`) for text styles.
- Default to Server Components; add `"use client"` only when interaction/browser APIs are required.
