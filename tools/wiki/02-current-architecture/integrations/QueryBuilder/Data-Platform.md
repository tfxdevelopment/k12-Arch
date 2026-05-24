# K12 QueryBuilder Analytics Platform

## Overview

The K12 QueryBuilder is a cloud-native data analytics platform for K-12 enrollment management. Built using **.NET Aspire** for orchestration, it provides a unified interface for executing data analytics queries across the K-12 enrollment system through:

- **Cube.js** - Semantic layer for pre-aggregated queries with business metrics
- **Trino** - Distributed SQL engine for federated data access
- **Metabase** - Business intelligence and visualization

**Repository**: `k12-querybuilder`

### Database Architecture

> **Important:** The K12 platform uses a **dual-database architecture**:

| Database | Role | Purpose |
|----------|------|---------|
| **Azure SQL Server** | **Primary** | All transactional data (enrollment, programs, awards) |
| **Azure PostgreSQL** | **Analytics Only** | Cube.js → Metabase sync for pre-aggregated data |

**Azure SQL remains the source of truth.** PostgreSQL is used exclusively for analytics sync:

```
Azure SQL ──▶ Trino ──▶ Cube.js ──sync──▶ PostgreSQL ──▶ Metabase
(Primary)    (Query)   (Semantic)        (Analytics)    (BI)
```

**Why PostgreSQL for Analytics?**
- Cube.js Semantic Layer Sync supports PostgreSQL
- Metabase uses PostgreSQL as its default backend
- PostgreSQL extensions (TimescaleDB, pg_trgm) enable advanced analytics

See [ADR-010 Option 6](./../../../adr/ADR-010-embedded-analytics-components.md) for details.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     .NET Aspire AppHost (net10.0)                        │
│              - Service orchestration & discovery                         │
│              - Health monitoring & observability                         │
│              - Dependency management (WaitFor chains)                    │
│              - Aspire Dashboard (https://localhost:15888)                │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
    ┌────────────────────────────┼────────────────────────────────┐
    │                            │                                │
    ▼                            ▼                                ▼
┌─────────────┐          ┌─────────────┐                 ┌─────────────┐
│  Metabase   │          │   Query API │                 │   Trino     │
│  (port 3000)│          │   (.NET 10) │                 │   Cluster   │
│             │          │             │                 │             │
│ • BI Dashboards        │ • /health   │                 │ Coordinator │
│ • Visualizations       │ • /api/cube/*                 │ (port 8080) │
│ • Self-service         │ • /api/trino/*                │             │
│   Analytics            │             │                 │ Workers x3  │
└──────┬──────┘          └──────┬──────┘                 └──────┬──────┘
       │                        │                               │
       │                        ▼                               │
       │                 ┌─────────────┐                        │
       └────────────────►│   Cube.js   │◄───────────────────────┘
                         │  Semantic   │
                         │   Layer     │
                         │ (port 4000) │
                         │             │
                         │ • API Server│
                         │ • SQL Port  │
                         │   (15432)   │
                         └──────┬──────┘
                                │
                         ┌──────▼──────┐
                         │  Cubestore  │
                         │  Cluster    │
                         │             │
                         │ Router:9999 │
                         │ Workers x2  │
                         │ (10001-10002)│
                         └──────┬──────┘
                                │
┌───────────────────────────────┼───────────────────────────────┐
│                     Data Sources                                │
├───────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Azure SQL  │  │ PostgreSQL  │  │   Other     │            │
│  │  (K12 DB)   │  │ (Metabase)  │  │  Catalogs   │            │
│  │             │  │             │  │             │            │
│  │ • dbo       │  │ App database│  │ • crossroads│            │
│  │ • Enrollment│  │ for Metabase│  │ • grants    │            │
│  │ • Households│  │             │  │ • savings   │            │
│  │ • Awards    │  │             │  │             │            │
│  │ • Comms     │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└───────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Orchestration** | .NET Aspire | 13.0 | Service discovery, health monitoring |
| **Runtime** | .NET | 10.0 | Latest framework (preview) |
| **Semantic Layer** | Cube.js | latest | Data modeling, pre-aggregations |
| **Query Engine** | Trino | latest | Federated SQL queries |
| **BI Platform** | Metabase | latest | Dashboards, visualizations |
| **Caching** | Cubestore | latest | Pre-aggregation storage |
| **App Database** | PostgreSQL | latest | Metabase persistence |
| **Primary Database** | Azure SQL | - | K12 enrollment data |
| **Validation** | FluentValidation | latest | Request validation |
| **Containers** | Docker | - | Service containerization |

---

## Service Components

### 1. AppHost (Aspire Orchestrator)

**Location**: `src/K12.QueryBuilder.AppHost/AppHost.cs`

The AppHost coordinates all services with dependency management:

```
Service Dependencies (WaitFor Chains):
├── trino (coordinator)
│   ├── trino-worker-1
│   ├── trino-worker-2
│   └── trino-worker-3
├── cubestore-router
│   ├── cubestore-worker-1
│   └── cubestore-worker-2
├── cube-api → waits for: trino, cubestore-router
├── cube-refresh-worker → waits for: trino, cubestore-router
├── metabase → waits for: postgres, cube-api
└── query-api → waits for: cube-api, trino
```

**Key Configuration**:
- Bind mounts infrastructure from `k12-querybuilder-prototype/infra/`
- PostgreSQL uses `ContainerLifetime.Persistent` for data retention
- Cube.js secrets from configuration (`Cube:ApiSecret`, `Cube:SqlPassword`)

### 2. Query API (.NET 10 Minimal API)

**Location**: `src/K12.QueryBuilder.Api/`

A production-ready API providing unified access to Cube.js and Trino:

#### API Endpoints

| Endpoint | Method | Description | Rate Limit |
|----------|--------|-------------|------------|
| `/health` | GET | Service health check | Standard |
| `/api/cube/meta` | GET | Cube.js metadata (cached 5 min) | 100/min |
| `/api/cube/query` | POST | Execute Cube.js query | 10/min |
| `/api/trino/query` | POST | Execute Trino SQL | 10/min |
| `/api/trino/catalogs` | GET | List available catalogs | 100/min |

#### Project Structure

```
K12.QueryBuilder.Api/
├── Program.cs              # API configuration & endpoints
├── Controllers/
│   └── CubeController.cs   # Additional controller endpoints
├── Services/
│   ├── ICubeService.cs     # Cube.js service interface
│   ├── CubeService.cs      # Cube.js implementation
│   ├── ITrinoService.cs    # Trino service interface
│   └── TrinoService.cs     # Trino implementation
├── Validators/
│   ├── CubeQueryValidator.cs    # Cube.js request validation
│   ├── TrinoQueryValidator.cs   # Trino SQL validation
│   └── PaginationRequest.cs     # Pagination validation
├── Middleware/
│   └── GlobalExceptionHandlerMiddleware.cs
├── Models/
│   ├── CubeModels.cs       # Cube.js request/response models
│   ├── TrinoModels.cs      # Trino request/response models
│   ├── PaginationModels.cs # Pagination metadata
│   └── ApiErrorResponse.cs # Standardized error format
├── Health/
│   ├── CubeApiHealthCheck.cs
│   └── TrinoHealthCheck.cs
└── Extensions/
    ├── BuilderExtensions.*.cs  # Service registration extensions
    └── AppEndpointExtensions.*.cs
```

### 3. Cube.js (Semantic Layer)

Provides business-friendly data abstraction:

- **API Server** (port 4000): REST API for queries
- **SQL Interface** (port 15432): PostgreSQL-compatible for BI tools
- **Refresh Worker**: Background pre-aggregation updates

**Data Models Location**: `k12-querybuilder-prototype/infra/cube/model/`

### 4. Trino (Query Federation)

Distributed SQL engine with multiple catalogs:

| Catalog | Purpose | Data Source |
|---------|---------|-------------|
| `k12` | Primary enrollment data | Azure SQL |
| `crossroads` | Crossroads integration | TBD |
| `grants` | Grants management | TBD |
| `savings` | Savings program | TBD |

**Configuration Location**: `k12-querybuilder-prototype/infra/trino/`

---

## Design Patterns

### 1. Service Layer Pattern

Clean separation between API endpoints and business logic:

```
HTTP Request → Validator → Service → External API → Response
```

- **Services**: `ICubeService`, `ITrinoService` with health checks
- **Validators**: FluentValidation for comprehensive input validation
- **Dependency Injection**: Testable, maintainable code

### 2. Rate Limiting (ASP.NET Core)

Three-tier rate limiting strategy:

| Policy | Endpoints | Limit | Window |
|--------|-----------|-------|--------|
| `api` | Standard endpoints | 100 requests | 1 minute |
| `expensive` | Query execution | 10 requests | 1 minute |
| `concurrent` | All endpoints | 10 simultaneous | - |

### 3. Output Caching

Intelligent caching to reduce backend load:

| Policy | Endpoints | TTL | Strategy |
|--------|-----------|-----|----------|
| `cube-meta` | Metadata endpoints | 5 minutes | Tag-based |
| `query-cache` | Query endpoints | 1 minute | Vary by query |

### 4. Global Exception Handling

Centralized error handling with environment-aware responses:

```csharp
exception switch
{
    ValidationException     → 400 Bad Request
    ArgumentException       → 400 Bad Request
    HttpRequestException    → 503 Service Unavailable
    TaskCanceledException   → 408 Request Timeout
    UnauthorizedAccessException → 401 Unauthorized
    _                       → 500 Internal Server Error
}
```

All errors include:
- Consistent JSON structure
- OpenTelemetry trace IDs
- Environment-aware detail levels

---

## Security Architecture

### Input Validation

**Cube.js Query Validation**:
- At least one measure or dimension required
- Maximum 100 measures/dimensions
- Valid granularities: `second`, `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year`
- Valid filter operators: `equals`, `notEquals`, `contains`, `gt`, `gte`, `lt`, `lte`, etc.
- Limit range: 1 - 50,000

**Trino SQL Validation**:
- Query length maximum: 100,000 characters
- **Dangerous keywords blocked**: `DROP`, `DELETE`, `TRUNCATE`, `ALTER`, `CREATE`, `INSERT`, `UPDATE`
- Valid catalogs: `k12`, `crossroads`, `grants`, `savings`
- Schema identifier validation

### Authentication (Planned)

- Azure AD authentication with JWT bearer tokens
- Role-based access control
- Integration with existing K12 identity model

### SQL Injection Protection

Basic keyword blocking prevents destructive operations:
```csharp
private static readonly string[] DangerousKeywords =
{
    "DROP", "DELETE", "TRUNCATE", "ALTER", "CREATE", "INSERT", "UPDATE"
};
```

---

## Data Flow

### Query Execution Flow

```
                                    ┌──────────────┐
                                    │   Client     │
                                    └──────┬───────┘
                                           │
                              ┌────────────▼────────────┐
                              │      Query API         │
                              │  • Rate Limiting       │
                              │  • Input Validation    │
                              │  • Request Logging     │
                              └────────────┬───────────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              │                            │                            │
    ┌─────────▼──────────┐      ┌─────────▼──────────┐      ┌─────────▼──────────┐
    │   CubeService      │      │   TrinoService     │      │   Health Checks    │
    │                    │      │                    │      │                    │
    │ • GetMetadataAsync │      │ • ExecuteQueryAsync│      │ • CheckHealthAsync │
    │ • ExecuteQueryAsync│      │ • GetCatalogsAsync │      │                    │
    │ • CheckHealthAsync │      │ • CheckHealthAsync │      │                    │
    └─────────┬──────────┘      └─────────┬──────────┘      └────────────────────┘
              │                            │
              │     /cubejs-api/v1/*       │     /v1/statement
              │                            │
    ┌─────────▼──────────┐      ┌─────────▼──────────┐
    │     Cube.js        │      │      Trino         │
    │                    │      │                    │
    │ • Semantic queries │      │ • Raw SQL queries  │
    │ • Pre-aggregations │      │ • Federated access │
    │ • Caching          │      │ • Distributed      │
    └─────────┬──────────┘      └─────────┬──────────┘
              │                            │
              └────────────┬───────────────┘
                           │
              ┌────────────▼────────────┐
              │     Azure SQL (K12)     │
              │                         │
              │ • Enrollment data       │
              │ • Household data        │
              │ • Award data            │
              └─────────────────────────┘
```

---

## Observability

### Aspire Dashboard

Access at `https://localhost:15888` provides:

- **Service Health**: Real-time status of all containers
- **Logs**: Centralized logging from all services
- **Traces**: Distributed tracing across services
- **Metrics**: Performance metrics and counters

### OpenTelemetry Integration

All API requests include:
- Activity spans for distributed tracing
- Structured log messages with context
- Trace IDs for request correlation

```json
{
  "data": [...],
  "query": {
    "executionTimeMs": 142,
    "executedAt": "2025-12-08T10:30:00Z",
    "fromCache": false,
    "traceId": "00-abc123..."
  }
}
```

---

## Testing

### Unit Tests

**Location**: `src/K12.QueryBuilder.Api.Tests/`

- Framework: xUnit
- Mocking: Moq
- Assertions: FluentAssertions
- Coverage: 56+ passing tests

**Test Categories**:
- Validator tests (Cube.js, Trino, Pagination)
- Service tests (mocked HTTP clients)
- Middleware tests (exception handling)

### Running Tests

```bash
# Run all tests
dotnet test

# Run specific project tests
dotnet test src/K12.QueryBuilder.Api.Tests
```

---

## Development Setup

### Prerequisites

- .NET 10 SDK (Preview)
- Docker Desktop
- Visual Studio 2022 (17.9+) or VS Code with C# Dev Kit

### Configuration

1. Copy template configuration:
```bash
cp src/K12.QueryBuilder.AppHost/appsettings.Development.json.template \
   src/K12.QueryBuilder.AppHost/appsettings.Development.json
```

2. Update connection strings and secrets:
```json
{
  "ConnectionStrings": {
    "k12db": "Server=tcp:<SERVER>.database.windows.net,1433;..."
  },
  "Cube": {
    "ApiSecret": "your-cube-api-secret",
    "SqlPassword": "your-cube-sql-password"
  }
}
```

### Running the Application

```bash
cd k12-querybuilder/src/K12.QueryBuilder.AppHost
dotnet run
```

### Service Endpoints (Local Development)

| Service | URL | Port |
|---------|-----|------|
| Aspire Dashboard | https://localhost:15888 | 15888 |
| Metabase | http://localhost:3000 | 3000 |
| Cube.js API | http://localhost:4000 | 4000 |
| Cube.js SQL | localhost:15432 | 15432 |
| Trino UI | http://localhost:8080 | 8080 |
| Query API | Check Dashboard | Dynamic |

---

## API Examples

### Health Check

```bash
curl https://localhost:7123/health
```

Response:
```json
{
  "status": "Healthy",
  "services": {
    "cube-api": {
      "status": "Healthy",
      "responseTimeMs": 23,
      "description": "Cube.js service is responding"
    },
    "trino": {
      "status": "Healthy",
      "responseTimeMs": 45,
      "description": "Trino service is responding"
    }
  }
}
```

### Cube.js Query

```bash
curl -X POST https://localhost:7123/api/cube/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "measures": ["Enrollments.count"],
      "dimensions": ["Enrollments.status"],
      "timeDimensions": [{
        "dimension": "Enrollments.createdDate",
        "dateRange": ["2025-01-01", "2025-12-31"],
        "granularity": "month"
      }]
    }
  }'
```

### Trino SQL Query

```bash
curl -X POST https://localhost:7123/api/trino/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT status, COUNT(*) as total FROM k12.dbo.enrollments GROUP BY status",
    "catalog": "k12",
    "schema": "dbo"
  }'
```

---

## Integration with Main K12 System

### Relationship to Other Repositories

| Repository | Relationship |
|------------|-------------|
| `k12-api-enrollment` | Data source (Azure SQL) |
| `k12-web-enrollment` | Future BI dashboard integration |
| `k12-querybuilder-prototype` | Infrastructure configurations |
| `k12-infra` | Terraform deployment (future) |

### Shared Components

The QueryBuilder includes shared domain models from the main K12 system:

- `CFIK12.Domain` - Domain models and enums
- `CFIK12.EntityFramework` - Database context and configurations
- `CFIK12.Infrastructure` - Infrastructure services
- `CFIK12.Interfaces` - Service interfaces

---

## Deployment

### Azure Container Apps (Target)

```bash
# Build container image
dotnet publish src/K12.QueryBuilder.Api/K12.QueryBuilder.Api.csproj -c Release

# Deploy using Azure CLI
az containerapp up --name k12-querybuilder-api \
  --resource-group k12-rg \
  --location eastus \
  --source .
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `ConnectionStrings__k12db` | Azure SQL connection string |
| `ConnectionStrings__cube-api` | Cube.js endpoint |
| `ConnectionStrings__trino` | Trino endpoint |
| `Cube__ApiSecret` | Cube.js API secret |
| `Cube__SqlPassword` | Cube.js SQL password |

---

## Roadmap & Recommendations

> **Note:** See [ADR-009](./../../../adr/ADR-009-analytics-query-engine-abstraction.md), [ADR-010](./../../../adr/ADR-010-embedded-analytics-components.md), and [ADR-011](./../../../adr/ADR-011-azure-data-api-builder.md) for architectural decisions.

### Phase 1: Core SDK (Immediate)
- [ ] Implement `IQueryBuilderService` with basic CRUD for query definitions
- [ ] Implement `CubeJsQueryEngine` adapter (ADR-009)
- [ ] Implement `TrinoQueryEngine` adapter (ADR-009)
- [ ] Create Analytics SQL schema for query storage
- [ ] Basic snapshot caching (inline storage)
- [ ] Azure AD authentication integration

### Phase 2: Advanced Features
- [ ] Visual query builder in Angular admin app (ADR-010 Option 6)
- [ ] Query sharing and permissions system
- [ ] Azure Blob storage for large result sets
- [ ] Real-time execution status via SignalR
- [ ] Query scheduling with Azure Durable Functions
- [ ] Response streaming for large datasets
- [ ] Implement `DataApiBuilderEngine` as fallback (ADR-011)

### Phase 3: PostgreSQL-Enhanced Architecture (Option 6)
> This phase implements the recommended evolution path from ADR-010 Option 6.

- [ ] Deploy Azure PostgreSQL Flexible Server for pre-aggregated data
- [ ] Enable PostgreSQL extensions: pg_trgm, timescaledb, pgvector
- [ ] Implement Cube.js Semantic Layer Sync to PostgreSQL
- [ ] Build custom Angular analytics components (K12InteractiveChartComponent)
- [ ] Implement PostgresClientService for time-series queries
- [ ] Add autocomplete powered by pg_trgm fuzzy search
- [ ] Create dual data path: Cube.js (real-time) + PostgreSQL (historical)

### Phase 4: Data Pipeline Integration
- [ ] DBT adapter for data transformations
- [ ] Incremental snapshot updates
- [ ] Data freshness indicators
- [ ] Automated cache invalidation
- [ ] Data lineage tracking
- [ ] Integration with Brandon's DataMapper SemanticLayer

### Security Recommendations
- [ ] Query-level RLS integration with existing Hub & Spoke security model
- [ ] Parameter value sanitization beyond keyword blocking
- [ ] SQL parser for robust injection protection (replace keyword blocking)
- [ ] Audit logging for all query operations
- [ ] Rate limiting per user/role
- [ ] Query cost estimation and limits

### Architecture Recommendations
- [ ] Abstract Cube.js/Trino behind unified `IQueryEngine` interface (ADR-009)
- [ ] Use pluggable adapter pattern for future query engines
- [ ] Leverage existing `Enrollment.SemanticLayer` tables for metadata
- [ ] Store query definitions in new `Analytics` schema
- [ ] Implement snapshot caching with hash-based deduplication
- [ ] Consider PostgreSQL-enhanced architecture for Metabase-like UX (ADR-010 Option 6)

---

## Related Documentation

### Internal Documentation
- [QueryBuilder SDK Design](SDK-Design.md) - Full SDK architecture & API design
- [System Architecture Overview](./../../README.md)
- [Development Guide](./../../../05-development/README.md)
- DataMapper SemanticLayer Tables (external: k12-api-enrollment repo)

### Architecture Decision Records
- [ADR-009: Analytics Query Engine Abstraction](./../../../adr/ADR-009-analytics-query-engine-abstraction.md) - IQueryEngine interface design
- [ADR-010: Embedded Analytics Components](./../../../adr/ADR-010-embedded-analytics-components.md) - Angular component strategy & Option 6
- [ADR-011: Azure Data API Builder](./../../../adr/ADR-011-azure-data-api-builder.md) - DAB as fallback engine

### Proposed Analytics Architecture
- [ANALYTICS-01: Data Federation](./../../../09-proposed-architecture/05-analytics/ANALYTICS-01-data-federation.md)
- [ANALYTICS-02: Semantic Layer](./../../../09-proposed-architecture/05-analytics/ANALYTICS-02-semantic-layer.md)
- [ANALYTICS-03: Real-Time vs Batch](./../../../09-proposed-architecture/05-analytics/ANALYTICS-03-realtime-vs-batch.md)

### External Resources
- [Cube.js Official Docs](https://cube.dev/docs)
- [Cube.js Angular Integration](https://cube.dev/docs/product/apis-integrations/javascript-sdk/angular)
- [Trino Official Docs](https://trino.io/docs/current/)
- [Azure Data API Builder](https://learn.microsoft.com/en-us/azure/data-api-builder/)
- [Azure PostgreSQL Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/overview)

---

*Last Updated: December 2025*
*Maintained by: K12 Architecture Team*
