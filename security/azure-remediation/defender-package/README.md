# Defender for Cloud remediation package — K12 / NCSEAA MyPortal

Local-only review package. Nothing here has been applied to Azure, Eraser, Miro or Confluence.

| Item | Purpose |
|---|---|
| `Defender-Remediation-Plan.md` | The plan: standard recommendation (MCSB / CAF / WAF), root causes, decisions D-1…D-9, target state by environment, remediation catalog keyed by Defender recommendation name, phased roadmap, breaking-change checklist, Resource Graph verification queries, Mermaid diagrams. |
| `Defender-Remediation-DevOps.pptx` | 12-slide deck for the DevOps leads review. |
| `terraform/` | Validated (azurerm ~> 4.60) reference implementation: MG-scoped policy initiative, per-subscription Defender plans, per-environment workload baseline. See `terraform/README.md`. |
| `diagrams/*.mmd` | Mermaid sources: target-state architecture, governance hierarchy, roadmap. |

**Next input needed:** the Defender for Cloud Recommendations CSV export (or the Resource Graph output from plan Section 8) so the catalog can be pruned to real findings and the roadmap re-sequenced by actual severity counts.
