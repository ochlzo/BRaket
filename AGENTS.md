# AGENTS.md

## Framework-specific warning

This is not the stock Next.js Codex may assume from prior training.
This project may use newer or breaking conventions, APIs, and file structure.
Before writing or editing Next.js code, read the relevant local documentation in `node_modules/next/dist/docs/` when available and heed deprecation notices.

## Mission

- Understand the repo before making changes.
- Prefer explaining architecture and recent activity before proposing edits when the task is exploratory.
- Reuse existing patterns, utilities, and shared components before creating new ones.

## Operating rules

- Start by identifying the active app entry points, package boundaries, and the current branch.
- Prefer reading only the files needed for the current task; avoid loading large generated files, build output, coverage, snapshots, dist, vendor, and lockfile churn unless explicitly relevant.
- Treat `README.md`, workspace manifests, routing config, app bootstrap files, API entry points, shared libraries, and test setup as high-signal starting points.
- When summarizing the project, separate stable architecture from recent branch-specific work.
- When recent work matters, inspect recent commits and changed files before drawing conclusions.
- Call out uncertainty explicitly when the repository contains multiple apps, deprecated directories, or conflicting patterns.

## Project map checklist

When building context, look for and summarize:

- package manager and workspace layout
- app entry points and routing
- shared UI/component libraries
- state management and data fetching approach
- API/client boundaries
- database, migrations, or schema locations
- test, lint, build, and typecheck commands
- environment files and feature-flag conventions
- deployment/config directories

## Preferred evidence sources

1. `AGENTS.md` in the repo root and current subdierctory
2. `README.md` and docs under `docs/`
3. root manifests such as `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `tsconfig.json`, `vite.config.*`, `next.config.*`
4. app bootstrap and route files
5. recent `git log`, `git diff`, and changed-file inspection

## Recent-change workflow

When asked to rebuild context for a fresh session:

1. Identify the current branch and compare it to the default branch when possible.
2. Review the last 10–20 commits relevant to the current branch.
3. Group changed files into domains such as UI, API, data, infra, tests, and config.
4. Read only the highest-signal files from each domain.
5. Produce a compact briefing with:
   - what the project is
   - how it is structured
   - what changed recently
   - what appears in progress now
   - likely next steps
   - risks, unknowns, and commands to verify assumptions

## Output contract for context briefings

Use this structure unless the caller asks for something else:

1. One-paragraph repo summary
2. Architecture map
3. Recent branch activity
4. Active work areas
5. Important files to read next
6. Risks / unknowns
7. Verification commands

## Constraints

- Do not claim a module is authoritative until you verify it is referenced by the current app/runtime.
- Do not over-index on a single recent commit; look for commit clusters and repeated file touch points.
- Do not rewrite or refactor during a context-only task unless explicitly asked.
- Prefer concise bullet points and exact file paths.
