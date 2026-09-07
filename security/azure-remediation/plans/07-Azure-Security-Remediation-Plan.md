# MyPortal K12 — Azure Security & Architecture Remediation Plan (DRAFT v0.2)

> **v0.2 (2026-09-07):** live commercial-tenant data merged — §1 queries executed read-only
> against subscription `K12 Azure` (secure score **12.9/27**, 245 unhealthy recommendations:
> 65 High / 84 Medium / 96 Low). Gap-register `[confirm]` items resolved; see
> `../evidence/04-defender-findings-commercial.md` and `05-plan-confirms-commercial.md`
> for the full findings and raw query output. **Gov tenant still pending.**
> This copy lives in Terry's private mirror org (`tfxdevelopment/k12-Arch`), not client systems.

**Scope:** every MyPortal workload — Admin, Enrollment/Household, Providers and Schools portals (SWA + Front Door), the APIs (today: Function Apps on App Service plans behind APIM; target: Container Apps `enrollment-api` / `admin-api` / `validation-api`), Logic Apps / workflow engine, querybuilder gateway, Metabase, audit-sink jobs, SignalR, Service Bus / Event Hubs / Event Grid, Azure SQL, Storage (general + ADLS Gen2), Key Vault, App Configuration, Redis, ACR, ADF, Log Analytics, ADO runners and service connections — across Dev, Testing, Staging (commercial) and Pre-prod / Prod (Azure Government).
**Out of scope:** the `k12-cms` estate (`app-k12-site-prd*`, `sql-k12-site-shared*`, `fd-k12-site-shared`, `Notify_Netsupport`).
**Sources:** target-state diagrams (`01targetstatearchitecture`, `02governancehierarchy`), *02-Azure Architecture* inventory (Dec 2025), Luke's *Multi-region Support* page, AzD4D runbook, CFI audit-log policy (3-year retention, 4 months online), K12-8497 / K12-8385 / K12-9219.
**Now in this plan:** the live commercial Defender/Resource Graph export (2026-09-07). Remaining `[...]` = still open (mostly Gov-tenant or ADO-side).

Two tracks, kept apart on purpose so security remediation doesn't get held hostage by re-platforming:
- **Track A — harden in place** (Functions/App Service + APIM as they run today). This is what closes Defender findings before launch.
- **Track B — target platform** (Container Apps, App Gateway WAF, Managed Redis, MG hierarchy). Phase 2 / extension scope; designed now so Track A fixes carry forward.

---

## 1. Get the Defender for Cloud export (2 minutes, read-only)

Defender for Cloud → **Recommendations → Download CSV report** (per subscription; do commercial and Gov tenants separately), **or** Azure Resource Graph Explorer:

```kusto
securityresources
| where type == "microsoft.security/assessments"
| extend name = tostring(properties.displayName), sev = tostring(properties.metadata.severity),
         status = tostring(properties.status.code), rid = tolower(tostring(properties.resourceDetails.Id)),
         rg = tolower(tostring(properties.resourceDetails.ResourceGroup))
| where status == "Unhealthy"
| where rg !in ("k12-cms")                     // portal only
| summarize resources = dcount(rid), example = any(rid) by name, sev, subscriptionId
| order by sev asc, resources desc
```
Secure score: `securityresources | where type == "microsoft.security/securescores" | project subscriptionId, score = properties.score.current, max = properties.score.max`.
Policy compliance: `policyresources | where type == "microsoft.policyinsights/policystates" | summarize count() by tostring(properties.complianceState), tostring(properties.policyDefinitionName)`.

**Status: DONE for commercial (2026-09-07)** via `../evidence/run-remediation-queries.sh` — seven
read-only queries (these three + the Defender plan's §8 four), k12-cms excluded at both RG and
resource-name level. Raw output in `../evidence/results/`. **Gov tenant: pending** (run the same
script with `--cloud AzureUSGovernment` once Gov access is available).

---

## 2. Target state in one table (what the diagrams commit to)

| Layer | Control | Applies to |
|---|---|---|
| Governance | MG hierarchy Tenant → **CFI** (initiative `k12-platform-security-guardrails` defined here) → Platform / Landing Zones / Sandboxes → Corp → **NonProd MG** (`k12-guardrails-nonprod` → **Audit**) and **Prod MG** (`k12-guardrails-prod` → **Deny**); subs `sub-k12-nonprod` (rg-k12-dev, rg-k12-test), `sub-k12-stage`, `sub-k12-prod` | All |
| Governance | Defender for Cloud: MCSB baseline; NonProd = CSPM + Key Vault; Stage/Prod = full plan set (Servers n/a, App Service, SQL, Storage, Containers, Key Vault, Resource Manager, DevOps) | All |
| Identity | Ops/Architects group: NonProd = Contributor + data-plane Owner; Prod = Reader + **PIM-eligible Contributor**. Workloads = **user-assigned managed identities**; pipelines = **workload identity federation** (no SPN secrets, no PATs) | All |
| Identity | **Entra-only auth** on SQL, Service Bus, Event Hubs, App Configuration, Redis; **local auth / shared keys disabled** on Storage, Redis, App Config, Service Bus; Key Vault **RBAC** model | Data + messaging |
| Network | `vnet-k12-env` 10.x.0.0/20; `snet-aca` (Container Apps env, internal LB, public access disabled, mTLS); `snet-private-endpoints` (NSG deny-by-default, ~10 private endpoints + private DNS zones); `snet-appgw`; **NAT Gateway** stable egress IP (for NSC / SFTP partner allow-lists); **public network access Disabled** on every PaaS; **TLS 1.2 minimum** everywhere | All |
| Edge | Front Door Premium + WAF (portals); Application Gateway WAF v2 (APIs); SWA Standard with private endpoint for Admin | Portals + APIs |
| Data | SQL: Entra-only, auditing → LAW, Ledger on designated tables, TDE, vulnerability assessment, RLS backstop. Storage: no shared key, no public blobs, soft delete + versioning, immutability for audit containers. Key Vault: soft delete + **purge protection**. ACR Premium, admin user disabled | Data |
| Logging | `log-k12-env`: diagnostic settings `allLogs` + SQL audit + Container Apps logs; **prod 120 d interactive + archive to 3 y** (CFI policy: 3 years retained, ≥ 4 months online); forward to CFI Splunk `[confirm mechanism]` | All |
| Delivery | Managed DevOps Pool agent inside the VNet; MSDO + SBOM in pipelines; Defender for Containers scans images at ACR | DevOps |

---

## 3. Current state vs. target — gap register

Current column: **verified against the live commercial tenant 2026-09-07** (evidence files cited as E04/E05 = `../evidence/04-…` / `05-…`). Gov state still unverified. **Live-confirmed rows are marked ✔; new rows found in the export are D4, N7, L4, S3, E1.**

| # | Domain | Current (as known) | Gap to target | Fix (Terraform unless noted) | Track | Freeze-safe? |
|---|---|---|---|---|---|---|
| G1 ✔ | Governance | **Confirmed:** one subscription (`K12 Azure`) holds dev+test+staging in RGs `development`/`testing`/`staging` (+ shared `k12-infra`); no guardrail initiative deployed (policy query returns empty) | No guardrails; nothing prevents a public SQL endpoint being created tomorrow | Create initiative `k12-platform-security-guardrails` (§6); assign **Audit** on non-prod now; **Deny** on prod after remediation | A | Yes (Audit mode) |
| G2 ✔ | Governance | **Confirmed:** plans ON (Standard): CSPM, App Services, Key Vault, SQL, SQL-on-VM, Storage V2, Cosmos, OSS RDBs. **OFF: Containers, Container Registry, Resource Manager** (+ APIs, AI, DNS). DevOps connectors exist (commercial) — research: Defender for DevOps is **commercial-cloud only**, no Gov option | Two High findings = the two missing plans; container images unscanned at registry | Enable **Containers + Resource Manager** now (small cost); Gov plan set at pre-prod build (Defender CSPM is GA in Gov) | A | Yes |
| G3 | Governance | No resource locks / tagging standard visible | Accidental deletion (DR scenario 4) | `CanNotDelete` locks on prod RGs, SQL, storage, Key Vault; tags `env`, `owner`, `data-class` via policy | A | Yes |
| I1 | Identity | Function Apps use managed identity for SQL (contained users); ADF SPNs (`K12dev-adf-sp` etc.). **Confirmed:** SQL Entra admin on all 4 servers = group `CFI-AzureDevOps - K12 - Contributors` (pipeline group as DB admin — tighten). Service-connection modes need ADO-side check | SPN secrets and (per K12-8497) PATs on runners; no WIF | Convert service connections to **WIF** (GA; in-place convert); UAMI per workload; PAT-free agent registration (`--auth SP` now supported); narrow the SQL Entra admin group | A | Yes (non-prod first) |
| I2 ✔ | Identity | **Confirmed: Entra-only = false on all 4 servers** (Entra admin set; SQL logins possible). MinTLS 1.2 ✓; PNA already Disabled on the 3 primary servers (only `development-api-replic` public) | SQL logins may still exist | `azuread_authentication_only = true`; remove SQL logins after app validation | A | Non-prod yes; prod after cutover test |
| I3 ✔ | Identity | **Confirmed:** shared key enabled on **10/12** storage accounts (only `k12nonprodrefundsftp` locked); local auth ON on all 3 App Config stores + all 3 Service Bus namespaces + all 4 SignalR (E05) | Shared-key paths bypass Entra + audit | `shared_access_key_enabled = false`, `local_auth_enabled = false`, `disable_local_auth = true`; apps use `DefaultAzureCredential` | A | Non-prod yes; prod staged |
| I4 ✔ | Identity | **Confirmed: RBAC = true on all 8 vaults** ✓. Purge protection missing on `k12-rds-integration` + `lowerenvfdcfnccert`; soft delete 7 d on the three `*apikv` (90 d elsewhere); 7 secrets with no expiry (High); all vaults publicly reachable | Purge protection ×2; secret expiry; network lockdown | `purge_protection_enabled = true` (2 vaults), `soft_delete_retention_days = 90`, secret expiry + `SecretNearExpiry` rotation; N2 covers network | A | Yes |
| I5 | Identity | Ops/Architects AD group proposed (your CAF/RBAC business case) | Not assigned; PIM not configured for prod | Assign per §2 Identity row; PIM eligible Contributor with justification, 8 h | A | Yes |
| I6 | Identity | End users: Entra External ID (B2C) for citizens/schools/providers; Entra ID for SEAA admins; custom security attributes; OBO to SQL + RLS | Verify: MFA/conditional access on admin tenant, B2C password/age policies, token lifetimes, sign-in risk policies `[confirm with Alex Won / Jeff Shuron]` | Conditional Access for admin roles; B2C user flows hardened; app registrations reviewed (redirect URIs, implicit flow off, secrets → certificates/federated) | A | Yes |
| N1 ✔ | Network | **Confirmed:** per-env VNets exist (dev 10.0/16, testing 10.1/16, staging 10.2/16), NAT gateways in all 3 envs (2 in dev), VPN gateways ×3 — **but only 1 NSG in the whole estate**, and see N7 (CIDR collision) | NSG deny-by-default is greenfield; subnets un-NSG'd | One `network` module: VNet /20, subnets (`aca`, `private-endpoints`, `appgw`, `runners`), NSG deny-by-default, NAT Gateway, private DNS zones linked; **applied identically to all envs** (K12-9219 reconciliation) | A | Non-prod yes; prod during pre-prod build |
| N2 ✔ | Network | **Confirmed: 38 private endpoints already deployed** (per env: SQL, KV, ACR, storage blob/file/queue/table + HNS blob/dfs, Service Bus, SignalR; + SFTP account). **Missing PEs: App Config, Redis.** 27 resources still answer publicly (E04 query 06) — endpoints exist but `publicNetworkAccess` not flipped | Flip public access off + validate private DNS; add App Config + Redis PEs | Add the 2 missing PE types; then `public_network_access_enabled = false` per service, **Testing first with DNS validated from runners and apps** | A | **No for prod until private DNS verified from runners and apps — do on pre-prod first** |
| N3 ✔ | Network | **Confirmed:** all 30 App Service apps HTTPS-only ✓ and VNet-integrated ✓ **except the 3 `k12-*-gateway` (querybuilder) apps — no VNet**. **APIM does not exist in the tenant** (Dec-2025's 3 instances gone/invisible) — the API path is Front Door → App Service directly. Inbound access restrictions per app still unchecked | APIs reachable bypassing Front Door — now the **only** gate, priority up | App Service inbound restriction to Front Door (`X-Azure-FDID` + AzureFrontDoor.Backend service tag) on every app; VNet-integrate the 3 gateway apps; FTPS off, remote debugging off, SCM restricted. APIM decision deferred to Track B (re-base the premise first) | A | Yes (non-prod), staged prod |
| N4 ✔ | Edge | **Confirmed: all 12 Front Door profiles are `Standard_AzureFrontDoor` and ZERO WAF policies exist in the tenant.** Standard tier cannot attach managed rule sets | No WAF at all; no rate limiting; Standard tier blocks the target | **Upgrade Standard → Premium** (consider consolidating 4 portal profiles → 1 per env first; Premium base fee is $330/profile/mo vs $35) then WAF: DRS 2.1 managed rules, bot manager, rate-limit on auth + submit paths, admin IP allow-list; log to LAW | A | Yes (detection mode first) |
| N5 | Edge | Target adds Application Gateway WAF v2 in `snet-appgw` in front of Container Apps | Not needed until Track B | Design only; module skeleton | B | — |
| N6 | Network | Egress: SFTP to NSC / EFT partners from Function/Logic Apps | Partner allow-lists need a stable IP | NAT Gateway on integration subnet; document egress IPs per env | A | Yes |
| C1 | Compute | Function Apps v4 .NET 8 on shared plans; runtime drift .NET 9/10 (K12-8497) | Unpatched runtimes; inconsistent | Pin runtime in Terraform (`site_config`), remove module masking; always-on, health check, min TLS, HTTP/2 | A | Yes |
| C2 ✔ | Compute | **Confirmed: 7 ACA environments** — only `k12-infra-ops-cae` internal; the 4 main `*-k12-cae` envs have **no VNet at all**; mTLS off everywhere; **all Consumption-only profiles** (one has Flex) — Consumption-only blocks private endpoints | Target = internal workload-profile env, mTLS; env type + VNet cannot be changed in place → **replace** operations | New workload-profile envs (internal, VNet-injected), `mtls`, ingress via Front Door / App Gateway private link; sequence per roadmap | A/B | Non-prod yes |
| C3 | Compute | Logic Apps + storage accounts (`stapilogicapp*`) | Storage for workflow state likely on shared key + public | Same I3/N2 treatment; VNet-integrated Standard Logic Apps | A | Yes |
| D1 ✔ | Data | **Confirmed: SQL auditing is Disabled** on staging/testing (dev has no policy); `k12sqlauditdev` storage exists unused; VA config conflict noted in K12-8385 | No SQL audit trail at all — CFI 3-year policy unmet | `mssql_server_extended_auditing_policy` → LAW on all 3 servers (freeze-safe); VA with storage via managed identity (fixes K12-8385 item); Ledger tables list from PO | A | Yes |
| D2 ✔ | Data | **Confirmed:** httpsOnly + TLS1_2 ✓ everywhere; but `allowBlobPublicAccess = true` on **6** accounts incl. every `*enrollmenthns` document store; **blob soft delete OFF everywhere** except SFTP (30 d); versioning only on flat api-enrollment accounts | MCSB: no public blob, soft delete; document stores most exposed | `allow_nested_items_to_be_public = false` (6 accounts), blob soft delete 30 d, versioning where supported, immutability policy on audit/evidence containers | A | Yes |
| D3 ✔ | Data | **Confirmed: PITR = 7 d and LTR = none on every K12 DB**; backup storage redundancy Geo ✓; DBs are GP serverless (GP_S_Gen5); dev K12 has a **Geo secondary** on `development-api-replic` | DR scenario 2/3 needs PITR 35 d + LTR | PITR 35 d + LTR weekly/monthly/yearly per CFI retention (backup-only change, freeze-safe); ties to DR brief | A | Yes |
| M1 ✔ | Messaging | **Confirmed: Service Bus is already Premium ×3** (`k12eventhub-k12-*-sbns`), TLS 1.2 ✓, PE'd ✓, PNA Disabled on staging/testing (dev Enabled); **local auth still ON ×3**; no separate Event Hubs namespaces exist | Local auth on; dev public | `local_auth_enabled = false` ×3, RBAC roles per UAMI (Sender/Receiver), flip dev PNA off — no SKU change needed | A | Yes |
| M2 ✔ | Messaging | **Confirmed:** SignalR Standard_S1 ×4, access keys ON (`disableLocalAuth = false`), PNA Enabled — but a PE already exists per env | Target = Entra auth, public off | `local_auth_enabled = false` ×4, flip PNA (PEs exist), Front Door origin | A | Yes |
| M3 | Events | Dapr sidecars (target) — component secrets | Dapr components must use UAMI, not keys | Dapr components with `azureClientId`; secret store = Key Vault | B | — |
| L1 ✔ | Logging | **Confirmed:** diagnostic settings present on sampled key resources (SQL DB, KV, ACA env, SB, SignalR, AFD); gaps concentrate on FD/CDN profiles (12), public IPs (8), 5 KVs. **But see L4: 31 LAW workspaces** | Coverage gaps + workspace sprawl | `azurerm_monitor_diagnostic_setting` `allLogs` on the flagged resources → consolidated env LAW; Activity Log → LAW | A | Yes |
| L2 ✔ | Logging | **Confirmed:** all 31 workspaces at 30 d (three at 90 d), all public ingestion/query | CFI policy: 3 y, 4 months online; monitoring plane itself publicly open (186 Medium finding-instances) | Prod: interactive 120 d + archive (3 y); non-prod 30 d; **Splunk mechanism (researched): diagnostic settings dual-homed to Event Hub (preferred) or LAW data-export rules → Event Hubs → Splunk Add-on for Microsoft Cloud Services; Defender alerts via continuous export; 3-y tamper-proof tier = export to immutable storage**; AMPLS + Entra-only ingestion for the monitoring plane | A | Yes |
| L3 | Alerting | Custom alerts exist only for cms; Monitoring & Alerting epic (K12-4697) in flight | Defender alerts not routed | Defender alert → action group → on-call; security contact configured on both tenants | A | Yes |
| S1 ✔ | Supply chain | **Confirmed:** ACR **admin user OFF on all 5** ✓; 3× Premium with PNA Disabled + PE ✓; **2 stray Basic registries public** (`acr6okwxqo3pdluq`, `developmentk12caeacr…` — no PE support); Defender for Containers OFF so registry is unscanned (Trivy in-pipeline is the only scanner); **85 "Update <pkg>" image-vuln recommendations (≈21 images)**; MSDO coverage per repo still `[confirm — ADO side]` | Registry unscanned; stray registries; stale images | Enable Defender for Containers (G2); rebuild images on patched bases + digest pinning (collapses ~85 findings); consolidate/delete the 2 Basic ACRs; MSDO template in every repo | A | Yes |
| S2 | Supply chain | ACI runners with PATs and mutable image tags (K12-8497). **Research: Managed DevOps Pools are commercial-cloud only — not available in Azure Government** | Target platform differs by tenant | Commercial: Managed DevOps Pool in VNet + WIF per K12-8497. **Gov: VMSS agent pools or self-hosted agents in the Gov VNet, SP-registered (no PAT)**; digest-pinned images meanwhile | A/B | Yes (pilot) |
| D4 | Data | **New (live):** `development-k12-postgres` (PG 18, dev) — Entra auth **Disabled**, password auth Enabled, public network access Enabled; in no prior inventory (likely Metabase backend) | Un-inventoried data store outside all controls | Entra auth on, password auth off after app validation, PNA off + PE (`privatelink.postgres.database.azure.com`); add to Terraform | A | Yes |
| N7 | Network | **New (live):** `k12-cae-ops-vbet` VNet (dev RG, typo'd name) uses **10.1.0.0/16 — collides with `testing-vnet`** | Blocks peering/hub topology and DR CIDR plan | Re-address (and rename) via the N1 network module; pre-allocate non-overlapping DR CIDRs at the same time (DR brief §4) | A | Yes |
| L4 | Logging | **New (live): 31 Log Analytics workspaces** (per-app managed AI workspaces + per-env + defaults), all public ingestion/query | Sprawl defeats the single-sink audit design; 186 Medium finding-instances on the monitoring plane | Consolidate to `log-k12-env` per env; AMPLS + Entra-only ingestion; delete/merge stragglers | A | Yes (non-prod first) |
| S3 | Supply chain | **New (live):** guest-account exposure — **53 guests with write, 4 with owner**, 19 privileged roles without PIM, >3 owners, 29 overprovisioned + 28 inactive identities | Largest High-severity block in the export; pure Entra hygiene | Access review + guest cleanup, PIM-eligible roles, owner reduction (Entra admin work, no pipeline risk) | A | Yes |
| E1 | Edge | **New (live):** 48 "authentication should be enabled" findings (30 App Service + 18 Container Apps) — EasyAuth not configured | High-severity noise or real gaps depending on app | Triage list: enable built-in Entra auth where it fits; **policy exemption with justification** where APIM/JWT middleware is the control (D-9 style, never silence) | A | Yes |

---

## 4. Expected Defender for Cloud recommendations → fix map

Originally a placeholder list; **now checked against the live export (2026-09-07, commercial)** — full row-level counts in `../evidence/04-defender-findings-commercial.md` and `results/…/01|04-*.csv`. Verdicts:

- **Fired as predicted:** private-endpoint/public-network block (Storage 9+9+4, KV 8/6/5, App Config 3+3, SignalR 4, ACR 2+2+2, Redis 3, ADF 2); storage shared-key (11) and public-blob (6); KV purge protection (2) and secret expiry (7, High); SQL Entra-only (Low, 4); diagnostic-log Lows (FD/CDN ×12, public IPs ×8, KV ×5); subnets-need-NSG.
- **Did NOT fire (already done):** Defender plans for KV/Storage/SQL/App Service; security contact + email alerts (L3 clean); ACR admin user; SQL public access (primaries); non-SSL Redis; HTTPS-only/TLS on apps and storage.
- **Fired but not predicted:** guest/owner/PIM identity block (S3 — the top High cluster); 85 container-image `Update <pkg>` vulns (S1); LAW/App Insights public-ingestion cluster (L4, 31 resources × 6 recs); App Service/ACA "authentication should be enabled" ×48 (E1); Postgres Entra-only (D4); "database owners as expected" ×4.
- **Moot:** APIM rows (no APIM exists); Event Hubs rows (no namespaces); management ports/IP forwarding (no VMs, as expected).

| Likely recommendation (severity) | Maps to |
|---|---|
| Azure SQL servers should have Microsoft Entra-only authentication enabled (High) | I2 |
| SQL servers should have auditing enabled / auditing retention ≥ 90 days (Medium) | D1 |
| Vulnerability assessment should be enabled on SQL servers (Medium) | D1 |
| Private endpoint connections on Azure SQL Database / Storage / Key Vault / Service Bus / App Configuration / Container Registry should be enabled (Medium) | N2 |
| Public network access should be disabled for SQL / Storage / Key Vault / App Config / Service Bus / ACR (High/Medium) | N2 |
| Storage accounts should prevent shared key access / restrict network access / require secure transfer / disallow public blob access (High/Medium) | I3, D2 |
| Key vaults should have soft delete and purge protection enabled (Medium) | I4 |
| Key vaults should use RBAC permission model (Medium) | I4 |
| Function apps / App Service: HTTPS only, TLS 1.2, FTPS disabled, remote debugging off, managed identity used, client certificates, latest runtime (Medium/Low) | C1, N3 |
| App Service should use VNet integration / private link (Medium) | N3 |
| Container registries should not allow unrestricted network access; admin account disabled (High) | S1 |
| Container Apps environments should use internal load balancer / mTLS `[if present]` | C2 |
| Service Bus / Event Hubs namespaces should have local authentication disabled (Medium) | M1 |
| Diagnostic logs should be enabled on … (Low) | L1 |
| Log Analytics workspace retention / Activity Log retention (Low) | L2 |
| Subscriptions should have a contact email for security issues; email notifications for high severity alerts (Low) | L3 |
| Microsoft Defender for App Service / SQL / Storage / Key Vault / Containers / Resource Manager should be enabled (High) | G2 |
| Azure DevOps repositories should have code/secret/IaC scanning findings resolved (High/Medium) | S1 + CI/CD checklist D1–D5 |
| Subnets should be associated with a network security group (Low) | N1 |
| Management ports / IP forwarding — n/a (no VMs) | — |

---

## 5. Sequencing (respects the 10/7 freeze and the DR brief)

**Wave 0 — now → Oct 7, non-prod + no release-path impact** *(re-cut 2026-09-07 by measured severity — the evidence-ranked order inside this wave:)*
1. S3 identity hygiene: guest write/owner cleanup, PIM, owner count (kills the top High block, zero pipeline risk).
2. G2: enable Defender **Containers + Resource Manager** (the only missing plans).
3. S1: image rebuilds on patched bases + digest pinning (collapses ~85 recommendations).
4. D1: SQL auditing → LAW ×3 servers; D3: PITR 35 d + LTR (both backup/logging-only, freeze-safe).
5. I4: purge protection ×2 vaults + secret expiry ×7; I3/M1/M2: local-auth off on the 6 stores/namespaces + 4 SignalR (apps first).
6. D2: public-blob off ×6 + blob soft delete on document stores; delete/lock the 2 stray Basic ACRs.
7. N2: flip PNA off on Testing (PEs already exist — validate DNS from runners/apps); add App Config + Redis PEs.
8. E1 triage list; D4 Postgres hardening; N7 CIDR fix inside the N1 module work.

Original Wave-0 content (still applies where not superseded above):
- G1 initiative in **Audit** mode on non-prod; G2 plans on non-prod; G3 locks; L1/L2 diagnostic settings + retention; L3 security contacts + Defender alert routing.
- I1 WIF service connections for non-prod pipelines; I4 Key Vault RBAC + purge protection (non-prod).
- N1 network module applied to Dev/Testing; N2 private endpoints on **Testing** with DNS validated from runners and apps; N4 WAF in detection mode on non-prod Front Doors.
- D1 SQL audit → LAW + VA fix (non-prod); D2 storage hardening (non-prod); M1/M2 local-auth off (non-prod).
- S1 ACR admin off + Defender for Containers; MSDO template into every repo (non-breaking, `break:false`).
- Evidence: secure score before/after on `sub-k12-nonprod`; recommendations count by severity.

**Wave 1 — Oct 9–23, pre-prod (Gov) as the rehearsal**
- Everything above applied to pre-prod via the same modules (this *is* the "same as prod" test Steve's K12-7867 wants).
- N2 public-network-off on pre-prod; N3 App Service inbound restricted to Front Door; I2 Entra-only on pre-prod SQL; I3 shared-key off with app validation.
- Prod: **detect-only** changes (diagnostics, alerts, plans, locks) before dark launch; anything that changes a network path waits for the drill.

**Wave 2 — Nov add-on window (Mock Go-Live & DR)**
- Prod: N2/N3/I2/I3 flipped during the mock go-live change window with rollback = Terraform revert; G1 initiative moved to **Deny** on Prod MG; G2 full plan set; N4 WAF prevention mode.
- DR brief data-plane items (failover group, GRS, ACR geo-replication) land here too — same change window, same runbook.

**Phase 2 — extension scope**
- Track B: Container Apps migration with internal env + mTLS + Dapr/UAMI; App Gateway WAF v2; Managed Redis; MG hierarchy + sandboxes; Managed DevOps Pools for Gov; Splunk forwarding hardening; continuous compliance dashboard.

---

## 6. `k12-platform-security-guardrails` — initiative contents (Audit non-prod → Deny prod)

Built-in policies unless noted; parameters `effect = Audit | Deny`.
1. Azure SQL: Entra-only authentication; public network access disabled; auditing enabled; TDE on.
2. Storage: secure transfer required; shared key access disallowed; public blob access disallowed; minimum TLS 1.2; public network access disabled; soft delete enabled.
3. Key Vault: purge protection; soft delete; RBAC permission model; public network access disabled; secrets/certs expiration set.
4. App Service / Functions: HTTPS only; TLS 1.2; FTPS disabled; remote debugging off; managed identity; VNet integration (Audit only).
5. Container Registry: admin account disabled; public network access disabled; Premium SKU for prod.
6. Service Bus / Event Hubs / App Configuration / Redis / SignalR: local authentication disabled; private endpoint; TLS 1.2.
7. Container Apps: environment uses internal LB; managed identity; no HTTP ingress without HTTPS `[custom policy]`.
8. Monitoring: diagnostic settings to LAW required (DeployIfNotExists); Activity Log to LAW.
9. Networking: subnets require NSG; no public IPs except NAT Gateway / App Gateway / Front Door; private DNS zone linkage (DINE).
10. Tags required: `env`, `owner`, `data-classification`, `cost-center` (Audit → Deny on create).
11. Allowed locations: East US 2 / Central US (non-prod); US Gov Virginia / US Gov Texas (prod) `[confirm primary Gov region]`.
12. Defender plans required per subscription (DINE).

---

## 7. Evidence & governance (ties to CFI SA-11 "verifiable flaw remediation")

- One Jira story per gap-register row under `[K12-8863 Platform Maintenance or a new "Security Remediation" epic — confirm with Jacqui]`, each carrying the Defender recommendation ID(s) it closes.
- Weekly: secure score + unhealthy-recommendation count by severity per subscription (Resource Graph query in §1) posted as the platform update.
- Before/after screenshots and Terraform PR links attached to the story = SA-11 evidence; suppressions/exemptions require a ticket + expiry (policy exemptions, not silence).
- Sign-off: Alex Won / Jeff Shuron for the initiative and the prod Deny cut-over; Danny Hite for network/DNS; Jacqui for change windows.

---

## 8. Open items — status (2026-09-07)
1. Defender export — **commercial DONE** (evidence 04/05); **Gov pending**.
2. Gov availability — **ANSWERED** (evidence `01-azure-ado-research-notes.md`, accessed 2026-09-07): Defender CSPM **GA in Gov**; **Defender for DevOps commercial-only** (no Gov connector); Front Door Standard/Premium **GA in Gov**; App Gateway WAF v2, SignalR, Service Bus Premium, Functions Premium, Logic Apps Standard all GA in Gov. **Static Web Apps: not available in current public Gov availability docs; Container Apps: GA in Azure Government cloud but US Gov Virginia/Texas per-region confirmation remains ambiguous in current public products matrix; Azure Managed Redis (`Microsoft.Cache/redisEnterprise`): global-Azure preview only (not available in Gov); APIM Basic v2/Standard v2/Premium v2: no US Gov regions listed in official v2 region table (treated as not available in US Gov Virginia/Texas).**
3. APIM tier — **MOOT for current state: no APIM exists in the commercial tenant** (Dec-2025's 3 instances gone/invisible). For any future APIM: classic Developer/Premium = VNet injection; Standard v2 = outbound integration + inbound PE; Premium v2 = full injection (GA, no classic→v2 migration); v2 Gov availability unlisted.
4. Key Vault — **ANSWERED**: RBAC on all 8; purge protection missing on 2 (`k12-rds-integration`, `lowerenvfdcfnccert`); soft delete 7 d on the 3 `*apikv`.
5. SPN secrets / PATs per pipeline — still open (**needs ADO org access**); note: WIF is GA with in-place conversion, agents can register via SP (no PAT), Entra Workload Identities GA in Gov.
6. Splunk mechanism — **RECOMMENDED**: diagnostic settings dual-homed to Event Hub (Microsoft-preferred low-latency path) or LAW data-export rules → Event Hubs, consumed by the Splunk Add-on for Microsoft Cloud Services; Defender alerts via continuous export (cross-tenant capable via REST API); 3-year tamper-proof tier via export to immutable storage. `[CFI to confirm which side hosts Splunk ingestion]`
7. Ledger table list from the PO — still open.
8. Track B in the Oct 31 handover vs Phase 2 proposal — still open (leadership call).
