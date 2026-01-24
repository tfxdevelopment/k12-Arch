# [DOC-LINKS] - Fix broken wiki links + normalize doc paths

**Status:** In Progress  
**Added:** 2026-01-20  
**Updated:** 2026-01-20

## Original Request
Repair broken links and normalize relative paths across `wiki/` markdown files to keep navigation intact.

## Thought Process
- Use the health report to prioritize broken links.
- Fix paths without introducing cross-repo dependencies.
- Preserve existing structure and avoid regressions by batching changes.

## Implementation Plan
- Review `wiki/DOCUMENTATION-HEALTH-REPORT.md` to identify current broken links.
- Fix broken links in priority batches (navigation, security, architecture, ADRs, rules, proposed architecture stubs).
- Re-run the health report after each batch to confirm fixes and catch regressions.
- Track progress and remaining issues.

## Progress Tracking

**Overall Status:** In Progress - 50%

### Subtasks
| ID | Description | Status | Updated | Notes |
|----|-------------|--------|---------|-------|
| 1.1 | Analyze current health report | Complete | 2026-01-20 | Baseline taken from previous run |
| 1.2 | Fix navigation links (README, TOC) | Complete | 2026-01-20 | Batch 1 done |
| 1.3 | Fix security doc links (SEC-01..04) | Complete | 2026-01-20 | Batch 2 done |
| 1.4 | Fix architecture deep links | Complete | 2026-01-20 | Batch 3 done |
| 1.5 | Fix ADR-PROP links | Complete | 2026-01-20 | Batch 4 done |
| 1.6 | Fix business rules & API links | Complete | 2026-01-20 | Batch 5 done |
| 1.7 | Create placeholders for proposed architecture | Complete | 2026-01-20 | Batch 6 done |
| 1.8 | Re-run health report post-consolidation | Not Started |  | Pending after modernization fold |

## Progress Log
### 2026-01-20
- Recorded completion of link-fix batches 1–6; pending rerun of health report after consolidation moves.
