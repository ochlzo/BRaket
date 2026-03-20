# Marketing Component Rules

- Reuse existing cards/CTA/search/filter components before creating new variants.
- Use tone utilities from `theme/tailwind.ts` and semantic utilities from `theme/semantic.ts`.
- Keep colors tokenized via CSS variables; do not add raw color literals unless there is no existing token.
- Use typography utility classes from `app/globals.css` (`typo-*`) for all text hierarchy levels.
- Keep components composable and data-driven through props.
