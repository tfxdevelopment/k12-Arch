# FE-02: Shared Library Documentation

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
- **Checklist ID**: FE-02
- **Why incomplete**: This repository documents the shared library shape and intent, but does not include the actual `k12-web-enrollment` codebase for a complete inventory and ownership mapping.

## Purpose
Define how shared frontend libraries are organized, versioned (if applicable), and consumed.

The frontend uses a **single shared library** (documented as `projects/shared/`) to centralize cross-app code used by:
- Admin (4200)
- Enrollment (4300)
- Providers (4500)
- Schools (4600)

## Library Taxonomy
Based on the documented structure, the shared library is organized around the following categories:

- **UI components**: reusable layout/forms/tables/dialogs
- **Services**: API clients, auth helpers, real-time (SignalR), and state helpers
- **Guards**: authentication/authorization guards (MSAL/roles) and UX guards (e.g., unsaved changes)
- **Interceptors**: cross-cutting HTTP concerns (auth, error handling, loading indicators)
- **Models/Enums**: shared TypeScript types and enums

Documented example structure:
```
projects/shared/
	components/
	services/
	guards/
	interceptors/
	models/
	enums/
	public-api.ts
```

## Ownership and Change Process
This repo does not currently contain code ownership metadata for the frontend repository.

Recommended minimum process (until ownership is formalized):
- Shared library changes should be treated as cross-app changes and reviewed by a frontend owner.
- Prefer small, backwards-compatible changes.
- When breaking changes are needed, update consuming apps in the same change set (monorepo advantage).

Deprecation strategy (guidance):
- Mark deprecated exports in the shared library and document migration steps.
- Remove only after all consuming apps have migrated.

## References (Not a Requirement Substitute)
- [wiki/05-development/frontend/README.md](README.md)

## Open Questions / TODO
- Add Confluence source metadata (space/page/url/owner).
- Add a concrete inventory once `k12-web-enrollment` is available in this repo (or link to its authoritative docs).
- Add codeowner mapping for shared library areas (components/services/auth).
