# Rule: Theme Conventions And Token Usage

## Purpose
Keep styling consistent, maintainable, and easy to refactor by enforcing a single token-driven theme system.

## Source Of Truth
- Theme CSS variables are defined in `app/globals.css` under `:root` (and `.dark` when needed).
- Token access in TypeScript must go through `lib/theme/palette.ts` (`paletteVars`).
- Reusable class compositions belong in:
  - `lib/theme/semantic.ts` for semantic UI classes (text, buttons, borders, panels)
  - `lib/theme/tailwind.ts` for tone-based utility groups

## Do
- Use CSS variables via Tailwind arbitrary values:
  - `text-[color:var(--ink-body)]`
  - `bg-[color:var(--surface)]`
  - `border-[color:var(--line-strong)]`
  - `shadow-[var(--shadow-panel-elevated)]`
- Prefer `semantic` and `toneStyles` utilities before writing new ad-hoc class strings.
- Add new colors/shadows as CSS variables in `app/globals.css`, then expose them in `paletteVars`.
- Reuse shared shadow tokens (for example `--shadow-*`) instead of inline `rgba(...)` shadow literals.
- Keep gradients token-based whenever possible using `var(--token-name)`.

## Do Not
- Do not hardcode hex colors in component class strings.
- Do not hardcode `rgba(...)` values in `shadow-[...]` classes.
- Do not reference `var(--token-name)` directly in TS theme utilities when a `paletteVars` entry exists.
- Do not introduce one-off style tokens in random files; define them in `app/globals.css` first.

## Allowed Exceptions
- Brand-locked SVG fills (for example official provider logos like Google multicolor marks).
- Truly one-off visual experiments only when explicitly approved, and they should be converted to tokens before merge.

## Approved Pattern
```tsx
import { semantic } from "@/lib/theme/semantic";
import { toneStyles } from "@/lib/theme/tailwind";

<button className={semantic.button.brandOrange}>Sign Up</button>
<p className={semantic.text.body}>Body text</p>
<div className={`${toneStyles.sky.card} shadow-[var(--shadow-panel-elevated)]`} />
```

## PR Checklist
- No new hardcoded hex colors in app/component class strings.
- No new `shadow-[...rgba(...)]` class literals.
- New token values are added to `app/globals.css` and mapped in `lib/theme/palette.ts`.
- Shared semantic/tone utilities are used where applicable instead of repeating raw classes.
