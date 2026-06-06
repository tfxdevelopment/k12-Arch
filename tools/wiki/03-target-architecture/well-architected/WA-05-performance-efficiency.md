# WA-05: Performance Efficiency Assessment - K12 MyPortal Cloud-Native Architecture

## Metadata
- **Status:** Draft
- **Date:** 2026-06-06
- **Framework:** Microsoft Azure Well-Architected Framework - Performance Efficiency Pillar
- **Compliance:** FedRAMP Moderate, NIST 800-53, FERPA, WCAG 2.1 AA
- **Related Documents:** CONT-07 (KEDA Scaling), CONT-03 (Data API Builder), CONT-04 (Trino), CONT-05 (CubeJS), API-05 (Caching), API-06 (Performance Testing), WA-01 (Reliability), WA-03 (Cost Optimization)

## Executive Summary

Performance Efficiency assessment for K12 MyPortal's proposed Azure Container Apps architecture, hosted in **Azure Government Cloud (FedRAMP Moderate)**. The central performance challenge for this workload is **~80,000 concurrent users during the peak enrollment month** for the ESA+ and Opportunity Scholarship programs — a demand profile that is highly seasonal, bursty within the day, and read-heavy.

The proposed architecture meets this challenge through **KEDA event-driven horizontal autoscaling** on Azure Container Apps (scale to 1,000 instances, always-warm, no cold starts), a **distributed Redis cache** (65%+ hit-rate target), an **Azure SQL Hyperscale** data tier with read scale-out replicas and connection pooling, a **Trino + CubeJS** analytics stack with pre-aggregations, and **Azure Front Door** CDN for static asset delivery. Performance is validated continuously with **Azure Load Testing** integrated into CI/CD against numerical SLOs.

This pillar is intentionally balanced against **WA-03 Cost Optimization**: the target operating cost is **+20% vs. the current Functions Premium platform** and **-43% vs. a microservices-on-AKS alternative**. We achieve performance through elasticity (pay for peak only when peak occurs) rather than static overprovisioning. Where performance and cost trade off, the trade-off is documented and cross-referenced.

## Well-Architected Framework: Performance Efficiency Pillar

Performance Efficiency is about **maintaining the user experience even when load increases**, by managing capacity efficiently — having *just enough* supply to handle demand at all times, without overprovisioning.

### Four Design Principles

1. **Negotiate realistic performance targets** — Define the intended user experience with business stakeholders; develop benchmarks and measure against pre-established requirements.
2. **Design to meet capacity requirements** — Provide enough supply to address anticipated demand through right-sizing, dynamic scaling, and capacity planning.
3. **Achieve and sustain performance** — Protect against performance degradation while the system is in use and as it evolves, using continuous testing and monitoring.
4. **Improve efficiency through optimization** — Continuously improve system efficiency within the defined targets to increase workload value.

### Design Review Checklist Mapping (PE:01-PE:08)

| Code | Recommendation | K12 Application |
|------|----------------|-----------------|
| **PE:01** | Define performance targets | Numerical SLOs per flow (see Success Metrics) |
| **PE:02** | Conduct capacity planning | Enrollment-month demand model, predictive forecast |
| **PE:03** | Select the right services | Container Apps, SQL Hyperscale, Redis, Front Door |
| **PE:04** | Establish consistent performance measurement | App Insights + Azure Monitor baselines |
| **PE:05** | Optimize scaling and partitioning | KEDA scale rules, SQL read scale-out, Redis sharding |
| **PE:06** | Test performance regularly in production-like env | Azure Load Testing in CI/CD |
| **PE:07** | Optimize code and infrastructure | .NET 10 async, Dapr offload, DAB zero-code CRUD |
| **PE:08** | Optimize data usage | Indexes, query patterns, CubeJS pre-aggregations |

## Current State Performance Posture

### Existing Architecture (Functions Premium)
The current platform runs on Azure Functions Premium (EP-series) plan.

| Metric | Current State |
|--------|---------------|
| **Max concurrent users** | ~30,000 (theoretical, untested at scale) |
| **Cold starts** | 2-5s common on scale-out events |
| **API latency (p95)** | 3-5s under load |
| **Caching** | None (0% hit rate) — every request hits SQL |
| **Analytics** | None (no reporting/dashboard tier) |
| **Performance testing** | Ad-hoc, manual, no CI/CD gate |
| **Data tier** | Single Azure SQL General Purpose database, no read replicas |

### Performance Gaps
1. ❌ **No proven 80K headroom** — current ceiling (~30K) is below peak enrollment demand.
2. ❌ **Cold starts** — Functions Premium scale-out introduces 2-5s latency spikes during the exact bursts that matter most.
3. ❌ **No caching layer** — reference data (school lists, award rules, lookups) re-queried on every request.
4. ❌ **Single-replica data tier** — read and write workloads contend on one node.
5. ❌ **No continuous performance validation** — regressions discovered in production, not in CI.

## Proposed Architecture Performance Enhancements

### 1. Scalability Strategy for 80,000 Concurrent Users

The peak enrollment month is the design point. Demand is **seasonal** (one month dominates the year), **diurnal** (intra-day peaks at family/evening hours), and **read-heavy** (browsing eligibility, school data, and application status far exceeds writes).

The strategy is **horizontal scale with elasticity**: scale out the stateless compute tier on demand, offload reads to cache and replicas, and accelerate static delivery at the edge — rather than statically provisioning for peak year-round.

```
                       Internet (HTTPS, 80K concurrent)
                                  │
                    ┌─────────────▼─────────────┐
                    │ Azure Front Door (CDN/WAF)  │  Static assets cached at edge
                    └─────────────┬─────────────┘  (Angular SPA, images, CSS/JS)
                                  │
                    ┌─────────────▼─────────────┐
                    │   APIM (rate limit, JWT)   │
                    └─────────────┬─────────────┘
                                  │
            ┌─────────────────────▼─────────────────────┐
            │   Container Apps Environment (KEDA)         │
            │   ┌──────────────┐  ┌──────────────────┐   │
            │   │ Functions     │  │ Data API Builder │   │  Scale 5 → 1000
            │   │ (.NET 10)     │  │ (CRUD REST/GQL)  │   │  no cold start
            │   └──────┬───────┘  └────────┬─────────┘   │
            │   ┌──────▼───────┐  ┌─────────▼────────┐    │
            │   │ Trino        │  │ CubeJS           │    │
            │   └──────────────┘  └──────────────────┘    │
            └───────┬───────────────────┬────────────────┘
                    │                   │
         ┌──────────▼─────┐   ┌─────────▼──────────────┐
         │ Azure Cache    │   │ Azure SQL Hyperscale    │
         │ for Redis      │   │ Primary + read replicas │
         │ (65%+ hit)     │   │ (read scale-out)        │
         └────────────────┘   └─────────────────────────┘
```

### 2. KEDA Event-Driven Autoscaling on Container Apps

Azure Container Apps uses **KEDA (Kubernetes Event-driven Autoscaling)** to manage horizontal scaling declaratively. Azure Functions on Container Apps **automatically configure KEDA scale rules** from trigger configuration, and can scale out to **1,000 instances per app** (default max is 10). Idle apps can scale to zero; for the enrollment-critical path we hold a **warm floor** (`minReplicas > 0`) so there are **no cold starts** during bursts.

```yaml
# Container App scale configuration (HTTP-driven, enrollment path)
properties:
  template:
    scale:
      minReplicas: 5          # Always-warm floor: zero cold start
      maxReplicas: 1000       # Headroom for 80K concurrent peak
      rules:
        - name: http-concurrency
          http:
            metadata:
              concurrentRequests: "50"   # New replica per 50 in-flight requests
        - name: cpu-scale
          custom:
            type: cpu
            metadata:
              type: Utilization
              value: "70"               # Scale on 70% CPU
        - name: servicebus-queue        # Async work (PandaDoc, SendGrid, ClassWallet)
          custom:
            type: azure-servicebus
            metadata:
              queueName: enrollment-jobs
              messageCount: "20"
```

**Why no cold start matters:** the current Functions Premium cold-start penalty (2-5s) occurs precisely on scale-out, which is constant during enrollment bursts. With a warm floor on Container Apps, the platform creates new replicas on demand from already-pulled images, removing the latency cliff. See **CONT-07 (KEDA Scaling)** for the full per-app rule set.

**Scale-unit design (PE:05):** each replica is a self-contained, stateless scale unit (no in-process session state — session lives in Redis). This keeps scaling linear and controlled. The default KEDA polling interval is 30s and the cool-down (scale-in to zero) is 300s, so scale-in lag never starves an in-flight burst.

**Trade-off (→ WA-03):** the warm floor (`minReplicas: 5`) and 1,000-instance ceiling cost more than scale-to-zero. We accept the floor only on enrollment-critical apps; non-critical/back-office apps retain scale-to-zero. This is the deliberate performance↔cost balance documented in WA-03.

### 3. Caching Strategy — Azure Cache for Redis (65%+ Hit Rate Target)

Redis is the distributed cache for all layers (cache-aside, session store, content cache, and CubeJS pre-aggregation store). Target: **≥65% hit rate**, removing roughly two-thirds of read pressure from Azure SQL during peak.

**Tier selection (PE:03):** Premium or Enterprise tier for production — faster hardware, higher network bandwidth, more client connections, and clustering for additional bandwidth. The Basic/Standard/Premium tiers run open-source Redis (single-threaded command processing), so **scaling out (clustering) usually boosts throughput more than scaling up**. For K12's connection-heavy peak we provision **Premium with clustering**.

```csharp
// Cache-aside via IDistributedCache (StackExchange.Redis)
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration["redis-connection"]; // from Key Vault
    options.InstanceName = "k12:";
});

public async Task<SchoolList> GetSchoolsAsync(string county)
{
    var key = $"schools:county:{county}";          // structured keyspace
    var cached = await _cache.GetStringAsync(key);
    if (cached is not null) return Deserialize(cached);

    var schools = await _dab.QuerySchoolsAsync(county);    // miss → DAB/SQL
    await _cache.SetStringAsync(key, Serialize(schools),
        new() { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30) });
    return schools;
}
```

**What we cache (high read, low volatility — ideal cache-aside candidates):**

| Data | TTL | Rationale |
|------|-----|-----------|
| School / provider directories | 30 min | Near-static, high contention at peak |
| Award rules & eligibility lookups | 60 min | Reference data, rarely changes intra-day |
| Application status snapshots | 60 s | Read-heavy, short TTL for freshness |
| Session state (ASP.NET Core) | sliding 20 min | Enables stateless replicas (scale-unit design) |
| CubeJS pre-aggregations | per cube | Dashboard acceleration (see §5) |

**Production best practices applied:** single long-lived `ConnectionMultiplexer`, `AbortConnect=false`, smaller values across more keys (avoid >100 KB values), avoid O(n) commands like `KEYS`, tuned ThreadPool, and co-locate Redis and compute in the same Azure Government region for lowest latency.

### 4. Data Tier Performance — Azure SQL Hyperscale

**Service selection (PE:03):** migrate the data tier to **Azure SQL Hyperscale**. Hyperscale decouples compute from storage, enabling **rapid compute scale-up/down without data movement** (single-digit minutes) and **read scale-out** via replicas — directly addressing the read-heavy enrollment profile.

| Capability | Hyperscale Benefit for K12 |
|------------|----------------------------|
| **Rapid scale up/down** | Scale compute for enrollment month, scale back after (constant-time, no data-size dependency) |
| **Read scale-out** | 0-4 HA secondary replicas + up to 30 named replicas for read offload |
| **Higher log throughput** | Faster commits regardless of data volume (write bursts during application submission) |
| **Serverless option** | Auto scale compute to demand for bursty/off-peak windows (cost lever → WA-03) |

**Read scale-out routing:** read-only flows (status checks, directory browsing, analytics feeds) route to secondary replicas by setting `ApplicationIntent=ReadOnly` in the connection string. This isolates read workload from the read-write primary, so write performance (application submission) is unaffected during peak browsing.

```
Server=tcp:k12-sql.privatelink.database.usgovcloudapi.net;
Database=k12prod;ApplicationIntent=ReadOnly;       -- → secondary replica
Authentication=Active Directory Managed Identity;
Max Pool Size=200;Min Pool Size=10;Connection Lifetime=300;
```

**Connection pooling (PE:07):** each Container App replica maintains its own ADO.NET pool (`Min Pool Size=10`, `Max Pool Size=200`). With up to 1,000 replicas, pool caps are sized against Hyperscale's max connection budget; reads are dispersed across replicas so no single node saturates its connection limit. Managed Identity authentication avoids secret handling on the hot path.

**Data API Builder query patterns (PE:08):** DAB generates parameterized REST/GraphQL directly from the schema. We enforce:
- GraphQL **query depth limiting** and pagination (no unbounded result sets).
- **Indexed** filter/sort columns for every exposed entity; covering indexes for hot status queries.
- **Cursor/`first` pagination** on list entities to cap page size.
- Per-user **rate limiting** (≈1000 req/min) to bound N+1 amplification.

**Trade-off (→ WA-01 / WA-03):** read replicas add cost and a small read-staleness window. Acceptable for browse/status flows; submission and payment flows always read-write the primary.

### 5. Analytics Performance — Trino Federation + CubeJS Pre-Aggregations

Analytics is a **new capability** (absent in current state) and must not compete with the transactional path for resources.

- **Trino** provides distributed SQL **federation** across Azure SQL, ADLS Gen2, and other sources without ETL into a single store. Heavy federated scans run on the Trino tier (its own Container App scale group), isolated from enrollment compute.
- **CubeJS** is the **semantic layer** with **pre-aggregations**: dashboards query summarized, materialized rollups (stored in Redis) instead of scanning raw tables. This is the lever that takes dashboard queries from multi-second federated scans to sub-5s responses.

| Analytics flow | Path | Target |
|----------------|------|--------|
| Pre-aggregated dashboard tile | CubeJS → Redis pre-agg | < 5 s (p95) |
| Ad-hoc federated query | Trino → SQL/ADLS | < 10 s (p95) |
| Scheduled report refresh | Trino batch → ADLS | Off-peak window |

Analytics queries are **routed to SQL read replicas** (never the primary), so reporting load never degrades enrollment write performance.

### 6. CDN / Front Door for Static Assets

**Azure Front Door** is the global edge tier (118+ edge locations) serving the Angular SPA bundles and static media, with **anycast + split-TCP acceleration** and **SSL offload** at the edge.

```bicep
// Front Door route: cache static assets, bypass dynamic API
resource staticRoute 'Microsoft.Cdn/profiles/afdEndpoints/routes@2023-05-01' = {
  name: 'static-assets'
  properties: {
    patternsToMatch: ['/assets/*', '/*.js', '/*.css', '/*.woff2']
    cacheConfiguration: {
      queryStringCachingBehavior: 'IgnoreQueryString'  // max edge reuse for static
      compressionSettings: { isCompressionEnabled: true }
    }
  }
}
```

**Performance Efficiency best practices (per Front Door WAF service guide):**
- **Enable caching** for static content; `IgnoreQueryString` for purely static assets to maximize edge reuse — offloads bandwidth and origin load.
- **Enable compression** for downloadable/text content — smaller payloads, faster delivery.
- **Separate routes** for static vs. dynamic — dynamic/authenticated API responses are **never cached** (privacy/FERPA: avoid caching user-specific PII at the edge).
- Health probes use `HEAD` not `GET` (status-only, no body fetch).

Only `GET` requests are cacheable; all mutating API traffic is proxied to origin. This keeps PII off the CDN while still removing the static-asset load (often 60-80% of HTTP requests during browse-heavy enrollment) from the compute tier.

### 7. Capacity Planning & Right-Sizing (PE:02)

Capacity planning is done **before** the predicted seasonal spike (enrollment month). We build a **performance model** from historical telemetry and forecast demand using predictive modeling.

| Resource | Off-Peak Baseline | Peak Enrollment Target |
|----------|-------------------|------------------------|
| Container Apps (Functions) replicas | 5 (warm floor) | up to 1,000 (KEDA-driven) |
| DAB replicas | 3 | up to 300 |
| Redis | Premium P2 | Premium P3+ clustered (pre-scaled) |
| SQL Hyperscale compute | scaled-down primary | scaled-up primary + 2-4 read replicas |
| Front Door | always-on | always-on (edge absorbs static burst) |

**Right-sizing principle:** scale *up* the data tier and Redis on a planned schedule ahead of the enrollment window (they don't auto-scale per-request as cleanly as compute); let KEDA *scale out* the stateless compute tier reactively. After enrollment month, scale data/cache back down — the dominant cost lever, cross-referenced to WA-03. A **proof-of-concept load test** validates the model before each enrollment season.

### 8. Performance Testing / Load Testing Plan (PE:06)

**Azure Load Testing** generates high-scale load (Apache JMeter or Locust scripts) against the application, collects client- and server-side metrics, and integrates into CI/CD with **fail criteria** and **auto-stop**. See **API-06 (Performance Testing)**.

```yaml
# Azure Load Testing - peak enrollment simulation
testPlan: enrollment-peak.jmx
loadPattern: step                  # ramp to peak in stages
engineInstances: 40                # 40 engines
usersPerEngine: 2000               # 40 * 2000 = 80,000 virtual users
rampUpTime: 15m
duration: 60m
failureCriteria:
  - avg(response_time_ms) > 2000   # latency budget
  - percentage(error) > 1          # < 1% errors
  - percentile(response_time_ms, 95) > 2000
autoStop:
  errorPercentage: 90
  timeWindow: 60
```

**Test campaign:**

| Test | Profile | Pass Criteria |
|------|---------|---------------|
| **Smoke** | 100 users, every PR | p95 < 2s, 0 errors |
| **Load (baseline)** | 30K users, nightly | p95 < 2s, errors < 1% |
| **Peak (enrollment sim)** | 80K users, pre-season | p95 < 2s, errors < 1%, KEDA scales cleanly |
| **Spike** | 0 → 80K in 5 min | No cold-start cliff, recovers < 60s |
| **Soak** | 40K for 8h | No memory leak / replica churn |

Load tests run against a **production-like environment** in Azure Government, with results compared run-over-run to detect regressions before release (a CI/CD quality gate, not a one-time exercise).

### 9. Performance Baselines, SLOs & Continuous Monitoring (PE:04)

**Application Insights + Azure Monitor** establish baselines and continuously measure behavior over time so degradation, inefficiency, and scaling gaps are detected early.

**Continuously monitored signals:**
- API latency distribution (p50/p95/p99) per flow
- Redis hit rate, server load, connected clients, evictions
- SQL vCore, read-replica lag, connection pool saturation, query duration
- KEDA replica count vs. concurrency (scaling responsiveness)
- Front Door cache hit ratio, origin offload %
- End-to-end enrollment submission time

**Alerting examples:**

```kql
// Cache hit rate dropped below target (cache effectiveness regression)
AppMetrics
| where Name == "redis_cache_hit_ratio"
| summarize HitRate = avg(Value) by bin(TimeGenerated, 5m)
| where HitRate < 0.65            // SLO breach
```

```kql
// p95 API latency over budget under load
requests
| summarize p95 = percentile(duration, 95) by bin(timestamp, 5m)
| where p95 > 2000                // 2s budget
```

## Recommendations

### Phase 1 (Month 1-3): Foundation
1. ✅ Deploy Container Apps with KEDA HTTP + CPU scale rules; set warm floor (`minReplicas`) on enrollment-critical apps — eliminate cold starts.
2. ✅ Stand up Azure Cache for Redis (Premium, clustered); implement cache-aside for directories, lookups, and session state.
3. ✅ Establish App Insights baselines and the SLO dashboard.
4. ✅ Integrate Azure Load Testing smoke test into CI/CD.

### Phase 2 (Month 4-6): Scale & Data
1. Migrate data tier to Azure SQL Hyperscale; add read scale-out replicas; route read flows with `ApplicationIntent=ReadOnly`.
2. Tune connection pools and indexes; enforce DAB pagination/depth limits.
3. Deploy Trino + CubeJS with pre-aggregations on a dedicated scale group.
4. Add Front Door static-asset caching + compression.
5. Run full **80K peak** and **spike** load tests; tune scale rules from results.

### Phase 3 (Year 2): Sustain & Optimize
1. Pre-season capacity planning runbook (scale-up data/Redis, validate via PoC load test).
2. Continuous optimization cycle (monitor → optimize → test → deploy); adopt new .NET/platform performance features.
3. Evaluate Hyperscale serverless for off-peak compute cost (→ WA-03).
4. Re-baseline SLOs against real production data each season (Principle 4).

## Success Metrics

### Performance KPIs / SLOs

| Metric | Current | Target (SLO) | Measured By |
|--------|---------|--------------|-------------|
| **Max concurrent users** | ~30K (untested) | **80K (load-tested)** | Azure Load Testing |
| **API latency — Functions (p95)** | 3-5s | **< 2s** | App Insights |
| **API latency — DAB (p95)** | N/A | **< 50ms** | App Insights |
| **Cold start** | 2-5s | **0s (always warm)** | App Insights |
| **Redis cache hit rate** | 0% | **≥ 65%** | Azure Monitor |
| **Analytics — CubeJS dashboard (p95)** | N/A | **< 5s** | CubeJS metrics |
| **Analytics — Trino ad-hoc (p95)** | N/A | **< 10s** | Trino metrics |
| **Error rate at peak** | unknown | **< 1%** | Azure Load Testing |
| **Front Door cache hit / origin offload** | N/A | **≥ 60%** static | Front Door metrics |
| **SQL read-replica lag** | N/A | **< 5s** | Azure Monitor |
| **Scale-out recovery (spike)** | N/A | **< 60s to steady state** | KEDA / App Insights |

### Business Outcomes
1. ✅ **Enrollment-month success** — 80K concurrent users served at < 2s p95, < 1% errors.
2. ✅ **Analytics enabled** — sub-5s dashboards without impacting transactional performance.
3. ✅ **No cold-start cliff** — eliminate the 2-5s scale-out latency penalty.
4. ✅ **Cost-balanced performance** — stay within +20% vs. current, far under microservices-on-AKS (-43%).

## Cross-Reference Note

This document is part of the K12 Well-Architected Framework assessment series. Performance trade-offs are interdependent with the other pillars:

- **[WA-01: Reliability](./WA-01-reliability.md)** — read replicas, scale floors, and health probes serve both availability and performance; staleness/failover trade-offs noted here.
- **[WA-02: Security](./WA-02-security.md)** — Front Door never caches PII; APIM rate limiting bounds both abuse and N+1 load.
- **[WA-03: Cost Optimization](./WA-03-cost-optimization.md)** — elasticity vs. static provisioning; warm floors, read replicas, and pre-season scale-up are the primary performance↔cost trade-offs (+20% vs. current, -43% vs. AKS microservices).
- **[WA-04: Operational Excellence](./WA-04-operational-excellence.md)** — load testing in CI/CD and continuous performance monitoring are shared practices.
- **[WA-05: Performance Efficiency](./WA-05-performance-efficiency.md)** — this document.

For the broader adoption context, see the **Cloud Adoption Framework** docs in the sibling `cloud-adoption/` folder: **CAF-01 (Strategy)**, **CAF-02 (Plan)**, **CAF-03 (Adopt)**, and **CAF-04 (Govern & Manage)** — capacity planning and right-sizing feed CAF governance and cost management.

## References

### Microsoft Documentation
- [Well-Architected Framework: Performance Efficiency](https://learn.microsoft.com/azure/well-architected/performance-efficiency/)
- [Performance Efficiency design principles](https://learn.microsoft.com/azure/well-architected/performance-efficiency/principles)
- [Design review checklist for Performance Efficiency](https://learn.microsoft.com/azure/well-architected/performance-efficiency/checklist)
- [Architecture strategies for optimizing scaling and partitioning](https://learn.microsoft.com/azure/well-architected/performance-efficiency/scale-partition)
- [Architecture strategies for performance testing](https://learn.microsoft.com/azure/well-architected/performance-efficiency/performance-test)
- [Azure Functions on Azure Container Apps overview (scaling and performance)](https://learn.microsoft.com/azure/container-apps/functions-overview)
- [Set scaling rules in Azure Container Apps (KEDA)](https://learn.microsoft.com/azure/container-apps/scale-app)
- [What is Azure Cache for Redis?](https://learn.microsoft.com/azure/azure-cache-for-redis/cache-overview)
- [Azure Cache for Redis performance testing & best practices](https://learn.microsoft.com/azure/azure-cache-for-redis/cache-best-practices-performance)
- [Caching guidance (Azure Architecture Center)](https://learn.microsoft.com/azure/architecture/best-practices/caching)
- [Azure SQL Database Hyperscale service tier](https://learn.microsoft.com/azure/azure-sql/database/service-tier-hyperscale)
- [Use read-only replicas to offload read-only query workloads](https://learn.microsoft.com/azure/azure-sql/database/read-scale-out)
- [What is Azure Load Testing?](https://learn.microsoft.com/azure/app-testing/load-testing/overview-what-is-azure-load-testing)
- [Architecture best practices for Azure Front Door (Performance Efficiency)](https://learn.microsoft.com/azure/well-architected/service-guides/azure-front-door)
- [Caching with Azure Front Door](https://learn.microsoft.com/azure/frontdoor/front-door-caching)

### Related K12 Documents
- [CONT-07: KEDA Scaling and Performance](./../01-container-apps/CONT-07-keda-scaling.md)
- [CONT-03: Data API Builder Integration](./../01-container-apps/CONT-03-data-api-builder.md)
- [CONT-04: Trino Analytics Engine](./../01-container-apps/CONT-04-trino-integration.md)
- [CONT-05: CubeJS Semantic Layer](./../01-container-apps/CONT-05-cubejs-integration.md)
- [API-05: Caching Strategy](./../03-hybrid-api/API-05-caching-strategy.md)
- [API-06: Performance Testing](./../03-hybrid-api/API-06-performance-testing.md)
- [WA-01: Reliability](./WA-01-reliability.md)
- [WA-03: Cost Optimization](./WA-03-cost-optimization.md)

---

**Document Status:** ✅ Complete
**Last Updated:** 2026-06-06
**Next Review:** After first 80K peak load test
**Owner:** CFI Architecture Team
