# App UI Guidelines (Summary)

- Build route pages from shared components in `components/*` (layout, marketing, branding, icons); avoid route-local duplication.
- Keep navigation/content data centralized in `content/*` and favor declarative, data-driven rendering.
- Use the project design system from `theme/*` and CSS variables in `app/globals.css`; avoid hardcoded one-off colors.
- Use reusable typography classes (`typo-*`) for text hierarchy instead of repeated inline text styles.
- Default to Server Components, and add `"use client"` only when browser APIs or interactivity require it.
- Align route-level UI with existing shared patterns before introducing new components.
