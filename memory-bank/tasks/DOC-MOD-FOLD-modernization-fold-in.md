# [DOC-MOD-FOLD] - Fold modernization WIP into main architecture docs and archive superseded drafts

**Status:** In Progress  
**Added:** 2026-01-20  
**Updated:** 2026-01-24

## Original Request
Move modernization WIP documents into the main architecture sections, archive superseded drafts, and keep references unbroken via stubs or redirects.

## Thought Process
- Modernization content should live alongside current/proposed architecture documentation (02-architecture and 09-proposed-architecture).
- Superseded drafts should be retained in `wiki/archive/` rather than deleted.
- Redirect stubs may be needed where links point to old modernization locations.

## Implementation Plan
- Inventory modernization docs under `wiki/modernization/` and `wiki/newdocs-to-integrate/`.
- Decide target destinations: current vs proposed architecture sections.
- Move files and add redirect stubs where necessary to preserve links.
- Update navigation/TOC references to new locations.
- Archive superseded drafts in `wiki/archive/` with a short index.

## Progress Tracking

**Overall Status:** In Progress - 50%

### Subtasks
| ID | Description | Status | Updated | Notes |
|----|-------------|--------|---------|-------|
| 1.1 | Inventory modernization and newdocs-to-integrate materials | Complete | 2026-01-24 | Inventory gathered under `wiki/02-architecture/cloud-native/`: background-azure-architecture-framework.md, background-modernization-strategy-start.md, cloud-native-architecture.md, pointer-*.md, references/ |
| 1.2 | Map destinations (02-architecture vs 09-proposed-architecture) | Complete | 2026-01-24 | Content already resides in current architecture (`02-architecture/cloud-native/`); no relocation to `09-proposed-architecture` needed. |
| 1.3 | Move files and add redirect stubs | Not Needed | 2026-01-24 | No moves required; canonical locations already under 02-architecture. |
| 1.4 | Update TOC/navigation links | Not Needed | 2026-01-24 | Paths remain unchanged. |
| 1.5 | Archive superseded drafts in `wiki/archive/` | Not Needed | 2026-01-24 | No superseded drafts identified. |
| 1.6 | Re-run health report to validate links | Not Started |  |  |

## Progress Log
### 2026-01-24
- Confirmed `wiki/newdocs-to-integrate` folder is absent; modernization content to fold appears under `wiki/02-architecture/cloud-native/`.
- Inventoried cloud-native files for relocation: background-azure-architecture-framework.md, background-modernization-strategy-start.md, cloud-native-architecture.md, pointer-async-event-flows-dapr.md, pointer-container-diagram.md, pointer-devops-iac-cicd.md, pointer-hybrid-data-strategy.md, pointer-resiliency-observability.md, references/.
- Determined no relocation is required; content already in the current architecture section. Remaining step: rerun wiki health report after confirming no moves.
