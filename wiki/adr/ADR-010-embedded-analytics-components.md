# ADR-010: Embedded Analytics Component Strategy

> **ARCHIVED** - This ADR has been superseded. See [ADR-014: Metabase as Unified Analytics Platform](ADR-014-metabase-analytics.md) for the current approach.

**Status:** Superseded
**Superseded By:** ADR-014
**Archived:** 2025-12-22
**Original Date:** 2025-12-08
**Deciders:** CFI Architecture Team, K12 Dev Team

---

## Summary

This ADR proposed building custom Angular components using Cube.js APIs (`@cubejs-client/ngx`) for embedded analytics in the K12 Admin Portal, with an optional evolution path to a PostgreSQL-enhanced architecture.

## Decision

The embedded analytics component strategy was **superseded** by Metabase's native embedding capabilities.

### Original Proposal

- **Option 3 (Chosen)**: Custom Angular Components + Cube.js
- **Option 6 (Recommended Evolution)**: Cube.js + PostgreSQL with reimplemented Metabase-like components
- Features: QueryBuilder, DrillDown Table, ChartWrapper, Dashboard Container
- `@cubejs-client/ngx` for Observable-based Angular integration

### Why Superseded

- **Reduced development effort**: Metabase provides pre-built components
- **No React dependency**: Metabase iframe embedding works with Angular
- **Simpler maintenance**: One vendor solution vs. custom component library
- **Faster delivery**: Built-in visualizations instead of custom charting

## New Approach

See [ADR-014: Metabase as Unified Analytics Platform](ADR-014-metabase-analytics.md) for the current embedding strategy:

- Metabase iframe embedding for complex dashboards
- Metabase REST API for data consumption
- Azure SQL direct queries (no PostgreSQL analytics layer)

---

*Archived: December 22, 2025*
# ADR-009: Analytics Query Engine Abstraction Layer

**Status:** Proposed
**Date:** 2025-12-08
**Deciders:** CFI Architecture Team, K12 Dev Team
**Technical Story:** Design pluggable query engine for K12 QueryBuilder analytics platform

## Context and Problem Statement

The K12 QueryBuilder platform needs a data analytics layer to enable SEAA administrators to build, store, share, and execute queries against enrollment data. Initial implementation uses Cube.js as the semantic layer, but there are concerns about:

1. **Vendor Lock-in**: Cube.js is a proprietary product with paid cloud tiers
2. **Complexity**: Cube.js requires learning a custom data modeling language
3. **Alternatives**: Azure offers native analytics services that may integrate better
4. **Flexibility**: Need ability to swap query engines without rewriting applications

The question is: How should we abstract the query engine layer to enable flexibility while leveraging existing investments?

## Decision Drivers

* **Pluggability**: Must be able to swap Cube.js for alternatives without major rewrites
* **Azure Integration**: Should work seamlessly with Azure SQL, Entra ID, Azure Container Apps
* **Microsoft Ecosystem**: CFI is heavily invested in Microsoft stack
* **Team Skills**: Team knows .NET, SQL, Angular - not Node.js/Cube.js modeling language
* **Cost**: Minimize licensing costs while maintaining capabilities
* **Semantic Layer**: Need business-friendly abstraction over raw SQL
* **Performance**: Sub-second queries for common operations
* **Existing Investment**: Brandon's DataMapper tables provide semantic metadata

## Considered Options

1. **Cube.js with IQueryEngine Abstraction** - Keep Cube.js behind pluggable interface
2. **Azure Data API Builder + Metabase** - Replace Cube.js entirely
3. **Microsoft Fabric Semantic Model** - Full Microsoft stack
4. **Dapper + Custom Semantic Layer** - Build our own using existing DataMapper tables
5. **Trino-Only with Views** - Use SQL views as semantic layer

## Decision Outcome

**Chosen option:** "Cube.js with IQueryEngine Abstraction", with **Azure Data API Builder** as the fallback engine, because:

1. Cube.js provides proven semantic layer with pre-aggregations (performance)
2. The `IQueryEngine` interface allows swapping to alternatives if Cube.js doesn't work
3. Azure Data API Builder provides zero-code REST/GraphQL that pairs with existing Dapper patterns
4. Brandon's DataMapper tables provide metadata that can drive either engine
5. This approach minimizes risk while maintaining flexibility

### Implementation Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    IQueryEngine Interface                        │
│  • CanExecute(definition) → bool                                │
│  • GetPriority(definition) → int                                │
│  • ExecuteAsync(definition, params) → EngineResult              │
│  • CheckHealthAsync() → HealthStatus                            │
└────────────────────────────────┬────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ CubeJsEngine    │    │ DataApiBuilder  │    │  TrinoEngine    │
│ (Primary)       │    │ Engine (Backup) │    │  (Federation)   │
│                 │    │                 │    │                 │
│ • Semantic API  │    │ • REST/GraphQL  │    │ • Raw SQL       │
│ • Pre-aggs      │    │ • Zero-code     │    │ • Multi-source  │
│ • Caching       │    │ • Azure native  │    │ • Complex joins │
│ • Type: semantic│    │ • Type: sql     │    │ • Type: sql     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Consequences

#### Good
- Cube.js pre-aggregations provide excellent query performance
- IQueryEngine interface allows hot-swapping engines
- Azure Data API Builder is free, open-source, and Azure-native
- Can use Brandon's DataMapper metadata with any engine
- Reduced vendor lock-in through abstraction
- Team can evaluate Cube.js without full commitment
- Multiple engines can run simultaneously (best tool for each query type)

#### Bad
- Additional abstraction layer adds complexity
- Must maintain multiple engine adapters
- Cube.js still requires learning its modeling language
- Testing across multiple engines increases effort

#### Neutral
- Configuration-driven engine selection
- May need to standardize query definition format across engines
- Performance characteristics vary by engine

## Pros and Cons of the Options

### Option 1: Cube.js with IQueryEngine Abstraction (Chosen)

* **Pro:** Proven semantic layer with pre-aggregations
* **Pro:** REST, GraphQL, and Postgres wire protocols
* **Pro:** Integrates with Metabase, Power BI, Excel
* **Pro:** Abstraction allows fallback to alternatives
* **Pro:** WASM query engine pushes sub-second latency
* **Pro:** Supports Azure hosting, Entra ID, Fabric
* **Con:** Proprietary modeling language (JavaScript/YAML)
* **Con:** Cube Cloud has cost at scale
* **Con:** Self-hosting requires Node.js expertise
* **Con:** Another technology for team to learn

### Option 2: Azure Data API Builder + Metabase

* **Pro:** Zero-code REST/GraphQL from configuration
* **Pro:** Free and open-source (MIT license)
* **Pro:** Native Azure integration (Container Apps, Entra ID)
* **Pro:** Works with existing Dapper patterns
* **Pro:** In-memory caching built-in
* **Pro:** Metabase provides semantic layer via Models
* **Con:** No pre-aggregation/materialization
* **Con:** Must build semantic abstractions ourselves
* **Con:** Metabase SDK is React-only (Angular app would need wrapper)
* **Con:** Less sophisticated query optimization than Cube.js

### Option 3: Microsoft Fabric Semantic Model

* **Pro:** Full Microsoft ecosystem integration
* **Pro:** Copilot AI integration in Teams/Office
* **Pro:** Unified with Power BI, Synapse, Azure ML
* **Pro:** Deep Office 365 ties
* **Con:** Expensive licensing (Fabric capacity SKUs)
* **Con:** Heavy dependency on Microsoft pricing decisions
* **Con:** Less flexible for custom embedding
* **Con:** Overkill for current requirements

### Option 4: Dapper + Custom Semantic Layer

* **Pro:** Team already knows Dapper well (ADR-002)
* **Pro:** Full control over implementation
* **Pro:** Can leverage Brandon's DataMapper tables directly
* **Pro:** No new dependencies
* **Con:** Significant custom development effort
* **Con:** Must build caching, pre-aggregation ourselves
* **Con:** No proven semantic layer tooling
* **Con:** Maintenance burden long-term

### Option 5: Trino-Only with SQL Views

* **Pro:** SQL is universal skill
* **Pro:** Views provide logical abstraction
* **Pro:** Federation across data sources
* **Pro:** Already in architecture for raw SQL needs
* **Con:** No semantic layer for business users
* **Con:** No pre-aggregation or intelligent caching
* **Con:** Views don't capture business logic well
* **Con:** Poor fit for self-service analytics

## Technical Details

### IQueryEngine Interface

```csharp
public interface IQueryEngine
{
    string EngineId { get; }
    string DisplayName { get; }

    /// <summary>
    /// Check if this engine can execute the given query
    /// </summary>
    bool CanExecute(QueryDefinitionJson definition);

    /// <summary>
    /// Get priority for this engine (higher = preferred)
    /// </summary>
    int GetPriority(QueryDefinitionJson definition);

    /// <summary>
    /// Execute the query
    /// </summary>
    Task<EngineExecutionResult> ExecuteAsync(
        QueryDefinitionJson definition,
        IDictionary<string, object> parameters,
        ExecutionOptions options,
        CancellationToken ct = default);

    /// <summary>
    /// Check engine health
    /// </summary>
    Task<EngineHealthStatus> CheckHealthAsync(CancellationToken ct = default);

    /// <summary>
    /// Get engine capabilities
    /// </summary>
    EngineCapabilities GetCapabilities();
}
```

### Engine Selection Strategy

```csharp
public class QueryEngineSelector : IQueryEngineSelector
{
    private readonly IEnumerable<IQueryEngine> _engines;

    public IQueryEngine SelectEngine(
        QueryDefinitionJson definition,
        string? preferredEngine = null)
    {
        // 1. If user specified engine preference, try that first
        if (!string.IsNullOrEmpty(preferredEngine))
        {
            var preferred = _engines.FirstOrDefault(e =>
                e.EngineId == preferredEngine && e.CanExecute(definition));
            if (preferred != null) return preferred;
        }

        // 2. Select by query type and priority
        return _engines
            .Where(e => e.CanExecute(definition))
            .OrderByDescending(e => e.GetPriority(definition))
            .FirstOrDefault()
            ?? throw new NoSuitableEngineException(definition);
    }
}
```

### Azure Data API Builder Configuration

```json
{
  "$schema": "https://dataapibuilder.azureedge.net/schemas/v1.2.0/dab.draft.schema.json",
  "data-source": {
    "database-type": "mssql",
    "connection-string": "@env('SQL_CONNECTION_STRING')"
  },
  "runtime": {
    "rest": { "enabled": true, "path": "/api" },
    "graphql": { "enabled": true, "path": "/graphql" },
    "host": {
      "authentication": {
        "provider": "AzureAD",
        "jwt": {
          "audience": "api://k12-querybuilder",
          "issuer": "https://login.microsoftonline.com/{tenant-id}/v2.0"
        }
      }
    }
  },
  "entities": {
    "Enrollment": {
      "source": {
        "object": "Enrollment.vw_EnrollmentAnalytics",
        "type": "view"
      },
      "permissions": [
        { "role": "anonymous", "actions": ["read"] },
        { "role": "authenticated", "actions": ["read"] }
      ],
      "graphql": { "enabled": true, "type": { "singular": "Enrollment", "plural": "Enrollments" }},
      "rest": { "enabled": true, "path": "/enrollments" }
    }
  }
}
```

### Cube.js Model Example (for comparison)

```javascript
// schema/Enrollments.js
cube(`Enrollments`, {
  sql_table: `Enrollment.Applications`,

  joins: {
    Students: {
      relationship: `many_to_one`,
      sql: `${CUBE}.StudentId = ${Students}.Id`
    }
  },

  measures: {
    count: { type: `count` },
    totalAwardAmount: {
      sql: `AwardAmount`,
      type: `sum`,
      format: `currency`
    }
  },

  dimensions: {
    status: {
      sql: `Status`,
      type: `string`
    },
    createdDate: {
      sql: `CreatedDate`,
      type: `time`
    }
  },

  preAggregations: {
    enrollmentsByStatus: {
      measures: [count, totalAwardAmount],
      dimensions: [status],
      timeDimension: createdDate,
      granularity: `day`
    }
  }
});
```

## Migration Path

1. **Phase 1 (Current)**: Implement IQueryEngine interface, CubeJsEngine adapter
2. **Phase 2**: Add DataApiBuilderEngine as fallback
3. **Phase 3**: Evaluate Cube.js fit over 3-6 months
4. **Phase 4**: If issues arise, promote Data API Builder to primary
5. **Phase 5**: Consider Metabase Models as semantic layer alternative

## Validation

Success will be measured by:
- Query response times < 2 seconds (semantic queries)
- Engine swap requires < 1 day of configuration changes
- No code changes needed when switching engines
- Health checks detect engine failures within 30 seconds
- At least 2 engines operational at all times

## Related Decisions

* [ADR-002: Dapper for Data Access](ADR-002-dapper-over-entity-framework.md) - Data API Builder complements Dapper
* [ADR-010: Embedded Analytics Components](ADR-010-embedded-analytics-components.md) - Front-end integration
* [ADR-011: Azure Data API Builder](ADR-011-azure-data-api-builder.md) - Detailed DAB configuration
* [QueryBuilder SDK Design](../02-architecture/integrations/QueryBuilder/SDK-Design.md) - Full SDK architecture

## References

* [Cube.js Documentation](https://cube.dev/docs)
* [Azure Data API Builder](https://learn.microsoft.com/en-us/azure/data-api-builder/)
* [Data API Builder GitHub](https://github.com/Azure/data-api-builder)
* [Best Semantic Layer Tools 2025](https://www.getgalaxy.io/blog/best-semantic-layer-tools-2025)
* [Cube.js + Microsoft Ecosystem](https://cube.dev/blog/introducing-semantic-layer-sync-with-power-bi)
* [Microsoft Fabric Semantic Model](https://learn.microsoft.com/en-us/fabric/data-warehouse/semantic-models)

---

**Decision Made:** December 8, 2025
**Review Date:** March 2026 (3-month evaluation of Cube.js)
