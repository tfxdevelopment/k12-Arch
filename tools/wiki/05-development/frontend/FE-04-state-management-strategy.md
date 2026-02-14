# FE-04: State Management Strategy

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
- **Checklist ID**: FE-04
- **Why incomplete**: The repo documents high-level intent (RxJS services + signals) but not the canonical, enforced implementation from the frontend codebase.

## Decision Summary
Primary state management approach (documented):
- **RxJS services** are used for shared state management.
- Angular **signals** are referenced as part of the state layer in the C4 component diagram.

Usage guidance:
- Prefer **local component state** for transient UI state (expanded panels, local filters, in-progress form state).
- Prefer **shared service state** when multiple components/routes need consistent state (current user context, reference data, cached lookups).

## Patterns
Documented layering:
- State is owned by services (RxJS `BehaviorSubject` / streams) and exposed to components.
- Side effects (HTTP) are performed by shared services via an API service, with interceptors applied.

Recommended conventions (guidance until source is confirmed):
- Keep state normalized where possible; store IDs and separate dictionaries for large collections.
- Centralize retries/timeouts at the service layer (not in components).
- Surface user-facing errors consistently (shared error handling in an HTTP interceptor).

## Performance Considerations
Documented performance lever:
- Use service-level caching and reuse streams to avoid duplicate HTTP calls.

Not documented in this repo:
- Change detection strategy (Default vs OnPush) and selector/memoization conventions.

## Open Questions / TODO
- Add Confluence source metadata (space/page/url/owner).
- Confirm whether signals are used in production code or only as a planned pattern.
- Document any standard caching/retry/error-handling utilities from the shared library once source is available.
