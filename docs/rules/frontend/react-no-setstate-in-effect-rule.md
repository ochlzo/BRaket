# Rule: Avoid `setState` Inside `useEffect` For Initial/Derived Values

## Purpose
Prevent `react-hooks/set-state-in-effect` errors and cascading renders.

## Do Not
- Do not call `setState(...)` synchronously inside `useEffect` just to initialize values from:
  - `localStorage` / `sessionStorage`
  - props-derived values
  - values that can be computed during render

## Do Instead
- Use render-time derivation for computed values.
- Use lazy state initialization for one-time browser reads.
- Use `useSyncExternalStore` when reading client storage/session state that should be SSR-safe.

## Approved Patterns

### 1) SSR-safe session/localStorage read
```tsx
const isLoggedIn = useSyncExternalStore(
  () => () => {},
  () => !!localStorage.getItem("braket_session"),
  () => false,
);
```

### 2) Lazy init state (no effect)
```tsx
const [isVerified, setIsVerified] = useState(() => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("verified");
});
```

### 3) Derive from existing state/props directly
```tsx
const isClient = role === "client";
```

## Allowed `useEffect`
- Subscriptions and cleanup (`addEventListener`, sockets, observers).
- Syncing React state to external systems.
- Async side effects (fetch, analytics, timers) with cleanup/guards.

## PR Checklist
- No `setState` used only for initial value hydration in `useEffect`.
- If storage/session is used, prefer `useSyncExternalStore` or lazy initializer.
- Keep fallback values SSR-safe.

