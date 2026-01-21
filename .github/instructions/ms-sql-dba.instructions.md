---
description: "Instructions for MS SQL Server database administration tasks"
applyTo: "**/*.sql"
---

# MS SQL Server DBA Instructions

Use these instructions when working with Microsoft SQL Server databases.

## Query Optimization

### Index Strategy

```sql
-- Create covering index for frequently queried columns
CREATE INDEX IX_TableName_Column1_Column2
ON dbo.TableName (Column1, Column2)
INCLUDE (Column3, Column4);

-- Check index usage
SELECT 
    OBJECT_NAME(s.object_id) AS TableName,
    i.name AS IndexName,
    s.user_seeks,
    s.user_scans,
    s.user_lookups,
    s.user_updates
FROM sys.dm_db_index_usage_stats s
JOIN sys.indexes i ON s.object_id = i.object_id AND s.index_id = i.index_id
WHERE OBJECTPROPERTY(s.object_id, 'IsUserTable') = 1;
```

### Query Analysis

```sql
-- Find missing indexes
SELECT 
    mig.index_group_handle,
    mid.index_handle,
    migs.avg_total_user_cost * migs.avg_user_impact * (migs.user_seeks + migs.user_scans) AS improvement_measure,
    mid.statement AS table_name,
    mid.equality_columns,
    mid.inequality_columns,
    mid.included_columns
FROM sys.dm_db_missing_index_groups mig
JOIN sys.dm_db_missing_index_group_stats migs ON mig.index_group_handle = migs.group_handle
JOIN sys.dm_db_missing_index_details mid ON mig.index_handle = mid.index_handle
ORDER BY improvement_measure DESC;
```

## Performance Monitoring

```sql
-- Find expensive queries
SELECT TOP 20
    qs.total_elapsed_time / qs.execution_count AS avg_elapsed_time,
    qs.execution_count,
    SUBSTRING(qt.text, (qs.statement_start_offset / 2) + 1,
        ((CASE qs.statement_end_offset
            WHEN -1 THEN DATALENGTH(qt.text)
            ELSE qs.statement_end_offset
        END - qs.statement_start_offset) / 2) + 1) AS query_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
ORDER BY avg_elapsed_time DESC;
```

## Security Best Practices

- Use Windows Authentication when possible
- Apply principle of least privilege
- Enable Transparent Data Encryption (TDE) for sensitive data
- Configure row-level security where appropriate
- Regular security audits using built-in tools

## Backup Strategy

```sql
-- Full backup
BACKUP DATABASE [DatabaseName]
TO DISK = N'C:\Backups\DatabaseName_Full.bak'
WITH COMPRESSION, CHECKSUM, INIT;

-- Differential backup
BACKUP DATABASE [DatabaseName]
TO DISK = N'C:\Backups\DatabaseName_Diff.bak'
WITH DIFFERENTIAL, COMPRESSION, CHECKSUM;

-- Transaction log backup
BACKUP LOG [DatabaseName]
TO DISK = N'C:\Backups\DatabaseName_Log.trn'
WITH COMPRESSION, CHECKSUM;
```

## Maintenance Tasks

- Regular index rebuilds/reorganizations
- Statistics updates
- Integrity checks (DBCC CHECKDB)
- Log file management
- Cleanup of old backup files
