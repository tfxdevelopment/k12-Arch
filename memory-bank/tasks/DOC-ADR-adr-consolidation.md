# [DOC-ADR] - ADR consolidation + redirect stubs

**Status:** In Progress  
**Added:** 2026-01-20  
**Updated:** 2026-01-20

## Original Request
Consolidate ADRs into the canonical `wiki/adr/` folder and preserve legacy paths via redirect stubs so no links break.

## Thought Process
- Canonical ADRs must live in `wiki/adr/` per governance.
- Legacy copies under `wiki/newdocs-to-integrate/adr/` should be replaced with stubs pointing to canonical ADRs to avoid broken links.
- After moves, a health report should validate no new broken links.

## Implementation Plan
- Copy/move ADR content from staging locations into `wiki/adr/` as the single source of truth.
- Replace legacy files with short stubs that point to the canonical ADRs.
- Verify numbering/filenames are consistent and deduplicate if needed.
- Run documentation health checks to confirm no broken links.

## Progress Tracking

**Overall Status:** In Progress - 40%

### Subtasks
| ID | Description | Status | Updated | Notes |
|----|-------------|--------|---------|-------|
| 1.1 | Identify all ADR files outside `wiki/adr/` | Complete | 2026-01-20 | Located under `wiki/newdocs-to-integrate/adr/` |
| 1.2 | Create canonical copies in `wiki/adr/` | Complete | 2026-01-20 | ADR-002..006 copied |
| 1.3 | Replace legacy files with redirect stubs | In Progress | 2026-01-20 | ADR-002..006 stubbed |
| 1.4 | Run health report to confirm no broken links | Not Started |  |  |
| 1.5 | Update tasks index/progress | Not Started |  |  |

## Progress Log
### 2026-01-20
- Copied ADR-002..006 into `wiki/adr/` and replaced legacy files with stubs in `wiki/newdocs-to-integrate/adr/`.
- Updated task index to reflect active ADR consolidation work.
