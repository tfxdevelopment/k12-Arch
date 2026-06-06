# CAF-02: Cloud Adoption Plan - K12 MyPortal Cloud-Native Architecture

## Metadata
- **Status:** Draft
- **Date:** 2025-11-24
- **Framework:** Microsoft Cloud Adoption Framework (CAF) - Plan Methodology
- **Compliance:** FedRAMP Moderate, NIST 800-53, FERPA, WCAG 2.1 AA
- **Related Documents:** CAF-01 (Strategy), CAF-03 (Adopt), CAF-04 (Govern & Manage), MIGRATE-01..05 (Migration Guide), ADR-PROP-003 (Data API Builder)

## Executive Summary

This document applies the **CAF Plan methodology** to convert the K12 cloud adoption strategy (CAF-01) into an actionable, data-driven plan. Plan turns motivations and OKRs into a digital-estate inventory, a rationalization decision for each workload component, organizational alignment, a skills-readiness plan, and a prioritized cloud adoption backlog.

K12 follows the CAF **"migrate existing workloads"** path (not greenfield/cloud-native), because the program already runs in Azure Government on Azure Functions Premium with an Azure SQL multi-schema database, ADLS Gen2 document storage, and live state-agency integrations. The plan therefore covers the full sequence: **prepare → discover → rationalize (select) → assess → estimate → document**, then hands off to CAF Ready (landing zone) and CAF Adopt (CAF-03).

## 1. Map the Adoption Journey

```text
              ┌─────────────────────────────────────────────┐
   Existing   │  CAF Plan:  prepare → discover → select →    │
   K12 estate │             assess → estimate → document     │
 (Functions   └─────────────────────────────────────────────┘
  Premium,                         │
  Azure SQL,                       ▼
  ADLS Gen2)        CAF Ready (Azure landing zone, Gov)
                                   │
                                   ▼
                 CAF Adopt (Migrate + Modernize) → CAF-03
```

K12 is an enterprise with an existing IT estate, so it executes **all** of CAF Plan. The output is a backlog that feeds the Azure landing zone build and the migration waves.

## 2. Digital Estate and Rationalization

### 2.1 Digital Estate Inventory

Following CAF's SAP/Oracle pattern, K12 assets are grouped into **platform**, **foundational**, and **workload** categories. Each component is named, inventoried, tagged, and rationalized individually.

| Asset Group | Component | Category | Current State |
|-------------|-----------|----------|---------------|
| Compute | Business-logic API (.NET 8 Azure Functions v4) | Workload | Functions Premium plan |
| Compute | Background tasks / scheduled jobs | Workload | Functions (timer/queue triggers) |
| Data | Azure SQL (schemas: `dbo`, `Enrollment`, `Households`, `Awards`, `Comms`) | Workload | Azure SQL, TDE, RLS |
| Data | Document storage (ADLS Gen2, SAS-token downloads) | Workload | ADLS Gen2 hierarchical namespace |
| Identity | Entra ID (Hub), `studentAccessControl` custom attribute | Foundational | Hub & Spoke, OBO flow |
| Edge / Gateway | APIM, gateway middleware (`EntraAuthenticationMiddleware`) | Foundational | APIM + JWT validation |
| Frontend | Angular 19 Nx apps (admin, enrollment, providers, schools) | Workload | Static hosting / SPA |
| Integrations | ClassWallet, SendGrid, PandaDoc, Microsoft Graph, NC DMV/DOR/DPI | Workload | External APIs (PGP for DMV/DOR) |
| Analytics | (none today) | Workload | Gap — to be built |
| Platform | Networking, monitoring, Key Vault, governance | Foundational | To be standardized via landing zone |

**Tagging/grouping requirement:** every asset is tagged with `program` (esa-plus / opportunity), `environment` (dev/test/prod), `data-classification` (pii / non-pii), and `cost-center` to support both financial planning and FERPA data-handling controls.

### 2.2 Rationalization — The 5 Rs / 6 Rs

CAF's rationalization assigns each workload one of the "Rs". K12 component decisions:

| Component | Decision (R) | Rationale |
|-----------|--------------|-----------|
| Business-logic Functions API | **Replatform → Rearchitect** | Containerize Functions onto Container Apps (replatform), then introduce Dapr/KEDA patterns (light rearchitect). No microservices decomposition (ADR-PROP-008). |
| CRUD data access | **Refactor / Replace** | Replace hand-written CRUD with **Data API Builder (DAB)** — zero-code REST/GraphQL from the SQL schema (ADR-PROP-003). |
| Azure SQL database | **Retain (rehost in place)** | Schema, TDE, and RLS are preserved unchanged; no re-platform of the data tier. Lowest risk for FERPA-governed data. |
| ADLS Gen2 documents | **Retain** | Existing SAS-token model and hierarchy `/{application}/{legal-entity}/{userid}/{documentType}` kept as-is. |
| Entra ID / auth middleware | **Retain** | Hub & Spoke identity model is a fixed guardrail; middleware runs unchanged in containers. |
| Analytics capability | **Rebuild (new build)** | Net-new Trino (federation) + CubeJS (semantic layer) stack — no equivalent exists today. |
| Frontend Angular apps | **Retain / Replatform** | Apps unchanged; only API base URLs and gateway routing adjust. |
| Legacy ad-hoc reporting scripts | **Retire** | Superseded by CubeJS dashboards; eliminate redundant assets to reduce cost and risk. |

```text
RATIONALIZATION SUMMARY (K12 MyPortal)
  Retain:      Azure SQL, ADLS Gen2, Entra ID, frontends
  Replatform:  Functions API → Container Apps
  Refactor:    CRUD → Data API Builder
  Rearchitect: Dapr service mesh, KEDA scaling, Redis caching
  Rebuild:     Trino + CubeJS analytics (new capability)
  Retire:      Ad-hoc reporting scripts
```

## 3. Initial Organizational Alignment

CAF Plan requires early org alignment. K12 uses the CAF "two-team MVP" balance, instantiated with existing roles:

| CAF Function | K12 Team | Accountability |
|--------------|----------|----------------|
| **Cloud adoption team** | K12 application/dev team | Technical solutions, business alignment, project mgmt, workload operations (containers, DAB, analytics) |
| **Cloud governance team** | CFI platform + security team | Landing zone, governance disciplines, FedRAMP/FERPA enforcement, automation, platform operations |

A lightweight RACI separates "who builds the workload" (adoption team) from "who owns the guardrails" (governance team). Because K12 is FedRAMP-regulated, the governance team holds approval authority over anything that touches the authorization boundary (networking, identity, encryption, data residency).

## 4. Skills Readiness Plan

CAF Plan calls for a skills/readiness assessment to find capability gaps before execution. New technologies in the target architecture introduce specific gaps.

| New Technology | Skill Gap | Readiness Action |
|----------------|-----------|------------------|
| Azure Container Apps / KEDA | Container ops, scaling rules | Microsoft Learn paths + internal workshop; pilot on dev landing zone |
| Dapr service mesh | mTLS, pub/sub, service invocation | ADR-PROP-006 spike; hands-on with Aspire |
| Data API Builder | DAB config, policy-based authz | Build one entity end-to-end (Student) as proof |
| Trino + CubeJS | Federated SQL, semantic modeling, pre-aggregation | Analytics enablement track; vendor/partner support if needed |
| .NET Aspire | AppHost orchestration, local dev | Team workshop; standardize F5 workflow |
| .NET 10 (LTS) | Runtime/library deltas from .NET 8 | Upgrade spike; dependency compatibility review |
| Terraform (governance IaC) | Module authoring for ALZ governance | Pair with platform team; ALZ accelerator modules |

**Engage external expertise where needed.** Per CAF guidance, bring in Microsoft or a FedRAMP-experienced Microsoft partner to validate the migration approach, Gov-cloud service availability, and realistic timelines for complex items (Trino/CubeJS, multi-region).

## 5. Cloud Adoption Plan / Backlog

CAF provides backlog templates (Azure DevOps work items) derived from each methodology's tasks. K12 maps its backlog to the documented 10-week timeline and the migration waves (detailed in CAF-03 and MIGRATE-01..05).

### 5.1 Estimation Inputs
- **TCO/cost estimate:** current $5,800/mo (no analytics, ~30K ceiling) → proposed $6,955/mo (+20%, 80K, analytics); 3-year TCO $250K. Multi-region HA option $9,785/mo. (Detail in WA-03 / CONT-10.)
- **Azure architecture plan:** Container Apps Environment (VNet-integrated, Gov), DAB, Trino/CubeJS, Redis, fronted by Front Door + APIM.

### 5.2 Backlog Epics (sequenced)

| Epic | CAF Phase | K12 Documents | Wave |
|------|-----------|---------------|------|
| Build Azure Government landing zone | Ready | CONT-02, CONT-09, ASPIRE-06 | Foundation |
| Containerize Functions API | Adopt/Migrate | MIGRATE-01, CONT-01 | Wave 1 |
| Aspire orchestration + DAB CRUD | Adopt/Modernize | MIGRATE-02, ASPIRE-01..05, API-01 | Wave 2 |
| Dapr service mesh + Redis caching | Adopt/Modernize | MIGRATE-03, CONT-06, API-05 | Wave 3 |
| Analytics stack (Trino + CubeJS) | Adopt/Innovate | MIGRATE-04, CONT-04/05, ANALYTICS-01..05 | Wave 4 |
| Optimization + multi-region | Adopt/Manage | MIGRATE-05, WA-01, WA-05 | Wave 5 |
| Governance + ops baseline | Govern/Manage | CAF-04, OPS-01..03 | Continuous |

### 5.3 Estimated Timelines and Dependencies
CAF requires recorded timelines, milestones, and a process for updates. K12 uses the 10-week documentation timeline and a 6-month implementation window. Key dependencies and risks:

- **Hard deadline:** no cutover during an active enrollment cycle (immovable). Production migration waves must land between cycles.
- **Critical path:** landing zone (Gov, FedRAMP boundary) → containerize Functions → DAB → analytics.
- **Risk — Gov-cloud parity:** confirm Container Apps, DAB, Trino/CubeJS support in Azure Government regions before committing each wave.
- **Update process:** revisit timelines at each wave gate and after every enrollment cycle; reflect actuals in the backlog.

## Cross-reference: CAF and Well-Architected

The Plan's rationalization and estimation decisions are validated against the Well-Architected pillars before commitment:

| Plan activity | Validated against | K12 doc |
|---------------|-------------------|---------|
| Cost estimate / TCO | Cost Optimization | WA-03 |
| Replatform/rearchitect choices for 80K scale | Performance Efficiency | WA-05 |
| Retain SQL/RLS, FERPA data handling | Security | WA-02 |
| Migration-wave reliability, no-cutover-during-enrollment | Reliability | WA-01 |
| Skills/ops readiness | Operational Excellence | WA-04 |

Plan feeds directly into **CAF-03 (Adopt)**, which executes the migration waves against the landing zone, and is sustained by **CAF-04 (Govern & Manage)**.

## References

### Microsoft Documentation
- [Prepare your organization for the cloud (CAF Plan)](https://learn.microsoft.com/azure/cloud-adoption-framework/plan/prepare-organization-for-cloud)
- [Select your cloud migration strategies (the Rs)](https://learn.microsoft.com/azure/cloud-adoption-framework/plan/select-cloud-migration-strategy)
- [The 6 Rs of application modernization](https://learn.microsoft.com/azure/app-modernization-guidance/plan/the-6-rs-of-application-modernization)
- [Document your cloud adoption plan](https://learn.microsoft.com/azure/cloud-adoption-framework/plan/document-cloud-adoption-plan)
- [Tools and templates (cloud adoption plan / backlog)](https://learn.microsoft.com/azure/cloud-adoption-framework/resources/tools-templates)
- [Mature team structures (adoption + governance MVP)](https://learn.microsoft.com/azure/cloud-adoption-framework/organize/organization-structures)

### Related K12 Documents
- [CAF-01: Strategy](./CAF-01-strategy.md)
- [CAF-03: Adopt](./CAF-03-adopt.md)
- [CAF-04: Govern & Manage](./CAF-04-govern-manage.md)
- [WA-03: Cost Optimization](./../well-architected/WA-03-cost-optimization.md)
- [WA-05: Performance Efficiency](./../well-architected/WA-05-performance-efficiency.md)
- [Target Architecture Overview](./../README.md)

---

**Document Status:** Draft
**Last Updated:** 2025-11-24
**Owner:** CFI Architecture Team
