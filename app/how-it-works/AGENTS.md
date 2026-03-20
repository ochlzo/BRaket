# How-It-Works Route UI Rules

- Build route UI using shared components (`PageShell`, `ProcessStepCard`, `CtaBanner`) instead of route-local duplicates.
- Use centralized color/tone tokens from `theme/*` and CSS variables from `app/globals.css`.
- Apply reusable typography utility classes (`typo-*`) for all text levels.
- Keep component usage declarative and data-driven via arrays/props.
