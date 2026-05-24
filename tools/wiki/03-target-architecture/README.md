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
| **Compute** | Azure Container Functions on Container Apps | Business logic, no cold starts, 80K scale |
| **CRUD APIs** | Data API Builder (DAB) | Zero-code REST/GraphQL from database schema |
| **Analytics** | Trino + CubeJS | Data federation, semantic layer, pre-aggregations |
| **Caching** | Azure Cache for Redis | Distributed cache for all layers (65%+ hit rate target) |
| **Service Mesh** | Dapr (built into Container Apps) | mTLS, pub/sub, service invocation, state management |
| **Local Dev** | .NET Aspire | F5 to launch all containers, auto-generate Bicep |
| **IaC** | Aspire (compute) + Terraform (governance) | Hybrid approach for flexibility |
| **Runtime** | .NET 10 (LTS) | Latest long-term support, released Nov 11, 2025 |

### ❌ **Rejected Approach: Microservices Decomposition**

**Decision:** Keep Functions as containerized monolith, do NOT decompose into 10+ services
**Rationale:** Container Apps solves scale (1000 instances), avoids distributed transaction complexity, 6-month timeline vs 12-18 for microservices

---

## Documentation Structure (48 Documents)

### **Priority 0: Critical (Week 1-2)**

#### **1. Container Apps Architecture** (`01-container-apps/`)
- [CONT-01: Container Functions on Container Apps](01-container-apps/CONT-01-container-functions-architecture.md)
- [CONT-02: Container Apps Environment Design](01-container-apps/CONT-02-environment-design.md)
- [CONT-03: Data API Builder Integration](01-container-apps/CONT-03-data-api-builder.md)
- [CONT-04: Trino Analytics Engine](01-container-apps/CONT-04-trino-integration.md)
- [CONT-05: CubeJS Semantic Layer](01-container-apps/CONT-05-cubejs-integration.md)
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
- [ADR-PROP-003: Data API Builder for CRUD APIs](07-adr-proposed/ADR-PROP-003-data-api-builder.md) ⭐ **CRITICAL**
- [ADR-PROP-004: Trino for Data Federation](07-adr-proposed/ADR-PROP-004-trino.md)
- [ADR-PROP-005: CubeJS Semantic Layer](07-adr-proposed/ADR-PROP-005-cubejs.md)
- [ADR-PROP-006: Dapr for Microservices Patterns](07-adr-proposed/ADR-PROP-006-dapr.md)
- [ADR-PROP-007: Hybrid IaC (Aspire + Terraform)](07-adr-proposed/ADR-PROP-007-hybrid-iac.md)
- [ADR-PROP-008: No Microservices Decomposition](07-adr-proposed/ADR-PROP-008-no-microservices.md) ⭐ **CRITICAL**

### **Priority 1: High (Week 3-5)**

#### **4. Hybrid API Strategy** (`03-hybrid-api/`)
- [API-01: Data API Builder Implementation](03-hybrid-api/API-01-dab-implementation.md)
- [API-02: Container Functions Business Logic](03-hybrid-api/API-02-functions-business-logic.md)
- [API-03: Analytics APIs](03-hybrid-api/API-03-analytics-apis.md)
- [API-04: API Gateway Patterns](03-hybrid-api/API-04-api-gateway.md)
- [API-05: Caching Strategy](03-hybrid-api/API-05-caching-strategy.md)
- [API-06: Performance Testing](03-hybrid-api/API-06-performance-testing.md)

#### **5. Analytics Architecture** (`04-analytics/`)
- [ANALYTICS-01: Data Federation Strategy](04-analytics/ANALYTICS-01-data-federation.md)
- [ANALYTICS-02: Semantic Layer Design](04-analytics/ANALYTICS-02-semantic-layer.md)
- [ANALYTICS-03: Real-Time vs Batch](04-analytics/ANALYTICS-03-realtime-batch.md)
- [ANALYTICS-04: Data Lake Integration](04-analytics/ANALYTICS-04-data-lake.md)
- [ANALYTICS-05: Reporting and Dashboards](04-analytics/ANALYTICS-05-reporting.md)

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
- [MIGRATE-02: Phase 2 - Aspire & DAB](09-migration/MIGRATE-02-aspire-dab.md)
- [MIGRATE-03: Phase 3 - Dapr & Service Mesh](09-migration/MIGRATE-03-dapr-service-mesh.md)
- [MIGRATE-04: Phase 4 - Analytics Stack](09-migration/MIGRATE-04-analytics-stack.md)
- [MIGRATE-05: Phase 5 - Optimization & Multi-Region](09-migration/MIGRATE-05-optimization.md)

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
| **API Latency (p95)** | 3-5s | <2s (Functions), <50ms (DAB) |
| **Cold Start** | 2-5s (common) | 0s (always warm) |
| **Cache Hit Rate** | 0% (no caching) | 65%+ (Redis + CubeJS) |
| **Analytics Query Time** | N/A | <5s (CubeJS), <10s (Trino) |
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
- **Data API Builder** - Zero-code REST/GraphQL API generator (Microsoft open-source)
- **Trino** - Distributed SQL query engine for data federation
- **CubeJS** - Semantic layer and pre-aggregation engine
- **Dapr** - Service mesh built into Container Apps
- **.NET Aspire** - Cloud-native orchestration framework
- **Azure Developer CLI (azd)** - Infrastructure provisioning automation

---

## References

- [Current State Architecture](./../02-architecture/README.md) - Baseline documentation
- [Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
- [.NET Aspire Documentation](https://learn.microsoft.com/en-us/dotnet/aspire/)
- [Data API Builder](https://learn.microsoft.com/en-us/azure/data-api-builder/)
- [Microsoft Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/)
- [Cloud Adoption Framework](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/)

---

## Contact

- **Technical Lead**: CFI Architecture Team (Marty Flournory, Sumith Mathur)
- **Product Owner**: SEAA Product Lead
- **Questions**: Create Jira ticket in [K12 Project](https://cfi-nc.atlassian.net/jira/software/c/projects/K12)

---

**Last Updated:** November 24, 2025
**Next Review:** Week 2 completion
**Status:** 🚧 Week 1 in progress (0/48 documents complete)
