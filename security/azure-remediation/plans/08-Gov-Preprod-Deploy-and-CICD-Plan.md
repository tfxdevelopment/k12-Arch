# 08 — Gov Preprod Deploy and CI/CD Plan (v0.1, 2026-09-13)

Companion to plans 05–07. Context capture and standing rules are in `ops/handoff/2026-09-13-k12-session-handoff.md`. Source facts come from read-only reads of ADO `k12-infra@main` (`99ebc95a`) and Angelo's `feature/preprodUpdates@3e0a960e` (PR 6078), Microsoft Learn (Gov availability), and Jira epic K12-7534.

## Implementation plan (revised 2026-09-13)

## B0. Decisions recorded from Terry (2026-09-12/13)

| Topic | Decision |
|---|---|
| First target | **Gov preprod**, outcome "deployable in Gov". Prod later, reusing the same changes. |
| Where preprod lives | Gov sub `f2a2966b-27ff-4694-88c5-c283e957d0ce` (seaacfi), tenant `0e166b06-…`, `usgovvirginia`, state `k12infra/tfstate/preprod.tfstate`. **Brownfield**: applied in July (PRs 4839/4897/4951/5119; Key Vault `preprodapikv` exists, was soft-deleted and restored). |
| Base branch | ADO `k12-infra` `feature/preprodUpdates` (Angelo, PR 6078, head `3e0a960e`, 3 commits, 5 files, targets `main`, no reviews yet). Cut our branch from it; draft PR **targets `feature/preprodUpdates`**; retarget to `main` after 6078 merges. |
| Angelo's Gov-incorrect values | Fix in our branch **and** draft review comments for PR 6078 (approval gate before posting). |
| Hardening scope | "Safe hardening bundle" (Terraform-native, app-transparent). SQL Entra-only auth and storage shared-key-off are follow-ups. |
| Discovery and apply | From Terry's WSL machine. This cloud session never logs into Gov. |
| Gov agent pool | **Container Apps Jobs** (KEDA `azure-pipelines` scaler, scale-to-zero). VMSS pools and Managed DevOps Pools are Azure Public only (verified in docs). |
| Jira | Epic **K12-7534 "Pre-Prod UAT environment"** (In Development, PI7). New stories under it (titles in B3 step 0; creation is an approval gate). Related existing stories: K12-9398 (split-API Terraform = Angelo's work), K12-7867 (pipelines, In Progress), K12-9368 (monitoring/logs), K12-9397/K12-9409 (Entra), K12-8385 (fix preprod TF, under K12-3511). |
| Attribution | None on ADO commits/PR/comments. Normal attribution on GitHub k12-Arch. |

## B1. What is wrong with Gov preprod today (verified in ADO `k12-infra`)

Sources: `main@99ebc95a`, `feature/preprodUpdates@3e0a960e` (diff saved at `the cloud-session scratchpad `ado-infra/prs/diff6078.out` (re-derive with `git diff main...feature/preprodUpdates` in ADO `k12-infra`)`), module files as of `main@99ebc95a`.

| # | Finding | Where | Effect in Gov | Fix |
|---|---|---|---|---|
| F1 | Private DNS zones are created with **commercial** names and every private endpoint binds to them | `modules/core/dns.tf` (11 zones), `modules/api-enrollment/network.tf` (9 PEs keyed by literal zone name), `modules/messaging/main.tf:38` | Gov FQDNs (`*.database.usgovcloudapi.net`, `*.vaultcore.usgovcloudapi.net`, `*.core.usgovcloudapi.net`, `*.azurecr.us`, `*.servicebus.usgovcloudapi.net`, `*.azurewebsites.us`) never resolve to the PE IP; with public access disabled the SQL/KV/storage/ACR/Service Bus calls fail | Cloud-aware zone map keyed by logical name (`sql`, `vault`, `blob`, `file`, `queue`, `table`, `dfs`, `acr`, `servicebus`, `signalr`, `sites`), `moved` blocks so commercial envs stay zero-diff; consumers use logical keys |
| F2 | `sql_connection_string` uses `.database.windows.net` | `environments/preprod/locals.tf:108` | API cannot reach SQL | `.database.usgovcloudapi.net` |
| F3 | `blob_storage_connection_string` still the greenfield placeholder; staging's pattern uses `core.windows.net` | `preprod/locals.tf:116` | Blob access broken | Wire to `data.azurerm_key_vault_secret.storage_account_key` (Angelo already un-commented it) with `AccountName=preprodapienrollment;EndpointSuffix=core.usgovcloudapi.net` |
| F4 | Angelo removed `sql_azuread_admin_login/object_id` | `preprod/main.tf` (PR 6078) | Module default is the commercial group `50a9f81f…`, absent in the Gov tenant; apply fails or breaks SQL admin | Restore `k12-devsecops-randstad` / `8990340b-2506-4b8f-9c4e-a34ff8d8077d` |
| F5 | Angelo removed `create_adf = true` | same | Default `false` → Terraform destroys the preprod Data Factory (created in July) | Restore (confirm with `terraform state list`) |
| F6 | Angelo removed `k12_contributors_kv_rw_principal_id_prod` | same | `azurerm_role_assignment.k12_contributors_kv_rw` gets an empty principal for preprod → apply error and loss of Key Vault Secrets Officer for the devsecops group | Restore `8990340b…` |
| F7 | Angelo removed `website_contentshare` | same | `WEBSITE_CONTENTSHARE` empty while `WEBSITE_CONTENTOVERVNET=1` | Restore `preprod-api-enrollment` |
| F8 | ACI agents copied from staging: pool `k12-staging-pool`, image `stagingk12acr.azurecr.io@sha256:8b66…` (commercial ACR), UAMI `mi-k12-ops-acr-pull` expected in RG `preprod` | `preprod/locals.tf`, `preprod/main.tf`, `modules/core/devops_agents.tf` | Gov ACI cannot pull a commercial ACR image; preprod jobs would land in the staging pool | `enable_devops_agents = false` for preprod; agents move to the ACA Jobs module (B2.3) |
| F9 | `web-apis` copied from staging: app names `k12-stage-*`, `entra_valid_audiences` = six **commercial** app registration IDs, Redis location patched by a conditional | `preprod/main.tf`, `modules/web-apis/main.tf:186` | Wrong names; JWT audiences of a different tenant; brittle location | `k12-preprod-*`; audiences from the Gov tenant app registrations (`k12-entra-infra` Preprod-Admin/Household/Provider/School; client IDs via `terraform output` or `az ad app list` in Gov); Redis `location = var.location` |
| F10 | `web-workflows` app settings carry empty plaintext secret placeholders and the module creates its own Log Analytics workspace | `preprod/main.tf` (new module block), `modules/web-workflows/main.tf` | Secrets in app settings; LAW sprawl | Key Vault references + central LAW (module variable, null = today's behaviour) |
| F11 | SignalR `public_network_access_enabled = true` set explicitly | `preprod/main.tf` | Public data plane although a SignalR PE exists | `false` in the hardening commit (verify app path via VNet integration) |
| F12 | P2S VPN gateway hard-codes the **commercial** Entra tenant/issuer/audience and is not gated by a variable | `modules/core/vpn.tf:43-52` | Gov gateway (if present) authenticates against the wrong cloud | `enable_vpn_gateway` var + Gov values (`login.microsoftonline.us`, tenant `0e166b06…`, Gov Azure VPN app ID — verify) |
| F13 | `azurerm_key_vault_access_policy` on an RBAC-enabled vault with a hard-coded object ID | `modules/core/app_regs.tf` | Access policies are rejected/ignored when RBAC is on | Gate off for preprod (verify plan) |
| F14 | Plaintext default secrets in code: `sql_administrator_login_password = "ComplexP@ssw0rd123!"`, `vm_admin_password` | `modules/api-enrollment/variables.tf:190-195`, `modules/core/variables.tf:17-22` | Known admin password in git | `random_password` → KV secret; remove defaults (do not copy the values anywhere) |
| F15 | Front Door `Standard_AzureFrontDoor`, WAF commented out, and the commented code uses the App Gateway WAF resource type | `modules/web-frontend/app.tf:108-215` | No managed WAF rules (Premium only) | See B2.2 |
| F16 | No NSGs on any subnet; LAW retention 30 d; no SQL auditing; KV `soft_delete_retention_days = 7` under `ignore_changes = all` | `modules/core/network.tf`, `modules/logging/main.tf:7`, `modules/api-enrollment/db.tf`, `app.tf:169-184` | Baseline gaps from the remediation register (N7, L4, D4, S3) | See B2.2 |
| F17 | Preprod `preprodapikv` and `preprodk12acr` have public access disabled; Terry's WSL `terraform plan` must read KV secrets (data sources active in Angelo's branch) | `preprod/data.tf`, `modules/api-enrollment/app.tf` | A local plan needs a private path to the vault | See B6 risk R1 (VPN vs pipeline-run) |
| F18 | Web app SCM allow-list uses commercial service tags `AzureCloud.${location_shortname}` and `AzureCloud.centralus` (ADO org region) | `modules/web-frontend/app.tf:60-80` | `AzureCloud.usgovvirginia` must be verified; `centralus` is meaningless for the Gov pool | Variable list of SCM service tags/IPs; preprod = NAT egress IP of the agent subnet |
| F19 | Availability web test targets `https://<env>-api-enrollment.azure-api.net/…` (commercial APIM host; no APIM in preprod) | `modules/api-enrollment/app.tf:42` | Test always fails / alerts | `availability_test_url` variable (Gov API hostname) |
| F20 | `data.azurerm_subnet.aci` is looked up unconditionally for the NAT gateway association | `modules/core/nat_gateway.tf` | Fails as soon as `enable_devops_agents = false` (our preprod setting) | Reference the subnet resources directly, gated; associate the NAT gateway with the new ops-ACA subnet and `app-integration-subnet` |
| F21 | Preprod Entra app (`k12-entra-infra/Preprod-Admin`) redirects to `admin-prod-frontend-….z01.azurefd.us`, a Gov Front Door endpoint named for **prod** | `k12-entra-infra` | Prod resources or a `prod.tfstate` may already exist in Gov; prod may not be greenfield | Discovery checks RG `prod` and state blobs before any prod planning |

Gov service facts verified (Microsoft Learn, 2026-09-13): Front Door Standard/Premium GA in Gov (FedRAMP High, IL4/5); managed WAF rule sets need **Premium**; Container Instances and Container Apps in Gov audit scope; SP registration for agents (`--auth SP`, agent ≥ 3.227.1) and OAuth token as `--token` supported; WIF service connections for Gov are created **manually** and keep the Azure DevOps issuer (not in the July 2027 deprecation); ACA jobs cannot run Docker; KEDA `azure-pipelines` scaler supports PAT and Azure workload identity.

## B2. Change list for the ADO `k12-infra` branch

Branch `feature/K12-<story-a>-preprod-gov-alignment` from `feature/preprodUpdates@3e0a960e`; draft PR → `feature/preprodUpdates`; commit subjects `K12-<key>: …`; no attribution trailers. Every module change is behind a variable whose default preserves today's behaviour so `development`/`testing`/`staging` plans stay **zero-diff** (gate in B5).

### B2.1 Commit 1 — Gov-correctness (F1–F9, F12, F13)

| File | Change |
|---|---|
| `terraform/modules/core/dns.tf` | `locals { is_gov = startswith(lower(var.location), "usgov") }`; `zone_names = { sql = is_gov ? "privatelink.database.usgovcloudapi.net" : "privatelink.database.windows.net", vault = …vaultcore.usgovcloudapi.net/…vaultcore.azure.net, blob/file/queue/table/dfs = …core.usgovcloudapi.net/…core.windows.net, acr = privatelink.azurecr.us/privatelink.azurecr.io, servicebus = …servicebus.usgovcloudapi.net/…servicebus.windows.net, sites = privatelink.azurewebsites.us/privatelink.azurewebsites.net, signalr = verify Gov name (docs list only `privatelink.service.signalr.net`; confirm from the live SignalR hostname) }`; `for_each = local.zone_names` keyed by logical name; `moved` blocks from the old literal keys; output `private_dns_zone_ids` keyed by logical name |
| `terraform/modules/api-enrollment/network.tf` | Replace the 9 literal keys (`private_dns_zone_ids["privatelink.database.windows.net"]` …) with logical keys |
| `terraform/modules/messaging/main.tf:38` | `["servicebus"]` |
| `terraform/environments/preprod/locals.tf` | F2, F3; drop the ACI agent locals; add ACA agent locals (B2.3) |
| `terraform/environments/preprod/main.tf` | F4–F7 restored on `enrollment-api`; `web-apis` names `k12-preprod-*` and Gov audiences (or an explicit empty list plus TODO until K12-9397/K12-9409 land); `core` gets `enable_devops_agents = false` |
| `terraform/modules/web-apis/main.tf` | Redis `location = var.location` |
| `terraform/modules/core/vpn.tf` + `variables.tf` | `enable_vpn_gateway` (default `true`), `count` on the three resources; Gov-aware `aad_*` values (`login.microsoftonline.us`, tenant `0e166b06…`, Gov Azure VPN app ID — verify in discovery) |
| `terraform/modules/core/app_regs.tf` | Gate the access-policy resource off when the vault is RBAC-only (count on a `create_kv_access_policy` var, default true) |
| `terraform/modules/core/nat_gateway.tf` | F20: drop the data source; associate via resource references (`aci` when enabled, ops-ACA subnet, `app-integration-subnet`) |
| `terraform/modules/web-frontend/app.tf` | F18: `scm_allowed_service_tags` / `scm_allowed_ips` variables (defaults = today's two tags) |
| `terraform/modules/api-enrollment/app.tf` | F19: `availability_test_url` variable (default = today's URL) |
| `terraform/environments/preprod/.terraform.lock.hcl` | Commit the lock file if absent (provider `~> 4.12` already allows 4.x latest; no constraint change) |

### B2.2 Commit 2 — Safe hardening bundle (F10, F11, F14–F16 + register items)

| Area | Change (variable, preprod value) | Register ref |
|---|---|---|
| Front Door + WAF | `web-frontend`: `frontdoor_sku_name` (preprod `Premium_AzureFrontDoor`), `enable_waf` → `azurerm_cdn_frontdoor_firewall_policy` (mode **Detection** first, `Microsoft_DefaultRuleSet` 2.1 + `Microsoft_BotManagerRuleSet` 1.1, custom rate-limit rule) + `azurerm_cdn_frontdoor_security_policy`; `certificate_name_check_enabled = true` on the origin; diagnostic settings (`FrontDoorAccessLog`, `FrontDoorWebApplicationFirewallLog`) to the central LAW. **Gate on the plan line**: the SKU change must show `~ update in-place`; if the provider shows `-/+ replace`, endpoint hostnames (`*-frontend-<random>.z01.azurefd.us`) change and the Entra redirect URIs (`k12-entra-infra`) and storage CORS must be updated in the same window, or the Premium/WAF step is deferred to a consolidated single profile. 4 profiles per environment → 4 Premium base fees; consolidation to one profile per env is a follow-up story | G-WAF |
| App Service hardening | `ftps_state = "Disabled"`, `minimum_tls_version = "1.2"`, `http2_enabled = true`, remote debugging off, `https_only` (already) on web-frontend, web-workflows and web-apis apps (variables, defaults = today) | — |
| NSGs | `core/network.tf`: NSGs on `app-integration-subnet`, `private-endpoints-subnet` (`private_endpoint_network_policies = "Enabled"`), and the new ops-ACA subnet; rules: allow VirtualNetwork + AzureLoadBalancer inbound, deny Internet inbound, allow outbound; NSG flow logs to LAW (`enable_nsg_flow_logs`, default false) | N7 |
| Logging | `logging`: `retention_in_days` var (preprod **365**); optional diagnostic settings for Front Door profiles, Service Bus, SignalR, storage (blob), ACR, Redis, CAE; `web-workflows` and `api-enrollment` ACA logs accept `log_analytics_workspace_id` (null = own LAW, today's behaviour) | L4 |
| SQL | `azurerm_mssql_server_extended_auditing_policy` (log to LAW, `log_monitoring_enabled = true`) + `master` db diagnostic `SQLSecurityAuditEvents`; keep `azuread_authentication_only = false` (follow-up) | D4 |
| Secrets | `random_password` + KV secret `sql-admin-password` feeding `administrator_login_password`; `vm_admin_password` default removed (bastion disabled; make it `default = null`, required when `enable_bastion_host`) | F14 |
| SignalR | preprod `signalr_public_network_access_enabled = false`; new `signalr_local_auth_enabled` var (default true; follow-up to flip once the API uses identity) | S3 |
| Key Vault | `soft_delete_retention_days` 90 — blocked by `lifecycle { ignore_changes = all }` on the vault; narrow the ignore to `[tags]` in a separate, reviewable change, or set once via `az keyvault update` (approval) | G-KV |
| Redis (web-apis) | `public_network_access_enabled = false` + PE (`redis` zone `privatelink.redis.cache.usgovcloudapi.net`) behind `redis_private_endpoint` var; keep `redis_version` 6 for now (upgrade is an app-team item) | — |
| State account | Outside Terraform: on `k12infra` enable blob versioning + soft delete, keep RBAC-only auth (`storage_use_azuread = true` already), restrict public access to Terry's IP/NAT IP — `az` commands, approval gate | — |
| Platform guardrails (separate root) | New `terraform/platform/gov-subscription/` (state key `platform-gov.tfstate`) from k12-Arch `defender-package/terraform/platform-guardrails/{defender,policy}`: Defender plans (AppServices, SqlServers, StorageAccounts `DefenderForStorageV2`, KeyVaults, Containers, Arm; no VM plan — no VMs), auto-provisioning/LAW link, **Audit-mode** assignment of the NIST SP 800-53 R5 built-in initiative at subscription scope, Deny only at RG `preprod` scope for storage public access and KV without purge protection. Subscription is shared with prod → subscription-scope changes are their own approval gate with a cost note (Defender App Service/SQL ≈ $15 per instance or server per month; Storage per account + transactions; Containers per vCore) | D1–D3, P1 |

### B2.3 Commit 3 — Gov agent pool as Container Apps Jobs

New module `terraform/modules/devops-agents-aca/` (consumed by preprod; commercial envs untouched):

| Resource | Notes |
|---|---|
| Subnet `ops-aca-subnet` `${network_address}.9.0/24` (in `core`, output) | Delegated `Microsoft.App/environments`; NAT Gateway association (extend `core/nat_gateway.tf` pattern used for `aci-subnet`) so egress to `dev.azure.com` is a static IP |
| `azurerm_container_app_environment` `<env>-ops-cae` | Workload profile `Consumption` (Gov requirement, same as `api-enrollment/app.tf:239`), `infrastructure_subnet_id`, `internal_load_balancer_enabled = true`, LAW = central. Not the API's CAE: that one is not VNet-integrated |
| `azurerm_user_assigned_identity` `<env>-ado-agent-mi` | Azure-side only: `AcrPull` on `preprodk12acr`, `Key Vault Secrets User` on `preprodapikv` (secret references), later `Storage Blob Data Contributor` on `k12infra` for pipeline-run Terraform. **It cannot authenticate to ADO**: the org is bound to the commercial tenant `3f80a41f…`, and Gov-tenant identities are not admitted |
| Registration identity | Commercial-tenant app registration `k12-ado-agent-preprod` (client secret stored in `preprodapikv` as `ado-agent-sp-secret`, yearly `time_rotating` like `core/app_regs.tf`), added to the ADO org as a user (Basic) with **Administrator** on `k12-preprod-pool` (ADO write, approval). Registration = `config.sh --unattended --auth SP --clientid … --clientsecret … --tenantid 3f80a41f… --pool k12-preprod-pool --agent $AZP_AGENT_NAME --replace --acceptTeeEula`, then `run.sh --once`, `config.sh remove` on exit. PAT-free for registration; the Gov `k12devops-docker-sp` from `app_regs.tf` cannot serve this |
| `azurerm_container_app_job` `<env>-ado-agent-placeholder` | Manual trigger, `AZP_PLACEHOLDER=1`, run once (registers the offline placeholder the pool needs; never delete it from the pool) |
| `azurerm_container_app_job` `<env>-ado-agent` | Event trigger, `custom_rule_type = "azure-pipelines"`, metadata `poolName=k12-preprod-pool`, `targetPipelinesQueueLength=1`, `parent=<placeholder agent name>`; `polling_interval 30`, `min 0 / max 5`, `parallelism 1`, `replica_timeout 5400`, CPU 2 / 4 Gi; scaler auth = `personalAccessToken` from KV secret `ado-pat-token` (Angelo's data source), a **read-only** PAT (`Agent Pools (Read)`) owned by a service account, 90-day expiry with a rotation runbook — the KEDA workload-identity option would again be a Gov identity, so it is not expected to work; try the rule `identity` once in the pilot and record the result |
| Runner image | Reuse `terraform/modules/core/runner/Dockerfile` (+ `kaniko` executor for daemon-less image builds, Terraform 1.15.8, `az`, .NET SDK 10, PowerShell refreshed, agent tarball baked in); `start.sh`: `AZP_AUTH=SP|PAT`, `AZP_PLACEHOLDER`, `--once`; agent name = `$CONTAINER_APP_JOB_EXECUTION_NAME`; keep the smoke-test contract (`smoke-test.sh` + `terraform version`) and the digest-pinned release rules from `ADO_RUNNER_STABILIZATION.md` / PR 5574 |
| Image supply chain (Gov) | Runner image bootstrap: Terry builds `linux/amd64` in WSL and pushes to `preprodk12acr.azurecr.us` — requires `acr_public_network_access` + `acr_allowed_ips` module vars (default off; preprod: dev IPs + NAT IP, `default_action = Deny`) or a temporary allow. App images: build on the ACA agents with kaniko and push through the ACR private endpoint (pilot); ACR Tasks are not usable against a network-restricted registry without an ACR agent pool (Gov availability unverified) |

ADO objects (writes, one approval): pool `k12-preprod-pool` (self-hosted, org level), identity added to org + pool admin, environment `tf-preprod` with approvers (stop sharing `tf-production`), variable group `k12-preprod`; reuse WIF connection `k12-production` now, dedicated `k12-preprod` connection scoped to RG `preprod` as a follow-up.

### B2.4 Phase 2 — pipelines (story K12-7867)

| File | Change |
|---|---|
| `azure-pipelines-terraform.yml` (defs 74/119) | Add `preprod → k12-preprod / tf-preprod` mapping; per-env pool (`k12-preprod-pool` for preprod, hosted for commercial until their pools move); remove the "Debug: Test Graph access to app object" step; `ARM_ENVIRONMENT=usgovernment` for Gov envs; `-lock-timeout=5m`; keep plan-artifact → apply; consolidate to one definition (`k12-infra`, disable 74) |
| `azure-pipelines-terraform-pr.yml` (def 86) | `terraform fmt -check` becomes an error; add `tflint` and `trivy config` (or `checkov`) — start non-blocking, flip to blocking after one clean cycle; plan summary comment already exists |
| `pipelines/templates/terraform-stages.yml` (new) | `extends` template; required-template check on `tf-*` environments (ADO write) |
| `azure-pipelines-runner-image.yml` | Register as a definition (validation only, per `ADO_RUNNER_STABILIZATION.md`); add the kaniko capability to the smoke test |
| `k12-entra-infra` (separate repo) | `provider "azuread" { environment = "usgovernment" }` + backend `environment = "usgovernment"` for `Preprod-*` if those app registrations live in the Gov tenant (discovery); add `client_id` outputs so `web-apis` audiences can be sourced |

## B3. Execution sequence and approval gates

| Step | Who | Action | Gate |
|---|---|---|---|
| 0 | me (Jira write) | Create stories under K12-7534: (a) "Preprod Terraform: Gov-correctness fixes (private DNS zones, endpoints, SQL admin, agents)"; (b) "Preprod safe hardening bundle (Front Door Premium + WAF, NSGs, logging/retention, SQL auditing, secrets)"; (c) "Gov ADO agent pool on Container Apps Jobs (PAT-free)"; (d) "Gov subscription platform guardrails (Defender plans, NIST policy audit)". Link (b) to K12-9368, pipelines work to K12-7867, Angelo's to K12-9398 | **Approval** (titles above; Terry said stories can be generated) |
| 1 | Terry (WSL) | Prereqs: `az` ≥ 2.60 with `az cloud set -n AzureUSGovernment && az login --tenant 0e166b06-… --use-device-code && az account set -s f2a2966b-…` (repo helper `terraform/scripts/azcloudswitch/azcloudswitch.sh gov`); Terraform 1.15.8 (`tenv`); clone into the WSL filesystem with `core.autocrlf=input`; Git Credential Manager for ADO. Run `discover-gov-preprod.sh` (I write it into k12-Arch; only `show/list/get` plus `terraform plan`, never printing secret values) covering: **identity** (Terry's role assignments on the subscription, RG `preprod`, `k12infra`; `Microsoft.Authorization/roleAssignments/write` is needed because the modules create role assignments; Entra membership via `graph.microsoft.us`); **state** (`k12infra` PNA/shared-key/versioning/soft-delete, blobs in `tfstate` — `preprod.tfstate` and whether `prod.tfstate` exists); **inventory** (`az group list`, `az resource list -g preprod` by type, RG `prod` presence — F21); **DNS** (private DNS zone names in `preprod`, private-endpoint states, SQL FQDN suffix, SignalR hostname suffix → Gov zone name); **edge/compute** (Front Door profiles + SKUs + endpoint hostnames, CAE, ACR, web apps' VNet integration, VPN gateway config); **Key Vault live config vs code** (PNA, ACLs, RBAC, purge, soft-delete days; secret *names* incl. `storage-account-key`, `ado-pat-token`; `az keyvault secret list` expected network-forbidden from WSL → confirms R1); **principals** (`8990340b…`, `df8b0836…`, `a172c66a…`, `50a9f81f…` in the Gov tenant; `mi-k12-ops-acr-pull` in RG `preprod`; `k12devops-docker-sp`; `PreProd K12 API *` app registrations and client IDs in both tenants); **platform** (registered RPs incl. `Microsoft.App`, `Microsoft.Cdn`, `Microsoft.SignalRService`, `Microsoft.DataFactory`, `Microsoft.Security`, `Microsoft.PolicyInsights`; `usgovvirginia` quotas; `az security pricing list`; policy assignments; LAW retention); `evidence/run-remediation-queries.sh --cloud AzureUSGovernment`; **Terraform baseline** on `feature/preprodUpdates`: `terraform init`, `state list`, `plan -out baseline.tfplan` + `show -json` (the "before" for review; expect failures at the KV data sources if R1 holds); **ADO** (commercial token): pools, service connections (`k12-production` environment = AzureUSGovernment), `tf-production` checks, branch policies on `k12-infra` (build validation on `main` / feature branches → auto-queue risk when the PR opens). Commit the outputs to `evidence/gov-preprod/` | none (read-only) |
| 2 | me | Apply B2.1–B2.3 as three commits in a local clone of ADO `k12-infra`; `terraform fmt -check -recursive`, `terraform validate` for every env root; confirm from step 1 that no build-validation policy fires on PRs into `feature/preprodUpdates`; push branch + open **draft PR** against `feature/preprodUpdates`; PR description ≤ 4,000 chars, attribution-free, listing F1–F21 and the plan expectations per commit | **Approval** before push |
| 3 | Terry (WSL) | `terraform plan` for preprod (expected: zone replacements + PE zone-group updates, connection-string app settings, restored ADF/role/admin, FD SKU + WAF, NSGs, LAW retention, auditing, secrets, ACA module adds); `terraform plan` for `development`, `testing`, `staging` from the same branch = **No changes** | Plan review |
| 4 | Terry (WSL) | Apply in three passes with a state backup before each: 4a Gov-correctness (`-target=module.core`, then full) → smoke S1; 4b hardening → smoke S2; 4c ACA agents after the ADO pool/identity exist → smoke S3; then the platform root (4d) | **Approval per pass** |
| 5 | me | Draft the PR 6078 review comments (one per F4–F9, F11 with the fix reference) → Terry approves → post; mark our PR ready; reviewers DevSecOps | **Approval** |
| 6 | me | Phase-2 pipeline changes (B2.4) as a second PR; ADO environment/pool/template checks | **Approval** for ADO objects |
| 7 | later | Prod: replay the environment-file pattern into `environments/prod` (greenfield two-phase apply per preprod `data.tf`), same modules | new story |

## B4. Handoff and housekeeping

1. Commit the handoff to GitHub `tfxdevelopment/k12-Arch` on branch `claude/k12-devcontainer-azure-research-ky409a` (restarted from `development`, same name as before per the session branch rule)` `` off **`development`** (normal attribution), PR to `development`:
   - `security/azure-remediation/plans/08-Gov-Preprod-Deploy-and-CICD-Plan.md` — this document (numbering follows 05/06/07);
   - `ops/handoff/2026-09-13-k12-session-handoff.md` — the session context capture, plus a pointer in `security/azure-remediation/README.md`;
   - `security/azure-remediation/evidence/gov-preprod/discover-gov-preprod.sh` and, later, its outputs and the redacted plan files; `pr-6078-review-notes.md` (F4–F9, F11 drafts for Terry's approval).
   Terry starts the local session with "read `ops/handoff/2026-09-13-k12-session-handoff.md` and `plans/08-…`, continue at B3 step 1".
2. Corrections to the remediation package: `plans/07-Azure-Security-Remediation-Plan.md` gap register gains F1, F12, F14, F18, F19 (IDs G-DNS, G-VPN, G-PWD, G-TAG, G-URL); `evidence/01-azure-ado-research-notes.md` §2 and plan 07 row S2 no longer list VMSS agent pools for Gov (Azure Public only; Gov options = ACI, Container Apps Jobs, plain VMs) and record the cross-tenant ADO identity constraint.
3. Cloud-session cleanup: done on 2026-09-13 — the K12-8804 check-in routines were one-shots and are all disabled; the k12-Arch #148 subscription ended automatically when the PR merged.

## B5. Verification

- Static: `terraform fmt -check -recursive`, `terraform validate` in `environments/{development,testing,staging,preprod,prod}` and the new module; `tflint` if installed locally.
- Zero-diff gate: `terraform plan` on `development`, `testing`, `staging` from our branch shows **No changes** (the PR pipeline def 86 can run the commercial plans; do not queue the app pipelines).
- Preprod plan review: counts by class (replace / update / add / destroy); **destroy** must list only the commercial-named DNS zones, nothing else.
- S1 (after 4a): from an ACA job console or the API container, `nslookup preprod-api-enrollment.database.usgovcloudapi.net` and `preprodapikv.vault.usgovcloudapi.net` return `10.0.2.x`; `az keyvault secret list` from the VNet works; API health endpoint OK.
- S2 (after 4b): portals load through Front Door; WAF logs appear in LAW (Detection mode); NSG flow logs present; SQL audit events in LAW; `az sql server show` admin login unchanged, password rotated in KV.
- S3 (after 4c): placeholder agent offline in `k12-preprod-pool`; a `pool: name: k12-preprod-pool` hello-world pipeline (new, not an app pipeline) triggers one job execution and completes; `az containerapp job execution list` shows Succeeded; agent registered without a PAT (log line).
- S4 (platform root): `az security pricing list` shows the plans Standard; policy compliance scan runs; no Deny effects outside RG `preprod`.
- Evidence: plan/apply outputs (secrets redacted) saved under `evidence/preprod-gov/`.

## B6. Risks and unknowns

| # | Risk | Mitigation |
|---|---|---|
| R1 | `preprodapikv` has public access disabled, so `terraform plan` from WSL fails at the KV data sources | Preferred: fix the P2S VPN for Gov (F12) and run Terraform from Windows PowerShell or WSL with mirrored networking while on the tunnel; alternative: run plan/apply from the ACA agent via the pipeline (step 6 first); last resort: temporary KV IP allow-list (approval) |
| R2 | Preprod and prod share the Gov subscription | Subscription-scope work lives in the separate platform root, Audit mode only, separate approval |
| R3 | Front Door Premium ×4 profiles per environment | Accept for preprod; follow-up story to consolidate to one profile per environment |
| R4 | KEDA `azure-pipelines` scaler with managed identity on ACA unverified | Pilot; PAT fallback with rotation |
| R5 | Image builds without Docker (kaniko on ACA, ACR Tasks unusable on a restricted registry) | Pilot kaniko; runner bootstrap from WSL with an ACR IP allow-list |
| R6 | Angelo's branch keeps changing; stacked PR needs rebases | Small commits; retarget after 6078 merges |
| R7 | `ignore_changes = all` on the vault hides KV hardening | Separate narrow-the-ignore change |
| R8 | Gov names unverified: SignalR privatelink zone, Azure VPN Gov app ID | Discovery step reads the live hostnames; docs check before the DNS commit |
| R9 | `k12-entra-infra` Preprod app registrations may sit in the commercial tenant (no `environment` in providers) | Discovery confirms; audiences left empty until K12-9397/K12-9409 |
| R10 | ACA jobs cannot run Docker; DACPAC/SqlPackage and .NET builds are fine | Kaniko for images; keep hosted agents for pure build jobs where no private access is needed |
| R11 | Front Door Standard→Premium may be a replacement in the provider (hostname change breaks Entra redirect URIs and CORS) | Plan-line gate in B2.2; defer to a consolidated profile if it replaces |
| R12 | Cross-tenant identity: Gov identities cannot join the commercial-tenant ADO org | Commercial-tenant SP for registration; scoped PAT for the scaler; Gov UAMI only for Azure-side access |
| R13 | ADO org-level writes (pool, org user, environment checks, branch policy) may exceed Terry's ADO permissions | Confirm Project Collection Administrator or line up who applies them |
| R14 | Prod may already exist in Gov (F21) | Discovery checks RG `prod` / `prod.tfstate` before any prod planning; import blocks instead of greenfield if found |
| R15 | Preprod KV drift hidden by `ignore_changes = all`; narrowing it may produce a change set that removes Terry's own network path mid-apply | Apply the IP allow-list first, narrow the ignore in a separate plan |

Defaults I will use unless Terry says otherwise: WAF in Detection for two weeks then Prevention; Front Door Premium on all four preprod profiles now (subject to the R11 plan-line gate); reuse the `k12-production` WIF connection for preprod until a scoped one exists; VPN fix for the durable data-plane path and a time-boxed KV/ACR IP allow-list (variables) for the bootstrap; registration via a commercial-tenant app registration if Terry can create one in `3f80a41f…`, otherwise the existing `ado-pat-token` for the pilot; scaler PAT owned by a service account, `Agent Pools (Read)` only, 90 days.
