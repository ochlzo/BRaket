# Rule: Use `next/image` Instead Of `<img>`

## Purpose
Prevent `@next/next/no-img-element` warnings and improve image performance (LCP and bandwidth).

## Do Not
- Do not use raw `<img>` in Next.js app components/pages.

## Do Instead
- Use `Image` from `next/image`.
- Always provide `alt`.
- Use explicit sizing (`width`/`height`) or `fill` with a sized parent.

## Approved Pattern
```tsx
import Image from "next/image";

<Image
  src="/images/avatar_john.png"
  alt="Profile"
  width={40}
  height={40}
  className="h-10 w-10 rounded-full object-cover"
/>
```

## PR Checklist
- No new raw `<img>` in Next.js UI files.
- `next/image` is used with valid sizing and `alt`.
