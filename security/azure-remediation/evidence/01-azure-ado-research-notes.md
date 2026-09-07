# Azure / ADO research notes — remediation-plan open items (2026-09-05)

Continues the research thread on branch `claude/k12-devcontainer-azure-research-ky409a`.
Answers plan open items from `07AzureSecurityRemediationPlan.md` §8 and `Defender-Remediation-Plan.md` §9,
sourced from Microsoft Learn on 2026-09-05. `[verify]` = confirm in tenant / products-by-region.

## 1. Defender for Cloud in Azure Government (plan §8 item 2)

**Available (GA in Gov / FedRAMP High):** Defender for Cloud itself, Foundational CSPM
(secure score, MCSB recommendations, asset inventory), **Defender CSPM plan** (incl. agentless
VM + secrets scanning, attack path analysis, risk prioritization, governance, regulatory
compliance, sensitive-data scanning, agentless Kubernetes/containers VA, continuous export,
workflow automation).

**NOT available in Azure Government:**
- **Defender for DevOps / the Azure DevOps connector** — "Clouds: Commercial ✓, National (Azure
  Government, 21Vianet) ✗" (quickstart-onboard-devops). DevOps security posture: Preview in
  commercial, **NA in Gov**. PR annotations, code-to-runtime mapping: NA in Gov.
- CIEM, ServiceNow integration, External Attack Surface Management, API security posture,
  Copilot in Defender for Cloud, Data & AI security dashboard.

**Consequence for the plan:** G2 stays as written for the commercial subs (the two existing
`securityconnectors` are already there — confirmed present in the Dec 2025 inventory). For the
Gov tenant, DevOps-side coverage must come from the pipeline itself (MSDO + SBOM in every repo,
gap S1) — there is no Defender DevOps connector to lean on. Defender plan set for stage/prod
(App Service, SQL, Storage, Containers, Key Vault, Resource Manager) is available in Gov
`[verify plan-by-plan in the Gov portal — the support matrix is feature-level]`.

Refs:
- https://learn.microsoft.com/azure/defender-for-cloud/support-matrix-defender-for-cloud
- https://learn.microsoft.com/azure/defender-for-cloud/quickstart-onboard-devops
- https://learn.microsoft.com/azure/defender-for-cloud/devops-support
- https://learn.microsoft.com/azure/azure-government/documentation-government-product-roadmap

## 2. Azure DevOps: WIF, PAT-free agents, Managed DevOps Pools (K12-8497, I1, S2)

- **Workload identity federation for Azure (ARM) service connections is GA.** Convert existing
  secret-based connections in place ("Convert" action on the service connection); pipelines
  don't change. Recommended variant: **WIF backed by a user-assigned managed identity** (avoids
  app-registration secrets entirely and the 1-hour assertion issue).
- **PAT-free agent registration is supported**: the pipeline agent accepts `--auth SP`
  (service principal) or Entra user auth instead of a PAT — this addresses the K12-8497
  "PATs on runners" finding even before Managed DevOps Pools.
- **Managed DevOps Pools: commercial Azure only.** "Managed DevOps Pools is supported with
  Azure DevOps Services and Azure public cloud, and isn't supported on any other national cloud
  offerings" (architecture-overview). Unsupported regions explicitly include US Gov.
  **Consequence:** the target "Managed DevOps Pool agent in the VNet" (§2 Delivery row) works
  for Dev/Testing/Staging (commercial) only. For Gov pre-prod/prod use **VMSS agent pools or
  self-hosted agents in the Gov VNet, registered via service principal (no PAT), images
  digest-pinned** — same posture, different host.
- **WIF → Gov subscriptions:** Entra **Workload Identities are GA in Azure Government**
  (Gov GA roadmap). The service-connection manual flow lets you pick the Azure Government
  environment. `[verify: create one manual WIF (managed-identity) service connection against
  sub-k12-stage and run a no-op pipeline before converting the rest]`
- ADO already offers for the CI/CD redesign lane: YAML templates + `extends`, environments with
  approvals & checks, parallel-job control, pipeline caching, MSDO extension, GitHub Advanced
  Security for Azure DevOps (secret/code/dependency scanning) — inventory what the org has
  enabled vs. these before building new templates. `[needs ADO org access — not reachable from
  this workspace]`

Refs:
- https://learn.microsoft.com/azure/devops/pipelines/release/configure-workload-identity
- https://learn.microsoft.com/azure/devops/release-notes/2023/sprint-227-update
- https://learn.microsoft.com/azure/devops/managed-devops-pools/architecture-overview

## 3. APIM tier decision (plan §8 item 3, gap N3)

- Classic tiers: VNet **injection** (external or internal) needs **Developer or Premium**.
  Basic/Standard support only inbound private endpoint.
- **v2 tiers are GA**: Standard v2 = outbound VNet **integration** + inbound private endpoint
  (gateway stays public unless PE + public access off). **Premium v2 = full VNet injection**
  (gateway only, runs on dedicated ASE).
- **No in-place migration** classic → v2; v2 is for new instances, and multi-region + Event
  Grid/Event Hubs metric features are still missing in v2.
- v2 region availability is a subset of regions and the current official v2 table lists no
  US Gov regions for **Basic v2 / Standard v2 / Premium v2** (treated as **not available in US Gov
  Virginia/Texas** as of 2026-09-07; source:
  https://learn.microsoft.com/en-us/azure/api-management/api-management-region-availability).
  Gov compare page still only calls out Azure AD B2C integration differences for APIM.
- Practical read for K12: current instances are 3× (dev/test/staging, tier `[confirm]`,
  likely Developer). Non-prod: Developer tier already allows internal VNet injection at no
  extra cost. Prod (Gov): classic **Premium** is the safe VNet-injection choice today; consider
  Standard v2 + inbound private endpoint only if the Front Door → APIM path stays
  header-restricted rather than network-isolated.

Refs:
- https://learn.microsoft.com/azure/api-management/virtual-network-concepts
- https://learn.microsoft.com/azure/api-management/v2-service-tiers-overview
- https://learn.microsoft.com/azure/api-management/api-management-region-availability

## 4. Edge & platform availability in Gov (plan §8 item 2, N4/N5, Track B)

| Service | Azure Government status | Impact |
|---|---|---|
| Front Door Standard/**Premium** | **GA** (deployed from US Gov Arizona/Texas) | N4 target OK in Gov |
| Application Gateway v2 (WAF v2) | **GA** | N5 / Track B OK |
| **Static Web Apps** | **Not available (Gov not listed in current public availability docs)** — not listed in Gov GA roadmap; product matrix entry is only non-regional SWA (no Gov geography). Source: https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-product-roadmap and https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/table (accessed 2026-09-07). | Target "SWA Standard + private endpoint" for Admin portal is at risk for Gov prod. Use fallback: App Service static hosting or Front Door + Storage static website in Gov. |
| **Container Apps** | **GA (Azure Government cloud)** per FedRAMP/DoD IL2 compliance scope, but **US Gov Virginia/Texas per-region confirmation remains ambiguous** because the current public Products-by-region table endpoint doesn't expose Gov geographies. Source: https://learn.microsoft.com/en-us/azure/azure-government/compliance/azure-services-in-fedramp-auditscope and https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/table (accessed 2026-09-07). | Track B's core platform can proceed only with tenant-side region validation for US Gov Virginia/Texas before Gov prod commitment. |
| **Azure Managed Redis** | **Not available in Azure Government (Preview in global Azure only)**. Source: https://learn.microsoft.com/en-us/azure/redis/planning-faq (accessed 2026-09-07). | Track B Redis target: commercial only for now; Gov keeps Azure Cache for Redis (Premium for VNet/persistence). Also note AMR quirks: **no VNet injection (Private Link only), no Entra RBAC data-plane roles yet, TLS-or-not chosen at creation, clustered by default** |
| **API Management v2 tiers (Basic v2 / Standard v2 / Premium v2)** | **Not available in US Gov Virginia/Texas** (official v2 region table lists no US Gov regions). Source: https://learn.microsoft.com/en-us/azure/api-management/api-management-region-availability (accessed 2026-09-07). | Track B should assume classic APIM tiers for Gov until v2 Gov regions appear in official region table. |
| SignalR, Service Bus Premium, Event Hubs (+Premium), Functions Premium, Logic Apps Standard, App Config, Key Vault, ACR, SQL DB, ADLS Gen2, NAT (VNet NAT), Private Link, Azure Policy | GA in Gov | Track A hardening carries to Gov unchanged |

Ref (accessed 2026-09-07): https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-product-roadmap
Ref (accessed 2026-09-07): https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/table
Ref (accessed 2026-09-07): https://learn.microsoft.com/en-us/azure/azure-government/compliance/azure-services-in-fedramp-auditscope
Ref (accessed 2026-09-07): https://learn.microsoft.com/en-us/azure/redis/planning-faq
Ref (accessed 2026-09-07): https://learn.microsoft.com/en-us/azure/api-management/api-management-region-availability

## 5. Splunk forwarding mechanism (plan §8 item 6, L2)

Recommended shape (matches CFI "3 y retained, ≥ 4 months online" and SA-11 evidence needs):
1. **Resource logs → Splunk:** keep diagnostic settings → LAW for the 120 d interactive window,
   and either (a) add **a second diagnostic-setting destination straight to an Event Hub**
   (lower latency; Learn explicitly prefers this when the resource already has diagnostic
   settings) or (b) configure **LAW data-export rules → Event Hubs** for the tables CFI wants
   (continuous, unfiltered per table, Azure-backbone only). Splunk consumes via the **Splunk
   Add-on for Microsoft Cloud Services** (Event Hubs input).
2. **Defender alerts/recommendations/secure score → Splunk:** Defender for Cloud **continuous
   export → Event Hub** (streaming; can target another tenant via REST API — relevant for
   Gov→commercial Splunk if CFI's Splunk lives on one side `[confirm which tenant hosts Splunk
   ingestion]`).
3. **3-year tamper-proof tier:** LAW data export (or archive) → Storage account with
   **immutability policy** — cheaper than 3 y in Splunk/LAW and satisfies the audit-retention
   policy; keep Splunk for the online window.

Refs:
- https://learn.microsoft.com/azure/azure-monitor/logs/logs-data-export
- https://learn.microsoft.com/azure/defender-for-cloud/benefits-of-continuous-export
- https://learn.microsoft.com/azure/defender-for-cloud/continuous-export

## 6. Offline dry-run of the plan's scope filter

`00-inventory-dryrun-portal-only.md`: Dec 2025 commercial inventory = **184 resources; 35
excluded as k12-cms estate; 149 in scope** (development 56 / testing 39 / staging 31 + shared
RGs). Notables vs. the gap register: 3 APIM instances, 4 Key Vaults, 12 storage accounts,
3 SQL servers, 12 Front Door profiles, 12 Static Web Apps, 4 SignalR, 2 Defender DevOps
connectors, 5 managed identities, no Container Apps environment rows and no Service Bus rows in
this export `[old export — refresh with query 06]`. Gov-tenant inventory not present in this
CSV — the runner script must be executed once per cloud.

## 7. What still needs tenant access (can't be researched from docs)

- The actual Defender export (plan §1 queries) — runner script ready, needs `az login`.
- Defender plan states per subscription (G2), Key Vault RBAC/purge state (I4), SQL Entra-only
  state (I2), public-network-access per PaaS (N2), APIM tiers per env (N3), WAF policy state
  (N4), diagnostic-settings coverage (L1).
- ADO org config: which service connections still use SPN secrets/PATs, parallel jobs, MSDO
  coverage per repo (S1), agent pool inventory (S2).
