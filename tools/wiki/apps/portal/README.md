# K12 Developer Portal (Custom IDP UI)

This is the **custom Internal Developer Portal UI** (NOT Backstage).

**Stack**: Nuxt 4 + Nuxt UI + Tailwind

## Goals

- Provide a single internal entry point for:
  - Architecture wiki content
  - Tooling links (observability, pipelines, docs API)
  - Runbooks / quick references
- Work well in a **static hosting** model (Azure Static Web Apps), but support local dev with Aspire.

## Local Development

```bash
cd tools/wiki/apps/portal
pnpm install
pnpm dev
```

Default: http://localhost:3000

## Production Build

```bash
pnpm build
pnpm preview
```

## Planned Integrations

### Docs API (Aspire)

The repo includes an Aspire-orchestrated Docs API at `src/K12.Docs.Api`.

- List docs: `GET /api/docs/list`
- Fetch doc by path: `GET /api/docs/{*path}`

Portal will consume these endpoints to render wiki content and enable search/navigation.

### Aspire Orchestration

Current Aspire AppHost is in `src/K12.AppHost/Program.cs` and orchestrates:

- APIM emulator
- Docs API
- Docs Site (Angular/Analog)

We will either:

1) add this Portal as an additional `AddNpmApp(...)` resource in the AppHost, or
2) keep it standalone and only integrate via environment variables.

## Next Work Items

- Replace starter landing page with K12 portal home
- Add navigation: Docs, Architecture, ADRs, Tools
- Add a Docs API client + caching
- Add search (Pagefind / client-side)
- Add auth (if needed) aligned with internal access model
