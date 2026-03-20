# UI Component Rules

When creating or updating UI in this folder or subfolders:

- Always reuse existing shared components before creating new ones.
- Keep shared layout structure in `components/layout/*` and branding in `components/branding/*`.
- Use the centralized color system from `theme/palette.ts`, `theme/semantic.ts`, and `theme/tailwind.ts`.
- Use CSS variables and semantic/tone utility classes; avoid introducing ad-hoc hex colors.
- Use reusable typography utilities from `app/globals.css` (`typo-*`) instead of repeating inline text/weight/leading/tracking classes.
- Prefer server-safe components by default. Add client boundaries only when interactivity is required.
- Keep component APIs pragmatic and small; avoid over-abstraction.
