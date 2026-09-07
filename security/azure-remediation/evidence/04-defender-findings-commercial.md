# Defender for Cloud — live findings, commercial tenant (run 2026-09-07, read-only)

Source: Azure Resource Graph, subscription **K12 Azure** (`cf6841bb-…`), k12-cms estate excluded
in every query. Raw output: `results/20260907-181549-AzureCloud/` (JSON + CSV per query).
Gap-row IDs reference `07AzureSecurityRemediationPlan.md` §3; catalog sections reference
`Defender-Remediation-Plan.md` §5.

## Headline numbers

| Metric | Value |
|---|---|
| Secure score | **12.9 / 27 (~48%)** — subscription-wide, so it includes the k12-cms estate (secure score cannot be filtered by RG; queries 01/04–07 ARE portal-only). Legacy scope row: 4.34 / 8 |
| Distinct unhealthy recommendations | **245** — 65 High · 84 Medium · 96 Low |
| Affected resource-instances | 637 High · 850 Medium · 676 Low |
| Subscriptions found | **One** — dev/test/staging all share `K12 Azure` (confirms RC-1/D-2) |
| Guardrail initiative (`k12-platform-security-guardrails`) | Not deployed (query 07 empty — expected) |

## The five clusters that dominate the count

1. **Identity hygiene (High, subscription-level — cheapest big wins)**
   **53 guest accounts with write** + 4 with owner; 19 privileged roles with permanent
   (non-PIM) access; ">3 owners" fires; 29 overprovisioned + 28 inactive identities (Medium).
   → Plan §5.1 / gap I5. Entra work, no pipeline risk, freeze-safe. This outranks everything
   else in the placeholder §4 table and wasn't Wave 0's lead item — it should be.
2. **Container image patching (85 "Update <pkg>" recommendations, up to 21 images each)**
   One remediation, not 85: rebuild images on current base (Metabase/querybuilder/audit jobs),
   digest-pin, add registry scan gate. → S1/K12-8497; collapses ~85 High/Medium rows.
3. **Monitoring plane exposure (Medium, 31 resources × 6 recs ≈ 186 instances)**
   LAW + App Insights: public ingestion/query, non-Entra ingestion, BYOS/CMK for saved queries.
   → The plans only touch this via §5.11 "Log Analytics AMPLS (prod)". Real fix: Azure Monitor
   Private Link Scope + Entra-only ingestion; fold into L1/L2 work.
4. **"Authentication should be enabled" on App Service (30, High) and Container Apps (18, High)**
   EasyAuth is not configured on the Function/App Service apps and ACA apps. There is no APIM in
   the tenant (see below), so the triage is against the actual controls: enable built-in Entra
   auth where it fits, exempt-with-justification (D-9) where **application-level JWT validation
   (EntraAuthenticationMiddleware) plus the Front Door inbound restriction** is the control. → N3/C2.
5. **Network/private-endpoint block (Medium, wide but known)** — matches N2 exactly:
   Storage (9 public / 9 vnet-rules / 4 private-link / 11 shared-key), Key Vault (8 service
   endpoint / 6 firewall / 5 private link / 8 public access), App Config (3+3), SignalR (4),
   Redis (3 private link), ACR (2 unrestricted / 2 public / 2 private link), Data Factory (2),
   5 Container Apps environments public (query 06).

## Better than the plan assumed (downgrade these gaps)

- **G2 Defender plans:** only **Containers** and **Resource Manager** are off — KV/Storage/SQL/
  App Service plans appear enabled already.
- **I2 SQL Entra-only:** Low severity, 4 DBs; and the main SQL servers already have public
  network access **Disabled** — only `development-api-replic` still answers publicly (query 06).
- **L3 security contacts/email alerts:** no findings — already configured.
- **M1 local auth:** exactly **6 resources** (3 App Config stores + 3 Service Bus namespaces
  `k12eventhub-k12-{development,testing,staging}-sbns`) — small, scriptable, freeze-safe.

## New facts the plans didn't have

- A **PostgreSQL flexible server** exists (Entra-only finding) — not in the Dec 2025 inventory
  scope; likely Metabase backend. Add to the gap register.
- `k12-infra` RG carries shared secrets/storage in scope: Key Vaults `classWallet`,
  `k12-rds-integration`, `k12-shared-accounts`, `lowerenvfdcfnccert`; storage `cfik12sbom`,
  `k12infra`, `k12nonprodrefundsftp` (SFTP landing — Defender-for-Storage malware-scan target).
- 4 "Database owners should be as expected" (High) on SQL DBs — check with DBA.
- Key Vault: **7 secrets without expiration** (High); 2 vaults without purge protection.
- Front Door/CDN profiles: 12 without resource logs (N4 evidence gap).

## Suggested Wave-0 re-rank (evidence-based, all freeze-safe)

1. Guest/owner/PIM cleanup (Entra) — kills the top High block.
2. Enable Defender for Containers + Resource Manager (the only missing plans).
3. Image rebuild + digest pinning (collapses ~85 recs).
4. Key Vault: secret expiry, purge protection ×2, RBAC audit.
5. Local-auth off on the 6 App Config/Service Bus resources.
6. Storage hardening on the 11 shared-key accounts (non-prod first).
7. LAW/App Insights AMPLS design decision (larger change — pre-prod rehearsal).
8. EasyAuth-vs-exemption triage list for the 48 auth findings.

## Still pending

- **Gov tenant run** (pre-prod/prod): same script with `--cloud AzureUSGovernment` — needs a
  Gov device-code login.
- Note: query 06's Redis type filter (`microsoft.cache/redisenterprise`) misses classic
  `microsoft.cache/redis` PNA state; classic instances did surface via the "private link"
  recommendation (3). Add `microsoft.cache/redis` to the filter for the next run.
