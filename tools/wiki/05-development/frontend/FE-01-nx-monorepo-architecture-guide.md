# FE-01: Nx Monorepo Architecture Guide

## Confluence Source
| Field | Value |
|---|---|
| Confluence Space | TBD |
| Confluence Page | TBD |
| Confluence URL | TBD |
| Last Reviewed | TBD |
| Owner | TBD |

## Status and Coverage
- **Status**: Draft (Incomplete)
- **Checklist ID**: FE-01
- **Why incomplete**: Confluence metadata and repo-internal ownership are not captured in this repository; the technical architecture below is based on existing ADRs and diagrams.

## Overview
The frontend is structured as an **Nx monorepo** containing **four Angular applications** plus a **shared library** used by all apps.

Key goals of this approach:
- Maximize code reuse across portals (auth, UI, services)
- Enable atomic changes across shared code and consuming apps
- Improve build and CI performance via Nx caching and affected builds

This documentation is based on:
- ADR: `wiki/adr/ADR-004-nx-monorepo-frontend.md`
- C4: `wiki/02-architecture/c4-diagrams/07-frontend-component-diagram.md`
- Aggregate: `wiki/wikifull.md`

## Architecture
### Workspace Structure
The frontend workspace (documented as `k12-web-enrollment/`) is organized as:

- **Apps** (each deployed independently):
	- `admin` (port **4200**) — administrative portal
	- `enrollment` (port **4300**) — household enrollment
	- `providers` (port **4500**) — provider management
	- `schools` (port **4600**) — school management
- **Shared library**: `projects/shared/` (or documented as `projects/shared/src/lib/...`)
	- Shared UI components
	- Shared services (HTTP + state)
	- Guards, interceptors
	- Shared models/enums

Key config files (documented):
- `nx.json` — Nx configuration including cacheable operations and default base branch
- `project.json` (per app/lib) — targets (build/test/lint) and dependency graph metadata
- `tsconfig.base.json` — shared TypeScript configuration

Tooling commands shown in existing docs:
- `nx build <app>` / `nx test <app>`
- `nx graph` for dependency visualization

### Boundaries and Dependency Rules
This repo documents the intent to enforce **clean module boundaries** using Nx’s dependency graph and constraints.

What’s explicitly documented:
- The shared library is the central reuse point for cross-app code.
- CI/CD is intended to optimize builds using Nx affected commands.

What is not present in this repo:
- The actual `nx.json`/eslint boundary rules (`nx/enforce-module-boundaries`) from the frontend code repo.

Until the frontend repo is available here, treat the following as guidance, not verified enforcement:
- Apps depend on shared libraries.
- Shared code should avoid depending on app-specific code.

## Developer Workflow
### First-time setup (documented workflow)
```bash
cd k12-web-enrollment
npm install

# CRITICAL: build shared library before running any app
npm run build:shared

# Start specific application
npm run start:admin      # https://localhost:4200
npm run start:enrollment # http://localhost:4300
npm run start:providers  # http://localhost:4500
npm run start:schools    # http://localhost:4600
```

### Shared library change workflow (documented)
Any change to the shared library requires:
1. Stop dev server
2. Rebuild shared: `npm run build:shared`
3. Restart the dev server for the app

### Nx “affected” usage (documented for CI/CD)
```bash
# Only build affected projects
npx nx affected:build --base=origin/main --head=HEAD --parallel=3
```

## References (Not a Requirement Substitute)
- ADR-004: Nx Monorepo for Frontend Applications: `wiki/adr/ADR-004-nx-monorepo-frontend.md`
- C4 Frontend Component Diagram: `wiki/02-architecture/c4-diagrams/07-frontend-component-diagram.md`
- Aggregated wiki content: `wiki/wikifull.md`

## Open Questions / TODO
- Add Confluence source metadata (space/page/url/owner).
- Confirm the authoritative workspace layout (`apps/` vs `projects/`) from the actual `k12-web-enrollment` repo.
- Capture the real module-boundary enforcement rules (eslint + Nx tags) once the frontend repo is accessible.
