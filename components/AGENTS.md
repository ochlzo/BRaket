# Components Rules

- Reuse existing shared components before creating new ones.
- Keep concerns separated: shared layout in `components/shared/layout/*`, branding in `components/shared/branding/*`, and icons in `components/shared/icons/*`.
- For page scaffolding, prefer `PageShell`, `SiteHeader`, and `SiteFooter`; avoid duplicating header/footer markup in pages.
- Keep navigation/footer data sourced from `lib/content/navigation.ts` and `lib/content/footer.ts`.
- Use theme tokens and semantic/tone utilities from `lib/theme/semantic.ts` and `lib/theme/tailwind.ts`; avoid ad-hoc/raw color literals.
- Use typography utilities from `app/globals.css` (`typo-*`) instead of repeated inline typography classes.
- Keep marketing and UI components composable and data-driven via props.
- Reuse icon primitives and existing icon sets; keep sizing/stroke behavior consistent and apply colors at usage sites.
- Default to server-safe components; add client boundaries only when interactivity requires it.
- Keep component APIs small and pragmatic; avoid unnecessary abstraction.
