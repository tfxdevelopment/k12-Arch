# CAF-01: Cloud Adoption Strategy - K12 MyPortal Cloud-Native Architecture

## Metadata
- **Status:** Draft
- **Date:** 2025-11-24
- **Framework:** Microsoft Cloud Adoption Framework (CAF) - Strategy Methodology
- **Compliance:** FedRAMP Moderate, NIST 800-53, FERPA, WCAG 2.1 AA
- **Related Documents:** CAF-02 (Plan), CAF-03 (Adopt), CAF-04 (Govern & Manage), WA-03 (Cost Optimization), ADR-PROP-001 (Container Functions)

## Executive Summary

This document applies the **Microsoft Cloud Adoption Framework Strategy methodology** to the K12 MyPortal modernization for NC SEAA. It connects executive intent — operating the ESA+ and Opportunity Scholarship programs at **80,000 concurrent users** during peak enrollment — to measurable business outcomes, and sets the guardrails that every workload team operates within.

The Strategy methodology guides four workstreams: (1) define motivations, mission, and objectives; (2) define the strategy team; (3) prepare the organization; and (4) inform the strategy across cost efficiency, resiliency, security, and sustainability. For K12, this is **expansion of an existing Azure Government footprint** rather than greenfield adoption: the program already runs in Azure Government Cloud under FedRAMP Moderate, and the strategy directs a move from Azure Functions Premium to a cloud-native Azure Container Apps platform.

> **Strategy is iterative.** This is a recurring input to K12 planning, not a one-pass document. Revisit it as enrollment volume, NC legislative funding decisions, and regulatory obligations (FERPA, FedRAMP) evolve.

## Why a Cloud Adoption Strategy for K12

A documented strategy helps the CFI Architecture Team and SEAA leadership:

1. **Maximize value of cloud investment.** Direct the approved +20% spend (vs. current Functions Premium baseline) toward the initiatives that deliver 80K-user scale and analytics, and avoid waste from uncoordinated, ad-hoc adoption.
2. **Align technology to outcomes.** Tie each initiative (Container Apps, Data API Builder, Trino/CubeJS analytics) to a measurable SEAA program objective so trade-offs are explicit and defensible to the SEAA board.
3. **Unify cross-functional leadership.** Establish shared goals across CFI architecture, SEAA program staff, finance, and security under a common operating model.
4. **Manage portfolio-level risk.** Set a deliberate path for modernizing the existing estate while preserving FedRAMP Moderate authorization and FERPA controls.
5. **Sustain improvement.** Adapt the strategy as the program scales (additional scholarship programs, new state-agency integrations).

## 1. Motivations, Mission, and Objectives

### 1.1 Motivations

CAF groups motivations into three categories. K12's primary motivations are mapped below.

| CAF Category | K12 Motivation | Driver |
|--------------|----------------|--------|
| **Reduce business risk** | Eliminate cold-start failures that degrade the enrollment experience during the once-a-year peak window | Functions Premium cold starts (2-5s) cause timeouts at ~30K users |
| **Reduce business risk** | Preserve FedRAMP Moderate / FERPA posture during modernization | Loss of authorization would halt the program |
| **Reduce business risk** | Resiliency and business continuity for a fixed, immovable enrollment deadline | An outage during enrollment week is a public, political failure |
| **Accelerate innovation** | Enable enterprise analytics (Trino + CubeJS) not available in the current architecture | SEAA leadership and NC legislature require program reporting and dashboards |
| **Accelerate innovation** | Cloud-native patterns (Dapr service mesh, KEDA scaling) to support future program growth | New scholarship programs and agency integrations |
| **Enhance agility & efficiency** | Developer productivity via .NET Aspire local dev (F5 to launch full stack) | Reduce onboarding/local setup from ~2 hours to ~5 minutes |
| **Enhance agility & efficiency** | Consumption-based scaling to right-size cost across the seasonal demand curve | Pay for 80K capacity only during peak month; scale to near-zero off-season |

### 1.2 Mission Statement

> **Mission:** "Deliver a secure, FedRAMP-compliant, cloud-native platform that lets every eligible North Carolina family apply for and manage ESA+ and Opportunity Scholarship awards reliably during peak enrollment, while giving SEAA the analytics it needs to administer public funds transparently."

The mission answers the three CAF framing questions:

- **Why:** Modernize to remove scale ceilings and add analytics without compromising compliance.
- **What:** Operate ESA+ and Opportunity Scholarship programs at 80K concurrent users with sub-2s response times and program-level reporting.
- **How:** Measure success against the objectives and key results (OKRs) below.

### 1.3 Objectives and Key Results (OKRs)

CAF recommends expressing objectives as measurable key results. These trace directly to the success metrics in the target-architecture README.

| Objective | Key Result (Measure) | Target |
|-----------|----------------------|--------|
| **Scale** — survive peak enrollment | Load-tested max concurrent users | 80,000 (from ~30K ceiling) |
| **Performance** — responsive UX | API latency p95 (business logic / CRUD) | < 2s (Functions) / < 50ms (DAB) |
| **Reliability** — no enrollment-week outage | Cold start time; availability during peak | 0s cold start; 99.9%+ (99.95% multi-region option) |
| **Analytics** — program transparency | Pre-built dashboards delivered | 10 dashboards; Trino < 10s, CubeJS < 5s queries |
| **Security/Compliance** — maintain authorization | FedRAMP Moderate authorization retained; RLS violations | Retained; zero unauthorized PII access |
| **Cost** — fiscal discipline | Monthly cost increase vs. current baseline | within +20% (~$6,955/mo target) |
| **Productivity** — developer velocity | Local environment setup time | < 5 minutes (Aspire F5) |

**Recommendation:** Review OKRs with SEAA program leadership and the CFI finance partner each fiscal year and after every enrollment cycle. Adjust targets as program volume changes.

## 2. Define the Strategy Team

CAF calls for a cross-functional cloud strategy team that maintains alignment between business priorities and adoption efforts. For K12, the team maps to existing CFI/SEAA roles.

| CAF Role | K12 Owner | Responsibility |
|----------|-----------|----------------|
| **Executive sponsor** | SEAA Program Lead / CFI leadership | Funding approval, board reporting, removes blockers |
| **Business strategy** | SEAA Product Lead / CFI Product Owner | Program priorities, enrollment-cycle requirements |
| **Technical strategy** | CFI Architecture Team (Marty Flournory, Sumith Mathur) | Target architecture, ADR ownership, technology direction |
| **Security/compliance** | CFI Security Team | FedRAMP/FERPA posture, Entra ID model, risk acceptance |
| **Finance / FinOps** | CFI finance partner | TCO, budget forecasting, cost guardrails |
| **Operations / platform** | Cloud governance + platform team | Landing zone, governance disciplines, ops baseline |

**Why K12 needs this team:** to keep initiatives purpose-driven and tied to motivations, bring security/compliance into early decisions (critical under FedRAMP), accelerate the 6-month modernization timeline through clear ownership, and reduce operational and regulatory risk for a public-funds program.

## 3. Prepare the Organization

### 3.1 Executive Sponsorship and Alignment
Leadership sign-off for the target architecture is in progress. CAF requires an executive summary with financial projections for sponsor approval — for K12 this is the cost analysis (current $5,800/mo → proposed $6,955/mo, +20%; 3-year TCO $209K → $250K) co-developed with finance and presented to SEAA leadership.

### 3.2 Operating Model
K12 adopts a **hybrid operating model**: a central CFI platform/governance team owns the Azure landing zone, FedRAMP controls, and shared services, while the application team owns the K12 MyPortal workload (admin, enrollment, providers, schools applications). This balances FedRAMP's need for centralized control with workload-team agility — it is **not** full subscription democratization, because a regulated public-funds program requires central operations and authorization boundaries.

### 3.3 Product-Oriented Shift
The modernization moves K12 toward a product-oriented model: the MyPortal platform is treated as a long-lived product (continuous improvement, .NET 10 LTS runtime, Aspire-based developer experience) rather than a project that ends at go-live.

## 4. Inform the Strategy

CAF's fourth step applies strategic considerations across the dimensions that shape outcomes. Each ties to a Well-Architected pillar (see cross-reference below).

### 4.1 Cost Efficiency
- Consumption-based Container Apps scaling matches the seasonal enrollment curve; scale to near-zero off-peak.
- Redis caching (65%+ hit-rate target) reduces SQL and compute load and therefore cost.
- Reject microservices-on-AKS (~$12K/mo, ~2x cost) in favor of a containerized modular monolith (+20%).
- Detailed financial modeling lives in **WA-03 Cost Optimization** and CONT-10 (Cost Model & ROI).

### 4.2 Resiliency
- No cold starts (always-warm Container Apps) removes the dominant peak-failure mode.
- Multi-region option ($9,785/mo) provides a 99.95% SLA path if SEAA accepts the cost for the enrollment window.
- Dapr-based service mesh and KEDA scaling support graceful degradation under load.

### 4.3 Security and Sovereignty
- **Azure Government Cloud** is mandatory; all selected services must be available and authorized in Gov regions under **FedRAMP Moderate / NIST 800-53**.
- Preserve the Hub & Spoke Entra ID model, the `studentAccessControl` custom security attribute, and defense-in-depth (APIM → middleware → SQL row-level security).
- **FERPA** governs all student PII; encryption at rest (TDE), in transit (TLS 1.2+), and PGP for DMV/DOR exchanges are non-negotiable strategy guardrails.
- Full treatment in **WA-02 Security**.

### 4.4 Sustainability
- Scaling to near-zero off-season reduces idle compute and aligns with green-IT goals.
- Distroless, minimal container images reduce footprint and attack surface.

## 5. Strategy Constraints and Guardrails

These organization-wide constraints bound every downstream Plan/Adopt/Govern decision:

```text
NON-NEGOTIABLE GUARDRAILS (K12 Cloud Strategy)
1. Cloud:         Azure Government Cloud only (no commercial-cloud services)
2. Compliance:    FedRAMP Moderate + NIST 800-53 authorization must be preserved
3. Privacy:       FERPA controls on all student PII (RLS, TDE, encrypted agency exchange)
4. Accessibility: WCAG 2.1 AA for all citizen-facing applications
5. Identity:      Entra ID remains the central identity authority (Hub & Spoke)
6. Cost:          Stay within +20% of the current monthly baseline
7. Timeline:      6-month modernization; no disruption to an active enrollment cycle
```

## Cross-reference: CAF and Well-Architected

The CAF Strategy methodology sets *direction and motivations*; the Well-Architected Framework provides the *technical design quality bar* that realizes the strategy. K12 mappings:

| CAF Strategy "Inform" dimension | Well-Architected pillar | K12 doc |
|---------------------------------|-------------------------|---------|
| Cost efficiency | Cost Optimization | WA-03 |
| Resiliency | Reliability | WA-01 |
| Security & sovereignty | Security | WA-02 |
| Operating model / ops readiness | Operational Excellence | WA-04 |
| Scale to 80K | Performance Efficiency | WA-05 |

The downstream CAF docs continue the journey: **CAF-02 (Plan)** turns this strategy into a backlog, **CAF-03 (Adopt)** executes migration/modernization, and **CAF-04 (Govern & Manage)** sustains the guardrails defined above.

## References

### Microsoft Documentation
- [Develop a cloud adoption strategy](https://learn.microsoft.com/azure/cloud-adoption-framework/strategy/)
- [Determine your motivations, mission, and objectives](https://learn.microsoft.com/azure/cloud-adoption-framework/strategy/motivations)
- [Define your cloud strategy team](https://learn.microsoft.com/azure/cloud-adoption-framework/strategy/define-your-team)
- [Prepare your organization for the cloud](https://learn.microsoft.com/azure/cloud-adoption-framework/strategy/prepare-organizational-alignment)
- [Inform your cloud adoption strategy](https://learn.microsoft.com/azure/cloud-adoption-framework/strategy/inform/)
- [Integrate security into your cloud adoption strategy](https://learn.microsoft.com/azure/cloud-adoption-framework/secure/strategy)
- [What is the Microsoft Cloud Adoption Framework?](https://learn.microsoft.com/azure/cloud-adoption-framework/overview)

### Related K12 Documents
- [CAF-02: Plan](./CAF-02-plan.md)
- [CAF-03: Adopt](./CAF-03-adopt.md)
- [CAF-04: Govern & Manage](./CAF-04-govern-manage.md)
- [WA-02: Security](./../well-architected/WA-02-security.md)
- [WA-03: Cost Optimization](./../well-architected/WA-03-cost-optimization.md)
- [Target Architecture Overview](./../README.md)

---

**Document Status:** Draft
**Last Updated:** 2025-11-24
**Owner:** CFI Architecture Team
