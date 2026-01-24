# FE-05: Routing Strategy

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
- **Checklist ID**: FE-05
- **Why incomplete**: This repo documents routing entry points and shared guard concepts, but detailed route conventions and lazy-loading rules require validation against the frontend code.

## Overview
Describe route structure, feature module boundaries (if applicable), and navigation patterns.

What is documented:
- Each app has independent routing via `app.routes.ts`.
- Guards are part of the shared library and are used for route protection and auth checks.

## Standards
### URL conventions
Not explicitly documented in this repo. Record conventions once confirmed from `app.routes.ts` sources.

### Lazy loading
Not explicitly documented in this repo. The `features/` folder structure suggests feature-area grouping; confirm whether lazy loading is used per feature.

### Guard usage (documented concepts)
- Authentication/authorization is handled via MSAL (Entra ID B2C).
- Shared guards (examples from diagrams/docs):
	- Auth guard
	- Role guard
	- Unsaved changes guard

## Error/Not Found Handling
Not explicitly documented in this repo.

Guidance until confirmed:
- Provide a catch-all route that renders a Not Found view.
- Ensure deep links work with the hosting platform (Static Web Apps route rewrites), and document the corresponding `staticwebapp.config.json` rules in the deployment docs.

## Open Questions / TODO
- Add Confluence source metadata (space/page/url/owner).
- Confirm per-app route entry points and route tree organization from the actual `app.routes.ts`.
- Document lazy-loading conventions (if used).
- Link to Static Web Apps routing configuration once captured in deployment docs.
