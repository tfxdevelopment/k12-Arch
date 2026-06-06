# CAF-04: Govern & Manage - K12 MyPortal Cloud-Native Architecture

## Metadata
- **Status:** Draft
- **Date:** 2025-11-24
- **Framework:** Microsoft Cloud Adoption Framework (CAF) - Govern + Manage Methodologies
- **Compliance:** FedRAMP Moderate, NIST 800-53, FERPA, WCAG 2.1 AA
- **Related Documents:** CAF-01 (Strategy), CAF-02 (Plan), CAF-03 (Adopt), WA-02 (Security), WA-04 (Operational Excellence), SEC-01/02/03

## Executive Summary

This document applies the two **operational CAF methodologies** that run continuously alongside adoption: **Govern** (establish and enforce guardrails) and **Manage** (keep workloads healthy and aligned to business commitments). For K12 MyPortal these are especially weighty because the platform runs in **Azure Government** under **FedRAMP Moderate / NIST 800-53** with **FERPA**-protected student PII.

Govern is organized around an **initial governance foundation (governance MVP)** plus the **five governance disciplines** — Cost Management, Security Baseline, Resource Consistency, Identity Baseline, and Deployment Acceleration — each mapped here to concrete K12 controls. Manage establishes **business commitments** (criticality, impact, SLAs) and an **operations baseline** (inventory & visibility, operational compliance, protect & recover), extended via the RAMP model (Ready, Administer, Monitor, Protect).

## Part A — Govern

### A.1 Initial Governance Foundation (Governance MVP)

Governance starts with a minimum foundation deployed into the Azure Government landing zone:

1. **Basic network and connectivity** — hub VNet, private endpoints, Front Door + APIM ingress (Gov boundary).
2. **Azure RBAC** for identity and access control.
3. **Naming and tagging standards** for consistent resource identification and FERPA data classification.
4. **Resource organization** using management groups → subscriptions → resource groups.
5. **Azure Policy** to enforce governance policies (deny-by-default, allowed Gov regions, encryption, required tags).

A dedicated **cloud governance team** (CFI platform + security) owns this foundation, then operates the continuous loop: **assess risks → document policies → enforce policies → monitor compliance**.

### A.2 Resource Organization & RBAC (Known Team Focus Area)

K12 organizes all resources across the four CAF scope levels and assigns RBAC at the **least-privileged scope**:

```text
SCOPE HIERARCHY (RBAC + policy inheritance)
  Management Group   ─ broad policy / role assignment (e.g., "deny non-Gov regions")
    └─ Subscription  ─ policy + cost boundary, scale unit (per workload, per env)
       └─ Resource Group ─ lifecycle unit (deployed/managed/retired together)
          └─ Resource ─ narrowest scope (rarely the right place for role assignment)
```

**RBAC best practices applied to K12:**

| Practice | K12 Application |
|----------|-----------------|
| Assign roles at the **appropriate (highest reasonable, least-privilege) scope** | Platform team roles at the K12 management group; workload-team roles at the application subscription/resource group — never broad Owner at tenant root |
| Prefer **groups over users** | Entra ID security groups (e.g., `k12-platform-admins`, `k12-enrollment-devs`) receive role assignments; membership managed via identity governance |
| **Custom least-privilege roles** | Define custom roles (e.g., `K12-Deploy-Operator`, `K12-DBA-NoData`) rather than granting built-in Owner/Contributor where narrower permission suffices |
| **PIM for privileged roles** | Just-in-time elevation (Privileged Identity Management) for any role that can touch the FedRAMP boundary, with approval + time limits |
| **ABAC conditions** | Attribute-based conditions to further constrain access to PII-classified storage |
| **Separation of duties** | Resource-group-per-environment isolates dev/test/prod; deployment identities cannot read production student data |

> RLS and `studentAccessControl` provide *data-row* authorization inside SQL; Azure RBAC provides *control-plane* authorization over Azure resources. Both are required — see SEC-02/SEC-03 and WA-02.

### A.3 The Five Governance Disciplines (Mapped to K12)

#### 1. Cost Management
| Control | K12 Implementation |
|---------|--------------------|
| Budgets & alerts | Budget per application subscription, alerts at resource-group level (target +20% baseline, ~$6,955/mo) |
| Deployment restrictions | Azure Policy to **disallow cost-intensive / non-approved SKUs** |
| Tagging for chargeback | Mandatory `program`, `environment`, `cost-center` tags enforced via policy |
| Right-sizing | Azure Advisor cost recommendations reviewed; KEDA scale-to-near-zero off-peak |

#### 2. Security Baseline (tied to FedRAMP / Entra ID)
This is the K12 keystone discipline. It enforces the existing security model under the FedRAMP boundary.
| Control | K12 Implementation |
|---------|--------------------|
| Identity authority | **Entra ID Hub & Spoke**; `studentAccessControl` custom security attribute; OBO flow to SQL |
| Defense-in-depth | APIM → `EntraAuthenticationMiddleware` → SQL **row-level security** |
| Encryption | TDE (at rest), TLS 1.2+ (in transit), PGP for DMV/DOR; customer-managed keys via Key Vault |
| Threat protection | **Microsoft Defender for Cloud / Containers** across all subscriptions; Sentinel SIEM (365-day retention for FERPA) |
| Compliance posture | FedRAMP Moderate / NIST 800-53 controls monitored; Defender regulatory-compliance dashboard |
| Secrets | All secrets in **Azure Key Vault** (managed identity, no creds in code) |
| Policy enforcement | Deny public network access to SQL/ADLS; require private endpoints; enforce HTTPS/TLS minimum |

#### 3. Resource Consistency
| Control | K12 Implementation |
|---------|--------------------|
| IaC-only deployments | Hybrid IaC — **Terraform for governance**, Aspire/Bicep for compute; portal changes prohibited in prod |
| Tagging & naming | Azure Policy enforces taxonomy on every resource |
| Resource locks | `CanNotDelete` locks on production SQL, ADLS, Key Vault |
| Inventory & drift | Azure Resource Graph inventory; policy `auditIfNotExists` for drift |
| Region restriction | Policy allows **Azure Government regions only** |

#### 4. Identity Baseline
| Control | K12 Implementation |
|---------|--------------------|
| MFA | Entra MFA required for all administrative access |
| Conditional Access | Block/limit by device + location; enforce compliant devices for privileged access |
| Identity governance | Access reviews, access-request workflows, lifecycle management |
| Privileged access | **PIM** just-in-time for FedRAMP-boundary roles |
| RBAC/ABAC | Least-privilege custom roles at correct scope (Section A.2) |

#### 5. Deployment Acceleration
| Control | K12 Implementation |
|---------|--------------------|
| Policy-driven guardrails | DeployIfNotExists / Deny policies via management-group hierarchy |
| Reusable IaC | Terraform modules + ALZ accelerator; `azd` for app deployments |
| CI/CD with gates | All artifacts version-controlled; automated test → pre-prod → prod promotion; no direct prod changes |
| Subscription provisioning | Controlled (non-self-service) subscription vending — FedRAMP requires central approval |

### A.4 Governance Enforcement & Monitoring
Defining policies is insufficient — K12 **automates enforcement** with Azure Policy and monitors compliance continuously. Example compliance checklist items:

```text
EXAMPLE K12 GOVERNANCE COMPLIANCE CHECKS
  [CM01] Budget alerts set at resource-group level
  [SB01] Encryption in transit + at rest on all PII-classified data
  [SB02] Defender for Cloud enabled on every subscription
  [RM01] Terraform/Bicep used for all resource deployment (no portal in prod)
  [RM02] Mandatory tags enforced via Azure Policy
  [ID01] MFA + Conditional Access enforced for admin roles
  [DA01] Deployments only via CI/CD pipeline with required reviewers
```

Compliance is reported back to the governance team and SEAA leadership; failed controls feed the assess→document→enforce loop.

## Part B — Manage

### B.1 Create Business Alignment (Business Commitments)
Before tooling, K12 establishes business commitments by understanding each workload's criticality and impact.

| Workload | Criticality | Business Impact of Outage | RTO / RPO target |
|----------|-------------|---------------------------|------------------|
| Enrollment (citizen-facing) | **Mission-critical (during enrollment)** | Families cannot apply; public/political failure | RTO minutes; RPO near-zero (peak) |
| Admin / back-office | High | SEAA staff blocked; processing delays | RTO hours; RPO low |
| Analytics (Trino/CubeJS) | Moderate | Reporting delayed; no transaction impact | RTO hours; RPO daily |
| Document storage (ADLS) | High (FERPA) | Cannot retrieve required documents | RTO hours; RPO low |

Defining business commitments balances the right level of operational management against acceptable operating cost — enrollment justifies workload-specialized operations and the multi-region HA option; analytics does not.

### B.2 Operations Baseline
The management baseline is the minimum set of tools/processes applied to **every** asset, across three disciplines:

#### 1. Inventory & Visibility
- Azure Monitor + Log Analytics (centralized workspace in the Management subscription).
- Application Insights for API/DAB telemetry; Resource Graph for inventory.
- Asset/workload catalog kept current (a core cloud-operations deliverable).

#### 2. Operational Compliance
- Patch and configuration-drift management (distroless base-image auto-rebuild on CVE patch).
- Operational-compliance policies prevent drift and unpatched components.
- Cost/right-sizing reviews on a defined cadence.

#### 3. Protect & Recover
- Azure Backup for SQL; geo-redundant storage for ADLS; documented, version-controlled DR plans.
- DR drills with record-keeping (required for FedRAMP/FERPA audit).
- RTO/RPO honored per the criticality table above.

### B.3 RAMP Operating Model
CAF Manage frames ongoing operations as **Ready → Administer → Monitor → Protect (RAMP)**:

| RAMP Phase | K12 Activity |
|------------|--------------|
| **Ready** | Prevent drift via IaC; organize ops teams and responsibilities; prepare for change management |
| **Administer** | Change, security, compliance, data, code/runtime, and cloud-resource administration (PaaS shared-responsibility model — Microsoft owns host/OS for Container Apps) |
| **Monitor** | Track performance vs. SLAs/baselines; Sentinel SIEM; automated alerts (e.g., RLS-denial spikes) |
| **Protect** | Backup/restore, DR, incident response (P0 PII-breach runbook from WA-02) |

### B.4 Operations Specialization
- **Platform specialization:** shared operations of the Container Apps Environment, Dapr mesh, and Redis — investment distributed across all workloads.
- **Workload specialization:** reserved for the **mission-critical enrollment workload** — enhanced monitoring, load-tested 80K capacity, and the multi-region HA option during the enrollment window.

## Cross-reference: CAF and Well-Architected

Govern and Manage operationalize the Well-Architected pillars over the platform's life:

| CAF discipline / activity | Well-Architected pillar | K12 doc |
|---------------------------|-------------------------|---------|
| Security Baseline + Identity Baseline | Security | WA-02 |
| Cost Management discipline | Cost Optimization | WA-03 |
| Operations baseline, RAMP, monitoring | Operational Excellence | WA-04 |
| Protect & Recover, business commitments (RTO/RPO) | Reliability | WA-01 |
| Right-sizing, scale governance | Performance Efficiency | WA-05 |

Govern and Manage run continuously, enforcing the guardrails set in **CAF-01 (Strategy)**, validating the decisions made in **CAF-02 (Plan)**, and keeping the workloads migrated in **CAF-03 (Adopt)** secure, compliant, and healthy.

## References

### Microsoft Documentation
- [CAF Govern methodology](https://learn.microsoft.com/azure/cloud-adoption-framework/govern/)
- [Build a cloud governance team](https://learn.microsoft.com/azure/cloud-adoption-framework/govern/build-cloud-governance-team)
- [Enforce cloud governance policies](https://learn.microsoft.com/azure/cloud-adoption-framework/govern/enforce-cloud-governance-policies)
- [Resource organization (management groups → subscriptions → resource groups)](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org)
- [Azure RBAC overview](https://learn.microsoft.com/azure/role-based-access-control/overview)
- [Azure RBAC scope](https://learn.microsoft.com/azure/role-based-access-control/scope-overview)
- [CAF Manage methodology](https://learn.microsoft.com/azure/cloud-adoption-framework/manage/)
- [Ready your Azure cloud operations (RAMP)](https://learn.microsoft.com/azure/cloud-adoption-framework/manage/ready-cloud-operations)
- [Improve landing zone operations (business alignment / ops baseline)](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/considerations/landing-zone-operations)
- [Design area: Management for Azure environments](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/design-area/management)

### Related K12 Documents
- [CAF-01: Strategy](./CAF-01-strategy.md)
- [CAF-02: Plan](./CAF-02-plan.md)
- [CAF-03: Adopt](./CAF-03-adopt.md)
- [WA-02: Security](./../well-architected/WA-02-security.md)
- [WA-04: Operational Excellence](./../well-architected/WA-04-operational-excellence.md)
- [Target Architecture Overview](./../README.md)

---

**Document Status:** Draft
**Last Updated:** 2025-11-24
**Owner:** CFI Architecture Team + CFI Security/Platform Team
