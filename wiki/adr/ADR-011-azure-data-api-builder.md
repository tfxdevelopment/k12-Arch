# ADR-011: Azure Data API Builder for Analytics Data Access

**Status:** Proposed
**Date:** 2025-12-08
**Deciders:** CFI Architecture Team, K12 Dev Team
**Technical Story:** Evaluate Azure Data API Builder as Cube.js backup/alternative

## Context and Problem Statement

The K12 QueryBuilder platform uses Cube.js as the primary semantic layer (ADR-009). However, we need a backup query engine that:

1. Can replace Cube.js if it doesn't meet requirements
2. Provides REST/GraphQL endpoints without custom code
3. Integrates seamlessly with existing Azure SQL and Dapper patterns
4. Works with Azure Container Apps deployment model
5. Supports Entra ID authentication natively

Azure Data API Builder (DAB) is a Microsoft open-source tool that generates REST and GraphQL endpoints from database configuration. This ADR evaluates its adoption as a secondary query engine.

## Decision Drivers

* **Azure Native**: Must integrate with existing Azure infrastructure
* **Zero Code**: Reduce development effort for CRUD-heavy analytics queries
* **Dapper Compatibility**: Should complement, not replace, existing Dapper repositories
* **Cost**: Must be free/open-source (licensing constraint)
* **Performance**: Must handle analytics workloads efficiently
* **Security**: Must support Entra ID and role-based access
* **GraphQL**: Nice-to-have for flexible client queries

## Considered Options

1. **Azure Data API Builder** - Microsoft's zero-code REST/GraphQL
2. **Hasura** - Third-party GraphQL engine
3. **PostGraphile** - PostgreSQL-focused GraphQL
4. **Custom .NET Minimal API** - Hand-coded endpoints
5. **OData via Entity Framework** - Standard OData endpoints

## Decision Outcome

**Chosen option:** "Azure Data API Builder", deployed as a secondary query engine alongside Cube.js, because:

1. **Zero Code**: Single configuration file replaces custom API code
2. **Free & Open Source**: MIT license, no licensing costs
3. **Azure Native**: Works with Azure SQL, Container Apps, Entra ID
4. **Complements Dapper**: DAB handles simple queries, Dapper handles complex logic
5. **Stateless**: Perfect for container deployment and horizontal scaling
6. **GraphQL + REST**: Provides both protocols from same config

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Azure Container Apps Environment                        │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ K12 QueryBuilder│  │  Azure Data     │  │   Cube.js       │              │
│  │      API        │  │  API Builder    │  │    (Primary)    │              │
│  │   (.NET 10)     │  │   Container     │  │   Container     │              │
│  │                 │  │                 │  │                 │              │
│  │ • IQueryEngine  │  │ • REST /api/*   │  │ • /cubejs-api/* │              │
│  │   Orchestrator  │  │ • GraphQL       │  │ • Pre-aggs      │              │
│  │ • Query Defs    │  │ • In-mem cache  │  │ • Semantic      │              │
│  │ • Snapshots     │  │ • OData-like    │  │                 │              │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
│           │                    │                    │                        │
│           │   ┌────────────────┴────────────────┐   │                        │
│           │   │       Entra ID Authentication   │   │                        │
│           │   │       (JWT Bearer Tokens)       │   │                        │
│           │   └────────────────┬────────────────┘   │                        │
│           │                    │                    │                        │
└───────────┼────────────────────┼────────────────────┼────────────────────────┘
            │                    │                    │
            │                    ▼                    │
            │         ┌─────────────────────┐        │
            └────────►│     Azure SQL       │◄───────┘
                      │     Database        │
                      │                     │
                      │ • Enrollment schema │
                      │ • Analytics views   │
                      │ • RLS policies      │
                      └─────────────────────┘
```

### Consequences

#### Good
- Zero custom code for REST/GraphQL analytics endpoints
- In-memory caching built-in (no Redis needed initially)
- OpenAPI/Swagger documentation generated automatically
- GraphQL enables flexible client queries (filter, sort, paginate)
- Works with existing SQL views optimized for analytics
- Horizontal scaling via stateless container design
- Native Entra ID authentication
- Claims passed to SQL session context (RLS integration)
- MIT license - free forever
- Microsoft-supported (part of Fabric ecosystem)

#### Bad
- No semantic layer (dimensions/measures abstraction)
- No pre-aggregation or materialized views management
- Limited to CRUD-style operations (not complex analytics)
- Must create SQL views for denormalized analytics data
- Another container to deploy and monitor
- Learning curve for configuration format

#### Neutral
- Can run alongside Cube.js (not either/or)
- SQL views become the "semantic layer" equivalent
- Configuration stored in repo alongside code

## Pros and Cons of the Options

### Option 1: Azure Data API Builder (Chosen)

* **Pro:** Zero-code REST/GraphQL from config file
* **Pro:** Free and open-source (MIT)
* **Pro:** Native Azure SQL, PostgreSQL, Cosmos DB support
* **Pro:** Entra ID authentication built-in
* **Pro:** In-memory caching
* **Pro:** Stateless, container-friendly
* **Pro:** OpenAPI spec generated automatically
* **Pro:** GraphQL with filtering, sorting, pagination
* **Pro:** Role-based access via JWT claims
* **Pro:** Hot-reload configuration changes
* **Con:** No semantic layer abstraction
* **Con:** No pre-aggregation capabilities
* **Con:** Must build analytics views in SQL

### Option 2: Hasura

* **Pro:** Powerful GraphQL engine
* **Pro:** Real-time subscriptions
* **Pro:** Remote schema stitching
* **Pro:** Good developer experience
* **Con:** Commercial licensing for enterprise features
* **Con:** PostgreSQL-focused (Azure SQL support limited)
* **Con:** Another vendor dependency
* **Con:** Self-hosting complexity

### Option 3: PostGraphile

* **Pro:** Excellent PostgreSQL integration
* **Pro:** Automatic schema introspection
* **Pro:** Plugin architecture
* **Con:** PostgreSQL only - doesn't support Azure SQL
* **Con:** Would require database migration
* **Con:** Community support only

### Option 4: Custom .NET Minimal API

* **Pro:** Full control over implementation
* **Pro:** Team already knows .NET
* **Pro:** Can integrate with existing Dapper
* **Con:** Significant development effort
* **Con:** Must implement caching, pagination, etc.
* **Con:** Ongoing maintenance burden
* **Con:** Slower time to market

### Option 5: OData via Entity Framework

* **Pro:** Standard protocol (OData)
* **Pro:** Rich query capabilities
* **Pro:** Microsoft ecosystem
* **Con:** Conflicts with ADR-002 (chose Dapper over EF)
* **Con:** EF overhead in serverless environment
* **Con:** Learning curve for OData specifics

## Technical Details

### DAB Configuration for Analytics

```json
{
  "$schema": "https://dataapibuilder.azureedge.net/schemas/v1.2.0/dab.draft.schema.json",
  "data-source": {
    "database-type": "mssql",
    "connection-string": "@env('SQL_CONNECTION_STRING')"
  },
  "runtime": {
    "rest": {
      "enabled": true,
      "path": "/api",
      "request-body-strict": true
    },
    "graphql": {
      "enabled": true,
      "path": "/graphql",
      "allow-introspection": true
    },
    "host": {
      "cors": {
        "origins": ["https://admin.k12.seaa.nc.gov"],
        "allow-credentials": true
      },
      "authentication": {
        "provider": "AzureAD",
        "jwt": {
          "audience": "api://k12-querybuilder",
          "issuer": "https://login.microsoftonline.com/{tenant-id}/v2.0"
        }
      }
    },
    "cache": {
      "enabled": true,
      "ttl-seconds": 300
    }
  },
  "entities": {
    "EnrollmentAnalytics": {
      "source": {
        "object": "Analytics.vw_EnrollmentSummary",
        "type": "view"
      },
      "permissions": [
        {
          "role": "admin",
          "actions": ["read"],
          "fields": { "include": ["*"] }
        },
        {
          "role": "analyst",
          "actions": ["read"],
          "fields": {
            "include": ["*"],
            "exclude": ["SensitiveField"]
          }
        }
      ],
      "graphql": {
        "enabled": true,
        "type": {
          "singular": "EnrollmentSummary",
          "plural": "EnrollmentSummaries"
        }
      },
      "rest": {
        "enabled": true,
        "path": "/enrollment-analytics"
      }
    },
    "AwardsBySchool": {
      "source": {
        "object": "Analytics.vw_AwardsBySchool",
        "type": "view"
      },
      "permissions": [
        { "role": "authenticated", "actions": ["read"] }
      ],
      "graphql": {
        "enabled": true,
        "type": {
          "singular": "AwardBySchool",
          "plural": "AwardsBySchool"
        }
      },
      "rest": {
        "enabled": true,
        "path": "/awards-by-school"
      }
    },
    "ApplicationTrends": {
      "source": {
        "object": "Analytics.vw_ApplicationTrends",
        "type": "view"
      },
      "permissions": [
        { "role": "authenticated", "actions": ["read"] }
      ],
      "graphql": { "enabled": true },
      "rest": { "enabled": true, "path": "/application-trends" }
    }
  }
}
```

### Analytics Views (SQL Server)

```sql
-- Analytics.vw_EnrollmentSummary
CREATE OR ALTER VIEW Analytics.vw_EnrollmentSummary AS
SELECT
    ep.Id AS ProgramId,
    ep.Name AS ProgramName,
    CAST(a.CreatedDate AS DATE) AS Date,
    a.Status,
    COUNT(*) AS ApplicationCount,
    COUNT(CASE WHEN a.Status = 'Approved' THEN 1 END) AS ApprovedCount,
    COUNT(CASE WHEN a.Status = 'Pending' THEN 1 END) AS PendingCount,
    SUM(COALESCE(aw.Amount, 0)) AS TotalAwardAmount,
    AVG(COALESCE(aw.Amount, 0)) AS AvgAwardAmount
FROM Enrollment.Applications a
INNER JOIN Enrollment.EnrollmentProgram ep ON a.ProgramId = ep.Id
LEFT JOIN Awards.Allocations aw ON a.Id = aw.ApplicationId
GROUP BY
    ep.Id,
    ep.Name,
    CAST(a.CreatedDate AS DATE),
    a.Status;
GO

-- Analytics.vw_AwardsBySchool
CREATE OR ALTER VIEW Analytics.vw_AwardsBySchool AS
SELECT
    s.Id AS SchoolId,
    s.Name AS SchoolName,
    s.City,
    s.State,
    YEAR(aw.DisbursementDate) AS Year,
    MONTH(aw.DisbursementDate) AS Month,
    COUNT(DISTINCT a.Id) AS StudentCount,
    COUNT(*) AS DisbursementCount,
    SUM(aw.Amount) AS TotalDisbursed,
    AVG(aw.Amount) AS AvgDisbursement
FROM Schools.Schools s
INNER JOIN Enrollment.Applications a ON s.Id = a.SchoolId
INNER JOIN Awards.Allocations aw ON a.Id = aw.ApplicationId
WHERE aw.Status = 'Disbursed'
GROUP BY
    s.Id,
    s.Name,
    s.City,
    s.State,
    YEAR(aw.DisbursementDate),
    MONTH(aw.DisbursementDate);
GO

-- Analytics.vw_ApplicationTrends
CREATE OR ALTER VIEW Analytics.vw_ApplicationTrends AS
SELECT
    CAST(CreatedDate AS DATE) AS Date,
    ProgramId,
    Status,
    COUNT(*) AS Count,
    SUM(COUNT(*)) OVER (PARTITION BY ProgramId ORDER BY CAST(CreatedDate AS DATE)) AS RunningTotal
FROM Enrollment.Applications
WHERE CreatedDate >= DATEADD(YEAR, -2, GETDATE())
GROUP BY
    CAST(CreatedDate AS DATE),
    ProgramId,
    Status;
GO
```

### DataApiBuilderEngine Implementation

```csharp
public class DataApiBuilderEngine : IQueryEngine
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;

    public string EngineId => "dab";
    public string DisplayName => "Azure Data API Builder";

    public bool CanExecute(QueryDefinitionJson definition)
    {
        // DAB handles simple SQL queries against views
        return definition.Type == "sql" &&
               definition.Engine == "dab" ||
               definition.EnginePreference == "auto";
    }

    public int GetPriority(QueryDefinitionJson definition)
    {
        // Lower priority than Cube.js for semantic queries
        // Higher priority for simple REST/GraphQL queries
        if (definition.Type == "sql" && definition.Sql?.IsSimpleSelect == true)
            return 80;
        return 30;
    }

    public async Task<EngineExecutionResult> ExecuteAsync(
        QueryDefinitionJson definition,
        IDictionary<string, object> parameters,
        ExecutionOptions options,
        CancellationToken ct = default)
    {
        // Option 1: Use REST endpoint
        if (definition.Sql?.UseRest == true)
        {
            return await ExecuteRestAsync(definition, parameters, options, ct);
        }

        // Option 2: Use GraphQL
        return await ExecuteGraphQLAsync(definition, parameters, options, ct);
    }

    private async Task<EngineExecutionResult> ExecuteGraphQLAsync(
        QueryDefinitionJson definition,
        IDictionary<string, object> parameters,
        ExecutionOptions options,
        CancellationToken ct)
    {
        var query = BuildGraphQLQuery(definition, parameters);

        var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/graphql")
        {
            Content = JsonContent.Create(new { query, variables = parameters })
        };

        var response = await _httpClient.SendAsync(request, ct);
        var result = await response.Content.ReadFromJsonAsync<GraphQLResponse>(ct);

        return new EngineExecutionResult
        {
            Success = result?.Errors == null,
            Data = result?.Data,
            RowCount = result?.Data?.Count ?? 0,
            ExecutionTimeMs = 0, // Would need to measure
            FromCache = response.Headers.Contains("X-Cache-Hit")
        };
    }

    private string BuildGraphQLQuery(QueryDefinitionJson definition, IDictionary<string, object> parameters)
    {
        var entityName = definition.Sql?.Entity ?? "EnrollmentAnalytics";
        var fields = definition.Sql?.Fields ?? ["*"];

        // Build filter clause from parameters
        var filters = parameters.Select(p => $"{p.Key}: {FormatValue(p.Value)}");
        var filterClause = filters.Any() ? $"(filter: {{ {string.Join(", ", filters)} }})" : "";

        return $@"
            query {{
                {entityName}{filterClause} {{
                    items {{
                        {string.Join("\n                        ", fields)}
                    }}
                }}
            }}";
    }
}
```

### Docker Deployment

```dockerfile
# Dockerfile for DAB
FROM mcr.microsoft.com/azure-databases/data-api-builder:latest

COPY dab-config.json /App/dab-config.json

EXPOSE 5000

ENTRYPOINT ["dotnet", "Azure.DataApiBuilder.Service.dll"]
CMD ["--ConfigFileName", "/App/dab-config.json"]
```

```yaml
# docker-compose.yml (development)
services:
  dab:
    image: mcr.microsoft.com/azure-databases/data-api-builder:latest
    ports:
      - "5000:5000"
    environment:
      - SQL_CONNECTION_STRING=${SQL_CONNECTION_STRING}
    volumes:
      - ./dab-config.json:/App/dab-config.json
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Azure Container Apps Deployment

```bicep
// infra/dab-container-app.bicep
resource dabContainerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'k12-dab'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: false
        targetPort: 5000
        transport: 'http'
      }
      secrets: [
        {
          name: 'sql-connection-string'
          value: sqlConnectionString
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'dab'
          image: 'mcr.microsoft.com/azure-databases/data-api-builder:latest'
          env: [
            {
              name: 'SQL_CONNECTION_STRING'
              secretRef: 'sql-connection-string'
            }
          ]
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 5
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '100'
              }
            }
          }
        ]
      }
    }
  }
}
```

## Validation

Success will be measured by:
- REST/GraphQL endpoints operational within 1 week of configuration
- Query latency < 500ms for cached results
- Zero custom code required for basic analytics queries
- Entra ID authentication working with existing tokens
- Can serve as Cube.js fallback without code changes
- Configuration changes deploy without downtime

## Related Decisions

* [ADR-002: Dapper for Data Access](ADR-002-dapper-over-entity-framework.md) - DAB complements Dapper
* [ADR-009: Analytics Query Engine Abstraction](ADR-009-analytics-query-engine-abstraction.md) - DAB as IQueryEngine
* [ADR-010: Embedded Analytics Components](ADR-010-embedded-analytics-components.md) - Frontend integration

## References

* [Azure Data API Builder Documentation](https://learn.microsoft.com/en-us/azure/data-api-builder/)
* [Data API Builder GitHub](https://github.com/Azure/data-api-builder)
* [DAB GA Announcement](https://devblogs.microsoft.com/azure-sql/data-api-builder-ga/)
* [DAB Configuration Schema](https://dataapibuilder.azureedge.net/schemas/v1.2.0/dab.draft.schema.json)
* [DAB + Azure Container Apps](https://learn.microsoft.com/en-us/azure/data-api-builder/deployment/how-to-run-container)
* [SQL Server 2025 + DAB](https://www.microsoft.com/en-us/sql-server/blog/2024/11/19/announcing-microsoft-sql-server-2025-apply-for-the-preview-for-the-enterprise-ai-ready-database/)

---

**Decision Made:** December 8, 2025
**Implementation Target:** Q1 2026 (alongside Cube.js evaluation)
