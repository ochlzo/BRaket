# AGENTS.md

## Init Guide (Read First)

Before starting any task, always check project rules in this order:

1. `docs/rules/`
2. Relevant subfolder inside rules (by task domain)
3. Then inspect code/files needed for implementation

Do not start coding until applicable rule docs are reviewed.

## Current Rule Set

- Auth rules: `docs/rules/auth/`
- Frontend rules: `docs/rules/frontend/`
- Architecture rules: `docs/rules/architecture/`

## Execution Expectations

- Follow rule docs as source-of-truth for implementation constraints.
- Reuse existing project patterns before introducing new ones.
- Keep edits minimal, targeted, and aligned with the applicable rules.
- When auth flow behavior changes, update `docs/rules/auth/` in the same task.
- If a rule is missing for a task, proceed with best judgment and keep changes reversible.

## STRICT GLOBAL RULE

- When coding, AS MUCH AS POSSIBLE - KEEP THE FILE UNDER 300 LINES OF CODE.
