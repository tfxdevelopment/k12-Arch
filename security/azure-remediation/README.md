# Azure Security Remediation — MyPortal K12 (working package)

Working home for the Defender-for-Cloud remediation effort. Lives in Terry's private mirror org
(`tfxdevelopment`) — **not client-facing**; nothing here is posted to CFI systems (Confluence,
ADO, client Azure) without explicit approval.

| Path | What it is |
|---|---|
| `plans/05-DR-Design-Brief-PI8.md` | DR design brief (v0.2 — live commercial facts merged: PITR 7 d/no LTR, dev geo-replica confirmed, Gov availability research) |
| `plans/06-CICD-Research-Checklist.md` | CI/CD configured-vs-available research checklist (v0.2 — Azure-side items pre-answered; ADO-side pending org access) |
| `plans/07-Azure-Security-Remediation-Plan.md` | The remediation plan (v0.2 — gap register verified against the live commercial tenant, waves re-cut by measured severity) |
| `defender-package/` | Standard recommendation (MCSB/CAF/WAF), remediation catalog by Defender recommendation name, Terraform reference implementation, Mermaid diagrams |
| `evidence/` | Read-only query runner + results: Defender findings (245 recs, secure score 12.9/27), gap-register confirmations, inventory dry-run, Azure/ADO research notes, devcontainer verification |

## State (2026-09-07)

- **Commercial tenant (`K12 Azure`): queried.** Secure score **12.9/27**; 65 High / 84 Medium /
  96 Low distinct recommendations. Headlines: guest/PIM identity block is the top High cluster;
  ~85 recs are container-image package updates; **no WAF + all Front Door profiles Standard**;
  SQL auditing off, PITR 7 d, no LTR; 38 private endpoints already deployed (public access not
  yet flipped); Key Vault RBAC everywhere; Service Bus already Premium; ACR admin off.
- **Azure Government (pre-prod/prod): not yet queried** — run
  `evidence/run-remediation-queries.sh --cloud AzureUSGovernment` with a Gov login.
- **ADO org: not yet inventoried** (checklist §1/§2 A–F need `dev.azure.com/CFI-AzureDevOps`
  access).

## Ground rules

- Everything in `evidence/` came from **read-only** queries (Azure Resource Graph + `az` GETs).
- No changes to Azure, Azure DevOps, or Atlassian from this workspace without explicit approval.
- The k12-cms estate is excluded from every query and every plan item.
