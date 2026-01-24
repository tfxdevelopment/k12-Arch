# FE-03: Component Architecture Patterns

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
- **Checklist ID**: FE-03
- **Why incomplete**: This repo contains architectural intent (C4 + ADRs) but not the full frontend source; conventions should be validated against the `k12-web-enrollment` codebase.

## Goals
- Consistent component layering (pages → features → UI components)
- Maintainable state and side effects
- Testable components and services

## Recommended Patterns
### Smart vs Presentational Components
The documented architecture follows a layered approach:
- **Smart (container) components** orchestrate data loading, state, and side effects.
- **Presentational components** focus on rendering and user interaction, and accept inputs/emit outputs.

This is reflected in the C4 component diagram’s separation of routing/components/state/services.

### Reusable UI Components
The platform uses **Angular Material** plus **PrimeNG** (documented) and builds reusable UI in the shared library.

Documented shared UI component categories:
- Layout: app shell, header, sidebar, breadcrumb, footer
- Forms: field wrappers, date picker, file upload, address/phone inputs
- Tables: data table, action column, status chips, export actions
- Dialogs: confirm/alert/form/view dialogs

### API/Data Access
Documented pattern:
- API calls are made via shared services (HTTP layer) and passed through HTTP interceptors.
- Authentication is handled using MSAL (Entra ID B2C), typically via guards and interceptors.

Note: concrete service/facade naming and folder conventions require validation in the frontend repo.

## Testing Guidance
What is documented here:
- Frontend uses **Jest**.
- Tests are `*.spec.ts` files alongside components.
- Per-project test execution via Nx is used, e.g.:
	- `nx test admin`
	- `nx test providers`

Not documented in this repo:
- E2E tooling choice and coverage expectations (needs source confirmation).

## References (Not a Requirement Substitute)
- [wiki/02-architecture/c4-diagrams/07-frontend-component-diagram.md](../02-architecture/c4-diagrams/07-frontend-component-diagram.md)

## Open Questions / TODO
- Add Confluence source metadata (space/page/url/owner).
- Confirm actual folder conventions (e.g., `features/`, `components/`, `shared/`) in `k12-web-enrollment`.
- Define E2E strategy (tooling + coverage) when the frontend repo/pipeline is available.
