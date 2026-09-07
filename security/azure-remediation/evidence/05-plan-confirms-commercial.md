# Gap register `[confirm]` items — resolved against the live commercial tenant

Run 2026-09-07, read-only (Resource Graph + `az` GETs), subscription **K12 Azure**, k12-cms
excluded. Gov (pre-prod/prod) intentionally skipped. Raw JSON: `results/confirm/`.
Row IDs = `07AzureSecurityRemediationPlan.md` §3; DR = `05DRDesignBriefPI8.md`.

## Headline surprises (change the plan)

1. **No APIM exists anywhere in the visible tenant** — not even in k12-cms. The Dec 2025
   inventory's 3 APIM instances are gone (or in an invisible subscription). The plan's
   "Functions behind APIM today" premise and open item #3 (tier choice) need re-basing:
   today the API path is Front Door → App Service apps directly, so **N3 inbound restriction
   to Front Door is the only gate** and rises in priority.
2. **Zero WAF policies in the tenant, and all 12 Front Door profiles are `Standard_AzureFrontDoor`**
   — Standard cannot attach managed rule sets. N4 is not "verify WAF config"; it is
   **upgrade Standard→Premium + create WAF policies from scratch** (detection first).
3. **Address-space collision:** `k12-cae-ops-vbet` (dev RG, note the typo'd name) uses
   **10.1.0.0/16 — the same as `testing-vnet`**. Blocks any future peering/hub; fold into N1
   module work and the DR CIDR pre-allocation.
4. **SQL auditing is Disabled on staging/testing (dev returns no policy)** — D1 confirmed
   worst-case; the CFI 3-year audit requirement currently has no SQL trail.
5. **PITR is 7 days and LTR is unset on every K12 DB** — DR brief D3 target is 35 d + LTR;
   the document stores (`*enrollmenthns`) are **Standard_LRS with no soft delete** (GRS +
   soft delete are the DR/D2 asks). Versioning on the flat accounts only (HNS can't).
6. **`development-k12-postgres` (PG 18): Entra auth Disabled, password auth Enabled, public.**
   Not in any plan inventory — new gap row (likely Metabase backend).

## `[confirm]` resolutions, row by row

| Row | Question | Answer (evidence) |
|---|---|---|
| G1 | MG hierarchy / initiative? | Single subscription `K12 Azure` holds dev+test+staging; no guardrail initiative (query 07 empty). RC-1/D-2 confirmed. |
| G2 | Defender plan coverage? | **On (Standard):** CSPM (incl. FoundationalCspm), App Services, Key Vault (PerKeyVault), SQL, SQL-on-VM, Storage V2, Cosmos, OSS RDBs, Discovery. **Off:** **Containers, Container Registry, Resource Manager**, APIs, AI, DNS, AKS, VMs. Fix = enable Containers + ARM (matches the 2 High findings). |
| I1 | Which identities deploy? | SQL Entra admin on all 4 servers = group **"CFI-AzureDevOps - K12 - Contributors"** (a DevOps pipeline group as SQL admin — flag for I5 tightening). ADO service-connection modes not visible from az. |
| I2 | Entra-only enforced? | **No** — `azureADOnlyAuthentication=false` on all 4 servers (Entra admin is set; SQL logins still possible). MinTLS 1.2 ✓. |
| I3 | Shared-key paths? | Storage `allowSharedKeyAccess=true` on 10/12 accounts (only `k12nonprodrefundsftp` locked; `k12sqlauditdev` default). Service Bus/App Config local auth on (6 resources, query 05). SignalR `disableLocalAuth=false` on all 4. |
| I4 | KV model / purge? | **RBAC = true on all 8 vaults** ✓ (better than feared). Purge protection **missing on `k12-rds-integration` and `lowerenvfdcfnccert`**. Soft delete 7 d on the three `*apikv`, 90 d elsewhere. All vaults publicly reachable (defaultAction Deny on only 2). |
| N1 | Per-env network state? | Per-env VNets exist (dev 10.0/16, testing 10.1/16, staging 10.2/16 + the colliding ops VNet), NAT gateways in all 3 envs (2 in dev), VPN gateways in all 3, **only 1 NSG in the estate**. Consistency is real; NSG deny-by-default is greenfield. |
| N2 | Private endpoints? | **38 private endpoints already deployed**: per env — SQL, Key Vault, ACR, api-enrollment storage (blob/file/queue/table), HNS storage (blob/dfs), Service Bus, SignalR; plus SFTP account (blob/dfs) and dev extras. **Missing: App Config, Redis** (none). Remaining work is flipping `publicNetworkAccess` off (27 resources still answer publicly per query 06) and DNS validation — the PE build-out is largely done. |
| N3 | Functions/APIM VNet? | All 30 App Service apps `httpsOnly=true` and VNet-integrated **except the 3 `k12-*-gateway` (querybuilder) apps — no VNet integration**. APIM: none exists (see surprise #1). Inbound access restrictions (X-Azure-FDID) not readable via ARG — per-app check still open. |
| N4 | WAF state? | **No WAF policies exist; Front Door is Standard tier ×12** (see surprise #2). Diagnostic setting present on sampled AFD profile, but Defender flags 12 profiles for resource logs. |
| C2 | ACA env ingress? | 7 environments: only `k12-infra-ops-cae` internal; `development-secure-cae` + `k12-infra-ops-apps-cae` VNet-injected but external; the 4 main `*-k12-cae` envs have **no VNet at all**; **mTLS off everywhere; all Consumption-only profiles** (blocks private endpoints per D-6) except one with Flex. |
| D1 | SQL audit → LAW? | **Disabled** (staging/testing explicit; dev no policy). `k12sqlauditdev` storage account exists but audit is off. |
| D2 | Storage protections? | httpsOnly + TLS1_2 ✓ everywhere. `allowBlobPublicAccess=true` on **6** accounts incl. every enrollment/HNS store; blob soft delete **off** everywhere except SFTP (30 d); versioning on flat api-enrollment accounts only. |
| D3 | PITR/LTR? | PITR **7 d** all K12 DBs; LTR **none**. Backup storage redundancy Geo ✓. Dev K12 has a **Geo secondary** (`secondaryType=Geo` → server `development-api-replic`, public + PE'd) — answers DR "replica type": true geo-replica, dev-only rehearsal exists; staging has none. |
| M1 | Service Bus SKU/keys? | **Already Premium ×3**, TLS 1.2 ✓, PE'd ✓; local auth still on ×3; PNA Enabled on dev only. (No separate Event Hubs namespaces exist.) |
| M2 | SignalR? | Standard_S1 ×4, local auth (keys) **on**, PNA Enabled, PE exists per env — flip `disableLocalAuth` + PNA. |
| L1 | Diagnostic settings? | Sampled SQL DB, KV, ACA env, Service Bus, SignalR, AFD — **all have ≥1 setting**. Gaps concentrate in Defender's list: FD/CDN profiles (12), public IPs (8), 5 KVs. |
| L2 | Retention? | **31 Log Analytics workspaces** (huge sprawl: per-app managed AI workspaces + per-env + defaults), all 30 d (three at 90 d), all public ingestion/query. Consolidation into `log-k12-env` + 120 d/archive + AMPLS is real work. |
| S1 | ACR state? | **Admin user disabled on all 5** ✓. 3× Premium with PNA Disabled + PE ✓. 2× stray **Basic** registries (`acr6okwxqo3pdluq`, `developmentk12caeacr…`) public, no PE support — consolidate/delete. Exports enabled everywhere (Low). |
| — | Redis? | Classic Azure Cache for Redis **Standard ×3** — non-SSL port off ✓, TLS 1.2 ✓, PNA Enabled, **no private endpoints**. Standard supports PE, so N2 can cover it; AMR migration (D-5) remains the 2028-retirement play. |

## What this does to the waves

- **Wave 0 adds:** enable Defender Containers+ARM; SQL auditing → LAW (3 servers, freeze-safe);
  PITR 35 d + LTR (freeze-safe, backup-only); purge protection on the 2 vaults; blob soft delete
  on document stores; delete/lock the 2 stray Basic ACRs; fix `k12-cae-ops-vbet` name+CIDR in
  Terraform (module work, non-prod).
- **Wave 0 gets easier:** N2 is mostly "flip PNA off + validate DNS" (endpoints exist);
  M1 needs no SKU change (already Premium).
- **N4 grows:** Front Door Standard→Premium migration decision (cost: ~$330/mo/profile vs
  $35 — ×12 profiles; consider consolidating 4 portal profiles per env into 1 Premium profile
  per env before upgrading).
- **New rows:** Postgres flexible server hardening; gateway apps VNet integration; LAW
  consolidation (31 workspaces); SQL Entra admin group tightening.

## Still open (not answerable from this seat)

- Gov tenant state (skipped per instruction).
- App Service inbound access restrictions per app (needs per-app reads — say the word).
- ADO service connections / PAT usage (needs Azure DevOps access, not az).
- Which subscription held the Dec-2025 APIM ×3 / whether decommissioned.
