# Defender for Cloud remediation package — K12 / NCSEAA MyPortal

Local-only review package. Nothing here has been applied to Azure, Eraser, Miro or Confluence.

| Item | Purpose |
|---|---|
| `Defender-Remediation-Plan.md` | The plan: standard recommendation (MCSB / CAF / WAF), root causes, decisions D-1…D-9, target state by environment, remediation catalog keyed by Defender recommendation name, phased roadmap, breaking-change checklist, Resource Graph verification queries, Mermaid diagrams. |
| `deck/` (generated: `Defender-Remediation-DevOps.pptx`) | 12-slide deck for the DevOps leads review — **generated output, not committed**. Build with `cd deck && npm install pptxgenjs && node build.js`; the file lands next to `build.js`. |
| `terraform/` | Validated (azurerm ~> 4.60) reference implementation: MG-scoped policy initiative, per-subscription Defender plans, per-environment workload baseline. See `terraform/README.md`. |
| `diagrams/*.mmd` | Mermaid sources: target-state architecture, governance hierarchy, roadmap. |

**Status:** the commercial export is in (`../evidence/`, 2026-09-07 — secure score 12.9/27, 245 recommendations) and the Section 5 emphasis notes reflect it. **Next inputs needed:** (1) the **Azure Government** tenant export (same Section 8 queries or Recommendations CSV), (2) DevOps sign-off on decisions D-1…D-9, (3) the per-row Status/Count pruning pass of Section 5 against `../evidence/results/`.
