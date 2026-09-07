# MyPortal K12 — Disaster Recovery Design Brief (DRAFT for PI8 planning, 9/8)

**Epic:** K12-2537 Disaster Recovery (Luke Samuels, Highest, PI8) · **Story proposed for Terry:** K12-3992 Develop Disaster Recovery strategy (unassigned) · **Feeds:** K12-9268 DR Tabletop Prep (Luke) and K12-7387 DR Table Top (PI9)
**Builds on:** Luke's *Multi-region Support in Azure* (June 2026) and the *02-Azure Architecture* inventory (Dec 2025). Nothing below is implemented yet — Luke's table shows "Implemented: No" across the board.
`[...]` = confirm before Tuesday.

> **v0.2 (2026-09-07) — live commercial-tenant facts merged** (read-only `az` run, evidence in
> `../evidence/`): PITR is **7 d** with **no LTR** on every K12 DB (backup redundancy Geo ✓);
> dev K12 already has a true **Geo secondary** (`secondaryType=Geo`) hosted on
> `development-api-replic` — a ready-made rehearsal asset; the `*enrollmenthns` document stores
> are **Standard_LRS with blob soft delete off** (GRS + soft delete are this brief's asks);
> **no APIM exists** in the commercial tenant (removes the 30–60 min APIM long pole from the
> commercial-rehearsal RTO); Gov availability research: **Front Door Standard/Premium and
> SignalR are GA in Azure Government**, while **Static Web Apps is absent from the Gov GA
> roadmap** `[verify products-by-region]`. Gov-tenant state itself not yet queried.

---

## 1. The ask for Tuesday (what this brief needs from Jacqui / Luke / CFI)

| Decision | Recommendation | Who decides |
|---|---|---|
| RTO / RPO targets for launch | **RPO ≤ 15 min, RTO ≤ 4 h** for the November mock go-live; **RPO seconds, RTO ≤ 1 h** as the Phase 2 target | Jacqui + CFI (Pete Rau / Danny Hite) |
| DR region | Paired region: **US Gov Texas** (primary `[US Gov Virginia]`); lower-environment rehearsals in Central US (paired with East US 2) | Luke + CFI infra |
| Standby posture | **Warm data, cold compute** for launch (Option B below); upgrade path to warm compute (Option C) | CFI (cost) |
| Analytics replica = DR secondary | **Yes** — one readable geo-secondary serves Metabase/Trino reporting *and* DR, instead of paying for two copies | Terry + Luke |
| Who declares a disaster, who executes | CFI Ops declares (Danny Hite / SRE on call); runbook executed by Luke/Steve Pardo with architect on the bridge | Jacqui / CFI |
| Rehearsal cadence | Staging failover drill before mock go-live (Oct), tabletop in PI9 (K12-7387), full drill semi-annually | Jacqui |

---

## 2. Options (RTO / RPO / cost)

| | A — Backups only (today) | **B — Warm data, cold compute (recommended for launch)** | C — Warm data, warm compute (Phase 2) |
|---|---|---|---|
| Database | Automated backups, geo-redundant backup storage → **geo-restore** | **Failover group** to paired region; readable async secondary | Same as B |
| Compute (Container Apps, Function Apps, Logic Apps, APIM, VNet/NAT/VPN) | Rebuild from Terraform after the outage | Rebuild from Terraform **from a pre-tested DR variable set**; images pre-replicated (ACR geo-replication) | Pre-provisioned and scaled to zero / minimum in the DR region; Front Door origin groups with health probes |
| Storage (Blob + ADLS Gen2) | LRS/ZRS | **GRS / RA-GRS** with customer-managed account failover | Same as B |
| Messaging (Service Bus, SignalR) | Rebuild; in-flight messages lost | Rebuild; in-flight messages lost (mitigated by idempotent handlers + outbox) | Service Bus geo-replication / SignalR geo-replication (Premium tiers) |
| RPO | Up to **1 h** (geo-restore) | **Seconds** for SQL (async replication), ≤ 15 min for storage (GRS lag) | Seconds |
| RTO | **Hours to a day** (restore + rebuild + validation, untested) | **≈ 2–4 h** (DB failover < 1 min; Terraform apply ≈ 45–90 min incl. APIM; config + Front Door switch + smoke test) | **≈ 15–30 min** |
| Incremental monthly cost | ≈ $0 | ≈ one additional prod database compute (secondary must match tier) + GRS delta + ACR geo-replica — **largely offset because the secondary replaces the analytics read replica** | + a second set of compute (minimum scale) + Premium messaging tiers |
| Meets epic ("push-button failover")? | No | Partially — push-button data, scripted compute | Yes |

---

## 3. Component-by-component (what replicates, what gets rebuilt)

Per Luke's table, everything stateful has a multi-region option; everything stateless does not — and stateless is fine because Terraform rebuilds it. The design principle is the epic's own: cattle, not pets.

| Component | DR mechanism | Notes / gotchas |
|---|---|---|
| Azure SQL (server per env, elastic pool in prod) | **Failover group** (auto or manual failover; read-write and read-only listener endpoints) | Secondary must be same service tier. Apps use the failover-group listener DNS name, never the server name. **Geo-replication is not a backup** — corruption replicates in seconds; keep PITR (35 d) + LTR for the ransomware/bad-deploy scenario. |
| Read replica for Metabase / Trino / audit queries | **The failover-group secondary**, via the `.secondary` listener | One replica, two jobs. During a failover reporting moves to the new primary or waits for failback — acceptable. **Confirmed (dev): current replica is a true geo-secondary** (`secondaryType=Geo` on server `development-api-replic`) — upgrade path is wrapping it in a failover group; staging/prod have none yet. |
| Blob + ADLS Gen2 (HNS) | **GRS / RA-GRS**, customer-managed account failover | Object replication is **not** supported on HNS accounts — GRS is the only path. After a failover the account becomes LRS; re-enable GRS as part of failback. |
| Key Vault | Microsoft-managed failover to paired region | Vault is **read-only** during failover — no secret rotation mid-incident. Pre-stage any DR-only secrets. |
| Container Apps (Metabase, querybuilder gateway, audit-sink jobs) | Rebuild environment + apps via Terraform | Images from a **geo-replicated ACR**; env vars/config from Terraform, not clicks (this is exactly the demo-week config-drift lesson). |
| Function Apps / App Service, Logic Apps | Rebuild via Terraform; Logic App storage rebuilt | Durable/Logic state is lost — workflows must be re-entrant; long-running workflow instances need a "resume from SQL state" path `[verify with Rex]`. |
| APIM | Rebuild via Terraform (Developer/Standard) **or** multi-region gateway (Premium only) | APIM deploy is the long pole in RTO (30–60 min). Keep policies/APIs in code. |
| VNet, NAT Gateway, VPN Gateway, private endpoints | Rebuild via Terraform with a DR address space | Pre-allocate non-overlapping CIDRs for the DR region now so peering/VPN doesn't collide at 2 a.m. |
| Front Door + Static Web Apps | Front Door is global; origin group per API with **priority failover + health probes** | Static Web Apps are not regional in the usual sense. **Researched:** Front Door Standard/Premium is **GA in Azure Government** (deployed from US Gov Arizona/Texas); **SWA is absent from the Gov GA roadmap** `[verify products-by-region; fallback = App Service static hosting or Front Door + Storage static site in Gov]`. Note (live): commercial profiles are currently Standard tier with **no WAF** — the Premium upgrade in remediation N4 also unlocks Private Link origins for DR. |
| Service Bus / Event Grid | Launch: rebuild + idempotent consumers. Phase 2: Geo-replication (Premium) | Metadata Geo-DR alias only replicates entities, not messages. |
| SignalR | Launch: rebuild (transient). Phase 2: geo-replication (Premium) | Clients reconnect; no data loss by design. |
| Log Analytics / App Insights | Workspace replication (Luke's table) or accept a separate DR workspace | Alerts and workbooks must exist in the DR workspace too (Monitoring & Alerting epic K12-4697). |
| Managed identities + RBAC | **User-assigned identities are regional** — create DR twins in Terraform; role assignments reapplied on apply | System-assigned identities die with the resource. SQL contained users for identities must exist on the secondary (they replicate with the DB). |
| Entra ID / External ID (B2C), DNS, Communication Services (email) | Global / non-regional | Custom domains and email sender domain unaffected; verify ACS email region behavior `[confirm]`. |
| Azure DevOps / Terraform state | State in a GRS storage account in a different resource group; pipelines runnable from a second agent pool | The 8/31 ADO degradation is a DR scenario in its own right — runbook must include "apply from a workstation with break-glass credentials." |

---

## 4. Terraform reconstitution — what "parameterized IaC" means concretely

1. **Region and DR are inputs, not forks:** `region`, `dr_region`, `is_dr` variables; naming module derives suffixes; one module set, two variable files (`prod.tfvars`, `prod-dr.tfvars`).
2. **State layout:** separate state for *global* (Front Door, DNS, ACR, failover group), *primary*, *DR*. Global never gets destroyed during a drill.
3. **Two-phase apply:** phase 1 = data plane (failover group, GRS, ACR replica) — applied **now** and left running; phase 2 = compute plane — applied at declare time (Option B) or kept at minimum scale (Option C).
4. **Drift guard:** `terraform plan` against prod nightly in the pipeline; non-empty plan = alert. Aligns with K12-9219 Terraform reconciliation (Luke).
5. **Secrets and config:** everything the app reads at startup comes from Terraform-managed App Configuration / Key Vault references, so the DR apply produces a working app without a human editing settings.
6. **Rehearse in the lower environments first:** the same modules deploy Staging into Central US as a drill (commercial, cheap); Gov prod drill after mock go-live.

---

## 5. Runbook skeleton (Option B)

| Step | Action | Owner | Target time |
|---|---|---|---|
| 0 | Declare: severity, decision to fail over (criteria: region-wide Azure outage > 30 min, or primary unrecoverable) | CFI Ops lead | T+0 |
| 1 | Freeze deployments; open bridge; status page / SEAA notice | Jacqui / Ops | T+5 min |
| 2 | SQL failover group → planned (if primary reachable) or forced failover; verify listener resolves to Texas | Luke / Steve | T+15 min |
| 3 | Storage account failover (GRS) for general + ADLS; confirm SAS/RBAC | Luke | T+30 min |
| 4 | `terraform apply -var-file=prod-dr.tfvars` (compute plane); APIM last | Luke / Steve; architect on bridge | T+30 → T+2 h |
| 5 | Front Door: flip origin priority to DR origins; confirm WAF policies attached | Luke | T+2 h |
| 6 | Smoke test: login (B2C), household enrollment read/write, school portal, provider payment path, Metabase | QA lead (Harshal) | T+2.5 h |
| 7 | Monitoring: alerts pointed at DR workspace; on-call re-paged | Matt V / Terry | T+3 h |
| 8 | Communicate all-clear; begin failback planning (reverse steps, re-enable GRS, re-seed secondary) | Jacqui | T+4 h |

---

## 6. Scenarios for the tabletop (K12-9268)

1. **Regional outage** (US Gov Virginia unavailable > 4 h) — exercises the whole runbook.
2. **Bad deploy / data corruption** — geo-replica is useless here; exercises PITR restore-to-point + app rollback. Tests the "geo-replication ≠ backup" understanding.
3. **Ransomware / credential compromise** — Key Vault read-only, identity revocation, restore from LTR; personnel controls (the epic's own bullet).
4. **Accidental deletion of a resource group** — resource locks, soft delete, Terraform re-apply.
5. **Tooling outage** (Azure DevOps down, like 8/31) — apply from a workstation with break-glass access.

Each scenario carries: trigger, detection (which alert fires), decision owner, RTO/RPO expected vs. achieved, evidence to capture.

---

## 7. Proposed PI8 work breakdown (under K12-2537)

| Story | Owner | Sprint |
|---|---|---|
| K12-3992 DR strategy + this design approved (ADR-0xx "DR posture: warm data / cold compute") | Terry | 51 |
| Failover group + readable secondary for prod (and staging rehearsal) | Luke + Terry | 51–52 |
| GRS on general + ADLS accounts; ACR geo-replication | Luke | 52 |
| Terraform: region/DR variables, state split, `prod-dr.tfvars`, two-phase apply | Luke + Steve | 52–53 |
| Staging failover drill in Central US; timed RTO/RPO | Luke, Steve, Harshal, Terry | 53 |
| Runbook + monitoring in DR workspace | Terry + Matt V | 53 |
| Tabletop scenarios + client pre-training (K12-9268) | Luke + Terry | PI8 end → PI9 |

Open items to confirm before 9/8 — status 2026-09-07: primary Gov region `[still open]`; ~~current replica type~~ **answered: geo-secondary (dev)**; ~~SWA / Front Door / SignalR availability~~ **answered: FD + SignalR GA in Gov; SWA absent from Gov roadmap `[verify]`**; APIM tier in prod `[still open — no APIM exists in commercial; check Gov]`; November add-on window for the prod drill `[still open]`.
