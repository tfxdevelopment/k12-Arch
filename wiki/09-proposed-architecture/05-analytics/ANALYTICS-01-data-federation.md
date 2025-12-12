# ANALYTICS-01: Data Federation Strategy - K12 MyPortal Analytics Architecture

## Metadata
- **Status:** Draft
- **Date:** 2024-11-24
- **Related ADRs:** ADR-PROP-004 (Trino), ADR-PROP-005 (CubeJS), [ADR-009](../../adr/ADR-009-analytics-query-engine-abstraction.md), [ADR-010](../../adr/ADR-010-embedded-analytics-components.md), [ADR-011](../../adr/ADR-011-azure-data-api-builder.md)
- **Related Docs:** API-03 (Analytics APIs), [QueryBuilder SDK Design](../../02-architecture/integrations/QueryBuilder/SDK-Design.md)

## Executive Summary
Data federation strategy using **Trino** as the distributed SQL query engine to unify Azure SQL (transactional data), ADLS Gen2 (document metadata), and future data sources (Cosmos DB, external APIs) for K12 MyPortal analytics.

> **Update (December 2025):** This document is complemented by newer ADRs:
> - **ADR-009**: Introduces `IQueryEngine` abstraction allowing pluggable query engines (Cube.js, Trino, Data API Builder)
> - **ADR-010**: Defines embedded analytics component strategy with PostgreSQL-enhanced architecture (Option 6)
> - **ADR-011**: Documents Azure Data API Builder as a zero-code fallback engine

## Problem Statement

### Current Analytics Pain Points
1. **No Unified View:** Data scattered across Azure SQL (95K applications), ADLS Gen2 (2M documents), separate systems
2. **Manual Reporting:** 20 hours/week spent writing custom SQL queries for executive dashboards
3. **Performance Issues:** Complex joins across 15 tables cause 30+ second query times
4. **Data Silos:** Cannot correlate enrollment data with document metadata or external data (ClassWallet balances)

### Business Requirements
1. **Executive Dashboards:** Real-time enrollment metrics, approval rates, fund utilization
2. **Compliance Reporting:** FERPA-compliant audit reports, financial reconciliation
3. **Operational Analytics:** Provider performance, school district trends, household demographics
4. **Ad-Hoc Queries:** Self-service analytics for SEAA administrators

---

## Solution: Trino Data Federation

### Why Trino?
- **Distributed SQL:** Query across heterogeneous data sources with single SQL statement
- **Performance:** MPP (Massively Parallel Processing) architecture, sub-second queries on billions of rows
- **Cost-Effective:** Self-hosted on Container Apps ($960/month vs $1,500 for Azure Synapse)
- **Flexibility:** 40+ connector types (SQL Server, Parquet, Delta Lake, REST APIs, etc.)

### Architecture Overview
```
┌───────────────────────────────────────────────────────────────┐
│ Analytics Clients                                             │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│ │ CubeJS      │  │ Power BI    │  │ Jupyter     │            │
│ │ (Dashboards)│  │ (Ad-Hoc)    │  │ Notebooks   │            │
│ └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
└────────┼─────────────────┼─────────────────┼──────────────────┘
         │                 │                 │
         └─────────────────┴─────────────────┘
                           │
                  ┌────────▼────────┐
                  │ Trino Cluster   │
                  │ (Container App) │
                  │ - Coordinator   │
                  │ - Workers (4x)  │
                  └────────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────▼─────┐    ┌──────▼──────┐    ┌─────▼──────┐
  │ Catalog 1 │    │ Catalog 2   │    │ Catalog 3  │
  │ (Azure    │    │ (ADLS Gen2) │    │ (Cosmos DB)│
  │  SQL)     │    │ (Hive       │    │ (MongoDB   │
  │           │    │  Metastore) │    │  Connector)│
  └─────┬─────┘    └──────┬──────┘    └─────┬──────┘
        │                  │                  │
  ┌─────▼──────┐   ┌──────▼────────┐   ┌────▼──────┐
  │ SQL Server │   │ Data Lake     │   │ Cosmos DB │
  │ K12Portal  │   │ Documents     │   │ (Future)  │
  │ Database   │   │ Metadata      │   │           │
  └────────────┘   └───────────────┘   └───────────┘
```

---

## Trino Deployment on Container Apps

### Container App Configuration
```yaml
apiVersion: apps/v1
kind: ContainerApp
metadata:
  name: k12-trino
spec:
  configuration:
    ingress:
      external: false  # Internal only (accessed via Dapr)
      targetPort: 8080
      traffic:
        - latestRevision: true
          weight: 100
  template:
    containers:
      - name: trino-coordinator
        image: trinodb/trino:latest
        env:
          - name: TRINO_DISCOVERY_URI
            value: http://localhost:8080
        resources:
          cpu: 4
          memory: 8Gi
        volumeMounts:
          - name: trino-config
            mountPath: /etc/trino
    scale:
      minReplicas: 2   # Always available
      maxReplicas: 10  # Scale for heavy analytics workload
    volumes:
      - name: trino-config
        secret:
          secretName: trino-catalogs
```

**Cost:** $960/month (4 vCPU × 8 GB × 2 replicas × $0.000012/vCPU/sec)

---

## Catalog Configuration

### Catalog 1: Azure SQL (Transactional Data)

**File:** `/etc/trino/catalog/sqlserver.properties`
```properties
connector.name=sqlserver
connection-url=jdbc:sqlserver://k12-sql-failover.database.windows.net:1433;database=K12Portal;encrypt=true
connection-user=${ENV:SQL_USER}
connection-password=${ENV:SQL_PASSWORD}

# Performance tuning
sqlserver.bulk-copy-for-write.enabled=true
sqlserver.snapshot-isolation.enabled=true
sqlserver.domain-compaction-threshold=100
```

**Tables Exposed:**
- `Enrollment.Applications`
- `Enrollment.Students`
- `Households.Members`
- `Awards.Allocations`
- `Awards.Disbursements`
- `Comms.EmailLog`
- `dbo.UserResourceAccessMap` (for reference only - claims-based auth used instead)

**Example Query:**
```sql
-- Query Azure SQL via Trino
SELECT
    school_code,
    COUNT(*) as application_count,
    SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved_count,
    CAST(SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS DOUBLE) / COUNT(*) * 100 as approval_rate
FROM sqlserver.Enrollment.Applications
WHERE application_submitted_date >= DATE '2024-01-01'
GROUP BY school_code
ORDER BY application_count DESC;
```

### Catalog 2: ADLS Gen2 (Document Metadata)

**File:** `/etc/trino/catalog/hive.properties`
```properties
connector.name=hive
hive.metastore=thrift
hive.metastore.uri=thrift://hive-metastore:9083

# Azure Data Lake Gen2 configuration
hive.azure.abfs.storage-account=k12docsstg.dfs.core.windows.net
hive.azure.abfs.auth-type=OAuth
hive.azure.abfs.oauth-client-id=${ENV:AZURE_CLIENT_ID}
hive.azure.abfs.oauth-client-secret=${ENV:AZURE_CLIENT_SECRET}
hive.azure.abfs.oauth-endpoint=https://login.microsoftonline.com/${ENV:TENANT_ID}/oauth2/token

# Parquet optimization
hive.parquet.use-column-names=true
hive.parquet.optimized-reader.enabled=true
```

**Hive Metastore Setup:**
```sql
-- Create external table pointing to ADLS Gen2 Parquet files
CREATE EXTERNAL TABLE hive.k12.documents (
    document_id BIGINT,
    application_id INT,
    student_id INT,
    document_type VARCHAR(50),
    file_name VARCHAR(255),
    file_size_bytes BIGINT,
    upload_date TIMESTAMP,
    uploader_user_id INT,
    storage_path VARCHAR(500),
    content_type VARCHAR(100)
)
STORED AS PARQUET
LOCATION 'abfss://documents@k12docsstg.dfs.core.windows.net/metadata/';
```

**How Document Metadata Gets to ADLS:**
```csharp
// When document uploaded, write metadata to Parquet (Functions code)
public async Task OnDocumentUploaded(DocumentMetadata doc)
{
    // 1. Upload file to ADLS Gen2 (existing code)
    await _blobClient.UploadAsync(doc.Stream, ...);

    // 2. NEW: Append metadata to Parquet file (batch writes every 1000 docs)
    var parquetWriter = new ParquetWriter("documents-metadata-2024-11.parquet");
    parquetWriter.WriteRow(new {
        DocumentId = doc.Id,
        ApplicationId = doc.ApplicationId,
        StudentId = doc.StudentId,
        DocumentType = doc.Type,
        FileName = doc.FileName,
        FileSizeBytes = doc.Size,
        UploadDate = DateTime.UtcNow,
        UploaderUserId = doc.UserId,
        StoragePath = doc.BlobPath,
        ContentType = doc.ContentType
    });
}
```

**Example Federated Query (SQL + ADLS):**
```sql
-- Join Azure SQL applications with ADLS document metadata
WITH app_docs AS (
    SELECT
        a.application_id,
        a.student_id,
        a.status,
        COUNT(d.document_id) as document_count,
        SUM(d.file_size_bytes) / 1024 / 1024 as total_mb
    FROM sqlserver.Enrollment.Applications a
    LEFT JOIN hive.k12.documents d ON a.application_id = d.application_id
    WHERE a.application_submitted_date >= DATE '2024-01-01'
    GROUP BY a.application_id, a.student_id, a.status
)
SELECT
    status,
    COUNT(*) as application_count,
    AVG(document_count) as avg_docs_per_app,
    AVG(total_mb) as avg_mb_per_app
FROM app_docs
GROUP BY status;
```

**Performance:** 95K applications × 2M documents = <3 seconds (Trino parallelizes across 4 workers)

### Catalog 3: Cosmos DB (Future - ClassWallet Integration)

**File:** `/etc/trino/catalog/mongodb.properties`
```properties
connector.name=mongodb
mongodb.connection-url=mongodb://k12-cosmos:${ENV:COSMOS_KEY}@k12-cosmos.mongo.cosmos.azure.com:10255/?ssl=true

# Schema inference
mongodb.schema-collection=_schema
mongodb.case-insensitive-name-matching=true
```

**Use Case:** Replicate ClassWallet account balances to Cosmos DB for real-time analytics

**Example Query:**
```sql
-- Join SQL awards with Cosmos DB live balances
SELECT
    a.award_id,
    a.student_id,
    a.allocated_amount,
    c.current_balance,
    (a.allocated_amount - c.current_balance) as spent_amount
FROM sqlserver.Awards.Allocations a
INNER JOIN mongodb.k12.classwallet_balances c ON a.external_account_id = c.account_id
WHERE c.last_updated >= CURRENT_TIMESTAMP - INTERVAL '1' HOUR;
```

---

## Query Performance Optimization

### 1. Predicate Pushdown
Trino automatically pushes filters to source systems (reduce data transferred):

```sql
-- BAD: Trino scans all 95K rows, then filters
SELECT * FROM sqlserver.Enrollment.Applications
WHERE application_submitted_date >= DATE '2024-01-01';

-- GOOD: Trino pushes filter to SQL Server (SQL does the filtering)
-- Same query, but Trino optimizer pushes predicate
-- SQL Server only returns ~15K rows (vs 95K)
```

**Performance:** 95K rows scanned → 15K rows transferred = **84% less network traffic**

### 2. Partitioning (ADLS Gen2 Data)
```sql
-- Partition Parquet files by year/month for faster queries
CREATE EXTERNAL TABLE hive.k12.documents (
    document_id BIGINT,
    application_id INT,
    ...
)
PARTITIONED BY (year INT, month INT)
STORED AS PARQUET
LOCATION 'abfss://documents@k12docsstg.dfs.core.windows.net/metadata/';

-- Query only scans November 2024 partition (vs all 2M documents)
SELECT COUNT(*)
FROM hive.k12.documents
WHERE year = 2024 AND month = 11;
```

**Performance:** 2M documents → 167K documents scanned = **91% faster**

### 3. Columnar Storage (Parquet)
Parquet stores data by column (not row), enabling efficient queries:

```sql
-- Only reads 2 columns (document_type, file_size_bytes) instead of all 10
SELECT document_type, AVG(file_size_bytes) / 1024 / 1024 as avg_mb
FROM hive.k12.documents
GROUP BY document_type;
```

**Performance:** 500 MB (all columns) → 50 MB (2 columns) = **90% less I/O**

### 4. Trino Query Tuning
```sql
-- Enable adaptive query execution (auto-tunes join strategy)
SET SESSION optimizer_use_histograms = true;
SET SESSION join_reordering_strategy = 'AUTOMATIC';

-- Use distributed joins for large-large table joins
SET SESSION join_distribution_type = 'PARTITIONED';  -- Default for >1M rows

-- Use broadcast joins for small-large table joins
SET SESSION join_distribution_type = 'BROADCAST';  -- Faster for <10K rows
```

---

## Security & Compliance

### 1. Claims-Based Security in Federated Queries

**Approach:** Claims-based filtering in CubeJS layer (NOT database RLS)

**Why:** Trino connects to SQL using service account (no user context), so authorization happens in application layer

**Solution:** CubeJS applies JWT claims filtering before executing Trino queries

```javascript
// CubeJS security context from validated JWT token (Entra ID)
cube(`EnrollmentApplications`, {
  sql: `SELECT * FROM trino.sqlserver.enrollment.applications`,

  // Claims-based security: Filter based on JWT token claims
  dataSource: ({ securityContext }) => {
    const role = securityContext.role;
    const studentIds = securityContext.studentIds || [];

    if (role === 'Admin') {
      return `SELECT * FROM trino.sqlserver.enrollment.applications`;  // See all
    } else if (role === 'Household') {
      return `
        SELECT * FROM trino.sqlserver.enrollment.applications
        WHERE student_id IN (${studentIds.join(',')})  // Filter by claims
      `;
    } else if (role === 'Provider') {
      const providerId = securityContext.providerId;
      return `
        SELECT * FROM trino.sqlserver.enrollment.applications
        WHERE provider_id = ${providerId}  // Filter by provider claim
      `;
    }

    return `SELECT * FROM trino.sqlserver.enrollment.applications WHERE 1=0`; // No access
  }
});
```

**Benefits:**
- ✅ No SQL session context required
- ✅ Works with all Trino connectors (SQL Server, ADLS Gen2, Cosmos DB)
- ✅ Filtering logic in one place (CubeJS security context)
- ✅ Testable with mock JWT tokens

### 2. Encryption & Compliance
- **In-Transit:** TLS 1.3 for all Trino connections (client → coordinator, coordinator → workers)
- **At-Rest:** Azure SQL (TDE), ADLS Gen2 (SSE), Cosmos DB (SSE)
- **FERPA Compliance:** No PII in Trino logs (query text masked)

---

## Monitoring & Observability

### Trino Query Monitoring
```sql
-- Query performance dashboard (Trino system tables)
SELECT
    query_id,
    user,
    source,
    state,
    queued_time_ms,
    analysis_time_ms,
    execution_time_ms,
    total_memory_reservation,
    total_cpu_time_ms,
    total_split_count
FROM system.runtime.queries
WHERE state = 'FINISHED'
  AND execution_time_ms > 5000  -- Slow queries (>5 seconds)
ORDER BY execution_time_ms DESC;
```

**Alerts:**
- CRITICAL: Query execution >30 seconds (potential missing index or bad join)
- WARNING: Memory usage >75% (scale up workers)
- INFO: Query count >1000/hour (high usage, validate caching strategy)

### Application Insights Integration
```csharp
// Log Trino queries to Application Insights
public class TrinoTelemetry : ITrinoTelemetry
{
    private readonly TelemetryClient _telemetry;

    public async Task LogQuery(TrinoQuery query)
    {
        _telemetry.TrackDependency(new DependencyTelemetry
        {
            Type = "Trino",
            Name = query.QueryText.Substring(0, 100),  // First 100 chars
            Duration = query.ExecutionTime,
            Success = query.State == "FINISHED",
            Data = query.QueryId
        });
    }
}
```

---

## Migration Path

### Phase 1 (Week 3-4): Setup Trino Infrastructure
1. Deploy Trino cluster on Container Apps (2 replicas)
2. Configure Azure SQL catalog
3. Test basic queries (enrollment stats, approval rates)

### Phase 2 (Week 5-6): ADLS Gen2 Integration
1. Set up Hive Metastore (containerized)
2. Create Parquet metadata export (document upload events)
3. Backfill historical document metadata (2M documents)
4. Test federated queries (SQL + ADLS joins)

### Phase 3 (Week 7-8): CubeJS Integration
1. Connect CubeJS to Trino (see ANALYTICS-02)
2. Create 10 data models with RLS
3. Build executive dashboards (enrollment, awards, compliance)

### Phase 4 (Month 3-6): Advanced Features
1. Add Cosmos DB catalog (ClassWallet balances)
2. Implement query result caching (Redis)
3. Add external data sources (NC DPI, DMV/DOR via REST connector)

---

## Production Queries (Examples)

### Query 1: Enrollment Funnel Analysis
```sql
-- Track application progress through enrollment funnel
WITH funnel AS (
    SELECT
        DATE_TRUNC('week', application_submitted_date) as week,
        COUNT(*) as started,
        COUNT(CASE WHEN status = 'DocumentsUploaded' THEN 1 END) as docs_uploaded,
        COUNT(CASE WHEN status = 'UnderReview' THEN 1 END) as under_review,
        COUNT(CASE WHEN status = 'Approved' THEN 1 END) as approved
    FROM sqlserver.Enrollment.Applications
    WHERE application_submitted_date >= DATE '2024-01-01'
    GROUP BY DATE_TRUNC('week', application_submitted_date)
)
SELECT
    week,
    started,
    docs_uploaded,
    CAST(docs_uploaded AS DOUBLE) / started * 100 as docs_uploaded_pct,
    under_review,
    CAST(under_review AS DOUBLE) / started * 100 as under_review_pct,
    approved,
    CAST(approved AS DOUBLE) / started * 100 as approval_rate
FROM funnel
ORDER BY week;
```

### Query 2: Provider Performance Scorecard
```sql
-- Rank providers by approval rate, avg processing time
WITH provider_metrics AS (
    SELECT
        p.provider_id,
        p.provider_name,
        COUNT(s.student_id) as student_count,
        COUNT(a.application_id) as application_count,
        SUM(CASE WHEN a.status = 'Approved' THEN 1 ELSE 0 END) as approved_count,
        AVG(DATE_DIFF('day', a.application_submitted_date, a.decision_date)) as avg_days_to_decision
    FROM sqlserver.Providers.Organizations p
    INNER JOIN sqlserver.Enrollment.Students s ON p.provider_id = s.provider_id
    INNER JOIN sqlserver.Enrollment.Applications a ON s.student_id = a.student_id
    WHERE a.application_submitted_date >= DATE '2024-01-01'
    GROUP BY p.provider_id, p.provider_name
)
SELECT
    provider_name,
    student_count,
    application_count,
    approved_count,
    CAST(approved_count AS DOUBLE) / application_count * 100 as approval_rate,
    avg_days_to_decision,
    RANK() OVER (ORDER BY CAST(approved_count AS DOUBLE) / application_count DESC) as approval_rank
FROM provider_metrics
ORDER BY approval_rate DESC;
```

### Query 3: Document Compliance Report
```sql
-- Identify applications with missing required documents
WITH required_docs AS (
    SELECT DISTINCT document_type
    FROM sqlserver.Enrollment.RequiredDocuments
),
app_docs AS (
    SELECT
        a.application_id,
        a.student_id,
        a.status,
        rd.document_type as required_doc,
        d.document_type as uploaded_doc
    FROM sqlserver.Enrollment.Applications a
    CROSS JOIN required_docs rd
    LEFT JOIN hive.k12.documents d ON a.application_id = d.application_id AND rd.document_type = d.document_type
    WHERE a.application_submitted_date >= DATE '2024-01-01'
)
SELECT
    application_id,
    student_id,
    status,
    COUNT(*) as total_required,
    COUNT(uploaded_doc) as uploaded_count,
    (COUNT(*) - COUNT(uploaded_doc)) as missing_count,
    ARRAY_AGG(CASE WHEN uploaded_doc IS NULL THEN required_doc END) as missing_docs
FROM app_docs
GROUP BY application_id, student_id, status
HAVING COUNT(uploaded_doc) < COUNT(*)
ORDER BY missing_count DESC;
```

### Query 4: Fund Utilization Dashboard
```sql
-- Real-time fund allocation vs spending (requires Cosmos DB catalog)
WITH fund_metrics AS (
    SELECT
        s.student_id,
        s.student_name,
        a.award_id,
        a.allocated_amount,
        c.current_balance,
        c.last_transaction_date,
        (a.allocated_amount - c.current_balance) as spent_amount,
        CAST((a.allocated_amount - c.current_balance) AS DOUBLE) / a.allocated_amount * 100 as utilization_pct
    FROM sqlserver.Awards.Allocations a
    INNER JOIN sqlserver.Enrollment.Students s ON a.student_id = s.student_id
    LEFT JOIN mongodb.k12.classwallet_balances c ON a.external_account_id = c.account_id
    WHERE a.award_year = 2024
)
SELECT
    COUNT(*) as total_awards,
    SUM(allocated_amount) as total_allocated,
    SUM(spent_amount) as total_spent,
    SUM(current_balance) as total_remaining,
    AVG(utilization_pct) as avg_utilization_pct,
    COUNT(CASE WHEN utilization_pct < 25 THEN 1 END) as low_utilization_count,
    COUNT(CASE WHEN utilization_pct > 90 THEN 1 END) as high_utilization_count
FROM fund_metrics;
```

### Query 5: Multi-Source Audit Trail
```sql
-- Comprehensive audit trail combining SQL, ADLS, and email logs
SELECT
    a.application_id,
    a.student_id,
    a.status,
    a.application_submitted_date,
    d.document_type,
    d.upload_date,
    d.uploader_user_id,
    e.email_type,
    e.sent_date,
    e.recipient_email
FROM sqlserver.Enrollment.Applications a
LEFT JOIN hive.k12.documents d ON a.application_id = d.application_id
LEFT JOIN sqlserver.Comms.EmailLog e ON a.application_id = e.application_id
WHERE a.application_submitted_date >= DATE '2024-11-01'
ORDER BY a.application_id, d.upload_date, e.sent_date;
```

---

## Cost Analysis

| Component | Monthly Cost | Notes |
|-----------|--------------|-------|
| **Trino Coordinator** | $480 | 4 vCPU × 8 GB × 1 replica |
| **Trino Workers** | $480 | 4 vCPU × 8 GB × 1 replica (scale to 10 max) |
| **Hive Metastore** | $120 | 2 vCPU × 4 GB × 1 replica |
| **ADLS Gen2 Storage** | Included | Already paying for document storage |
| **TOTAL** | **$1,080** | **vs $1,500 for Azure Synapse** |

**Savings:** $420/month = $5,040/year

### Cost Optimization Strategies
1. **Auto-scale workers:** Scale down to 1 replica during off-peak hours (6pm-6am) = 20% savings
2. **Query result caching:** Reduce redundant queries by 40% with Redis cache
3. **Spot instances:** Use Azure Spot VMs for non-critical analytics workloads = 50-80% savings

---

## Troubleshooting

### Common Issues

#### Issue 1: Slow Queries (>30 seconds)
**Symptoms:** Trino queries timing out or taking excessive time

**Diagnosis:**
```sql
-- Check query execution plan
EXPLAIN (TYPE DISTRIBUTED)
SELECT * FROM sqlserver.Enrollment.Applications a
JOIN hive.k12.documents d ON a.application_id = d.application_id;
```

**Solutions:**
1. Add indexes to Azure SQL tables (check missing index DMVs)
2. Partition ADLS Gen2 Parquet files by date
3. Increase Trino worker count (scale to 4-6 replicas)
4. Enable query result caching in CubeJS

#### Issue 2: Memory Errors
**Symptoms:** `Query exceeded per-node memory limit of 8GB`

**Solutions:**
```properties
# Increase memory per query (/etc/trino/config.properties)
query.max-memory-per-node=12GB
query.max-total-memory-per-node=16GB

# Enable spill to disk for large joins
spill-enabled=true
spill-path=/tmp/trino-spill
```

#### Issue 3: Connection Timeouts (Azure SQL)
**Symptoms:** `Connection refused` or `Connection timeout`

**Solutions:**
1. Check Azure SQL firewall rules (allow Container Apps subnet)
2. Verify service account credentials in Key Vault
3. Enable connection pooling:
```properties
# /etc/trino/catalog/sqlserver.properties
sqlserver.connection-pool.max-size=100
sqlserver.connection-pool.min-size=10
```

---

## Testing Strategy

### Unit Tests (Trino Queries)
```sql
-- Test 1: Verify Azure SQL catalog connectivity
SELECT COUNT(*) FROM sqlserver.Enrollment.Applications;
-- Expected: 95000+ rows

-- Test 2: Verify ADLS Gen2 catalog connectivity
SELECT COUNT(*) FROM hive.k12.documents;
-- Expected: 2000000+ rows

-- Test 3: Verify federated join performance
SELECT COUNT(*)
FROM sqlserver.Enrollment.Applications a
JOIN hive.k12.documents d ON a.application_id = d.application_id;
-- Expected: <5 seconds execution time

-- Test 4: Verify RLS enforcement (run as household user)
SELECT COUNT(*) FROM sqlserver.Enrollment.Applications;
-- Expected: Only applications for user's students (not all 95K)
```

### Integration Tests
```csharp
// Test Trino query execution from C# API
[Test]
public async Task Trino_ExecuteQuery_ReturnsResults()
{
    var trinoClient = new TrinoClient("http://k12-trino:8080");
    var query = "SELECT COUNT(*) as app_count FROM sqlserver.Enrollment.Applications";

    var result = await trinoClient.ExecuteQueryAsync(query);

    Assert.IsNotNull(result);
    Assert.IsTrue(result.Rows.Count > 0);
    Assert.IsTrue((int)result.Rows[0]["app_count"] > 95000);
}
```

### Load Tests
```bash
# Apache Bench - 1000 concurrent queries
ab -n 1000 -c 100 -T 'application/json' \
  -p query.json \
  http://k12-trino:8080/v1/statement

# Expected:
# - P95 latency <5 seconds
# - 0% error rate
# - CPU usage <80%
```

---

## References

### Documentation
- [Trino Documentation](https://trino.io/docs/current/)
- [Trino SQL Server Connector](https://trino.io/docs/current/connector/sqlserver.html)
- [Trino Hive Connector](https://trino.io/docs/current/connector/hive.html)
- [Trino on Container Apps](https://learn.microsoft.com/azure/container-apps/tutorial-deploy-first-app)
- [Hive Metastore with ADLS Gen2](https://docs.delta.io/latest/delta-hive-metastore.html)
- [Parquet File Format](https://parquet.apache.org/docs/)

### Related K12 Documents
- [ADR-PROP-004: Trino for Data Federation](../07-adr-proposed/ADR-PROP-004-trino.md)
- [API-03: Analytics APIs](../03-hybrid-api/API-03-analytics-apis.md)
- [ANALYTICS-02: Semantic Layer Design](./ANALYTICS-02-semantic-layer.md)
- [ANALYTICS-03: Dashboard Architecture](./ANALYTICS-03-dashboard-architecture.md)

### External Resources
- [Trino GitHub Repository](https://github.com/trinodb/trino)
- [Presto to Trino Migration Guide](https://trino.io/blog/2020/12/27/announcing-trino.html)
- [Azure Container Apps Best Practices](https://learn.microsoft.com/azure/container-apps/plans)

---

## Appendix

### A. Trino Configuration Files

#### `/etc/trino/config.properties`
```properties
coordinator=true
node-scheduler.include-coordinator=false
http-server.http.port=8080
query.max-memory=50GB
query.max-memory-per-node=8GB
query.max-total-memory-per-node=10GB
discovery.uri=http://localhost:8080
```

#### `/etc/trino/jvm.config`
```
-server
-Xmx16G
-XX:+UseG1GC
-XX:G1HeapRegionSize=32M
-XX:+UseGCOverheadLimit
-XX:+ExplicitGCInvokesConcurrent
-XX:+HeapDumpOnOutOfMemoryError
-XX:+ExitOnOutOfMemoryError
```

#### `/etc/trino/node.properties`
```properties
node.environment=production
node.id=k12-trino-coordinator-001
node.data-dir=/data/trino
```

### B. Sample Terraform Configuration

```hcl
resource "azurerm_container_app" "trino" {
  name                         = "k12-trino"
  container_app_environment_id = azurerm_container_app_environment.k12.id
  resource_group_name          = azurerm_resource_group.k12.name
  revision_mode                = "Single"

  template {
    container {
      name   = "trino-coordinator"
      image  = "trinodb/trino:latest"
      cpu    = 4
      memory = "8Gi"

      env {
        name  = "TRINO_DISCOVERY_URI"
        value = "http://localhost:8080"
      }

      volume_mounts {
        name = "trino-config"
        path = "/etc/trino"
      }
    }

    min_replicas = 2
    max_replicas = 10

    volume {
      name         = "trino-config"
      storage_type = "Secret"
      storage_name = azurerm_container_app_environment_storage.trino_config.name
    }
  }

  ingress {
    external_enabled = false
    target_port      = 8080

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }
}
```

### C. Parquet File Writer (.NET 8)

```csharp
using Parquet;
using Parquet.Data;

public class DocumentMetadataWriter
{
    private readonly string _outputPath;
    private List<DocumentMetadata> _buffer = new();
    private const int BATCH_SIZE = 1000;

    public async Task WriteMetadataAsync(DocumentMetadata doc)
    {
        _buffer.Add(doc);

        if (_buffer.Count >= BATCH_SIZE)
        {
            await FlushAsync();
        }
    }

    private async Task FlushAsync()
    {
        var schema = new ParquetSchema(
            new DataField<long>("document_id"),
            new DataField<int>("application_id"),
            new DataField<int>("student_id"),
            new DataField<string>("document_type"),
            new DataField<string>("file_name"),
            new DataField<long>("file_size_bytes"),
            new DataField<DateTimeOffset>("upload_date"),
            new DataField<int>("uploader_user_id"),
            new DataField<string>("storage_path"),
            new DataField<string>("content_type")
        );

        var fileName = $"documents-metadata-{DateTime.UtcNow:yyyy-MM-dd-HHmmss}.parquet";
        var filePath = Path.Combine(_outputPath, fileName);

        using var stream = File.Create(filePath);
        using var writer = await ParquetWriter.CreateAsync(schema, stream);

        using var groupWriter = writer.CreateRowGroup();

        await groupWriter.WriteColumnAsync(new DataColumn(
            schema.DataFields[0],
            _buffer.Select(d => d.DocumentId).ToArray()
        ));

        await groupWriter.WriteColumnAsync(new DataColumn(
            schema.DataFields[1],
            _buffer.Select(d => d.ApplicationId).ToArray()
        ));

        // ... write remaining columns

        _buffer.Clear();
    }
}
```

---

**Document Status:** Complete
**Last Updated:** 2024-11-24
**Next Review:** After Phase 1 deployment (Week 4)
**Owner:** CFI Architecture Team
**Version:** 1.0
