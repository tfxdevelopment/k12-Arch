# ADR-014: Metabase as Unified Analytics Platform

**Status:** Accepted
**Date:** 2025-12-22
**Deciders:** CFI Architecture Team
**Technical Story:** Simplify K12 analytics stack for faster delivery and reduced operational complexity
**Supersedes:** ADR-009, ADR-010, ADR-PROP-003, ADR-PROP-004, ADR-PROP-005

---

## Context and Problem Statement

The original proposed architecture included a complex multi-layer analytics stack:
- **Data API Builder (DAB)** - Zero-code REST/GraphQL APIs
- **Trino** - Data federation across Azure SQL and ADLS
- **CubeJS** - Semantic layer with pre-aggregations
- **Custom Angular Components** - QueryBuilder, DrillDown, Charts

This approach offered flexibility but introduced significant complexity:
- 4 separate systems to deploy, configure, and maintain
- Custom `IQueryEngine` abstraction layer required
- PostgreSQL database added specifically for CubeJS sync
- Multiple container images and scaling configurations
- Extended development timeline

## Decision Drivers

* **Time to Value** - Need analytics capabilities operational faster
* **Operational Simplicity** - Reduce number of systems to manage
* **Cost Efficiency** - Minimize Azure resource costs
* **Developer Experience** - Simplify local development setup
* **Maintainability** - Single vendor solution easier to support long-term
* **Feature Completeness** - Metabase provides out-of-box dashboarding

## Considered Options

1. **Original Stack** - DAB + Trino + CubeJS + Custom Angular (status quo from previous ADRs)
2. **Metabase Only** - Single analytics platform for all environments
3. **Power BI** - Microsoft native BI solution
4. **Cube + Metabase Hybrid** - Semantic layer + visualization

## Decision Outcome

**Chosen option: "Metabase Only"**, because it provides the best balance of functionality, simplicity, and time-to-value for K12 MyPortal's analytics requirements.

### Multi-Environment Deployment Strategy

| Environment | Solution | Infrastructure | Notes |
|-------------|----------|----------------|-------|
| **Local Dev** | Metabase Container | Docker via .NET Aspire | F5 to launch with all services |
| **Development** | Metabase Cluster | Azure Container Apps | Shared dev environment |
| **Production** | Metabase Cloud | Hosted service | SLA-backed, managed infrastructure |

### Architecture Overview

```
                         ┌─────────────────────────────────────┐
                         │           Metabase                   │
                         │  ┌─────────────────────────────────┐│
                         │  │  Local Dev: Container (Aspire)  ││
                         │  │  Dev: Container Apps cluster    ││
                         │  │  Prod: Metabase Cloud          ││
                         │  └─────────────────────────────────┘│
                         └──────────────────┬──────────────────┘
                                            │
                                            │ Direct SQL queries
                                            │
                         ┌──────────────────▼──────────────────┐
                         │        Azure SQL Database           │
                         │                                      │
                         │  Enrollment | Households | Awards    │
                         │  Schools | Providers | Comms         │
                         └─────────────────────────────────────┘
```

### Positive Consequences

* **70% fewer components** - 1 analytics system vs 4
* **Faster delivery** - 4-6 weeks saved in initial implementation
* **Simplified ops** - Single monitoring, alerting, and update path
* **No PostgreSQL needed** - Removed analytics database entirely
* **Built-in dashboards** - 20+ visualization types out of the box
* **Embedding ready** - iframe and API embedding for Angular admin portal
* **Metabase Cloud SLA** - Production-grade availability without self-hosting complexity

### Negative Consequences

* **No pre-aggregations** - Metabase lacks CubeJS-style materialization (mitigated by Azure SQL query optimization)
* **Direct database load** - All analytics queries hit Azure SQL (mitigated by Metabase caching)
* **Less customization** - Limited compared to custom Angular components (mitigated by Metabase's extensive options)
* **Vendor dependency** - Single vendor for analytics (mitigated by standard SQL; data portable)

---

## Technical Details

### Local Development (Aspire Integration)

```csharp
// K12.Aspire.AppHost/Program.cs
var metabase = builder.AddContainer("metabase", "metabase/metabase")
    .WithHttpEndpoint(port: 3000, targetPort: 3000, name: "metabase-http")
    .WithEnvironment("MB_DB_TYPE", "postgres")
    .WithEnvironment("MB_DB_DBNAME", "metabase")
    .WithEnvironment("MB_DB_PORT", "5432")
    .WithEnvironment("MB_DB_USER", "metabase")
    .WithEnvironment("MB_DB_PASS", "metabase")
    .WithEnvironment("MB_DB_HOST", postgres.Resource.Name)
    .WaitFor(postgres);

// Connect Metabase to K12 SQL Server
metabase.WithEnvironment("MB_SETUP_DATABASE_HOST", sqlServer.Resource.Name);
```

### Development Environment (Container Apps)

```bash
# Deploy Metabase to Container Apps
az containerapp create \
  --name k12-metabase \
  --resource-group k12-dev-rg \
  --environment k12-dev-env \
  --image metabase/metabase:latest \
  --target-port 3000 \
  --ingress external \
  --min-replicas 2 \
  --max-replicas 5 \
  --cpu 2.0 \
  --memory 4Gi \
  --env-vars \
    MB_DB_TYPE=postgres \
    MB_DB_HOST=k12-metabase-db.postgres.database.azure.com \
    MB_DB_PORT=5432 \
    MB_DB_DBNAME=metabase \
    MB_DB_USER=metabase_admin \
    MB_DB_PASS=secretref:metabase-db-password
```

### Production (Metabase Cloud)

- **Plan**: Metabase Cloud Pro
- **Users**: 25+ admin users
- **Features**: SSO (Azure AD), audit logs, advanced permissions
- **Connection**: Direct to Azure SQL via Private Link (if available) or IP allowlist

### Embedding in Angular Admin Portal

```typescript
// Angular component for embedded Metabase dashboard
@Component({
  selector: 'k12-analytics-dashboard',
  template: `
    <iframe
      [src]="dashboardUrl | safe"
      width="100%"
      height="800"
      frameborder="0"
      allowtransparency>
    </iframe>
  `
})
export class AnalyticsDashboardComponent {
  @Input() dashboardId: number = 1;

  get dashboardUrl(): string {
    const token = this.generateEmbedToken();
    return `${environment.metabaseUrl}/embed/dashboard/${token}`;
  }
}
```

---

## Cost Comparison

| Solution | Monthly Cost | 3-Year TCO | Components |
|----------|--------------|------------|------------|
| **Original Stack** | ~$2,045 | ~$73,620 | DAB ($120) + Trino ($1,080) + CubeJS ($480) + Redis ($245) + PostgreSQL ($120) |
| **Metabase Only** | ~$500-850 | ~$18,000-30,600 | Container Apps ($200-500) OR Metabase Cloud ($85/user) |

**Savings**: $43,000-55,000 over 3 years (60-75% reduction)

---

## Migration from Original Proposal

### What's Removed
- Azure PostgreSQL (analytics-only database)
- Data API Builder container
- Trino container + Hive Metastore
- CubeJS container
- Custom `IQueryEngine` abstraction
- Custom Angular analytics components

### What's Added
- Metabase container (local/dev) or Metabase Cloud (prod)
- Metabase embedding configuration
- Azure SQL query optimization for analytics workloads

### Knowledge Graph Updates
- Removed entities: Data API Builder, Trino, Cube.js, Azure PostgreSQL
- Updated entity: Metabase (multi-environment deployment strategy)
- New relationship: Metabase → Azure SQL Database (queries_directly)

---

## Validation

### Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard load time | < 5 seconds | Metabase query logs |
| Cache hit rate | > 60% | Metabase analytics |
| User adoption | 20+ active users | Metabase usage stats |
| Query performance | p95 < 10 seconds | Azure SQL metrics |

### Proof of Concept (Completed)

1. Metabase container running locally via Docker
2. Connected to Azure SQL development database
3. Created 3 sample dashboards (Enrollment, Awards, Schools)
4. Validated iframe embedding in Angular admin portal

---

## Related Decisions

* **Supersedes:**
  * [ADR-009: Analytics Query Engine Abstraction](/_archive/ADR-009-analytics-query-engine-abstraction.md)
  * [ADR-010: Embedded Analytics Components](/_archive/ADR-010-embedded-analytics-components.md)
  * [ADR-PROP-003: Data API Builder](/_archive/ADR-PROP-003-data-api-builder.md)
  * [ADR-PROP-004: Trino](/_archive/ADR-PROP-004-trino.md)
  * [ADR-PROP-005: CubeJS](/_archive/ADR-PROP-005-cubejs.md)

* **Related:**
  * [ADR-PROP-001: Container Functions on Container Apps](../09-proposed-architecture/07-adr-proposed/ADR-PROP-001-container-functions.md)
  * [ADR-PROP-002: .NET Aspire Orchestration](../09-proposed-architecture/07-adr-proposed/ADR-PROP-002-aspire.md)
  * [ADR-PROP-006: Dapr for Cross-Cutting Concerns](../09-proposed-architecture/07-adr-proposed/ADR-PROP-006-dapr.md)

---

## References

* [Metabase Documentation](https://www.metabase.com/docs/latest/)
* [Metabase Embedding](https://www.metabase.com/docs/latest/embedding/introduction)
* [Metabase Cloud](https://www.metabase.com/cloud/)
* [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/)
* [.NET Aspire Container Integration](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/add-docker-containers)

---

**Decision Made:** 2025-12-22
**Decision Owner:** CFI Architecture Team
**Review Date:** Q1 2026 (after initial deployment)
