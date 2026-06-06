# CAF-03: Adopt (Migrate & Modernize) - K12 MyPortal Cloud-Native Architecture

## Metadata
- **Status:** Draft
- **Date:** 2025-11-24
- **Framework:** Microsoft Cloud Adoption Framework (CAF) - Adopt Methodology (Migrate + Modernize/Innovate)
- **Compliance:** FedRAMP Moderate, NIST 800-53, FERPA, WCAG 2.1 AA
- **Related Documents:** CAF-01 (Strategy), CAF-02 (Plan), CAF-04 (Govern & Manage), MIGRATE-01..05, CONT-01/02/09, WA-01 (Reliability)

## Executive Summary

This document applies the **CAF Adopt methodology** — **Migrate** and **Modernize/Innovate** — to execute the K12 MyPortal cloud-native modernization. Adopt takes the rationalized backlog from CAF-02 and moves workloads into a ready **Azure Government landing zone** using a structured, iterative **migration-wave** approach that reduces risk while building team experience.

For K12 the Adopt phase is a blend: a lift-and-replatform **Migrate** of the existing .NET Functions API into Azure Container Apps, followed by **Modernize** (Data API Builder, Dapr, Redis) and **Innovate** (Trino + CubeJS analytics — a net-new capability). All execution respects the immovable constraint that **no production cutover may occur during an active enrollment cycle**.

## 1. Landing Zone Readiness (CAF Ready Prerequisite)

CAF Migrate has a hard prerequisite: a prepared Azure landing zone. K12 deploys an **Azure landing zone in Azure Government** in parallel with the existing environment, then migrates workloads into it — a phased transition with minimal disruption to active workloads.

### 1.1 Platform vs. Application Landing Zones

```text
Tenant Root (Azure Government, Entra ID Hub)
└── K12 Management Group
    ├── Platform (MG)
    │   ├── Identity         (Entra ID, studentAccessControl)
    │   ├── Management       (Log Analytics, Monitor, Backup)
    │   └── Connectivity     (Hub VNet, Front Door, APIM, DDoS)
    └── Landing Zones (MG)
        ├── Corp (internal-facing)
        │   └── K12-Admin    (admin app + back-office)
        └── Online (citizen-facing)
            ├── K12-Enrollment-Prod   (Container Apps, DAB, Redis)
            ├── K12-Analytics-Prod    (Trino, CubeJS)
            └── K12-NonProd (dev/test) (sandbox + integration)
```

- **Platform landing zone:** shared governance and services (management group hierarchy, Azure Policy enforcement, connectivity, identity, monitoring) owned by the CFI platform/governance team.
- **Application landing zones:** one or more subscriptions per workload **per environment** (dev/test/prod), nested under the appropriate management group to inherit policy. This separates the citizen-facing enrollment workload from internal admin and from the analytics stack.

### 1.2 Universal Configurations
Every subscription (platform or application) enables, per CAF Ready: **Azure RBAC**, **Cost Management** (budgets/alerts), **Network Watcher**, and **Microsoft Defender for Cloud**. These are non-optional under the FedRAMP boundary.

### 1.3 Ready-the-Landing-Zone-for-Migration Tasks
- Confirm **Azure Government region** availability for Container Apps, DAB, Trino/CubeJS, Redis.
- Establish hybrid connectivity / private endpoints for Azure SQL and ADLS Gen2 (no public access).
- Deploy policy-driven guardrails (deny-by-default, allowed regions = Gov, required tags, encryption enforcement) — see CAF-04.
- Stand up the FedRAMP authorization-boundary networking (VNet integration, Front Door + APIM ingress).

> Detailed landing-zone design is in **CONT-02 (Environment Design)** and **CONT-09 (Networking & Security)**; hybrid IaC (Aspire for compute + Terraform for governance) is in **ASPIRE-06**.

## 2. Migrate: Five-Step Process

CAF Migrate runs each workload through: **Plan migration → Prepare workloads → Execute migration → Optimize in cloud → Decommission source.**

### 2.1 Plan Migration
- Sequence workloads into waves (Section 4).
- Assess migration readiness and team skills (see CAF-02 skills plan).
- Choose cutover approach per wave: **near-zero downtime** (parallel run + traffic shift) for citizen-facing enrollment; **planned downtime** acceptable for internal back-office only, and only between enrollment cycles.

### 2.2 Prepare Workloads (Cloud-Ready)
Make workloads cloud-ready before production cutover. For the Functions API:
- Containerize with a secure, distroless, non-root image (per WA-02 patterns).
- Validate `EntraAuthenticationMiddleware` and SQL session-context/RLS behavior inside containers (RLS works identically — confirmed in WA-02).
- Resolve compatibility issues in an Azure **test** environment, not the source.
- Deploy all workload components to a test application landing zone and validate completeness (compute, DAB, Redis, managed identities, private endpoints, DNS).

```dockerfile
# K12 Functions container — cloud-ready, FedRAMP-aligned base image
FROM mcr.microsoft.com/dotnet/aspnet:10.0-azurelinux3.0-distroless AS runtime
USER app                      # non-root
WORKDIR /app
COPY --from=build --chown=app:app /app/publish .
EXPOSE 8080                   # non-privileged port; Front Door terminates TLS
```

### 2.3 Execute Migration
- Deploy via `azd` / hybrid IaC into the target application landing zone.
- For data-adjacent components, **retain** Azure SQL and ADLS Gen2 in place (rationalized as Retain in CAF-02) and re-point the containerized API at them over private endpoints — avoids risky data-tier migration of FERPA-governed records.
- Run database/integration validation; keep a documented fallback (re-route APIM back to Functions Premium) until the wave is verified.

### 2.4 Optimize in Cloud
Post-cutover: tune KEDA scaling rules for the 80K curve, validate Redis hit-rate (65%+ target), confirm monitoring/alerts, verify backups, and collect user feedback.

### 2.5 Decommission Source
After stakeholder sign-off, retire the Functions Premium plan and ad-hoc reporting scripts (rationalized as Retire). Preserve logs/data needed for FERPA/FedRAMP audit retention before decommissioning. Update documentation and cost models to reflect the removed source assets.

## 3. Modernize and Innovate

After the migrate baseline, the Adopt phase modernizes and innovates (CAF Modernize prepares the org, prioritizes by business value vs. technical risk, then executes with governance and phased timelines).

| Track | Type | What | K12 Doc |
|-------|------|------|---------|
| Data API Builder | **Modernize (Refactor)** | Replace hand-written CRUD with zero-code REST/GraphQL from the SQL schema; policy-based authz mirrors RLS | API-01, ADR-PROP-003 |
| Dapr service mesh | **Modernize (Rearchitect)** | mTLS, pub/sub, service invocation, state — built into Container Apps | CONT-06, ADR-PROP-006 |
| Redis caching | **Modernize** | Distributed cache across layers; 65%+ hit-rate target | API-05 |
| KEDA autoscaling | **Modernize** | Event/HTTP-driven scale to 80K, scale-to-near-zero off-peak | CONT-07 |
| Trino + CubeJS | **Innovate (Rebuild)** | Net-new data federation + semantic layer + dashboards | CONT-04/05, ANALYTICS-01..05 |
| .NET Aspire dev loop | **Modernize** | F5 local orchestration of full stack | ASPIRE-01..05 |

**Modernization readiness:** define scope, assess team skills (CAF-02), and prioritize each item on a business-value vs. technical-risk matrix. DAB (high value, moderate risk) and analytics (high value, higher risk) lead; both go through governance approval and phased rollout before production.

## 4. Migration Waves

K12 organizes workloads into iterative waves to manage dependencies and complexity and build experience. Waves align to the documented migration guide (MIGRATE-01..05) and the backlog epics in CAF-02.

| Wave | Scope | Cutover Approach | Dependencies | Risk |
|------|-------|------------------|--------------|------|
| **0 — Foundation** | Azure Gov landing zone, policy guardrails, connectivity, monitoring | N/A (build) | Gov-region parity confirmed | Medium |
| **1 — Containerize** | Functions API → Container Apps; retain SQL/ADLS via private endpoints | Parallel run; APIM traffic shift; fallback to Functions Premium | Wave 0 | Medium |
| **2 — Aspire + DAB** | Aspire orchestration; DAB CRUD endpoints | Incremental per-entity; canary | Wave 1 | Medium |
| **3 — Dapr + Redis** | Service mesh (mTLS), distributed caching | Rolling; feature-flagged | Wave 2 | Low-Med |
| **4 — Analytics** | Trino federation + CubeJS semantic layer + dashboards | Additive (new capability, no cutover risk to enrollment) | Waves 1-3 | Higher |
| **5 — Optimize / HA** | Tuning, optimization, optional multi-region (99.95%) | Blue-green | Waves 1-4 | Medium |

### 4.1 Wave Sequencing Rules
1. **Never cut over a citizen-facing wave during an active enrollment cycle.** Production waves land between cycles.
2. Each wave has an entry/exit gate: governance + security sign-off (FedRAMP boundary unchanged), load test against the wave's target, documented rollback.
3. Analytics (Wave 4) is additive and can proceed independently once data sources are stable — lowest blast radius to enrollment.
4. Multi-region (Wave 5) is conditional on SEAA accepting the +$2,830/mo HA cost.

```text
WAVE FLOW
  W0 Foundation ─► W1 Containerize ─► W2 Aspire+DAB ─► W3 Dapr+Redis ─► W5 Optimize/HA
                                          └──────────► W4 Analytics (additive) ┘
```

## 5. Adopt-Phase Security (Maintained Through Migration)

Per CAF "perform your cloud adoption securely": define security baselines early, automate deployments to reduce human error, and enforce Zero Trust access. For K12 this means every wave preserves the Hub & Spoke Entra ID model, `studentAccessControl`, defense-in-depth (APIM → middleware → SQL RLS), TDE/TLS encryption, and PGP for DMV/DOR — validated at each wave gate. Change management uses a structured ACM approach (e.g., ADKAR) for the dev/ops teams adopting Container Apps, Dapr, and DAB.

## Cross-reference: CAF and Well-Architected

Each migration wave is gated against the Well-Architected pillars:

| Adopt activity | Validated against | K12 doc |
|----------------|-------------------|---------|
| Wave cutover, fallback, no-cutover-during-enrollment | Reliability | WA-01 |
| Container/image security, RLS preservation, Zero Trust | Security | WA-02 |
| Optimize-in-cloud, decommission source cost | Cost Optimization | WA-03 |
| KEDA scaling to 80K, Redis hit-rate | Performance Efficiency | WA-05 |
| Automated deploys, monitoring, runbooks | Operational Excellence | WA-04 |

Adopt is preceded by **CAF-02 (Plan)** and runs in parallel with **CAF-04 (Govern & Manage)**, which enforces the guardrails and establishes the operations baseline that keeps migrated workloads healthy.

## References

### Microsoft Documentation
- [Plan your migration (CAF Migrate)](https://learn.microsoft.com/azure/cloud-adoption-framework/migrate/plan-migration)
- [Prepare workloads for the cloud](https://learn.microsoft.com/azure/cloud-adoption-framework/migrate/prepare-workloads-cloud)
- [Execute migration to the cloud](https://learn.microsoft.com/azure/cloud-adoption-framework/migrate/execute-migration)
- [Guide: Migration wave planning](https://learn.microsoft.com/azure/cloud-adoption-framework/migrate/migration-wave-planning)
- [Decommission source workloads](https://learn.microsoft.com/azure/cloud-adoption-framework/migrate/decommission-source-workload)
- [Prepare for cloud modernization (CAF Modernize)](https://learn.microsoft.com/azure/cloud-adoption-framework/modernize/prepare-organization-cloud-modernization)
- [Ready your Azure environment for workloads (landing zones)](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/)
- [What is an Azure landing zone?](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)
- [Perform your cloud adoption securely](https://learn.microsoft.com/azure/cloud-adoption-framework/secure/adopt)

### Related K12 Documents
- [CAF-01: Strategy](./CAF-01-strategy.md)
- [CAF-02: Plan](./CAF-02-plan.md)
- [CAF-04: Govern & Manage](./CAF-04-govern-manage.md)
- [WA-01: Reliability](./../well-architected/WA-01-reliability.md)
- [WA-02: Security](./../well-architected/WA-02-security.md)
- [Target Architecture Overview](./../README.md)

---

**Document Status:** Draft
**Last Updated:** 2025-11-24
**Owner:** CFI Architecture Team
