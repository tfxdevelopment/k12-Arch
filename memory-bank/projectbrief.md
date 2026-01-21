# Project Brief

## Project
K12 MyPortal Architecture & Documentation Repository.

## Goals
- Maintain a navigable architecture knowledge base under `wiki/` (C4, ADRs, standards, dev, ops, deployment).
- Keep documentation actionable and grounded in repo evidence (configs, ADRs, diagrams), avoiding invented details.
- Track and reduce documentation incompleteness (`wiki/DOCUMENTATION-INCOMPLETENESS-SCAN.md`) and overall quality (`wiki/DOCUMENTATION-HEALTH-REPORT.md`).

## Current Focus
Consolidate and normalize architecture/dev documentation:
- Canonical ADRs in `wiki/adr/` (including ADR-PROP)
- Keep legacy ADR paths working via redirect stubs
- Remove/update documentation tech debt (broken links, non-portable absolute paths)
- Keep `wiki/DOCUMENTATION-HEALTH-REPORT.md` and `wiki/DOCUMENTATION-INCOMPLETENESS-SCAN.md` aligned with repo state

## Constraints
- Application source repos (e.g., `k12-web-enrollment`) are referenced but not vendored here; documentation must clearly mark unknowns.
- Target stack guidance may mention future versions (e.g., .NET 10 / Aspire 13.x) but repo-observed versions must be recorded separately.
