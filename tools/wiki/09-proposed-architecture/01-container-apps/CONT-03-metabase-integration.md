# CONT-03: Metabase Analytics Integration

**Status:** Active
**Date:** 2025-12-22
**Related ADR:** [ADR-014: Metabase as Unified Analytics Platform](./../../adr/ADR-014-metabase-analytics.md)

---

## Overview

K12 MyPortal uses **Metabase** as the unified analytics platform across all environments. This document describes the integration patterns for Container Apps deployment.

## Multi-Environment Strategy

| Environment | Deployment | Infrastructure | Connection |
|-------------|------------|----------------|------------|
| **Local Dev** | Metabase container | Docker via .NET Aspire | Local SQL Server |
| **Development** | Metabase cluster | Azure Container Apps | Azure SQL Dev |
| **Production** | Metabase Cloud | Hosted service | Azure SQL Prod (Private Link) |

---

## Container Apps Deployment (Development)

### Container Configuration

```yaml
# metabase-container-app.yaml
apiVersion: apps/v1
kind: ContainerApp
metadata:
  name: k12-metabase
  namespace: k12-dev
spec:
  template:
    containers:
    - name: metabase
      image: metabase/metabase:v0.50.x
      resources:
        cpu: 2.0
        memory: 4Gi
      env:
      - name: MB_DB_TYPE
        value: postgres
      - name: MB_DB_HOST
        secretRef: metabase-db-host
      - name: MB_DB_PORT
        value: "5432"
      - name: MB_DB_DBNAME
        value: metabase
      - name: MB_DB_USER
        secretRef: metabase-db-user
      - name: MB_DB_PASS
        secretRef: metabase-db-password
      - name: MB_JETTY_PORT
        value: "3000"
      - name: MB_SITE_URL
        value: https://analytics-dev.k12portal.nc.gov
      ports:
      - containerPort: 3000
    scale:
      minReplicas: 2
      maxReplicas: 5
      rules:
      - name: http-scaling
        http:
          metadata:
            concurrentRequests: "100"
```

### Azure CLI Deployment

```bash
# Create Metabase Container App
az containerapp create \
  --name k12-metabase \
  --resource-group k12-dev-rg \
  --environment k12-dev-env \
  --image metabase/metabase:v0.50.x \
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
    "MB_DB_PASS=secretref:metabase-db-password" \
    MB_JETTY_PORT=3000
```

---

## .NET Aspire Integration (Local Development)

### AppHost Configuration

```csharp
// K12.Aspire.AppHost/Program.cs
var builder = DistributedApplication.CreateBuilder(args);

// Metabase metadata store (required for local persistence)
var metabaseDb = builder.AddPostgres("metabase-postgres")
    .WithDataVolume("metabase-data")
    .AddDatabase("metabase");

// K12 SQL Server (data source)
var sqlServer = builder.AddSqlServer("k12-sql")
    .WithDataVolume("k12-data")
    .AddDatabase("K12");

// Metabase container
var metabase = builder.AddContainer("metabase", "metabase/metabase")
    .WithHttpEndpoint(port: 3000, targetPort: 3000, name: "metabase-http")
    .WithEnvironment("MB_DB_TYPE", "postgres")
    .WithEnvironment("MB_DB_DBNAME", "metabase")
    .WithEnvironment("MB_DB_PORT", "5432")
    .WithEnvironment("MB_DB_USER", "postgres")
    .WithEnvironment("MB_DB_PASS", metabaseDb.Resource.PasswordParameter.Value)
    .WithEnvironment("MB_DB_HOST", metabaseDb.Resource.Name)
    .WithEnvironment("MB_JETTY_PORT", "3000")
    .WaitFor(metabaseDb)
    .WaitFor(sqlServer);

builder.Build().Run();
```

### Local Development Workflow

1. **F5 to Launch**: All containers start via Aspire AppHost
2. **Access Metabase**: Navigate to `http://localhost:3000`
3. **Initial Setup**:
   - Add SQL Server connection (host: `k12-sql`, port: `1433`)
   - Create K12 database connection using SA credentials
4. **Dashboard Development**: Build dashboards locally, export as JSON
5. **Sync to Dev**: Import dashboard configurations to Container Apps environment

---

## Azure SQL Database Connection

### Connection Configuration

```json
{
  "database-type": "sqlserver",
  "host": "k12-dev-sql.database.windows.net",
  "port": 1433,
  "dbname": "K12",
  "user": "metabase-reader",
  "password": "<from-key-vault>",
  "ssl": true,
  "additional-options": "encrypt=true;trustServerCertificate=false"
}
```

### Read-Only User Setup

```sql
-- Create Metabase read-only user
CREATE USER [metabase-reader] WITH PASSWORD = '<secure-password>';

-- Grant schema-specific read access
GRANT SELECT ON SCHEMA::dbo TO [metabase-reader];
GRANT SELECT ON SCHEMA::Enrollment TO [metabase-reader];
GRANT SELECT ON SCHEMA::Households TO [metabase-reader];
GRANT SELECT ON SCHEMA::Awards TO [metabase-reader];
GRANT SELECT ON SCHEMA::Comms TO [metabase-reader];
GRANT SELECT ON SCHEMA::Schools TO [metabase-reader];

-- Deny write operations
DENY INSERT, UPDATE, DELETE ON SCHEMA::dbo TO [metabase-reader];
```

---

## Embedding in Angular Admin Portal

### Signed Embedding (Recommended)

```typescript
// analytics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly metabaseApiUrl = environment.metabaseApiUrl;

  constructor(private http: HttpClient) {}

  getEmbedUrl(dashboardId: number, params: Record<string, any>): Observable<string> {
    return this.http.post<string>(`${this.metabaseApiUrl}/embed/dashboard`, {
      dashboardId,
      params,
      expiration: 600 // 10 minutes
    });
  }
}

// analytics-dashboard.component.ts
@Component({
  selector: 'k12-analytics-dashboard',
  template: `
    <div class="dashboard-container">
      <iframe
        *ngIf="embedUrl$ | async as url"
        [src]="url | safe"
        width="100%"
        height="800"
        frameborder="0"
        allowtransparency>
      </iframe>
    </div>
  `,
  styles: [`
    .dashboard-container {
      width: 100%;
      min-height: 800px;
      background: var(--surface-ground);
    }
  `]
})
export class AnalyticsDashboardComponent implements OnInit {
  @Input() dashboardId = 1;
  @Input() filters: Record<string, any> = {};

  embedUrl$: Observable<string>;

  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
    this.embedUrl$ = this.analytics.getEmbedUrl(this.dashboardId, this.filters);
  }
}
```

### Backend Embed Token Generation

```csharp
// MetabaseEmbedService.cs
public class MetabaseEmbedService
{
    private readonly string _secretKey;
    private readonly string _siteUrl;

    public string GenerateEmbedUrl(int dashboardId, Dictionary<string, object> params)
    {
        var payload = new
        {
            resource = new { dashboard = dashboardId },
            @params = params,
            exp = DateTimeOffset.UtcNow.AddMinutes(10).ToUnixTimeSeconds()
        };

        var token = Jose.JWT.Encode(payload, Encoding.UTF8.GetBytes(_secretKey), Jose.JwsAlgorithm.HS256);
        return $"{_siteUrl}/embed/dashboard/{token}";
    }
}
```

---

## Pre-Built Dashboards

### K12 Analytics Dashboards

| Dashboard | Purpose | Refresh Rate |
|-----------|---------|--------------|
| **Enrollment Overview** | Total enrollments, status breakdown, trends | 15 min |
| **School Performance** | Per-school metrics, rankings | 1 hour |
| **Award Distribution** | Awards by program, provider, region | 15 min |
| **Provider Analytics** | Provider activity, compliance rates | 1 hour |
| **Financial Summary** | Budget allocation, spend tracking | 1 hour |
| **Household Demographics** | Geographic distribution, income bands | Daily |

### Dashboard Configuration Export

```bash
# Export dashboard to JSON for version control
curl -X GET "https://analytics.k12portal.nc.gov/api/dashboard/1" \
  -H "X-Metabase-Session: <session-id>" \
  -o dashboards/enrollment-overview.json

# Import dashboard to new environment
curl -X POST "https://analytics-dev.k12portal.nc.gov/api/dashboard" \
  -H "X-Metabase-Session: <session-id>" \
  -H "Content-Type: application/json" \
  -d @dashboards/enrollment-overview.json
```

---

## Caching Strategy

### Metabase Query Cache

```yaml
# Container App environment variables
MB_QP_CACHE_STRATEGY: adaptive  # adaptive, ttl, or off
MB_QP_CACHE_TTL: 86400          # 24 hours for low-volatility data
```

### Azure SQL Query Optimization

```sql
-- Create indexes for common Metabase queries
CREATE NONCLUSTERED INDEX IX_Enrollment_Status_Date
ON Enrollment.Enrollments (StatusId, CreatedDate)
INCLUDE (StudentId, SchoolId, ProgramId);

CREATE NONCLUSTERED INDEX IX_Awards_Program_Date
ON Awards.Awards (ProgramId, AwardDate)
INCLUDE (Amount, ProviderId, HouseholdId);

-- Materialize common aggregations
CREATE VIEW analytics.EnrollmentSummary AS
SELECT
    CAST(CreatedDate AS DATE) as EnrollmentDate,
    SchoolId,
    StatusId,
    COUNT(*) as TotalEnrollments,
    COUNT(DISTINCT StudentId) as UniqueStudents
FROM Enrollment.Enrollments
GROUP BY CAST(CreatedDate AS DATE), SchoolId, StatusId;
```

---

## Monitoring and Alerting

### Container Apps Metrics

```bash
# Query Metabase container metrics
az monitor metrics list \
  --resource "/subscriptions/{sub}/resourceGroups/k12-dev-rg/providers/Microsoft.App/containerApps/k12-metabase" \
  --metric "Requests" "CpuUsage" "MemoryUsage" \
  --interval PT1M
```

### Health Check Endpoint

```bash
# Metabase health check
curl -s https://analytics.k12portal.nc.gov/api/health | jq .
# Expected: {"status": "ok"}
```

### Alert Rules

| Alert | Condition | Action |
|-------|-----------|--------|
| High CPU | > 80% for 5 min | Scale out |
| Memory Pressure | > 85% for 3 min | Scale out + investigate |
| Query Timeout | > 30s avg for 10 queries | Optimize indexes |
| Container Restart | > 2 in 5 min | Page on-call |

---

## Security Considerations

### Network Security

- **Ingress**: HTTPS only via Azure Front Door
- **Egress**: Private Link to Azure SQL (production)
- **Authentication**: Azure AD SSO via SAML

### Data Access Control

- **Read-Only Access**: Metabase uses dedicated read-only SQL user
- **Row-Level Security**: Inherit SQL RLS policies where applicable
- **Audit Logging**: All query execution logged to Azure Monitor

### Secret Management

```bash
# Store secrets in Container Apps secrets
az containerapp secret set \
  --name k12-metabase \
  --resource-group k12-dev-rg \
  --secrets metabase-db-password="<password>" sql-connection-password="<password>"
```

---

## Migration from Previous Architecture

This document replaces the following deprecated documents:
- CONT-03: Data API Builder Integration (archived)
- CONT-04: Trino Analytics Engine (archived)
- CONT-05: CubeJS Semantic Layer (archived)

See [ADR-014](./../../adr/ADR-014-metabase-analytics.md) for the decision rationale.

---

## References

- [Metabase Documentation](https://www.metabase.com/docs/latest/)
- [Metabase Embedding Guide](https://www.metabase.com/docs/latest/embedding/introduction)
- [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/)
- [.NET Aspire Container Integration](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/add-docker-containers)

---

**Last Updated:** December 22, 2025
**Owner:** CFI Architecture Team
