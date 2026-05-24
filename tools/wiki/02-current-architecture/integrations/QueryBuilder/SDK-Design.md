# K12 QueryBuilder SDK - Architecture & API Design

## Executive Summary

The K12 QueryBuilder SDK provides a **unified, pluggable analytics interface** that abstracts underlying query engines (Cube.js, Trino, future DBT) while leveraging the existing **SemanticLayer metadata** from the enrollment form builder. Administrators can build, store, share, and execute query definitions with automatic snapshot caching.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Admin Portal (Angular)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Query Builder│  │Query Library│  │ Execution   │  │ Snapshots   │        │
│  │   (Visual)  │  │  (Shared)   │  │  Console    │  │  Viewer     │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      K12 QueryBuilder SDK (.NET)                             │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    IQueryBuilderService (Public API)                  │   │
│  │  • CreateQueryDefinition()     • ExecuteQuery()                      │   │
│  │  • GetQueryDefinitions()       • GetSnapshot()                       │   │
│  │  • ShareQueryDefinition()      • ListSnapshots()                     │   │
│  │  • GetSemanticModel()          • ScheduleRefresh()                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐  │
│  │              Query Engine Abstraction Layer                           │  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐             │  │
│  │  │ IQueryEngine  │  │ IQueryEngine  │  │ IQueryEngine  │             │  │
│  │  │   (Cube.js)   │  │   (Trino)     │  │   (DBT/SQL)   │             │  │
│  │  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘             │  │
│  │          │                  │                  │                      │  │
│  │  ┌───────▼───────┐  ┌───────▼───────┐  ┌───────▼───────┐             │  │
│  │  │CubeJsAdapter  │  │TrinoAdapter   │  │ DbtAdapter    │             │  │
│  │  │• Semantic API │  │• Raw SQL      │  │• Transforms   │             │  │
│  │  │• Pre-aggs     │  │• Federation   │  │• Materialized │             │  │
│  │  └───────────────┘  └───────────────┘  └───────────────┘             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐  │
│  │                   Metadata & Persistence Layer                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │ Semantic    │  │   Query     │  │  Snapshot   │  │  Schedule   │  │  │
│  │  │ Layer Repo  │  │ Definition  │  │   Cache     │  │   Manager   │  │  │
│  │  │ (Brandon's) │  │    Repo     │  │    Repo     │  │             │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Azure SQL Database                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────┐                   │
│  │  Enrollment Schema      │  │  Analytics Schema (NEW) │                   │
│  │  (Brandon's DataMapper) │  │                         │                   │
│  │  • SemanticLayer        │  │  • QueryDefinition      │                   │
│  │  • Dimension            │  │  • QueryVersion         │                   │
│  │  • Measure              │  │  • QueryShare           │                   │
│  │  • Prompt*              │  │  • QuerySnapshot        │                   │
│  │  • PromptData           │  │  • QuerySchedule        │                   │
│  │  • Input*               │  │  • QueryAuditLog        │                   │
│  └─────────────────────────┘  └─────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Design

### New Analytics Schema

```sql
-- ============================================================================
-- Analytics.QueryDefinition
-- Stores reusable query definitions that can be shared across users
-- ============================================================================
CREATE SCHEMA [Analytics];
GO

CREATE TABLE [Analytics].[QueryDefinition] (
    [Id]                    UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [Name]                  NVARCHAR(255)    NOT NULL,
    [Description]           NVARCHAR(MAX)    NULL,
    [SemanticLayerId]       UNIQUEIDENTIFIER NULL,          -- Links to Brandon's SemanticLayer
    [EnrollmentProgramId]   UNIQUEIDENTIFIER NULL,          -- Scope to program (optional)
    [QueryType]             VARCHAR(50)      NOT NULL,       -- 'semantic', 'sql', 'hybrid'
    [EnginePreference]      VARCHAR(50)      NOT NULL,       -- 'auto', 'cubejs', 'trino', 'dbt'
    [Definition]            NVARCHAR(MAX)    NOT NULL,       -- JSON query definition
    [DefaultParameters]     NVARCHAR(MAX)    NULL,           -- JSON default parameter values
    [Tags]                  NVARCHAR(MAX)    NULL,           -- JSON array of tags
    [IsTemplate]            BIT              NOT NULL DEFAULT 0,
    [IsPublic]              BIT              NOT NULL DEFAULT 0,
    [CreatedBy]             UNIQUEIDENTIFIER NOT NULL,
    [CreatedDateTime]       DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedBy]             UNIQUEIDENTIFIER NULL,
    [UpdatedDateTime]       DATETIME2        NULL,
    [IsDeleted]             BIT              NOT NULL DEFAULT 0,

    CONSTRAINT [PK_QueryDefinition] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QueryDefinition_SemanticLayer]
        FOREIGN KEY ([SemanticLayerId]) REFERENCES [Enrollment].[SemanticLayer]([Id]),
    CONSTRAINT [FK_QueryDefinition_EnrollmentProgram]
        FOREIGN KEY ([EnrollmentProgramId]) REFERENCES [Enrollment].[EnrollmentProgram]([Id]),
    CONSTRAINT [CK_QueryDefinition_QueryType]
        CHECK ([QueryType] IN ('semantic', 'sql', 'hybrid')),
    CONSTRAINT [CK_QueryDefinition_EnginePreference]
        CHECK ([EnginePreference] IN ('auto', 'cubejs', 'trino', 'dbt'))
);

CREATE INDEX [IX_QueryDefinition_SemanticLayerId] ON [Analytics].[QueryDefinition]([SemanticLayerId]);
CREATE INDEX [IX_QueryDefinition_CreatedBy] ON [Analytics].[QueryDefinition]([CreatedBy]);
CREATE INDEX [IX_QueryDefinition_IsPublic] ON [Analytics].[QueryDefinition]([IsPublic]) WHERE [IsDeleted] = 0;

-- ============================================================================
-- Analytics.QueryVersion
-- Version history for query definitions (immutable snapshots)
-- ============================================================================
CREATE TABLE [Analytics].[QueryVersion] (
    [Id]                    UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [QueryDefinitionId]     UNIQUEIDENTIFIER NOT NULL,
    [VersionNumber]         INT              NOT NULL,
    [Definition]            NVARCHAR(MAX)    NOT NULL,       -- Frozen JSON definition
    [ChangeDescription]     NVARCHAR(500)    NULL,
    [CreatedBy]             UNIQUEIDENTIFIER NOT NULL,
    [CreatedDateTime]       DATETIME2        NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT [PK_QueryVersion] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QueryVersion_QueryDefinition]
        FOREIGN KEY ([QueryDefinitionId]) REFERENCES [Analytics].[QueryDefinition]([Id]),
    CONSTRAINT [UQ_QueryVersion_Number] UNIQUE ([QueryDefinitionId], [VersionNumber])
);

-- ============================================================================
-- Analytics.QueryShare
-- Sharing permissions for query definitions
-- ============================================================================
CREATE TABLE [Analytics].[QueryShare] (
    [Id]                    UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [QueryDefinitionId]     UNIQUEIDENTIFIER NOT NULL,
    [SharedWithUserId]      UNIQUEIDENTIFIER NULL,           -- Specific user
    [SharedWithRoleId]      INT              NULL,           -- Role-based sharing
    [SharedWithTeamId]      UNIQUEIDENTIFIER NULL,           -- Team-based sharing
    [Permission]            VARCHAR(20)      NOT NULL,       -- 'view', 'execute', 'edit', 'admin'
    [SharedBy]              UNIQUEIDENTIFIER NOT NULL,
    [SharedDateTime]        DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    [ExpiresDateTime]       DATETIME2        NULL,

    CONSTRAINT [PK_QueryShare] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QueryShare_QueryDefinition]
        FOREIGN KEY ([QueryDefinitionId]) REFERENCES [Analytics].[QueryDefinition]([Id]) ON DELETE CASCADE,
    CONSTRAINT [CK_QueryShare_Permission]
        CHECK ([Permission] IN ('view', 'execute', 'edit', 'admin')),
    CONSTRAINT [CK_QueryShare_Target]
        CHECK ([SharedWithUserId] IS NOT NULL OR [SharedWithRoleId] IS NOT NULL OR [SharedWithTeamId] IS NOT NULL)
);

CREATE INDEX [IX_QueryShare_User] ON [Analytics].[QueryShare]([SharedWithUserId]);
CREATE INDEX [IX_QueryShare_Role] ON [Analytics].[QueryShare]([SharedWithRoleId]);

-- ============================================================================
-- Analytics.QuerySnapshot
-- Timestamped execution results (cached data)
-- ============================================================================
CREATE TABLE [Analytics].[QuerySnapshot] (
    [Id]                    UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [QueryDefinitionId]     UNIQUEIDENTIFIER NOT NULL,
    [QueryVersionId]        UNIQUEIDENTIFIER NULL,           -- Which version was executed
    [SnapshotName]          NVARCHAR(255)    NULL,           -- Optional friendly name
    [Parameters]            NVARCHAR(MAX)    NULL,           -- JSON parameters used
    [ExecutionEngine]       VARCHAR(50)      NOT NULL,       -- Which engine was used
    [Status]                VARCHAR(20)      NOT NULL,       -- 'pending', 'running', 'completed', 'failed'
    [RowCount]              BIGINT           NULL,
    [DataHash]              VARCHAR(64)      NULL,           -- SHA256 of result for dedup
    [ResultStorageType]     VARCHAR(20)      NOT NULL,       -- 'inline', 'blob', 'cubestore'
    [ResultData]            NVARCHAR(MAX)    NULL,           -- Inline JSON (small results)
    [ResultBlobUrl]         VARCHAR(500)     NULL,           -- Azure Blob URL (large results)
    [ResultCubeStoreKey]    VARCHAR(255)     NULL,           -- Cubestore reference
    [ExecutionTimeMs]       BIGINT           NULL,
    [ErrorMessage]          NVARCHAR(MAX)    NULL,
    [ExecutedBy]            UNIQUEIDENTIFIER NOT NULL,
    [ExecutedDateTime]      DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    [ExpiresDateTime]       DATETIME2        NULL,           -- When cache expires
    [IsArchived]            BIT              NOT NULL DEFAULT 0,

    CONSTRAINT [PK_QuerySnapshot] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QuerySnapshot_QueryDefinition]
        FOREIGN KEY ([QueryDefinitionId]) REFERENCES [Analytics].[QueryDefinition]([Id]),
    CONSTRAINT [FK_QuerySnapshot_QueryVersion]
        FOREIGN KEY ([QueryVersionId]) REFERENCES [Analytics].[QueryVersion]([Id]),
    CONSTRAINT [CK_QuerySnapshot_Status]
        CHECK ([Status] IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    CONSTRAINT [CK_QuerySnapshot_StorageType]
        CHECK ([ResultStorageType] IN ('inline', 'blob', 'cubestore'))
);

CREATE INDEX [IX_QuerySnapshot_Definition] ON [Analytics].[QuerySnapshot]([QueryDefinitionId]);
CREATE INDEX [IX_QuerySnapshot_Status] ON [Analytics].[QuerySnapshot]([Status]) WHERE [Status] IN ('pending', 'running');
CREATE INDEX [IX_QuerySnapshot_Executed] ON [Analytics].[QuerySnapshot]([ExecutedDateTime] DESC);
CREATE INDEX [IX_QuerySnapshot_DataHash] ON [Analytics].[QuerySnapshot]([DataHash]) WHERE [DataHash] IS NOT NULL;

-- ============================================================================
-- Analytics.QuerySchedule
-- Scheduled refresh configurations for queries
-- ============================================================================
CREATE TABLE [Analytics].[QuerySchedule] (
    [Id]                    UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [QueryDefinitionId]     UNIQUEIDENTIFIER NOT NULL,
    [ScheduleName]          NVARCHAR(100)    NOT NULL,
    [CronExpression]        VARCHAR(100)     NOT NULL,       -- Cron schedule
    [TimeZone]              VARCHAR(50)      NOT NULL DEFAULT 'America/New_York',
    [Parameters]            NVARCHAR(MAX)    NULL,           -- JSON parameters for scheduled run
    [RetentionDays]         INT              NOT NULL DEFAULT 30,
    [MaxSnapshots]          INT              NOT NULL DEFAULT 10,
    [NotifyOnComplete]      BIT              NOT NULL DEFAULT 0,
    [NotifyOnFailure]       BIT              NOT NULL DEFAULT 1,
    [NotificationEmails]    NVARCHAR(MAX)    NULL,           -- JSON array of emails
    [IsEnabled]             BIT              NOT NULL DEFAULT 1,
    [LastRunDateTime]       DATETIME2        NULL,
    [NextRunDateTime]       DATETIME2        NULL,
    [CreatedBy]             UNIQUEIDENTIFIER NOT NULL,
    [CreatedDateTime]       DATETIME2        NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT [PK_QuerySchedule] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QuerySchedule_QueryDefinition]
        FOREIGN KEY ([QueryDefinitionId]) REFERENCES [Analytics].[QueryDefinition]([Id]) ON DELETE CASCADE
);

-- ============================================================================
-- Analytics.QueryAuditLog
-- Audit trail for all query operations
-- ============================================================================
CREATE TABLE [Analytics].[QueryAuditLog] (
    [Id]                    BIGINT IDENTITY(1,1) NOT NULL,
    [QueryDefinitionId]     UNIQUEIDENTIFIER NULL,
    [QuerySnapshotId]       UNIQUEIDENTIFIER NULL,
    [Action]                VARCHAR(50)      NOT NULL,       -- 'created', 'updated', 'executed', 'shared', etc.
    [ActionDetail]          NVARCHAR(MAX)    NULL,           -- JSON with details
    [UserId]                UNIQUEIDENTIFIER NOT NULL,
    [UserIpAddress]         VARCHAR(45)      NULL,
    [UserAgent]             VARCHAR(500)     NULL,
    [ActionDateTime]        DATETIME2        NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT [PK_QueryAuditLog] PRIMARY KEY ([Id])
);

CREATE INDEX [IX_QueryAuditLog_Definition] ON [Analytics].[QueryAuditLog]([QueryDefinitionId]);
CREATE INDEX [IX_QueryAuditLog_User] ON [Analytics].[QueryAuditLog]([UserId]);
CREATE INDEX [IX_QueryAuditLog_DateTime] ON [Analytics].[QueryAuditLog]([ActionDateTime] DESC);

-- ============================================================================
-- Analytics.QueryParameter
-- Reusable parameter definitions for queries
-- ============================================================================
CREATE TABLE [Analytics].[QueryParameter] (
    [Id]                    UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [QueryDefinitionId]     UNIQUEIDENTIFIER NOT NULL,
    [Name]                  VARCHAR(100)     NOT NULL,
    [DisplayName]           NVARCHAR(255)    NOT NULL,
    [Description]           NVARCHAR(500)    NULL,
    [DataType]              VARCHAR(50)      NOT NULL,       -- 'string', 'number', 'date', 'daterange', 'select', 'multiselect'
    [IsRequired]            BIT              NOT NULL DEFAULT 0,
    [DefaultValue]          NVARCHAR(MAX)    NULL,
    [ValidationRule]        NVARCHAR(MAX)    NULL,           -- JSON validation config
    [SelectOptions]         NVARCHAR(MAX)    NULL,           -- JSON for select/multiselect
    [SelectSourceQuery]     NVARCHAR(MAX)    NULL,           -- Dynamic options from query
    [Order]                 INT              NOT NULL DEFAULT 0,

    CONSTRAINT [PK_QueryParameter] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_QueryParameter_QueryDefinition]
        FOREIGN KEY ([QueryDefinitionId]) REFERENCES [Analytics].[QueryDefinition]([Id]) ON DELETE CASCADE,
    CONSTRAINT [CK_QueryParameter_DataType]
        CHECK ([DataType] IN ('string', 'number', 'boolean', 'date', 'datetime', 'daterange', 'select', 'multiselect'))
);
```

---

## Query Definition JSON Schema

### Semantic Query Definition

```json
{
  "$schema": "https://k12.seaa.nc.gov/schemas/query-definition/v1.json",
  "version": "1.0",
  "type": "semantic",
  "model": {
    "measures": [
      {
        "id": "enrollments_count",
        "name": "Enrollments.count",
        "displayName": "Total Enrollments",
        "aggregation": "count"
      },
      {
        "id": "awards_total",
        "name": "Awards.totalAmount",
        "displayName": "Total Award Amount",
        "aggregation": "sum",
        "format": "currency"
      }
    ],
    "dimensions": [
      {
        "id": "enrollment_status",
        "name": "Enrollments.status",
        "displayName": "Enrollment Status",
        "type": "string"
      },
      {
        "id": "school_name",
        "name": "Schools.name",
        "displayName": "School Name",
        "type": "string"
      },
      {
        "id": "created_date",
        "name": "Enrollments.createdDate",
        "displayName": "Created Date",
        "type": "time"
      }
    ],
    "filters": [
      {
        "dimension": "Enrollments.programId",
        "operator": "equals",
        "values": ["{{programId}}"]
      },
      {
        "dimension": "Enrollments.createdDate",
        "operator": "inDateRange",
        "values": ["{{dateRange}}"]
      }
    ],
    "timeDimensions": [
      {
        "dimension": "Enrollments.createdDate",
        "granularity": "{{granularity}}",
        "dateRange": "{{dateRange}}"
      }
    ],
    "order": {
      "Enrollments.count": "desc"
    },
    "limit": "{{limit}}"
  },
  "parameters": {
    "programId": {
      "type": "select",
      "required": true,
      "source": "query:enrollment_programs"
    },
    "dateRange": {
      "type": "daterange",
      "required": true,
      "default": "Last 30 days"
    },
    "granularity": {
      "type": "select",
      "options": ["day", "week", "month", "quarter", "year"],
      "default": "month"
    },
    "limit": {
      "type": "number",
      "default": 1000,
      "max": 50000
    }
  },
  "visualization": {
    "defaultType": "bar",
    "supportedTypes": ["bar", "line", "table", "pivot"],
    "pivotConfig": {
      "x": ["created_date"],
      "y": ["enrollments_count", "awards_total"],
      "fillMissingDates": true
    }
  }
}
```

### SQL Query Definition

```json
{
  "$schema": "https://k12.seaa.nc.gov/schemas/query-definition/v1.json",
  "version": "1.0",
  "type": "sql",
  "engine": "trino",
  "sql": {
    "query": "SELECT \n  e.status,\n  COUNT(*) as enrollment_count,\n  SUM(a.amount) as total_amount\nFROM k12.enrollment.application e\nLEFT JOIN k12.awards.allocation a ON e.id = a.application_id\nWHERE e.program_id = :programId\n  AND e.created_date >= :startDate\n  AND e.created_date <= :endDate\nGROUP BY e.status\nORDER BY enrollment_count DESC",
    "catalog": "k12",
    "schema": "enrollment"
  },
  "parameters": {
    "programId": {
      "type": "string",
      "required": true,
      "sqlType": "uuid"
    },
    "startDate": {
      "type": "date",
      "required": true
    },
    "endDate": {
      "type": "date",
      "required": true
    }
  },
  "columns": [
    { "name": "status", "type": "string", "displayName": "Status" },
    { "name": "enrollment_count", "type": "number", "displayName": "Count" },
    { "name": "total_amount", "type": "number", "displayName": "Amount", "format": "currency" }
  ]
}
```

---

## SDK Interface Design

### Core Interfaces

```csharp
namespace K12.QueryBuilder.SDK;

/// <summary>
/// Main entry point for the QueryBuilder SDK
/// </summary>
public interface IQueryBuilderService
{
    // === Query Definition Management ===

    /// <summary>
    /// Create a new query definition
    /// </summary>
    Task<QueryDefinition> CreateQueryDefinitionAsync(
        CreateQueryDefinitionRequest request,
        CancellationToken ct = default);

    /// <summary>
    /// Get a query definition by ID
    /// </summary>
    Task<QueryDefinition?> GetQueryDefinitionAsync(
        Guid id,
        CancellationToken ct = default);

    /// <summary>
    /// List query definitions accessible to the current user
    /// </summary>
    Task<PagedResult<QueryDefinitionSummary>> ListQueryDefinitionsAsync(
        QueryDefinitionFilter filter,
        PaginationRequest pagination,
        CancellationToken ct = default);

    /// <summary>
    /// Update an existing query definition
    /// </summary>
    Task<QueryDefinition> UpdateQueryDefinitionAsync(
        Guid id,
        UpdateQueryDefinitionRequest request,
        CancellationToken ct = default);

    /// <summary>
    /// Delete (soft) a query definition
    /// </summary>
    Task DeleteQueryDefinitionAsync(
        Guid id,
        CancellationToken ct = default);

    // === Query Sharing ===

    /// <summary>
    /// Share a query definition with users/roles/teams
    /// </summary>
    Task<QueryShare> ShareQueryDefinitionAsync(
        Guid queryDefinitionId,
        ShareQueryRequest request,
        CancellationToken ct = default);

    /// <summary>
    /// List shares for a query definition
    /// </summary>
    Task<IReadOnlyList<QueryShare>> GetQuerySharesAsync(
        Guid queryDefinitionId,
        CancellationToken ct = default);

    /// <summary>
    /// Revoke a share
    /// </summary>
    Task RevokeQueryShareAsync(
        Guid shareId,
        CancellationToken ct = default);

    // === Query Execution ===

    /// <summary>
    /// Execute a query and return results (may use cache)
    /// </summary>
    Task<QueryExecutionResult> ExecuteQueryAsync(
        Guid queryDefinitionId,
        ExecuteQueryRequest request,
        CancellationToken ct = default);

    /// <summary>
    /// Execute a query and create a named snapshot
    /// </summary>
    Task<QuerySnapshot> CreateSnapshotAsync(
        Guid queryDefinitionId,
        CreateSnapshotRequest request,
        CancellationToken ct = default);

    /// <summary>
    /// Get execution status for async queries
    /// </summary>
    Task<QueryExecutionStatus> GetExecutionStatusAsync(
        Guid snapshotId,
        CancellationToken ct = default);

    // === Snapshot Management ===

    /// <summary>
    /// List snapshots for a query definition
    /// </summary>
    Task<PagedResult<QuerySnapshotSummary>> ListSnapshotsAsync(
        Guid queryDefinitionId,
        SnapshotFilter filter,
        PaginationRequest pagination,
        CancellationToken ct = default);

    /// <summary>
    /// Get snapshot data
    /// </summary>
    Task<QuerySnapshotData> GetSnapshotDataAsync(
        Guid snapshotId,
        DataRetrievalOptions options,
        CancellationToken ct = default);

    /// <summary>
    /// Compare two snapshots
    /// </summary>
    Task<SnapshotComparison> CompareSnapshotsAsync(
        Guid snapshotId1,
        Guid snapshotId2,
        CancellationToken ct = default);

    // === Semantic Model ===

    /// <summary>
    /// Get available semantic model (dimensions, measures) for a program
    /// </summary>
    Task<SemanticModel> GetSemanticModelAsync(
        Guid? enrollmentProgramId = null,
        CancellationToken ct = default);

    /// <summary>
    /// Validate a query definition against the semantic model
    /// </summary>
    Task<QueryValidationResult> ValidateQueryDefinitionAsync(
        QueryDefinitionJson definition,
        CancellationToken ct = default);

    // === Scheduling ===

    /// <summary>
    /// Create a schedule for automatic query refresh
    /// </summary>
    Task<QuerySchedule> CreateScheduleAsync(
        Guid queryDefinitionId,
        CreateScheduleRequest request,
        CancellationToken ct = default);

    /// <summary>
    /// List schedules for a query
    /// </summary>
    Task<IReadOnlyList<QuerySchedule>> GetSchedulesAsync(
        Guid queryDefinitionId,
        CancellationToken ct = default);
}

/// <summary>
/// Pluggable query engine interface - implement for each backend
/// </summary>
public interface IQueryEngine
{
    /// <summary>
    /// Unique identifier for this engine
    /// </summary>
    string EngineId { get; }

    /// <summary>
    /// Display name
    /// </summary>
    string DisplayName { get; }

    /// <summary>
    /// Check if this engine can execute the given query type
    /// </summary>
    bool CanExecute(QueryDefinitionJson definition);

    /// <summary>
    /// Get the priority for this engine (higher = preferred)
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

/// <summary>
/// Query engine registry - manages available engines
/// </summary>
public interface IQueryEngineRegistry
{
    /// <summary>
    /// Register an engine
    /// </summary>
    void Register(IQueryEngine engine);

    /// <summary>
    /// Get all registered engines
    /// </summary>
    IReadOnlyList<IQueryEngine> GetEngines();

    /// <summary>
    /// Select the best engine for a query
    /// </summary>
    IQueryEngine SelectEngine(QueryDefinitionJson definition, string? preferredEngine = null);
}
```

### Request/Response Models

```csharp
namespace K12.QueryBuilder.SDK.Models;

public record CreateQueryDefinitionRequest
{
    public required string Name { get; init; }
    public string? Description { get; init; }
    public Guid? SemanticLayerId { get; init; }
    public Guid? EnrollmentProgramId { get; init; }
    public required QueryType QueryType { get; init; }
    public EnginePreference EnginePreference { get; init; } = EnginePreference.Auto;
    public required QueryDefinitionJson Definition { get; init; }
    public IDictionary<string, object>? DefaultParameters { get; init; }
    public IList<string>? Tags { get; init; }
    public bool IsTemplate { get; init; }
    public bool IsPublic { get; init; }
}

public record ExecuteQueryRequest
{
    public IDictionary<string, object>? Parameters { get; init; }
    public CacheStrategy CacheStrategy { get; init; } = CacheStrategy.PreferCache;
    public TimeSpan? MaxCacheAge { get; init; }
    public int? Limit { get; init; }
    public int? Offset { get; init; }
    public bool IncludeMetadata { get; init; } = true;
}

public record CreateSnapshotRequest
{
    public string? SnapshotName { get; init; }
    public IDictionary<string, object>? Parameters { get; init; }
    public TimeSpan? CacheDuration { get; init; }
    public bool WaitForCompletion { get; init; } = true;
    public TimeSpan? Timeout { get; init; }
}

public record QueryExecutionResult
{
    public required Guid ExecutionId { get; init; }
    public required ExecutionStatus Status { get; init; }
    public IReadOnlyList<IDictionary<string, object>>? Data { get; init; }
    public QueryMetadata? Metadata { get; init; }
    public PaginationInfo? Pagination { get; init; }
    public CacheInfo? CacheInfo { get; init; }
    public PerformanceInfo? Performance { get; init; }
    public string? ErrorMessage { get; init; }
}

public record QueryMetadata
{
    public IReadOnlyList<ColumnInfo> Columns { get; init; } = [];
    public long? TotalRowCount { get; init; }
    public string ExecutionEngine { get; init; } = "";
    public DateTime ExecutedAt { get; init; }
}

public record CacheInfo
{
    public bool FromCache { get; init; }
    public DateTime? CachedAt { get; init; }
    public DateTime? ExpiresAt { get; init; }
    public string? CacheKey { get; init; }
}

public record SemanticModel
{
    public Guid? SemanticLayerId { get; init; }
    public string Version { get; init; } = "";
    public IReadOnlyList<SemanticCube> Cubes { get; init; } = [];
}

public record SemanticCube
{
    public required string Name { get; init; }
    public string? DisplayName { get; init; }
    public string? Description { get; init; }
    public IReadOnlyList<SemanticMeasure> Measures { get; init; } = [];
    public IReadOnlyList<SemanticDimension> Dimensions { get; init; } = [];
}

public record SemanticMeasure
{
    public required string Name { get; init; }
    public string? DisplayName { get; init; }
    public string? Description { get; init; }
    public required string Type { get; init; }
    public string? Format { get; init; }
    public AggregationType Aggregation { get; init; }
}

public record SemanticDimension
{
    public required string Name { get; init; }
    public string? DisplayName { get; init; }
    public string? Description { get; init; }
    public required string Type { get; init; }
    public bool IsTimeDimension { get; init; }
    public IReadOnlyList<string>? SupportedGranularities { get; init; }
}

public enum QueryType { Semantic, Sql, Hybrid }
public enum EnginePreference { Auto, CubeJs, Trino, Dbt }
public enum CacheStrategy { NoCache, PreferCache, ForceRefresh, CacheOnly }
public enum ExecutionStatus { Pending, Running, Completed, Failed, Cancelled }
public enum AggregationType { Count, CountDistinct, Sum, Avg, Min, Max, RunningTotal }
```

---

## API Endpoints

### Query Definition Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/queries` | Create query definition |
| `GET` | `/api/v1/queries` | List query definitions |
| `GET` | `/api/v1/queries/{id}` | Get query definition |
| `PUT` | `/api/v1/queries/{id}` | Update query definition |
| `DELETE` | `/api/v1/queries/{id}` | Delete query definition |
| `POST` | `/api/v1/queries/{id}/duplicate` | Duplicate query |
| `GET` | `/api/v1/queries/{id}/versions` | List versions |
| `GET` | `/api/v1/queries/{id}/versions/{version}` | Get specific version |

### Query Execution Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/queries/{id}/execute` | Execute query |
| `POST` | `/api/v1/queries/{id}/snapshots` | Create snapshot |
| `GET` | `/api/v1/queries/{id}/snapshots` | List snapshots |
| `GET` | `/api/v1/snapshots/{id}` | Get snapshot |
| `GET` | `/api/v1/snapshots/{id}/data` | Get snapshot data |
| `GET` | `/api/v1/snapshots/{id}/status` | Get execution status |
| `POST` | `/api/v1/snapshots/{id}/cancel` | Cancel execution |
| `DELETE` | `/api/v1/snapshots/{id}` | Delete snapshot |

### Sharing Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/queries/{id}/shares` | Share query |
| `GET` | `/api/v1/queries/{id}/shares` | List shares |
| `DELETE` | `/api/v1/queries/{id}/shares/{shareId}` | Revoke share |
| `GET` | `/api/v1/queries/shared-with-me` | Queries shared with user |

### Semantic Model Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/semantic-model` | Get semantic model |
| `GET` | `/api/v1/semantic-model/cubes` | List available cubes |
| `GET` | `/api/v1/semantic-model/cubes/{name}` | Get cube details |
| `POST` | `/api/v1/semantic-model/validate` | Validate query definition |

### Schedule Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/queries/{id}/schedules` | Create schedule |
| `GET` | `/api/v1/queries/{id}/schedules` | List schedules |
| `PUT` | `/api/v1/schedules/{id}` | Update schedule |
| `DELETE` | `/api/v1/schedules/{id}` | Delete schedule |
| `POST` | `/api/v1/schedules/{id}/run` | Trigger manual run |

---

## Query Engine Adapters

### Cube.js Adapter

```csharp
public class CubeJsQueryEngine : IQueryEngine
{
    public string EngineId => "cubejs";
    public string DisplayName => "Cube.js Semantic Layer";

    public bool CanExecute(QueryDefinitionJson definition)
    {
        return definition.Type == "semantic" ||
               (definition.Type == "hybrid" && definition.Model != null);
    }

    public int GetPriority(QueryDefinitionJson definition)
    {
        // Prefer Cube.js for semantic queries (pre-aggregations, caching)
        return definition.Type == "semantic" ? 100 : 50;
    }

    public async Task<EngineExecutionResult> ExecuteAsync(
        QueryDefinitionJson definition,
        IDictionary<string, object> parameters,
        ExecutionOptions options,
        CancellationToken ct = default)
    {
        // Transform K12 semantic model to Cube.js query
        var cubeQuery = TransformToCubeQuery(definition, parameters);

        // Execute via Cube.js API
        var response = await _cubeClient.LoadAsync(cubeQuery, ct);

        // Transform response back to standard format
        return TransformFromCubeResponse(response);
    }
}
```

### Trino Adapter

```csharp
public class TrinoQueryEngine : IQueryEngine
{
    public string EngineId => "trino";
    public string DisplayName => "Trino SQL Engine";

    public bool CanExecute(QueryDefinitionJson definition)
    {
        return definition.Type == "sql" || definition.Type == "hybrid";
    }

    public int GetPriority(QueryDefinitionJson definition)
    {
        // Prefer Trino for raw SQL and complex joins
        return definition.Type == "sql" ? 100 : 30;
    }

    public async Task<EngineExecutionResult> ExecuteAsync(
        QueryDefinitionJson definition,
        IDictionary<string, object> parameters,
        ExecutionOptions options,
        CancellationToken ct = default)
    {
        // Build parameterized SQL
        var sql = BuildParameterizedSql(definition.Sql, parameters);

        // Execute via Trino
        var response = await _trinoClient.ExecuteAsync(sql, ct);

        return TransformFromTrinoResponse(response);
    }
}
```

### Future DBT Adapter (Placeholder)

```csharp
public class DbtQueryEngine : IQueryEngine
{
    public string EngineId => "dbt";
    public string DisplayName => "dbt Transformations";

    public bool CanExecute(QueryDefinitionJson definition)
    {
        // Can execute queries that reference dbt models
        return definition.Type == "sql" && definition.Sql?.Query?.Contains("ref(") == true;
    }

    public int GetPriority(QueryDefinitionJson definition)
    {
        // Lower priority - use when specifically requested
        return 20;
    }

    // Implementation for triggering dbt runs and reading materialized tables
}
```

---

## Integration with Brandon's DataMapper

The SDK bridges the existing SemanticLayer metadata with the query execution system:

```csharp
public class SemanticLayerService : ISemanticLayerService
{
    public async Task<SemanticModel> GetSemanticModelAsync(
        Guid? enrollmentProgramId,
        CancellationToken ct)
    {
        // Query Brandon's semantic layer tables
        var semanticLayer = await _repository.GetCurrentSemanticLayerAsync(
            enrollmentProgramId, ct);

        if (semanticLayer == null)
            return SemanticModel.Empty;

        // Load dimensions and measures
        var dimensions = await _repository.GetDimensionsAsync(semanticLayer.Id, ct);
        var measures = await _repository.GetMeasuresAsync(semanticLayer.Id, ct);

        // Build SemanticModel from existing metadata
        return new SemanticModel
        {
            SemanticLayerId = semanticLayer.Id,
            Version = semanticLayer.Version,
            Cubes = BuildCubes(dimensions, measures, semanticLayer)
        };
    }

    private IReadOnlyList<SemanticCube> BuildCubes(
        IEnumerable<Dimension> dimensions,
        IEnumerable<Measure> measures,
        SemanticLayer layer)
    {
        // Group by Entity (from Brandon's mapping)
        var entities = dimensions
            .Select(d => d.Entity)
            .Union(measures.Select(m => m.Entity))
            .Distinct();

        return entities.Select(entity => new SemanticCube
        {
            Name = entity,
            DisplayName = FormatDisplayName(entity),
            Measures = measures
                .Where(m => m.Entity == entity)
                .Select(MapToSemanticMeasure)
                .ToList(),
            Dimensions = dimensions
                .Where(d => d.Entity == entity)
                .Select(MapToSemanticDimension)
                .ToList()
        }).ToList();
    }

    private SemanticDimension MapToSemanticDimension(Dimension d)
    {
        return new SemanticDimension
        {
            Name = $"{d.Entity}.{d.Attribute}",
            DisplayName = d.Attribute,
            Type = MapValueType(d.ValueType),
            // Use PromptComponentKeyPath to link back to form structure
            SourceKeyPath = d.PromptComponentKeyPath
        };
    }
}
```

---

## Snapshot & Caching Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Snapshot Execution Flow                         │
└─────────────────────────────────────────────────────────────────────┘

     Execute Query Request
            │
            ▼
    ┌───────────────┐
    │ Check Cache   │
    │ (DataHash)    │
    └───────┬───────┘
            │
      ┌─────┴─────┐
      │ Hit?      │
      └─────┬─────┘
            │
    ┌───────┴───────┐
    │Yes            │No
    ▼               ▼
┌─────────┐   ┌─────────────┐
│ Return  │   │ Select      │
│ Cached  │   │ Engine      │
│ Result  │   │ (Auto/Pref) │
└─────────┘   └──────┬──────┘
                     │
              ┌──────▼──────┐
              │ Execute     │
              │ Query       │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │ Store       │
              │ Result      │
              └──────┬──────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌────────┐  ┌────────┐  ┌────────────┐
   │ Inline │  │ Blob   │  │ Cubestore  │
   │ (<1MB) │  │ (>1MB) │  │ (Cube.js)  │
   └────────┘  └────────┘  └────────────┘
```

### Cache Strategy

```csharp
public class SnapshotCacheService : ISnapshotCacheService
{
    public async Task<QuerySnapshotData?> GetCachedResultAsync(
        Guid queryDefinitionId,
        IDictionary<string, object> parameters,
        TimeSpan? maxAge,
        CancellationToken ct)
    {
        // Compute hash of query + parameters
        var dataHash = ComputeQueryHash(queryDefinitionId, parameters);

        // Look for existing snapshot with same hash
        var snapshot = await _repository.FindSnapshotByHashAsync(
            queryDefinitionId,
            dataHash,
            maxAge ?? TimeSpan.FromMinutes(60),
            ct);

        if (snapshot == null)
            return null;

        // Load data based on storage type
        return snapshot.ResultStorageType switch
        {
            "inline" => LoadInlineData(snapshot),
            "blob" => await LoadBlobDataAsync(snapshot, ct),
            "cubestore" => await LoadCubestoreDataAsync(snapshot, ct),
            _ => null
        };
    }
}
```

---

## Recommendations & Future Enhancements

> **Note:** See [ADR-009](./../../../adr/ADR-009-analytics-query-engine-abstraction.md), [ADR-010](./../../../adr/ADR-010-embedded-analytics-components.md), and [ADR-011](./../../../adr/ADR-011-azure-data-api-builder.md) for architectural decisions.

### Phase 1: Core SDK (Immediate)
- [ ] Implement `IQueryBuilderService` with basic CRUD
- [ ] Implement `CubeJsQueryEngine` adapter (ADR-009)
- [ ] Implement `TrinoQueryEngine` adapter (ADR-009)
- [ ] Create SQL schema in Analytics namespace
- [ ] Basic snapshot caching (inline storage)

### Phase 2: Advanced Features
- [ ] Visual query builder in Angular admin app (ADR-010)
- [ ] Query sharing and permissions
- [ ] Blob storage for large results
- [ ] Real-time execution status via SignalR
- [ ] Query scheduling with Azure Durable Functions
- [ ] Implement `DataApiBuilderEngine` as fallback (ADR-011)

### Phase 3: PostgreSQL-Enhanced Architecture
> This phase implements the recommended evolution path from [ADR-010 Option 6](./../../../adr/ADR-010-embedded-analytics-components.md#option-6-custom-angular--cubejs--postgresql-recommended-evolution).

- [ ] Deploy Azure PostgreSQL Flexible Server for pre-aggregated data
- [ ] Enable PostgreSQL extensions:
  - `pg_trgm` (fuzzy search for autocomplete)
  - `timescaledb` (time-series optimization)
  - `pgvector` (AI/semantic search)
- [ ] Implement Cube.js Semantic Layer Sync to PostgreSQL
- [ ] Add `PostgresQueryEngine` to IQueryEngine implementations
- [ ] Build custom Angular analytics components (see below)
- [ ] Implement dual data path: Cube.js (real-time) + PostgreSQL (historical)

### Phase 4: Data Pipeline Integration
- [ ] DBT adapter for transformations
- [ ] Incremental snapshot updates
- [ ] Data freshness indicators
- [ ] Automated cache invalidation
- [ ] Data lineage tracking

### Security Considerations
- [ ] Query-level RLS integration with existing security model
- [ ] Parameter value sanitization
- [ ] Audit logging for all operations
- [ ] Rate limiting per user/role
- [ ] SQL injection prevention for raw SQL mode

---

## PostgreSQL Engine (Phase 3)

### PostgresQueryEngine Implementation

```csharp
/// <summary>
/// Query engine that uses Azure PostgreSQL Flexible Server
/// for pre-aggregated analytics data.
/// </summary>
public class PostgresQueryEngine : IQueryEngine
{
    public string EngineId => "postgres";
    public string DisplayName => "PostgreSQL Analytics";

    private readonly NpgsqlDataSource _dataSource;
    private readonly ILogger<PostgresQueryEngine> _logger;

    public bool CanExecute(QueryDefinitionJson definition)
    {
        // PostgreSQL handles time-series and pre-aggregated queries
        return definition.QueryType is "timeseries" or "historical" or "search";
    }

    public int GetPriority(QueryDefinitionJson definition)
    {
        // Higher priority for time-series queries (TimescaleDB optimization)
        if (definition.QueryType == "timeseries") return 100;
        // Medium priority for historical queries
        if (definition.QueryType == "historical") return 75;
        // Lower priority for general queries (prefer Cube.js)
        return 25;
    }

    public async Task<EngineExecutionResult> ExecuteAsync(
        QueryDefinitionJson definition,
        IDictionary<string, object> parameters,
        ExecutionOptions options,
        CancellationToken ct = default)
    {
        await using var connection = await _dataSource.OpenConnectionAsync(ct);
        await using var cmd = connection.CreateCommand();

        // Build SQL based on query definition
        cmd.CommandText = BuildSqlFromDefinition(definition, parameters);
        cmd.CommandTimeout = (int)options.Timeout.TotalSeconds;

        var startTime = Stopwatch.GetTimestamp();
        var rows = new List<Dictionary<string, object>>();

        await using var reader = await cmd.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
        {
            var row = new Dictionary<string, object>();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                row[reader.GetName(i)] = reader.IsDBNull(i) ? null! : reader.GetValue(i);
            }
            rows.Add(row);
        }

        return new EngineExecutionResult
        {
            Success = true,
            Data = rows,
            RowCount = rows.Count,
            ExecutionTimeMs = Stopwatch.GetElapsedTime(startTime).TotalMilliseconds,
            EngineId = EngineId
        };
    }

    /// <summary>
    /// Time-series query using TimescaleDB functions
    /// </summary>
    public async Task<EngineExecutionResult> ExecuteTimeSeriesAsync(
        string hypertable,
        string timeColumn,
        string[] metrics,
        string interval,
        DateRange dateRange,
        CancellationToken ct = default)
    {
        var sql = $@"
            SELECT time_bucket('{interval}', {timeColumn}) AS bucket,
                   {string.Join(", ", metrics)}
            FROM {hypertable}
            WHERE {timeColumn} >= @startDate AND {timeColumn} < @endDate
            GROUP BY bucket
            ORDER BY bucket";

        // ... execute query
    }

    /// <summary>
    /// Fuzzy search using pg_trgm for autocomplete
    /// </summary>
    public async Task<IEnumerable<SearchResult>> SearchAsync(
        string table,
        string column,
        string searchTerm,
        int limit = 10,
        CancellationToken ct = default)
    {
        var sql = $@"
            SELECT *, similarity({column}, @term) AS score
            FROM {table}
            WHERE {column} % @term
            ORDER BY score DESC
            LIMIT @limit";

        // ... execute query
    }
}
```

### PostgreSQL Extensions Configuration

```sql
-- Enable required extensions on Azure PostgreSQL Flexible Server
CREATE EXTENSION IF NOT EXISTS pg_trgm;      -- Fuzzy text search
CREATE EXTENSION IF NOT EXISTS timescaledb;   -- Time-series optimization
CREATE EXTENSION IF NOT EXISTS pgvector;      -- Vector embeddings (AI)

-- Create hypertable for enrollment metrics
CREATE TABLE analytics.enrollment_metrics (
    created_at TIMESTAMPTZ NOT NULL,
    county VARCHAR(100),
    school_type VARCHAR(50),
    application_count INTEGER,
    approval_count INTEGER,
    total_award_amount DECIMAL(15,2)
);

SELECT create_hypertable('analytics.enrollment_metrics', 'created_at');

-- Create GIN index for trigram search
CREATE INDEX idx_dimension_name_trgm
ON analytics.dimensions
USING gin (display_name gin_trgm_ops);

-- Create vector index for semantic search (future AI features)
CREATE INDEX idx_query_embeddings
ON analytics.query_definitions
USING ivfflat (embedding vector_cosine_ops);
```

---

## Angular Analytics Components (ADR-010 Option 6)

### Component Architecture

The following Angular components mirror Metabase SDK patterns, enabling
Metabase-like functionality without Pro/Enterprise licensing:

| Component | Metabase Equivalent | Purpose |
|-----------|---------------------|---------|
| `K12InteractiveChartComponent` | `InteractiveQuestion` | Drill-through, filters |
| `K12StaticChartComponent` | `StaticQuestion` | Read-only charts |
| `K12QueryBuilderComponent` | Query Builder (`questionId="new"`) | Visual query construction |
| `K12FilterBarComponent` | Filter components | Dimension filters |
| `K12DrillMenuComponent` | `mapQuestionClickActions` | Custom drill-down |

See [ADR-010: Embedded Analytics Components](./../../../adr/ADR-010-embedded-analytics-components.md) for full implementation details.

---

## Related Documentation

### Internal Documentation
- [QueryBuilder Analytics Platform](Data-Platform.md)
- [System Architecture Overview](./../../README.md)
- Brandon's DataMapper Tables (external: k12-api-enrollment repo)
- [Hub and Spoke Security Model](https://cfi-nc.atlassian.net/wiki/spaces/KR/pages/4053696597)

### Architecture Decision Records
- [ADR-009: Analytics Query Engine Abstraction](./../../../adr/ADR-009-analytics-query-engine-abstraction.md)
- [ADR-010: Embedded Analytics Components](./../../../adr/ADR-010-embedded-analytics-components.md)
- [ADR-011: Azure Data API Builder](./../../../adr/ADR-011-azure-data-api-builder.md)

### External Resources
- [Azure PostgreSQL Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/overview)
- [TimescaleDB Documentation](https://docs.timescale.com/)
- [pg_trgm Extension](https://www.postgresql.org/docs/current/pgtrgm.html)
- [pgvector Extension](https://github.com/pgvector/pgvector)

---

*Last Updated: December 2025*
*Maintained by: K12 Architecture Team*
