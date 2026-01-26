# C4 Data Architecture Diagram

## Overview

K12 MyPortal uses a **dual-database architecture** with Azure SQL as the primary transactional database and Azure PostgreSQL for analytics workloads.

## Data Flow Architecture

```mermaid
flowchart TB
    subgraph Sources["Data Sources"]
        users["Users<br/>(100K+)"]
        schools["Schools<br/>(500+)"]
        providers["Providers<br/>(1000+)"]
        agencies["State Agencies<br/>(DMV, DOR, DPI)"]
    end

    subgraph Ingestion["Data Ingestion"]
        api["Azure Functions API<br/>.NET 8"]
        service_bus["Azure Service Bus<br/>RDS Messages"]
    end

    subgraph Primary["Primary Database (Azure SQL)"]
        subgraph Schemas["Multi-Schema Design"]
            dbo["dbo<br/>Core Tables"]
            enrollment["Enrollment<br/>Applications"]
            households["Households<br/>Family Data"]
            awards["Awards<br/>Disbursements"]
            comms["Comms<br/>Communications"]
            analytics_schema["Analytics<br/>Query Definitions"]
        end
    end

    subgraph Analytics["Analytics Stack"]
        cubejs["Cube.js<br/>Semantic Layer"]
        trino["Trino<br/>Query Federation"]
        postgres["PostgreSQL<br/>Pre-aggregations"]
    end

    subgraph Storage["Document Storage"]
        blob["Azure Blob<br/>Temp Uploads"]
        adls["ADLS Gen2<br/>Documents"]
    end

    subgraph Consumers["Data Consumers"]
        admin_app["Admin Dashboard"]
        reports["Reports"]
        metabase["Metabase BI"]
        exports["Data Exports"]
    end

    users --> api
    schools --> api
    providers --> api
    agencies --> service_bus

    api --> Schemas
    service_bus --> api

    api --> blob
    blob --> adls

    Schemas --> cubejs
    cubejs --> postgres
    Schemas --> trino
    trino --> postgres

    cubejs --> admin_app
    cubejs --> reports
    postgres --> metabase
    Schemas --> exports

    style Sources fill:#e3f2fd
    style Ingestion fill:#fff3e0
    style Primary fill:#e8f5e9
    style Analytics fill:#fce4ec
    style Storage fill:#f3e5f5
    style Consumers fill:#e0f2f1
```

## Database Schema Architecture

```mermaid
erDiagram
    %% Core Schema (dbo)
    Users ||--o{ UserRoles : has
    Users ||--o{ AuditLogs : generates
    Users ||--|| UserResourceAccessMap : "maps to"

    %% Enrollment Schema
    Applications ||--o{ ApplicationDocuments : contains
    Applications ||--|| Students : "for"
    Applications }|--|| Programs : "applies to"
    Applications }|--|| Households : "submitted by"

    %% Households Schema
    Households ||--o{ HouseholdMembers : contains
    Households ||--o{ Addresses : has
    HouseholdMembers ||--o{ Students : includes

    %% Awards Schema
    Students ||--o{ StudentAwards : receives
    StudentAwards ||--o{ AwardDisbursements : generates
    AwardDisbursements ||--o{ AwardTransactions : records

    %% Comms Schema
    Users ||--o{ Notifications : receives
    Applications ||--o{ EmailLogs : triggers
    EmailLogs }|--|| EmailTemplates : uses
```

## Azure SQL Multi-Schema Design

### Schema Overview

| Schema | Purpose | Key Tables | Row Count (Est.) |
|--------|---------|------------|------------------|
| **dbo** | Core system tables | Users, AuditLogs, SystemConfiguration | 500K+ |
| **Enrollment** | Application processing | Applications, Students, Programs | 1M+ |
| **Households** | Family information | Households, HouseholdMembers, Addresses | 500K+ |
| **Awards** | Award management | StudentAwards, Disbursements, Transactions | 2M+ |
| **Comms** | Communications | EmailQueue, Notifications, Templates | 5M+ |
| **Analytics** | Query definitions | QueryDefinition, QuerySnapshot, QuerySchedule | 1K |

### Schema Relationships

```mermaid
flowchart LR
    subgraph dbo["dbo Schema"]
        users["Users"]
        audit["AuditLogs"]
        access["UserResourceAccessMap"]
        config["SystemConfiguration"]
    end

    subgraph enrollment["Enrollment Schema"]
        apps["Applications"]
        students["Students"]
        programs["Programs"]
        docs["ApplicationDocuments"]
    end

    subgraph households["Households Schema"]
        hh["Households"]
        members["HouseholdMembers"]
        addresses["Addresses"]
    end

    subgraph awards["Awards Schema"]
        student_awards["StudentAwards"]
        disbursements["AwardDisbursements"]
        transactions["AwardTransactions"]
    end

    subgraph comms["Comms Schema"]
        emails["EmailQueue"]
        notifications["Notifications"]
        templates["EmailTemplates"]
    end

    users --> apps
    users --> audit
    users --> access
    students --> apps
    hh --> apps
    members --> students
    students --> student_awards
    student_awards --> disbursements
    apps --> emails
    templates --> emails

    style dbo fill:#e3f2fd
    style enrollment fill:#e8f5e9
    style households fill:#fff3e0
    style awards fill:#fce4ec
    style comms fill:#f3e5f5
```

### Key Tables by Schema

#### dbo Schema (Core)

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `Users` | User accounts | UserId, EntraObjectId, Email, Role |
| `AuditLogs` | Audit trail | EventType, UserId, Timestamp, Details |
| `UserResourceAccessMap` | RLS authorization | UserId, ResourceType, ResourceId |
| `SystemConfiguration` | System settings | Key, Value, Environment |

#### Enrollment Schema

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `Applications` | Scholarship applications | ApplicationId, HouseholdId, ProgramId, Status |
| `Students` | Student records | StudentId, FirstName, LastName, DOB, EntraObjectId |
| `Programs` | ESA+, Opportunity | ProgramId, Name, YearId, Rules |
| `ApplicationDocuments` | Uploaded documents | DocumentId, ApplicationId, Type, BlobPath |
| `EligibilityRules` | Eligibility criteria | RuleId, ProgramId, Expression |

#### Households Schema

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `Households` | Family units | HouseholdId, PrimaryParentId, Status |
| `HouseholdMembers` | Family members | MemberId, HouseholdId, Relationship |
| `Addresses` | Physical addresses | AddressId, HouseholdId, Street, City, State, Zip |
| `IncomeVerification` | Income records | VerificationId, HouseholdId, Year, Amount |

#### Awards Schema

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `StudentAwards` | Award allocations | AwardId, StudentId, ProgramId, Amount, Year |
| `AwardDisbursements` | Payment events | DisbursementId, AwardId, ClassWalletId, Status |
| `AwardTransactions` | Transaction history | TransactionId, DisbursementId, Type, Amount |

#### Comms Schema

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `EmailQueue` | Outbound emails | EmailId, RecipientId, TemplateId, Status |
| `EmailTemplates` | Email templates | TemplateId, Name, Subject, Body |
| `Notifications` | In-app notifications | NotificationId, UserId, Message, Read |
| `Messages` | User messages | MessageId, SenderId, RecipientId, Content |

## Row-Level Security (RLS)

```mermaid
flowchart TB
    subgraph Request["User Request"]
        jwt["JWT Token<br/>with Claims"]
    end

    subgraph Middleware["API Middleware"]
        extract["Extract User Claims"]
        load["Load Custom Attributes"]
        context["Set SESSION_CONTEXT"]
    end

    subgraph SQL["Azure SQL with RLS"]
        policy["Security Policy"]
        predicate["Filter Predicate"]
        data["Return Filtered Data"]
    end

    jwt --> extract
    extract --> load
    load --> context
    context --> policy
    policy --> predicate
    predicate --> data
```

### RLS Implementation

```sql
-- Security policy for Students table
CREATE SECURITY POLICY StudentAccessPolicy
ADD FILTER PREDICATE dbo.fn_StudentAccessFilter(StudentId)
    ON Enrollment.Students;

-- Filter function
CREATE FUNCTION dbo.fn_StudentAccessFilter(@StudentId UNIQUEIDENTIFIER)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN (
    SELECT 1 AS AccessGranted
    FROM dbo.UserResourceAccessMap m
    WHERE m.UserId = CAST(SESSION_CONTEXT(N'UserId') AS UNIQUEIDENTIFIER)
      AND m.ResourceType = 'Student'
      AND m.ResourceId = @StudentId
);
```

## Document Storage Architecture (ADLS Gen2)

### Hierarchical Structure

```
/{application}/{legal-entity}/{userid}/{documentType}

Examples:
/enrollment/lincoln-high/student123/birthcertificate
/enrollment/lincoln-high/student123/residencyproof
/providers/math-tutor-inc/emp456/backgroundcheck
/schools/roosevelt-elem/staff789/certification
```

### Access Control Model

```mermaid
flowchart TB
    subgraph Roles["User Roles"]
        admin["K12.Admin<br/>Full Access"]
        school["School.Admin<br/>School Level"]
        parent["Parent.User<br/>Student Level"]
    end

    subgraph Paths["ADLS Paths"]
        app_level["/{application}/<br/>All documents"]
        entity_level["/{application}/{entity}/<br/>Entity documents"]
        user_level["/{application}/{entity}/{user}/<br/>User documents"]
    end

    admin --> app_level
    school --> entity_level
    parent --> user_level

    style Roles fill:#e3f2fd
    style Paths fill:#e8f5e9
```

### SAS Token Generation

```mermaid
sequenceDiagram
    participant User
    participant API
    participant Graph as Entra ID
    participant ADLS

    User->>API: GET /documents/{id}/download
    API->>Graph: Get user's security attributes
    Graph->>API: Return attributes
    API->>API: Check authorization
    API->>ADLS: Generate SAS token (5 min expiry)
    ADLS->>API: SAS URL
    API->>User: 302 Redirect to SAS URL
    User->>ADLS: Direct download
```

## Analytics Data Architecture

### Primary vs Analytics Database

| Aspect | Azure SQL (Primary) | PostgreSQL (Analytics) |
|--------|---------------------|------------------------|
| **Purpose** | OLTP transactions | OLAP analytics |
| **Access** | Application API | Cube.js, Metabase |
| **Data** | Live operational data | Pre-aggregated snapshots |
| **Scale** | Vertical (DTU) | Horizontal (Citus) |
| **Extensions** | None | TimescaleDB, pg_trgm, pgvector |

### Cube.js Pre-aggregation Flow

```mermaid
flowchart LR
    subgraph Source["Azure SQL"]
        apps["Applications"]
        awards["Awards"]
        students["Students"]
    end

    subgraph Cube["Cube.js"]
        cube_apps["ApplicationsCube"]
        cube_awards["AwardsCube"]
        preagg["Pre-aggregations"]
    end

    subgraph Target["PostgreSQL"]
        preagg_tables["Materialized Views"]
        timeseries["TimescaleDB Hypertables"]
    end

    subgraph BI["BI Layer"]
        metabase["Metabase"]
        dashboard["Admin Dashboard"]
    end

    apps --> cube_apps
    awards --> cube_awards
    students --> cube_apps

    cube_apps --> preagg
    cube_awards --> preagg
    preagg --> preagg_tables
    preagg --> timeseries

    preagg_tables --> metabase
    timeseries --> dashboard
```

### Cube.js Schema Example

```javascript
// cube/schema/Applications.js
cube('Applications', {
  sql: `SELECT * FROM Enrollment.Applications`,

  measures: {
    count: {
      type: 'count',
    },
    approved: {
      type: 'count',
      filters: [{ sql: `${CUBE}.Status = 'Approved'` }],
    },
    approvalRate: {
      type: 'number',
      sql: `${approved} / ${count} * 100`,
    },
  },

  dimensions: {
    status: {
      type: 'string',
      sql: 'Status',
    },
    program: {
      type: 'string',
      sql: 'ProgramName',
    },
    submittedDate: {
      type: 'time',
      sql: 'SubmittedAt',
    },
  },

  preAggregations: {
    dailyByProgram: {
      type: 'rollup',
      measures: [count, approved],
      dimensions: [program, status],
      timeDimension: submittedDate,
      granularity: 'day',
      partitionGranularity: 'month',
      refreshKey: {
        every: '1 hour',
      },
    },
  },
});
```

## Data Governance

### Data Classification

| Classification | Examples | Protection |
|----------------|----------|------------|
| **Public** | Program information, school names | None required |
| **Internal** | Application counts, statistics | Authentication required |
| **Confidential** | Student PII, addresses | Encryption + RLS |
| **Restricted** | SSN, bank accounts | Encryption + Masking + Audit |

### Data Retention

| Data Type | Retention Period | Archive Strategy |
|-----------|------------------|------------------|
| Applications | 7 years | Archive to cold storage |
| Audit Logs | 7 years | Partition by year |
| Documents | 7 years | Move to archive tier |
| Emails | 3 years | Purge after retention |
| Session Data | 90 days | Auto-delete |

### Backup Strategy

| Resource | Backup Type | Frequency | Retention |
|----------|-------------|-----------|-----------|
| Azure SQL | Automated | Continuous | 35 days (PITR) |
| ADLS Gen2 | Snapshot | Daily | 30 days |
| PostgreSQL | pg_dump | Daily | 30 days |
| Configuration | Git | On change | Infinite |

## Related Documentation

- [Container Diagram](02-container-diagram.md)
- [Security Architecture](./../security/README.md)
- [SEC-03: Row-Level Security](./../security/SEC-03-row-level-security.md)
- [ADR-002: Dapper over Entity Framework](./../../adr/ADR-002-dapper-over-entity-framework.md)
- [ADR-008: Multi-Schema Database Design](./../../adr/ADR-008-multi-schema-database.md)
- [QueryBuilder SDK Design](./../integrations/QueryBuilder/SDK-Design.md)

---

*Created: December 2025*
*Author: Architecture Team*
*Review Date: Q1 2026*
