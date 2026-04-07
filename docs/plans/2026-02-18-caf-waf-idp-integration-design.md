# CAF/WAF IDP Integration Design

Date: 2026-02-18
Owner: K12 Architecture
Status: Approved

## Goal

Create a demo-ready Internal Developer Platform (IDP) that presents CAF and WAF documentation through a Nuxt shell with integrated views for Astro docs, Scalar API reference, and Storybook-style component documentation.

## Scope

1. Scaffold `tools/wiki/apps/caf-waf` as the CAF/WAF content orchestration project.
2. Replace placeholder WA and CAF documents with first drafts.
3. Integrate Astro docs (`tools/wiki/apps/docs`) with real WA/CAF content.
4. Upgrade Nuxt portal (`tools/wiki/apps/portal`) to an IDP shell with integrated proxy views.
5. Add Scalar and Storybook demo surfaces and route them through Nuxt reverse proxy endpoints.

## Architecture

### Shell and integrated surfaces

- Nuxt portal is the single host for demo navigation and layout.
- Integrated endpoints through Nuxt server routes:
  - `/_docs/**` -> Astro docs app
  - `/_api-reference/**` -> Scalar app
  - `/_storybook/**` -> Storybook demo app
- User-facing portal routes:
  - `/docs/**`
  - `/api-reference`
  - `/storybook`
  - `/platform/tools`
  - `/platform/logs`

### Content and generation flow

- Canonical authored files remain in:
  - `tools/wiki/09-proposed-architecture/05-well-architected`
  - `tools/wiki/09-proposed-architecture/06-cloud-adoption`
- `caf-waf` scripts generate:
  - Astro-consumable docs pages
  - Portal navigation JSON
  - Legacy-to-new WA migration matrix

## Runtime model

Default dev ports:

- Nuxt portal: `http://localhost:3000`
- Astro docs: `http://localhost:4321`
- Scalar: `http://localhost:5050`
- Storybook demo: `http://localhost:6006`

Nuxt runtime config resolves each upstream and proxies requests from the shell host.

## Error handling

- If an upstream is unavailable, integrated pages continue rendering shell UI and present fallback messaging.
- Generation scripts fail fast with clear missing-file diagnostics.
- Migration matrix generation reports legacy coverage status.

## Testing and verification

1. Run CAF/WAF generation scripts and verify output files are created.
2. Start all apps through one command from the portal app.
3. Validate integrated routes return content:
   - `/docs`
   - `/api-reference`
   - `/storybook`
4. Validate WA and CAF files are no longer placeholders.

## Demo flow

1. Open portal home and show CAF/WAF progress cards.
2. Open integrated docs and navigate WAF and CAF pages.
3. Open integrated API reference (Scalar).
4. Open integrated component catalog (Storybook demo surface).
5. Show tools/logs pages in portal shell.
