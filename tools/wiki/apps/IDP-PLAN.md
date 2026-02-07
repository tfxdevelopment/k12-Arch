# Custom Internal Developer Portal (IDP) Plan

This folder contains early scaffolding for a **custom Internal Developer Portal**.

## Why custom (not Backstage)

This repo includes a Backstage scaffold under `src/cfi-k12/k12-idp/`, but the current direction is a **custom portal** aligned with:

- .NET Aspire for local orchestration and deployment topology
- Lightweight frontend apps (Astro / Nuxt) for static hosting + fast iteration
- A small documentation API (optional) for indexing, metadata extraction, and search

## Current Components

### Aspire Orchestration

- `src/K12.AppHost/Program.cs`
  - Dapr sidecar
  - APIM emulator container
  - Docs API (`src/K12.Docs.Api`)
  - Docs Site (`docs-site/` - Angular + Nx + AnalogJS)

### Docs API

- `src/K12.Docs.Api/Program.cs`
  - `GET /api/docs/list`
  - `GET /api/docs/{*path}` (renders markdown to HTML via Markdig)

### Portal UI (Nuxt)

- `tools/wiki/apps/portal`
  - Nuxt 4 + Nuxt UI
  - Currently template; needs K12 navigation + integrations

### Docs Site (Astro)

- `tools/wiki/apps/docs`
  - Astro 5 + Starlight
  - Currently template; needs real content ingestion

## Open Design Decisions

1. **Docs frontend**: keep `docs-site/` (Angular/Analog) vs replace with Astro Starlight vs Nuxt Content.
2. **Content source of truth**: `wiki/` vs generated/curated subset.
3. **Search**: Pagefind (static) vs API-backed indexing.
4. **Auth**: required or not for internal use; if yes, align with org identity.
5. **Deployment**: Azure Static Web Apps vs Container Apps (if server-side needed).

## Next Steps (Suggested)

1. Create a single “Portal Architecture” doc in `wiki/` and link it from `wiki/TABLE_OF_CONTENTS.md`.
2. Decide which docs frontend is the long-term choice and archive/label the others.
3. If Portal+Docs are the target, update `src/K12.AppHost/Program.cs` to include them as `AddNpmApp(...)` resources.
4. Define a minimal catalog of “Dev/Ops tools” links to surface in the portal (dashboards, pipelines, runbooks).
