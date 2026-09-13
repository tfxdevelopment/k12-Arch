# Azure Security Remediation — MyPortal K12 (working package)

Working home for the Defender-for-Cloud remediation effort. Lives in Terry's private mirror org
(`tfxdevelopment`) — **not client-facing**; nothing here is posted to CFI systems (Confluence,
ADO, client Azure) without explicit approval.

| Path | What it is |
|---|---|
| `plans/05-DR-Design-Brief-PI8.md` | DR design brief (v0.2 — live commercial facts merged: PITR 7 d/no LTR, dev geo-replica confirmed, Gov availability research) |
| `plans/06-CICD-Research-Checklist.md` | CI/CD configured-vs-available research checklist (v0.2 — Azure-side items pre-answered; ADO-side pending org access) |
| `plans/07-Azure-Security-Remediation-Plan.md` | The remediation plan (v0.3 — gap register verified against the live commercial tenant, waves re-cut by measured severity; Gov code findings G-DNS…G-URL added 2026-09-13) |
| `plans/08-Gov-Preprod-Deploy-and-CICD-Plan.md` | Gov preprod deployment + CI/CD and agent-pool plan (v0.1, 2026-09-13 — stacked on ADO PR 6078; Gov-correctness findings F1–F21; safe hardening bundle; Container Apps Jobs agents; approval gates and verification) |
| `evidence/gov-preprod/` | Read-only Gov discovery script (`discover-gov-preprod.sh`, run from Terry's WSL) and PR 6078 review-comment drafts; discovery outputs are committed here |
| `../../ops/handoff/2026-09-13-k12-session-handoff.md` | Session context capture for continuing this work in a local Claude Desktop session |
| `defender-package/` | Standard recommendation (MCSB/CAF/WAF), remediation catalog by Defender recommendation name, Terraform reference implementation, Mermaid diagrams |
| `evidence/` | Read-only query runner + results: Defender findings (245 recs, secure score 12.9/27), gap-register confirmations, inventory dry-run, Azure/ADO research notes, devcontainer verification |

## State (2026-09-13)

- **Commercial tenant (`K12 Azure`): queried.** Secure score **12.9/27** (subscription-wide —
  secure score can't exclude k12-cms; the findings queries can and do); 65 High / 84 Medium /
  96 Low distinct portal-scoped recommendations. Headlines: guest/PIM identity block is the top High cluster;
  ~85 recs are container-image package updates; **no WAF + all Front Door profiles Standard**;
  SQL auditing off, PITR 7 d, no LTR; 38 private endpoints already deployed (public access not
  yet flipped); Key Vault RBAC everywhere; Service Bus already Premium; ACR admin off.
- **Azure Government (pre-prod/prod): tenant not yet queried** — Terry runs
  `evidence/gov-preprod/discover-gov-preprod.sh` (which also calls
  `run-remediation-queries.sh --cloud AzureUSGovernment`) from WSL. The Gov **code** was
  reviewed read-only on 2026-09-13 (ADO `k12-infra@main` and PR 6078): preprod is in Gov and
  already applied; five Gov-correctness defects found (plan 07 rows G-DNS…G-URL, plan 08 §B1).
- **ADO org: inventoried read-only (2026-09-09/13)** — pools `k12-development-pool`/`testing`/`staging`,
  no Gov pool; all ARM service connections WIF (Gov: `k12-production`, `k12-dm-gov`); Terraform
  definitions 74/86/119; open infra PRs 6078 (Angelo, preprod), 5574, 5398. Details in plan 08 §B0–B1.

## Ground rules

- Everything in `evidence/` came from **read-only** queries (Azure Resource Graph + `az` GETs).
- No changes to Azure, Azure DevOps, or Atlassian from this workspace without explicit approval.
- The k12-cms estate is excluded from every query and every plan item.
