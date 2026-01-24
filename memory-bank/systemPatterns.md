# System Patterns

## Documentation Structure
- `wiki/` is the primary knowledge base.
- ADRs live under `wiki/adr/` (canonical source of truth).
- C4 diagrams live under `wiki/02-architecture/c4-diagrams/`.

## ADR Governance Pattern
- Canonical ADRs are maintained in `wiki/adr/`.
- Legacy ADR locations are preserved via lightweight redirect stubs to avoid breaking existing links.

## Frontend Pattern (as documented)
- Nx monorepo containing multiple Angular apps (Admin, Enrollment, Providers, Schools) and a shared library.
- Shared library provides reusable components, services, guards, interceptors, models/enums.

## Evidence Sources
- `wiki/adr/ADR-004-nx-monorepo-frontend.md`
- `wiki/02-architecture/c4-diagrams/07-frontend-component-diagram.md`
- `wiki/wikifull.md` (aggregated content)
