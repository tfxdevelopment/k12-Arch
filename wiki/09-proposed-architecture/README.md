# Proposed Cloud-Native Architecture for K12 MyPortal

**Status:** 🚧 In Development - Week 1/10
**Timeline:** 10 weeks (Starting November 24, 2025)
**Approval:** Leadership sign-off in progress
**Owner:** CFI Architecture Team

---

## Executive Summary

This directory contains the **proposed future-state architecture** for K12 MyPortal, designed to address:

1. **80,000 concurrent user scale** during peak enrollment month
2. **Enterprise analytics capabilities** (reporting, dashboards, data federation)
3. **Modern cloud-native patterns** (containerization, service mesh, microservices-ready)
4. **Developer productivity** (local development with .NET Aspire)
5. **Cost efficiency** (+20% vs current, -43% vs microservices on AKS)

## Key Architectural Decisions

### ✅ **Approved Approach: Container Apps + .NET 10 + Hybrid API Strategy**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Hosting** | Azure Container Apps | Managed Kubernetes, NOT App Service |
| **Compute** | Azure Container Functions on Container Apps | Business logic, no cold starts, 80K scale |
| **Analytics** | Metabase | Local container (dev), Container Apps (test), Metabase Cloud (prod) |
| **Caching** | Azure Cache for Redis | Distributed cache for all layers (65%+ hit rate target) |
| **Cross-Cutting** | Dapr (all 8 building blocks) | Unified abstractions for cloud-agnostic patterns |
| **Local Dev** | .NET Aspire + Dapr | F5 to launch all containers with Dapr sidecars |
| **IaC** | Aspire (compute) + Terraform (governance) | Hybrid approach for flexibility |
| **Runtime** | .NET 10 (LTS) | Latest long-term support, released Nov 11, 2025 |

### 🔧 **Dapr for ALL Cross-Cutting Concerns**

K12 uses **Dapr (Distributed Application Runtime)** as the abstraction layer for ALL cross-cutting concerns. This provides a consistent programming model that works identically in local development (Aspire + Docker) and production (Azure Container Apps).

| # | Dapr Building Block | Local (Aspire) | Production (Azure) | K12 Use Case |
|---|---------------------|----------------|-------------------|--------------|
| 1 | **Service Invocation** | Dapr sidecar | Container Apps Dapr | mTLS, retries, circuit breakers |
| 2 | **State Management** | Redis container | Azure Cache for Redis | Session cache, temp data |
| 3 | **Pub/Sub** | Redis Streams | Azure Service Bus | RDS integration, roster events |
| 4 | **Bindings** | Local file system | Azure Blob, SendGrid | Document storage, email |
| 5 | **Secrets** | Local secrets file | Azure Key Vault | API keys, connection strings |
| 6 | **Configuration** | Local config file | Azure App Configuration | Feature flags, settings |
| 7 | **Workflows** | Dapr Workflow runtime | Dapr Workflow runtime | Roster certification |
| 8 | **Jobs** | Dapr Jobs runtime | Dapr Jobs runtime | Scheduled tasks |

See [ADR-PROP-006: Dapr for Cross-Cutting Concerns](07-adr-proposed/ADR-PROP-006-dapr.md) and [CONT-06: Dapr Integration](01-container-apps/CONT-06-dapr-integration.md) for details.

### ❌ **Rejected Approaches**

| Approach | Decision | Rationale |
|----------|----------|-----------|
| **Microservices Decomposition** | Rejected | Container Apps solves scale (1000 instances), 6-month timeline vs 12-18 months |
| **Azure App Service** | Rejected | No Dapr support, no KEDA scaling, no multi-container environments |
| **Azure Durable Functions** | Superseded | Dapr Workflows provides consistent abstraction layer |
| **Azure Functions Timer Triggers** | Superseded | Dapr Jobs provides cloud-agnostic scheduled tasks |

---

## Documentation Structure (48 Documents)

### **Priority 0: Critical (Week 1-2)**

#### **1. Container Apps Architecture** (`01-container-apps/`)
- [CONT-01: Container Functions on Container Apps](01-container-apps/CONT-01-container-functions-architecture.md)
- [CONT-02: Container Apps Environment Design](01-container-apps/CONT-02-environment-design.md)
- [CONT-03: Metabase Analytics Integration](01-container-apps/CONT-03-metabase-integration.md)
- [CONT-06: Dapr Service Mesh](01-container-apps/CONT-06-dapr-integration.md)
- [CONT-07: KEDA Scaling and Performance](01-container-apps/CONT-07-keda-scaling.md)
- [CONT-08: Observability and Monitoring](01-container-apps/CONT-08-observability.md)
- [CONT-09: Networking and Security](01-container-apps/CONT-09-networking-security.md)
- [CONT-10: Cost Model and ROI](01-container-apps/CONT-10-cost-model.md)

#### **2. .NET Aspire Orchestration** (`02-aspire/`)
- [ASPIRE-01: AppHost Setup](02-aspire/ASPIRE-01-apphost-setup.md)
- [ASPIRE-02: Local Development Workflow](02-aspire/ASPIRE-02-local-development.md)
- [ASPIRE-03: Service Discovery](02-aspire/ASPIRE-03-service-discovery.md)
- [ASPIRE-04: Dapr Integration](02-aspire/ASPIRE-04-dapr-integration.md)
- [ASPIRE-05: Deployment with azd](02-aspire/ASPIRE-05-deployment-azd.md)
- [ASPIRE-06: Hybrid IaC](02-aspire/ASPIRE-06-hybrid-iac.md)
- [ASPIRE-07: Testing Strategies](02-aspire/ASPIRE-07-testing.md)

#### **3. Architecture Decision Records (Proposed)** (`07-adr-proposed/`)
- [ADR-PROP-001: Azure Container Functions on Container Apps](07-adr-proposed/ADR-PROP-001-container-functions.md) ⭐ **CRITICAL**
- [ADR-PROP-002: .NET Aspire Orchestration](07-adr-proposed/ADR-PROP-002-aspire.md)
- [ADR-PROP-006: Dapr for Microservices Patterns](07-adr-proposed/ADR-PROP-006-dapr.md)
- [ADR-PROP-007: Hybrid IaC (Aspire + Terraform)](07-adr-proposed/ADR-PROP-007-hybrid-iac.md)
- [ADR-PROP-008: No Microservices Decomposition](07-adr-proposed/ADR-PROP-008-no-microservices.md) ⭐ **CRITICAL**

> **Archived ADRs:** ADR-PROP-003 (DAB), ADR-PROP-004 (Trino), ADR-PROP-005 (CubeJS) superseded by [ADR-014: Metabase Analytics](../adr/ADR-014-metabase-analytics.md)

### **Priority 1: High (Week 3-5)**

#### **4. API Strategy** (`03-hybrid-api/`)
- [API-01: Container Functions Business Logic](03-hybrid-api/API-01-functions-logic.md)
- [API-02: Metabase Analytics APIs](03-hybrid-api/API-02-analytics-apis.md)
- [API-03: API Gateway Patterns](03-hybrid-api/API-03-api-gateway.md)
- [API-04: Caching Strategy](03-hybrid-api/API-04-caching-strategy.md)
- [API-05: Performance Testing](03-hybrid-api/API-05-performance-testing.md)

#### **5. Analytics Architecture** (`04-analytics/`)
- [ANALYTICS-01: Metabase Multi-Environment Strategy](04-analytics/ANALYTICS-01-metabase-deployment.md)
- [ANALYTICS-02: Metabase Models and Questions](04-analytics/ANALYTICS-02-metabase-models.md)
- [ANALYTICS-03: Dashboard Embedding](04-analytics/ANALYTICS-03-dashboard-embedding.md)
- [ANALYTICS-04: Query Performance Optimization](04-analytics/ANALYTICS-04-query-optimization.md)

> **Note:** Analytics simplified from Trino+CubeJS to Metabase-only per [ADR-014](../adr/ADR-014-metabase-analytics.md)

#### **6. Well-Architected Framework** (`05-well-architected/`)
- [WA-01: Reliability](05-well-architected/WA-01-reliability.md)
- [WA-02: Security](05-well-architected/WA-02-security.md)
- [WA-03: Cost Optimization](05-well-architected/WA-03-cost-optimization.md)
- [WA-04: Operational Excellence](05-well-architected/WA-04-operational-excellence.md)
- [WA-05: Performance Efficiency](05-well-architected/WA-05-performance-efficiency.md)

### **Priority 2: Medium (Week 6-8)**

#### **7. Cloud Adoption Framework** (`06-cloud-adoption/`)
- [CAF-01: Strategy](06-cloud-adoption/CAF-01-strategy.md)
- [CAF-02: Plan](06-cloud-adoption/CAF-02-plan.md)
- [CAF-03: Adopt](06-cloud-adoption/CAF-03-adopt.md)
- [CAF-04: Govern & Manage](06-cloud-adoption/CAF-04-govern-manage.md)

#### **8. C4 Diagrams (Proposed)** (`08-c4-diagrams/`)
- [C4-PROP-01: System Context](08-c4-diagrams/C4-PROP-01-system-context.md)
- [C4-PROP-02: Container Diagram](08-c4-diagrams/C4-PROP-02-container-diagram.md)
- [C4-PROP-03: Component Diagrams](08-c4-diagrams/C4-PROP-03-component-diagrams.md)
- [C4-PROP-04: Deployment Diagram](08-c4-diagrams/C4-PROP-04-deployment-diagram.md)

#### **9. Migration Guide** (`09-migration/`)
- [MIGRATE-01: Phase 1 - Containerize Functions](09-migration/MIGRATE-01-containerize-functions.md)
- [MIGRATE-02: Phase 2 - Aspire & Dapr](09-migration/MIGRATE-02-aspire-dapr.md)
- [MIGRATE-03: Phase 3 - Metabase Analytics](09-migration/MIGRATE-03-metabase-analytics.md)
- [MIGRATE-04: Phase 4 - Optimization & Multi-Region](09-migration/MIGRATE-04-optimization.md)

#### **10. Operations** (`10-operations/`)
- [OPS-01: Monitoring and Observability](10-operations/OPS-01-monitoring.md)
- [OPS-02: Incident Response and SRE](10-operations/OPS-02-incident-response.md)
- [OPS-03: Continuous Improvement](10-operations/OPS-03-continuous-improvement.md)

---

## Cost Analysis Summary

| Option | Monthly Cost | 3-Year TCO | Timeline | Notes |
|--------|--------------|------------|----------|-------|
| **Current (Functions Premium)** | $5,800 | $209K | N/A | No analytics, cold starts, ~30K user limit |
| **Proposed (Container Apps + Analytics)** | $6,955 | $250K | 6 months | +20%, 80K scale, analytics, no cold starts |
| **Multi-Region (HA)** | $9,785 | $352K | 7 months | 99.95% SLA |
| **Microservices on AKS** | $12,000 | $432K | 12-18 months | 2x cost, 2x complexity |

**ROI:** +$1,155/month (+20%) delivers 2.7x scale + analytics + modern dev experience

---

## Timeline (10 Weeks)

| Week | Deliverables | Documents |
|------|-------------|-----------|
| **1-2** | Foundation & Critical ADRs | 9 docs + executive brief |
| **3** | Hybrid API Strategy | 6 docs |
| **4** | Analytics Stack | 6 docs |
| **5** | Service Mesh & Dapr | 6 docs |
| **6** | Security & Deployment | 6 docs |
| **7** | Well-Architected Framework | 5 docs |
| **8** | Analytics Deep-Dive & CAF | 7 docs |
| **9** | Migration Guide & C4 Diagrams | 9 docs |
| **10** | Operations & Finalization | 3 docs + presentation |

---

## Success Metrics

### Performance Targets

| Metric | Current (Functions Premium) | Target (Container Apps) |
|--------|----------------------------|------------------------|
| **Max Concurrent Users** | ~30K (theoretical) | 80K (load tested) |
| **API Latency (p95)** | 3-5s | <2s (Functions) |
| **Cold Start** | 2-5s (common) | 0s (always warm) |
| **Cache Hit Rate** | 0% (no caching) | 65%+ (Redis + Metabase) |
| **Analytics Query Time** | N/A | <5s (Metabase with Azure SQL) |
| **Deployment Time** | 15 min | 5 min (azd deploy, blue-green) |

### Business Outcomes

1. ✅ **Enrollment Month Success** - Handle 80K concurrent users with <2s response time
2. ✅ **Analytics Enablement** - Deliver 10 pre-built dashboards
3. ✅ **Developer Productivity** - Reduce local setup from 2 hours → 5 minutes (Aspire F5)
4. ✅ **Operational Efficiency** - Reduce incident response time by 40%
5. ✅ **Cost Efficiency** - Stay within +20% cost increase

---

## Key Technologies

- **Azure Container Apps** - Fully managed Kubernetes-based platform
- **.NET 10** - LTS (Nov 11, 2025 release), 3 years support
- **Metabase** - Unified analytics platform (local container, Container Apps cluster, Metabase Cloud)
- **Dapr** - All 8 building blocks for cloud-agnostic patterns
- **.NET Aspire** - Cloud-native orchestration framework
- **Azure Developer CLI (azd)** - Infrastructure provisioning automation
- **KEDA** - Kubernetes Event-Driven Autoscaling

---

## References

- [Current State Architecture](../02-architecture/README.md) - Baseline documentation
- [ADR-014: Metabase Analytics](../adr/ADR-014-metabase-analytics.md) - Analytics platform decision
- [Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
- [.NET Aspire Documentation](https://learn.microsoft.com/en-us/dotnet/aspire/)
- [Metabase Documentation](https://www.metabase.com/docs/latest/)
- [Dapr Documentation](https://docs.dapr.io/)
- [Microsoft Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/)
- [Cloud Adoption Framework](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/)

---

## Contact

- **Technical Lead**: CFI Architecture Team (Marty Flournory, Sumith Mathur)
- **Product Owner**: SEAA Product Lead
- **Questions**: Create Jira ticket in [K12 Project](https://cfi-nc.atlassian.net/jira/software/c/projects/K12)

---

**Last Updated:** December 22, 2025
**Next Review:** Q1 2026
**Status:** 🚧 In progress - Analytics stack simplified to Metabase per ADR-014
