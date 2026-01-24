# Active Context

## Current Focus
Documentation consolidation and ADR canonicalization

## Scope & Boundaries
- **In scope**: `wiki/` markdown files (ADRs, modernization docs, proposed/current architecture) and redirect stubs
- **Out of scope**: Application source (`src/`), infra (`infra/terraform`), cross-repo assets
- **Current metrics** (2026-01-20 reference): ~146 wiki markdown files; broken-link/incompleteness counts to be refreshed after consolidation

## Current Work
- ADR migration: Canonical copies live in `wiki/adr/`; legacy `wiki/newdocs-to-integrate/adr/*` now stubs pointing to canonical ADR-002..006.
- Modernization WIP folding: Need to merge/relocate modernization docs into main architecture sets (02-architecture and 09-proposed-architecture) and archive superseded drafts.
- Redirect hygiene: Ensure stubs avoid broken links after moves; rerun health report once moves complete.

## Recent Decisions
- Keep legacy ADR paths via stub files to prevent broken links.
- Use archive location for superseded modernization drafts instead of deletion (per option A).

## Immediate Next Steps
1) Move/merge modernization WIP docs into main architecture sections; place superseded copies under `wiki/archive/`.
2) Rerun `scripts/generate-wiki-health-report.ps1` to catch new breaks after moves.
3) Update tasks index and progress once consolidation/archiving steps complete.
