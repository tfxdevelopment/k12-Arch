# Documentation Incompleteness Scan

**Last updated:** 2026-01-20

**Purpose:** Provide a lightweight, repeatable inventory of wiki pages that contain placeholder markers.

**Heuristic (current):** A document is *potentially incomplete* if it contains one or more of:
- `TBD`
- `TODO`
- `FIXME`
- `[K12-XXX]` / `[K12-XXXX]` placeholders

> Note: Many of the checklist-driven standalone docs were intentionally created as draft stubs and will naturally appear here.

## Results (by marker count)

| Path | Marker Count | Category |
|---|---:|---|
| 02-architecture/data/DATA-03-data-retention-policies.md | 14 | Draft stub (checklist) |
| 02-architecture/backend/BE-04-external-service-integration-patterns.md | 13 | Draft stub (checklist) |
| 02-architecture/data/DATA-01-data-flow-diagrams.md | 13 | Draft stub (checklist) |
| 02-architecture/data/DATA-04-backup-and-recovery.md | 13 | Draft stub (checklist) |
| 07-deployment/DEPLOY-04-infrastructure-monitoring.md | 13 | Draft stub (checklist) |
| 02-architecture/backend/BE-01-layered-architecture-deep-dive.md | 12 | Draft stub (checklist) |
| 02-architecture/backend/BE-02-api-design-patterns.md | 12 | Draft stub (checklist) |
| 02-architecture/data/DATA-02-adls-gen2-structure.md | 12 | Draft stub (checklist) |
| 06-operations/OPS-04-cutover-planning.md | 12 | Draft stub (checklist) |
| 07-deployment/DEPLOY-01-environment-topology.md | 12 | Draft stub (checklist) |
| 07-deployment/DEPLOY-03-cicd-pipeline-architecture.md | 12 | Draft stub (checklist) |
| 01-project-overview/roadmap/ROADMAP-01-current-sprint-features.md | 11 | Draft stub (checklist) |
| 02-architecture/backend/BE-03-data-access-patterns.md | 11 | Draft stub (checklist) |
| 02-architecture/c4-diagrams/level-4/C4-07-enrollment-process-sequence-diagram.md | 11 | Draft stub (checklist) |
| 06-operations/OPS-02-rbac-guide.md | 11 | Draft stub (checklist) |
| 06-operations/OPS-03-test-user-account-management.md | 11 | Draft stub (checklist) |
| 07-deployment/DEPLOY-02-network-architecture.md | 11 | Draft stub (checklist) |
| 01-project-overview/roadmap/ROADMAP-02-feature-roadmap.md | 10 | Draft stub (checklist) |
| 02-architecture/c4-diagrams/level-4/C4-08-payment-process-sequence-diagram.md | 10 | Draft stub (checklist) |
| 04-standards/STD-02-backend-coding-standards.md | 10 | Draft stub (checklist) |
| wikifull.md | 10 | Existing wiki content |
| 02-architecture/c4-diagrams/level-4/C4-05-domain-model-class-diagram.md | 9 | Draft stub (checklist) |
| 02-architecture/c4-diagrams/level-4/C4-06-authorization-sequence-diagram.md | 9 | Draft stub (checklist) |
| 06-operations/OPS-01-azure-defender-runbook.md | 9 | Draft stub (checklist) |
| 04-standards/STD-04-git-workflow.md | 9 | Draft stub (checklist) |
| DOCUMENTATION-HEALTH-REPORT.md | 8 | Existing wiki content |
| 04-standards/STD-01-frontend-coding-standards.md | 8 | Draft stub (checklist) |
| 04-standards/STD-03-code-review-guidelines.md | 7 | Draft stub (checklist) |
| 05-development/frontend/FE-01-nx-monorepo-architecture-guide.md | 6 | Draft stub (checklist) |
| 05-development/frontend/FE-02-shared-library-documentation.md | 6 | Draft stub (checklist) |
| 05-development/frontend/FE-03-component-architecture-patterns.md | 6 | Draft stub (checklist) |
| 05-development/frontend/FE-04-state-management-strategy.md | 6 | Draft stub (checklist) |
| 05-development/frontend/FE-05-routing-strategy.md | 6 | Draft stub (checklist) |
| 02-architecture/arch-full.md | 5 | Existing wiki content |
| 02-architecture/integrations/INT-07-rds-residency-determination-service.md | 5 | Existing wiki content |
| DOCUMENTATION-INCOMPLETENESS-SCAN.md | 4 | Existing wiki content |
| 02-architecture/integrations/QueryBuilder/Data-Platform.md | 3 | Existing wiki content |
| 02-architecture/workflows/WF-01-roster-to-be-certified.md | 2 | Existing wiki content |
| 09-proposed-architecture/EXECUTIVE-PRESENTATION.md | 2 | Existing wiki content |
| 09-proposed-architecture/full.md | 2 | Existing wiki content |
| 02-architecture/ARCHITECTURE-DOCUMENTATION-FRAMEWORK.md | 1 | Existing wiki content |
| 02-architecture/integrations/INT-01-classwallet-integration.md | 1 | Existing wiki content |
| 02-architecture/integrations/INT-06-nc-dpi-integration.md | 1 | Existing wiki content |
| 03-business-rules/RULES-01-nrules-implementation-guide.md | 1 | Existing wiki content |
| adr/ADR-012-roster-workflow-orchestration.md | 1 | Existing wiki content |
| adr/ADR-template.md | 1 | Template |
| adr/README.md | 1 | Existing wiki content |
| Database-Schema-Documentation.md | 1 | Existing wiki content |

## How to update this scan

Run this PowerShell snippet from repo root (or update `$root`):

```powershell
$root='g:\Projects\CFI\K12\k12-Arch\wiki'
$pattern='\bTBD\b|\bTODO\b|\bFIXME\b|\[K12-XXX\]|\[K12-XXXX\]'
Get-ChildItem -Path $root -Recurse -Filter *.md |
  ForEach-Object {
    $m = Select-String -Path $_.FullName -Pattern $pattern -AllMatches
    if ($m) {
      [pscustomobject]@{
        Path  = $_.FullName.Substring($root.Length+1).Replace('\\','/')
        Count = $m.Count
      }
    }
  } |
  Sort-Object -Property @{Expression='Count';Descending=$true}, @{Expression='Path';Descending=$false} |
  Format-Table -AutoSize
```
