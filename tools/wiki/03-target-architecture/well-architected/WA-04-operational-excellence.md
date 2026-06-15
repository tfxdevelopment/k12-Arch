# WA-04: Operational Excellence Assessment - K12 MyPortal Cloud-Native Architecture

## Metadata
- **Status:** Draft
- **Date:** 2026-06-06
- **Framework:** Microsoft Azure Well-Architected Framework - Operational Excellence Pillar
- **Compliance:** FedRAMP Moderate, NIST 800-53, FERPA, WCAG 2.1 AA
- **Related Documents:** WA-01 (Reliability), WA-02 (Security), WA-03 (Cost Optimization), WA-05 (Performance Efficiency), OPS-01 (Monitoring), OPS-02 (Incident Response/SRE), OPS-03 (Continuous Improvement), ASPIRE-05 (Deployment with azd), ASPIRE-06 (Hybrid IaC), CONT-08 (Observability)

## Executive Summary

Operational Excellence assessment for K12 MyPortal's proposed Azure Container Apps architecture. The goal is to establish DevOps standards, end-to-end observability, and safe, automated deployment practices that let the **CFI Architecture Team** operate the platform reliably and predictably — especially during the **~80,000 concurrent user peak enrollment month** for the ESA+ and Opportunity Scholarship programs.

The current Functions Premium estate ships changes through partially manual processes, has shallow telemetry (30-day App Insights, no distributed tracing), and lacks formalized incident management and progressive rollout. The proposed architecture — **Azure Container Apps + Container Functions, .NET 10, Data API Builder (DAB), Trino + CubeJS, Redis, Dapr, and .NET Aspire** on **Azure Government Cloud** — directly enables operational maturity: built-in OpenTelemetry agents, Dapr distributed tracing, Aspire-generated Bicep, and `azd` pipeline deployments with blue-green revisions. This assessment maps each Operational Excellence design principle to concrete K12 controls and a phased roadmap, while preserving FedRAMP Moderate, NIST 800-53, and FERPA obligations.

## Well-Architected Framework: Operational Excellence Pillar

### Five Operational Excellence Design Principles

1. **Embrace DevOps culture** — Shared ownership, blameless learning, common tooling, and a continuous-improvement mindset across development and operations.
2. **Establish development standards** — Standardized practices, quality gates, unified source control, and clear functional/non-functional specifications.
3. **Evolve operations with observability** — A decoupled monitoring stack covering infrastructure, application health, and the build/release pipeline; health modeling to anticipate incidents.
4. **Deploy with confidence (safe deployment practices)** — IaC, small incremental changes, automated pipelines, progressive exposure, and rollback/roll-forward mitigation.
5. **Automate for efficiency** — Replace repetitive, procedural toil with software automation that is treated as a first-class, Well-Architected workload dependency.

### Design-Review Checklist Mapping (OE:01–OE:12)

| Code | Recommendation | K12 Implementation |
|------|----------------|--------------------|
| **OE:01** | DevOps culture, blameless learning | Shared Azure DevOps boards + Jira; quarterly blameless postmortems |
| **OE:02** | Standardize routine/emergency operations | Runbooks in `10-operations/`; enrollment-peak game days |
| **OE:03** | Formalize the SDLC | Agile/Scrum, shared prioritized backlog in Jira K12 project |
| **OE:04** | Standardize tooling & quality assurance | .NET 10 SDK, EditorConfig, Roslyn analyzers, DAB config linting |
| **OE:05** | Standardized IaC | Hybrid: Aspire-generated Bicep (compute) + Terraform (governance) |
| **OE:06** | Automated, gated supply chain | `azure-pipelines.yml` multi-stage + `azd` provision/deploy |
| **OE:07** | Monitoring system & instrumentation | App Insights + Log Analytics + OpenTelemetry + Dapr traces |
| **OE:08** | Incident management process | P0–P3 severity model, on-call rotation, SRE error budgets |
| **OE:09** | Design automation up front | Aspire AppHost, KEDA scaling, secret rotation, self-healing probes |
| **OE:10** | Safe deployment practices | Container Apps blue-green revisions + traffic splitting |
| **OE:11** | Deployment failure mitigation | Instant revision rollback, feature flags, SQL point-in-time restore |
| **OE:12** | Health model & testing in production | Synthetic probes, smoke tests, load-tested 80K peak model |

## Current State Operational Posture

### Existing Practices (Maintained)
- ✅ **Source control & CI:** Azure DevOps repos with `azure-pipelines.yml` build/test/deploy pipeline.
- ✅ **Basic telemetry:** Application Insights (30-day retention), Azure SQL audit logs.
- ✅ **IaC foundation:** Terraform (`k12-infra`) provisions networking, SQL, ADLS, identity.
- ✅ **Integration test gates:** Postman/Newman (`k12-test-api-postman`) API suites.

### Operational Gaps in Current Architecture
1. ❌ **No distributed tracing:** Cannot follow a request across Functions → SQL → integrations.
2. ❌ **Manual/large deployments:** 15-minute deploys, no progressive exposure, risky during enrollment peak.
3. ❌ **Cold-start unpredictability:** Functions Premium cold starts complicate health modeling.
4. ❌ **Toil-heavy operations:** Manual SIEM exports, manual secret rotation, manual scale tuning.
5. ❌ **Informal incident management:** No documented severity model, on-call rotation, or error budgets.
6. ❌ **No health model:** No formal end-to-end health signal aggregation to gate rollouts.

## Proposed Architecture Operational Enhancements

### 1. DevOps Culture & Practices (OE:01, OE:03)

The proposed platform is operated with a DevOps mindset: shared ownership between the CFI Architecture Team, SEAA product, and DevOps; a blameless culture; and common tooling so that situational awareness is uniform across environments.

| Practice | Tool / Mechanism | Outcome |
|----------|------------------|---------|
| **Shared backlog** | Jira K12 project + Azure DevOps boards | One prioritized list across features and bugs |
| **Unified source control** | Azure DevOps Repos (Git), trunk-based with short-lived branches | Friction-free feature/hotfix release flow |
| **Blameless postmortems** | Confluence (KR space) templates | Root-cause learning, not blame |
| **Continuous learning** | Quarterly architecture guild, A/B and PoC sandboxes | Innovation at low cost |
| **Shift-left** | Pre-commit hooks, PR quality gates, IaC validation | Detect defects before merge |

**"Shift-left" quality gates** are enforced in pull requests: build, unit tests, Roslyn analyzers, DAB schema validation, Bicep `what-if`, and `tflint`/`terraform validate` for governance modules. Failing any gate blocks merge.

### 2. Development Standards (OE:03, OE:04)

```yaml
# .editorconfig + analyzer baseline (enforced in CI)
standards:
  language: .NET 10 (LTS)
  style: dotnet format + EditorConfig
  analyzers: Microsoft.CodeAnalysis.NetAnalyzers (warnings-as-errors)
  api_contracts:
    dab: dab validate (schema + permissions linting)
    rest_graphql: OpenAPI / GraphQL schema checked into repo
  branching: trunk-based; PR + 1 reviewer; squash-merge
  commit_convention: Conventional Commits (feat/fix/chore/ops)
  docs: ADRs in 07-adr-proposed/; runbooks in 10-operations/
```

Standardized templates ("design once, run everywhere"): a reusable Aspire AppHost template, a reusable pipeline YAML template, and a reusable Bicep module library so that onboarding a new service is a repeatable, low-risk action.

### 3. Observability (OE:07) — Evolve Operations

The monitoring system is treated as a **decoupled dimension of the workload** with its own stack and flows, covering infrastructure, application health, and the build/release pipeline. Container Apps' built-in **OpenTelemetry agent** pipes traces, metrics, and logs to Azure Monitor Application Insights without per-app agent management, and can fan out to OTLP-compatible endpoints.

#### Observability Stack

| Signal | Source | Sink | Purpose |
|--------|--------|------|---------|
| **Traces** | OpenTelemetry SDK + Dapr distributed tracing | App Insights (Azure Monitor) | End-to-end request flow across Container Apps, DAB, Trino |
| **Metrics** | OTel + KEDA metrics (`includeKeda: true`) | Log Analytics / Azure Monitor | Scale decisions, latency, throughput |
| **Logs** | Container `stdout`/`stderr`, structured logs | Log Analytics | Diagnostics, audit, troubleshooting |
| **Dapr telemetry** | Dapr sidecar (`includeDapr: true`) | App Insights | Service invocation, pub/sub, mTLS traces |
| **Profiles** | .NET diagnostics | App Insights Profiler | Memory/CPU hot paths |

#### Container Apps Environment OpenTelemetry Configuration (Bicep)

```bicep
// Aspire-generated managed environment with OTel agent + Dapr/KEDA signals
resource caeEnv 'Microsoft.App/managedEnvironments@2024-02-02-preview' = {
  name: 'k12-cae-prod'
  location: 'usgovvirginia' // Azure Government Cloud (FedRAMP Moderate)
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: { customerId: logAnalyticsWorkspaceId }
    }
    openTelemetryConfiguration: {
      tracesConfiguration: {
        destinations: [ 'appInsights' ]
        includeDapr: true          // Dapr distributed traces
      }
      metricsConfiguration: {
        destinations: [ 'appInsights' ]
        includeKeda: true          // KEDA scaling metrics
      }
      logsConfiguration: { destinations: [ 'appInsights' ] }
    }
  }
}
```

#### Application Instrumentation (.NET 10 + Aspire)

```csharp
// Program.cs — Aspire service defaults wire OpenTelemetry automatically
builder.AddServiceDefaults(); // OTel traces/metrics/logs + health checks

builder.Services.AddOpenTelemetry()
  .WithTracing(t => t
    .AddSource("K12.Enrollment")
    .AddAspNetCoreInstrumentation()
    .AddHttpClientInstrumentation()  // ClassWallet, SendGrid, PandaDoc, Graph
    .AddSqlClientInstrumentation())  // DAB / Dapper SQL spans
  .WithMetrics(m => m
    .AddAspNetCoreInstrumentation()
    .AddRuntimeInstrumentation());
// OTEL_EXPORTER_OTLP_ENDPOINT injected by the Container Apps OTel agent
```

**Distributed tracing across Container Apps:** Because every Dapr-enabled app runs a sidecar, service invocation (`http://localhost:3500/v1.0/invoke/...`) automatically propagates trace context with mTLS and retries, so a single enrollment request can be followed across the Functions container → DAB → SQL → integration calls in one App Insights end-to-end view.

#### Dashboards & Actionable Alerts

- **Situational dashboards** (Azure Monitor Workbooks) for leadership: enrollment throughput, error rate, p95 latency vs. business targets.
- **Operational dashboards** with drill-down for on-call: per-revision health, KEDA replica counts, dependency latency.
- **Actionable alerts only:** alerts notify the accountable on-call role with standardized severity and a runbook link; non-actionable noise is suppressed. Example KQL:

```kql
// Alert: enrollment API p95 latency breaching SLO during peak
requests
| where cloud_RoleName == "k12-enrollment-api"
| summarize p95 = percentile(duration, 95) by bin(timestamp, 5m)
| where p95 > 2000   // SLO: <2s p95
| extend Severity = "Sev2", Runbook = "OPS-01#latency-slo-breach"
```

#### Health Modeling

A formal **health model** aggregates infrastructure, application, and user-experience signals into per-component and overall health states. Container App `/health/live` and `/health/ready` probes (from Aspire service defaults), synthetic transactions, and KEDA/Dapr metrics feed the model. Rollouts are gated on green health throughout bake time (see §5).

### 4. Infrastructure as Code (OE:05) — Hybrid Approach

K12 uses a **declarative, layered, hybrid IaC** model aligned to lifecycle: stable foundational layers in Terraform, fast-moving compute in Aspire-generated Bicep.

| Layer | Tool | Scope | Lifecycle |
|-------|------|-------|-----------|
| **Governance / foundation** | Terraform (`k12-infra`) | VNET, subnets, private endpoints, SQL, ADLS Gen2, Key Vault, Entra, policy | Stable, change-controlled |
| **Compute / app topology** | Aspire → `azd infra gen` → Bicep | Container Apps env, container apps, Dapr components, Redis, DAB | Fast iteration |

```bash
# Generate reviewable Bicep from the Aspire app model (version-controlled)
azd config set alpha.infraSynth on
azd infra gen     # emits infra/main.bicep, resources.bicep, containerApp.tmpl.yaml
# Bicep is committed; pipeline runs what-if before apply
az deployment group what-if -g k12-prod-rg -f infra/main.bicep
```

**Drift control:** IaC is the single source of truth; pipelines run `what-if`/`terraform plan` to detect and reject drift. `azd infra gen` regeneration is committed and re-customizations re-applied (documented per the Aspire regeneration caveat). Foundational Terraform layers are kept independent of compute regeneration to avoid blast-radius coupling.

### 5. Safe Deployment Practices (OE:06, OE:10, OE:11)

All changes flow through **predictable, automated pipelines** with quality gates across environments (dev → test → staging → prod). Container Apps **revisions with traffic splitting** provide native blue-green and canary without extra infrastructure.

#### CI/CD Pipeline (Azure DevOps + azd)

```yaml
# azure-pipelines.yml (multi-stage, gated progressive exposure)
stages:
  - stage: Build
    jobs:
      - job: BuildTest
        steps:
          - script: dotnet build -c Release
          - script: dotnet test --collect "XPlat Code Coverage"
          - script: dab validate                       # DAB schema gate
          - script: az deployment group what-if ...     # IaC gate
          - script: dotnet publish /t:PublishContainer  # OCI image
  - stage: DeployStaging
    jobs:
      - deployment: Staging
        environment: k12-staging                         # approval gate
        strategy:
          runOnce:
            deploy: { steps: [ - script: azd deploy ] }
          postRouteTraffic:
            steps: [ - script: newman run smoke-tests ]   # smoke tests
  - stage: DeployProd
    jobs:
      - deployment: Prod
        environment: k12-prod                            # manual approval
        strategy:
          canary:
            increments: [ 10, 25, 50, 100 ]              # progressive exposure
```

#### Blue-Green / Canary with Container App Revisions

```bash
# Deploy new revision with 0% traffic (green), validate, then progressively shift
az containerapp update -n k12-enrollment-api -g k12-prod-rg \
  --image k12acr.azurecr.us/enrollment-api:$(Build.BuildId) \
  --revision-suffix $(Build.BuildId)

# Bake at 10% with health-model gating, then ramp
az containerapp ingress traffic set -n k12-enrollment-api -g k12-prod-rg \
  --revision-weight latest=10 <previous-revision>=90   # canary 10%
# ... ramp 25/50/100 across bake windows (hours), watch health signals
```

#### Safe Deployment Guardrails

| Strategy | Mechanism | K12 Use |
|----------|-----------|---------|
| **Small, frequent changes** | Trunk-based, daily merges | Smaller blast radius, easier rollback |
| **Progressive exposure** | Revision traffic split + feature flags (App Configuration) | 10→25→50→100% with bake time (hours) |
| **Bake time** | Health-model green across rollout window | Account for time zones / peak usage |
| **Failure detection** | Auto-halt on health-signal alert | Rollout stops immediately on Sev1/Sev2 |
| **Rollback** | Instant traffic shift to last-good revision | Near-zero MTTR for app changes |
| **Roll-forward** | Pre-approved expedited hotfix path | Security patches deployed fast |
| **Stateful changes** | Versioned, backward/forward-compatible migrations; SQL point-in-time restore | RLS-aware, no breaking schema changes |

**Emergency / hotfix path:** A pre-approved expedited pipeline (security patches, P0 fixes) bypasses non-essential gates while still enforcing build, smoke test, and canary. This is critical during the enrollment freeze window where only emergency changes are allowed.

### 6. Automation & Toil Reduction (OE:02, OE:09)

Automation is treated as a **critical, Well-Architected workload dependency** (it must be reliable, secure, and cost-aware). Repetitive, procedural, error-prone tasks with a positive ROI are automated; high-judgment tasks keep humans in the loop.

| Toil (Current) | Automation (Proposed) | Benefit |
|----------------|-----------------------|---------|
| Manual scale tuning | KEDA event-driven autoscaling (HTTP, queue, CPU) | 0 → 1000 replicas, no human action at peak |
| Manual secret rotation | Key Vault rotation + managed-identity refresh | 90-day rotation, zero-downtime restarts |
| Manual SIEM export | Sentinel connectors (continuous) | Real-time, no manual export |
| Manual local env setup (2 hrs) | `.NET Aspire` F5 (5 min) | Consistent dev environments |
| Manual incident triage | Alert auto-triage + self-healing probes | Faster MTTD/MTTR |
| Manual release notes | Conventional Commits → generated changelog | Auditable, repeatable |

**Self-healing:** Container Apps automatically restart unhealthy replicas (failed readiness/liveness probes) and reschedule on node failure; Dapr provides automatic retries/circuit breaking for transient integration faults (ClassWallet, SendGrid, PandaDoc, Graph, NC DMV/DOR/DPI).

### 7. Incident Management, Runbooks & On-Call (OE:08)

A structured incident management process with defined roles, documented procedures, and an architecture designed for rapid detection, diagnosis, and recovery.

#### Severity Model & Targets

| Severity | Definition | Response | Comms |
|----------|------------|----------|-------|
| **P0** | Outage / data exposure during enrollment | Page on-call ≤ 5 min; war room | SEAA + CFI leadership, hourly |
| **P1** | Major degradation, SLO breach | Page on-call ≤ 15 min | Stakeholder update ≤ 30 min |
| **P2** | Partial / non-critical degradation | Next business hour | Ticket + dashboard |
| **P3** | Minor, no user impact | Backlog | Tracked in Jira |

#### Runbook Library (`10-operations/`)
- **OPS-01:** Monitoring/observability — dashboards, alert routing, KQL queries.
- **OPS-02:** Incident response & SRE — on-call rotation, error budgets, escalation, postmortem template.
- **OPS-03:** Continuous improvement — postmortem action tracking, MTTR trend review.
- **Standard runbooks:** revision rollback, secret rotation failure, KEDA scaling stall, Dapr sidecar failure, SQL failover, integration-partner outage (ClassWallet/PandaDoc).

#### SRE & Error Budgets
- SLOs: 99.9% availability (peak), p95 < 2s API, p95 < 50ms DAB CRUD.
- Error budget governs release pace: budget exhausted → freeze feature deploys, prioritize reliability.
- **Blameless postmortems** within 48 hours of any P0/P1; action items tracked to closure in OPS-03.

### 8. Release & Change Management

| Control | Implementation |
|---------|----------------|
| **Change advisory** | Lightweight CAB for high-risk/governance changes; standard changes pre-approved via pipeline |
| **Approval gates** | Azure DevOps environment approvals (staging + prod) with auditable electronic sign-off |
| **Change log** | Auto-generated from Conventional Commits + pipeline run records |
| **Enrollment freeze** | Code freeze during peak window; only pre-approved emergency changes |
| **Audit trail** | Every deploy creates an immutable record (FedRAMP / NIST CM controls) |

### 9. Testing in Production & Health Modeling (OE:12)

- **Smoke tests** (Newman) run post-deploy against health endpoints and key flows before traffic routing.
- **Synthetic monitoring:** Availability tests simulate enrollment submission against staging and a small prod canary.
- **Load testing:** Azure Load Testing validates the **80K concurrent** model before each enrollment season; results feed KEDA scale rules and the health model.
- **Game days:** Pre-enrollment chaos drills (kill a replica, fail an integration partner) validate runbooks and on-call readiness.

### 10. Operations for 80K-User Peak Enrollment

The peak enrollment month is the single most operationally demanding event. Formalized operations include:

| Readiness Activity | Lead Time | Owner |
|--------------------|-----------|-------|
| Load test 80K model + tune KEDA | T-6 weeks | DevOps + Architecture |
| Pre-scale baseline replicas (min instances) | T-1 week | DevOps |
| Enrollment freeze (emergency-only deploys) | T-3 days → end | Change Board |
| 24×7 on-call rotation + war-room standby | Peak window | SRE / On-call |
| Real-time leadership dashboard | Peak window | Architecture |
| Daily health & error-budget review | Peak window | SRE |

## Compliance & Operational Controls Scorecard

| Requirement | Current | Proposed | Status |
|-------------|---------|----------|--------|
| **FedRAMP Moderate (Azure Gov)** | ✅ | ✅ | Maintained |
| **NIST 800-53 CM (Change Mgmt)** | ⚠️ Partial | ✅ Enhanced | Gated pipelines, audit trail |
| **NIST 800-53 AU (Audit/Accountability)** | ⚠️ Basic | ✅ Enhanced | OTel + Log Analytics + Sentinel |
| **NIST 800-53 IR (Incident Response)** | ❌ Informal | ✅ Formalized | Severity model, runbooks, on-call |
| **FERPA (operational data handling)** | ✅ | ✅ | RLS preserved; telemetry excludes PII |
| **WCAG 2.1 AA** | ✅ | ✅ | No frontend change; a11y CI checks added |

> **Note:** Observability telemetry is scoped to operational signals (traces, metrics, logs) and **must not capture PII / student business data**, consistent with FERPA and the WAF guidance to keep monitoring decoupled from business data.

## Recommendations

### Phase 1 (Month 1–3): Foundation
1. ✅ Enable Container Apps **OpenTelemetry agent** (traces/metrics/logs → App Insights), `includeDapr` + `includeKeda`.
2. ✅ Wire **Aspire service defaults** OTel + health probes into all .NET 10 services.
3. ✅ Adopt **hybrid IaC**: commit `azd infra gen` Bicep; keep Terraform for governance; add `what-if`/`plan` gates.
4. ✅ Stand up **multi-stage azure-pipelines.yml** with build/test/DAB/IaC quality gates.
5. ✅ Publish severity model and core runbooks (rollback, secret rotation, integration outage).

### Phase 2 (Month 4–6): Safe Deployment & Incident Maturity
1. Implement **blue-green/canary** via Container App revision traffic splitting + App Configuration feature flags.
2. Define and enforce a **health model**; gate rollouts on green bake time.
3. Establish **on-call rotation, error budgets, blameless postmortems** (OPS-02/OPS-03).
4. Automate **secret rotation, alert triage, and self-healing**; eliminate top-5 toil items.
5. Integrate **Sentinel** connectors for continuous audit (supports NIST AU).

### Phase 3 (Year 2): Optimization & Scale Maturity
1. Run **pre-enrollment game days** and chaos drills; codify enrollment-peak readiness checklist.
2. Add **self-service** developer environments and templates ("design once, run everywhere").
3. AI-assisted **rollout tuning** and incident triage (Copilot / agents over deployment + incident history).
4. Pursue **WAF Operational Excellence Level 4→5 maturity** (immutable revisions, deployment-stamp scaling, org-wide knowledge sharing).

## Success Metrics

### Operational KPIs (Measured Monthly / Quarterly)

| KPI | Current | Target |
|-----|---------|--------|
| **Deployment frequency** | ~Weekly, manual | Daily, automated |
| **Deployment lead time** | 15 min | < 5 min (`azd deploy`, blue-green) |
| **Change failure rate** | Unmeasured | < 10% |
| **Mean time to detect (MTTD)** | Hours | < 15 min |
| **Mean time to recover (MTTR)** | Hours | < 30 min (instant revision rollback) |
| **Trace coverage** | 0% | 100% of critical request paths |
| **Toil reduction** | Baseline | -40% incident response time |
| **Postmortem closure** | N/A | 100% P0/P1 action items closed in 30 days |
| **Local dev setup time** | ~2 hrs | 5 min (Aspire F5) |
| **Enrollment-peak readiness** | Ad hoc | 100% checklist complete by T-1 week |

## References

### Microsoft Documentation
- [Well-Architected Framework: Operational Excellence](https://learn.microsoft.com/azure/well-architected/operational-excellence/)
- [Operational Excellence design principles](https://learn.microsoft.com/azure/well-architected/operational-excellence/principles)
- [Design review checklist for Operational Excellence](https://learn.microsoft.com/azure/well-architected/operational-excellence/checklist)
- [Architecture strategies for fostering DevOps culture (OE:01)](https://learn.microsoft.com/azure/well-architected/operational-excellence/devops-culture)
- [Architecture strategies for safe deployment practices](https://learn.microsoft.com/azure/well-architected/operational-excellence/safe-deployments)
- [Building a health model](https://learn.microsoft.com/azure/well-architected/design-guides/health-modeling)
- [Operational Excellence maturity model](https://learn.microsoft.com/azure/well-architected/operational-excellence/maturity-model)
- [Collect and read OpenTelemetry data in Azure Container Apps](https://learn.microsoft.com/azure/container-apps/opentelemetry-agents)
- [Communicate between container apps (Dapr service invocation & tracing)](https://learn.microsoft.com/azure/container-apps/connect-apps#dapr-service-invocation)
- [Application Insights — OpenTelemetry observability](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview)
- [Customize Aspire Azure deployments (azd infra gen / Bicep)](https://learn.microsoft.com/dotnet/aspire/deployment/azd/customize-deployments)
- [Deploy an Aspire project to Azure Container Apps with azd](https://learn.microsoft.com/dotnet/aspire/deployment/azd/aca-deployment-azd-in-depth)
- [What is continuous delivery? (progressive exposure)](https://learn.microsoft.com/devops/deliver/what-is-continuous-delivery)
- [Deploy cloud-native solutions (CAF)](https://learn.microsoft.com/azure/cloud-adoption-framework/cloud-native/deploy-cloud-native-solutions)

### Related K12 Documents
- [WA-01: Reliability](./WA-01-reliability.md)
- [WA-02: Security](./WA-02-security.md)
- [WA-03: Cost Optimization](./WA-03-cost-optimization.md)
- [WA-05: Performance Efficiency](./WA-05-performance-efficiency.md)
- [CAF-01: Strategy](./../cloud-adoption/CAF-01-strategy.md)
- [CAF-02: Plan](./../cloud-adoption/CAF-02-plan.md)
- [CAF-03: Adopt](./../cloud-adoption/CAF-03-adopt.md)
- [CAF-04: Govern & Manage](./../cloud-adoption/CAF-04-govern-manage.md)
- [ASPIRE-05: Deployment with azd](./../02-aspire/ASPIRE-05-deployment-azd.md)
- [ASPIRE-06: Hybrid IaC](./../02-aspire/ASPIRE-06-hybrid-iac.md)
- [CONT-08: Observability and Monitoring](./../01-container-apps/CONT-08-observability.md)
- [OPS-01: Monitoring](./../10-operations/OPS-01-monitoring.md)
- [OPS-02: Incident Response and SRE](./../10-operations/OPS-02-incident-response.md)
- [OPS-03: Continuous Improvement](./../10-operations/OPS-03-continuous-improvement.md)

> **Cross-reference:** This document is one of five Well-Architected pillar assessments (WA-01 Reliability, WA-02 Security, WA-03 Cost Optimization, WA-04 Operational Excellence, WA-05 Performance Efficiency) and complements the Cloud Adoption Framework set in [`cloud-adoption/`](./../cloud-adoption/) (CAF-01 Strategy, CAF-02 Plan, CAF-03 Adopt, CAF-04 Govern & Manage). Operational Excellence intentionally trades some short-term velocity for safety and consistency; review alongside the reliability and performance pillars for the full tradeoff picture.

---

**Document Status:** ✅ Complete
**Last Updated:** 2026-06-06
**Next Review:** Before enrollment-season load testing (T-6 weeks)
**Owner:** CFI Architecture Team + DevOps/SRE
