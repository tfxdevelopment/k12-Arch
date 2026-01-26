# ADR-008: Multi-Schema Database Design

**Status:** Accepted
**Date:** 2024-08-15
**Deciders:** CFI Architecture Team (Marty Flournory, Sumith Mathur), K12 Dev Team, DBA Team
**Technical Story:** Database organization for 100+ tables across multiple business domains

## Context and Problem Statement

The K12 MyPortal system requires a comprehensive database to manage:
- **Enrollment**: Applications, students, schools, providers (~30 tables)
- **Households**: Families, guardians, income verification (~15 tables)
- **Awards**: Scholarships, disbursements, payments (~20 tables)
- **Communications**: Emails, notifications, templates, audit logs (~15 tables)
- **System**: Users, roles, configuration, lookup tables (~25 tables)

Total: ~105 tables across 5 distinct business domains

The database must support:
- Row-Level Security (RLS) for multi-tenant data isolation
- Clear organizational boundaries between domains
- Performance optimization per domain
- Security isolation (different permission levels per domain)
- Maintainability for large dev team
- Future scalability and microservices migration path

The question is: how should we organize 100+ tables in Azure SQL Database?

## Decision Drivers

* **Organization**: Clear logical grouping of related tables
* **Security**: Ability to grant permissions at domain level
* **Performance**: Optimize indexes and queries per domain
* **Maintainability**: Easy to understand and navigate
* **Scalability**: Support for future growth and potential microservices
* **Developer Experience**: Easy to find tables and understand relationships
* **Compliance**: Audit trail and separation of concerns
* **Migration Path**: Potential future split into separate databases

## Considered Options

1. **Multi-Schema Design** - Separate schemas per business domain
2. **Single Schema with Prefixes** - All tables in `dbo` with naming prefixes
3. **Separate Databases** - One database per domain
4. **Schema-per-Service** - Microservices-style with many schemas

## Decision Outcome

**Chosen option:** "Multi-Schema Design", because it provides:
1. Clear logical separation of business domains
2. Schema-level security boundaries (grant/deny at schema level)
3. Easy to navigate and understand (schema = domain)
4. Better performance isolation (indexes per schema)
5. Foundation for future microservices migration
6. Minimal overhead compared to separate databases
7. Standard SQL pattern used by many enterprise applications

**Schema Design:**
- `dbo` - System tables, configuration, lookups, users
- `Enrollment` - Applications, students, schools, providers
- `Households` - Families, guardians, income verification
- `Awards` - Scholarships, disbursements, payments, fund management
- `Comms` - Communications, email templates, notifications, audit logs

### Consequences

#### Good
- Clear organizational boundaries between domains
- Easy to grant permissions per domain (e.g., `GRANT SELECT ON SCHEMA::Enrollment`)
- Queries are self-documenting (`SELECT * FROM Enrollment.Students`)
- Easy to identify which domain a table belongs to
- Performance tuning can be domain-specific
- Future migration to microservices easier (each schema could become a separate DB)
- Reduces naming conflicts (can have `Enrollment.Documents` and `Awards.Documents`)
- Easier to apply domain-specific backup/restore strategies

#### Bad
- Cross-schema queries require fully-qualified names (`Enrollment.Students`, `Households.Families`)
- More complex permission management (must grant per schema)
- Foreign keys across schemas require careful planning
- Database migrations more complex (must specify schema)
- ORM configurations require schema specification
- Slightly more verbose SQL queries

#### Neutral
- Need to establish clear guidelines for what belongs in each schema
- Requires discipline to maintain schema boundaries
- Shared/lookup tables in `dbo` must be carefully chosen

## Pros and Cons of the Options

### Multi-Schema Design (Chosen)

* **Pro:** Clear logical organization by business domain
* **Pro:** Schema-level security boundaries
* **Pro:** Self-documenting queries (`Enrollment.Students`)
* **Pro:** Reduces naming conflicts
* **Pro:** Foundation for future microservices
* **Pro:** Performance optimization per domain
* **Pro:** Standard SQL pattern
* **Pro:** Easy to apply domain-specific settings
* **Con:** Cross-schema queries require fully-qualified names
* **Con:** More complex permission management
* **Con:** Foreign keys across schemas need careful design

### Single Schema with Prefixes

* **Pro:** Simplest approach (everything in `dbo`)
* **Pro:** No cross-schema query complexity
* **Pro:** Easier permission management (single schema)
* **Con:** ❌ No logical separation (all tables mixed together)
* **Con:** ❌ Naming becomes very verbose (`tblEnrollmentStudents`)
* **Con:** ❌ No security boundaries
* **Con:** ❌ Difficult to navigate 100+ tables in single schema
* **Con:** ❌ Performance optimization harder
* **Con:** ❌ No migration path to microservices
* **Con:** ❌ Naming conflicts require longer prefixes

### Separate Databases

* **Pro:** Complete physical and logical separation
* **Pro:** Independent backups, scaling, security
* **Pro:** Clear microservices boundaries
* **Con:** ❌ Cross-database queries much slower
* **Con:** ❌ No distributed transactions (no ACID across databases)
* **Con:** ❌ Complex foreign key relationships
* **Con:** ❌ Higher infrastructure cost (multiple databases)
* **Con:** ❌ Premature optimization (we don't need microservices yet)
* **Con:** ❌ Connection pooling complexity

### Schema-per-Service (Many Schemas)

* **Pro:** Microservices-ready architecture
* **Pro:** Fine-grained security boundaries
* **Con:** Too many schemas for current scale
* **Con:** Overhead of managing many schemas
* **Con:** Unnecessarily complex for current needs
* **Con:** May over-engineer the solution

## Technical Details

### Schema Definitions

**Create Schemas:**
```sql
-- System/Core tables
CREATE SCHEMA dbo;  -- Default schema (already exists)

-- Business domain schemas
CREATE SCHEMA Enrollment AUTHORIZATION dbo;
CREATE SCHEMA Households AUTHORIZATION dbo;
CREATE SCHEMA Awards AUTHORIZATION dbo;
CREATE SCHEMA Comms AUTHORIZATION dbo;
```

### Table Organization

**dbo Schema (System/Configuration):**
```sql
-- System tables
dbo.Users
dbo.Roles
dbo.UserRoles
dbo.AuditLogs
dbo.SystemConfiguration

-- Lookup/reference tables (shared across domains)
dbo.States
dbo.Counties
dbo.Grades
dbo.SchoolYears
dbo.DocumentTypes
dbo.AddressTypes
```

**Enrollment Schema (Application/Student Data):**
```sql
Enrollment.Applications
Enrollment.ApplicationStatuses
Enrollment.Students
Enrollment.StudentDocuments
Enrollment.Schools
Enrollment.SchoolEnrollments
Enrollment.Providers
Enrollment.ProviderServices
Enrollment.EligibilityChecks
```

**Households Schema (Family/Guardian Data):**
```sql
Households.Households
Households.HouseholdMembers
Households.Guardians
Households.GuardianRelationships
Households.IncomeVerifications
Households.ResidencyVerifications
Households.Addresses
Households.PhoneNumbers
Households.EmailAddresses
```

**Awards Schema (Scholarship/Payment Data):**
```sql
Awards.StudentAwards
Awards.AwardAmounts
Awards.Disbursements
Awards.DisbursementSchedules
Awards.Payments
Awards.PaymentMethods
Awards.FundSources
Awards.FundAllocations
Awards.ClassWalletTransactions
```

**Comms Schema (Communications/Notifications):**
```sql
Comms.EmailQueue
Comms.EmailTemplates
Comms.SentEmails
Comms.Notifications
Comms.NotificationPreferences
Comms.SMSMessages
Comms.AuditTrail
Comms.EventLogs
```

### Example Table Definitions

**Enrollment.Students:**
```sql
CREATE TABLE Enrollment.Students (
    StudentId NVARCHAR(50) PRIMARY KEY,
    HouseholdId NVARCHAR(50) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    MiddleName NVARCHAR(100),
    DateOfBirth DATE NOT NULL,
    Grade INT NOT NULL,
    SpecialNeeds BIT NOT NULL DEFAULT 0,
    EligibilityStatus NVARCHAR(20) NOT NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy NVARCHAR(100) NOT NULL,
    ModifiedBy NVARCHAR(100) NOT NULL,

    -- Foreign key to Households schema
    CONSTRAINT FK_Students_Households
        FOREIGN KEY (HouseholdId)
        REFERENCES Households.Households(HouseholdId),

    -- Foreign key to dbo schema (lookup)
    CONSTRAINT FK_Students_Grades
        FOREIGN KEY (Grade)
        REFERENCES dbo.Grades(GradeLevel)
);

CREATE INDEX IX_Students_HouseholdId ON Enrollment.Students(HouseholdId);
CREATE INDEX IX_Students_EligibilityStatus ON Enrollment.Students(EligibilityStatus);
```

**Households.Households:**
```sql
CREATE TABLE Households.Households (
    HouseholdId NVARCHAR(50) PRIMARY KEY,
    PrimaryGuardianId NVARCHAR(50) NOT NULL,
    HouseholdSize INT NOT NULL,
    TotalIncome DECIMAL(18,2),
    IncomeVerificationStatus NVARCHAR(20),
    ResidencyStatus NVARCHAR(20),
    CountyCode NVARCHAR(3) NOT NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    -- Foreign key to dbo schema (lookup)
    CONSTRAINT FK_Households_Counties
        FOREIGN KEY (CountyCode)
        REFERENCES dbo.Counties(CountyCode)
);

CREATE INDEX IX_Households_CountyCode ON Households.Households(CountyCode);
CREATE INDEX IX_Households_IncomeVerificationStatus ON Households.Households(IncomeVerificationStatus);
```

**Awards.StudentAwards:**
```sql
CREATE TABLE Awards.StudentAwards (
    AwardId NVARCHAR(50) PRIMARY KEY,
    StudentId NVARCHAR(50) NOT NULL,
    ApplicationId NVARCHAR(50) NOT NULL,
    SchoolYearId INT NOT NULL,
    AwardAmount DECIMAL(18,2) NOT NULL,
    RemainingBalance DECIMAL(18,2) NOT NULL,
    AwardStatus NVARCHAR(20) NOT NULL,
    FundSourceId NVARCHAR(50) NOT NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    -- Foreign key to Enrollment schema
    CONSTRAINT FK_StudentAwards_Students
        FOREIGN KEY (StudentId)
        REFERENCES Enrollment.Students(StudentId),

    CONSTRAINT FK_StudentAwards_Applications
        FOREIGN KEY (ApplicationId)
        REFERENCES Enrollment.Applications(ApplicationId),

    -- Foreign key within same schema
    CONSTRAINT FK_StudentAwards_FundSources
        FOREIGN KEY (FundSourceId)
        REFERENCES Awards.FundSources(FundSourceId),

    -- Foreign key to dbo schema
    CONSTRAINT FK_StudentAwards_SchoolYears
        FOREIGN KEY (SchoolYearId)
        REFERENCES dbo.SchoolYears(SchoolYearId)
);

CREATE INDEX IX_StudentAwards_StudentId ON Awards.StudentAwards(StudentId);
CREATE INDEX IX_StudentAwards_ApplicationId ON Awards.StudentAwards(ApplicationId);
CREATE INDEX IX_StudentAwards_AwardStatus ON Awards.StudentAwards(AwardStatus);
```

### Cross-Schema Queries

**Query joining multiple schemas:**
```sql
-- Get complete application details across all domains
SELECT
    a.ApplicationId,
    a.Status AS ApplicationStatus,
    a.SubmittedDate,
    s.FirstName,
    s.LastName,
    s.Grade,
    h.HouseholdSize,
    h.TotalIncome,
    aw.AwardAmount,
    aw.AwardStatus,
    c.CountyName
FROM Enrollment.Applications a
    INNER JOIN Enrollment.Students s ON a.StudentId = s.StudentId
    INNER JOIN Households.Households h ON s.HouseholdId = h.HouseholdId
    LEFT JOIN Awards.StudentAwards aw ON a.ApplicationId = aw.ApplicationId
    INNER JOIN dbo.Counties c ON h.CountyCode = c.CountyCode
WHERE a.ApplicationId = @applicationId;
```

**Aggregate query across schemas:**
```sql
-- Get award statistics by county
SELECT
    c.CountyName,
    COUNT(DISTINCT aw.StudentId) AS TotalStudents,
    SUM(aw.AwardAmount) AS TotalAwarded,
    AVG(aw.AwardAmount) AS AverageAward
FROM Awards.StudentAwards aw
    INNER JOIN Enrollment.Students s ON aw.StudentId = s.StudentId
    INNER JOIN Households.Households h ON s.HouseholdId = h.HouseholdId
    INNER JOIN dbo.Counties c ON h.CountyCode = c.CountyCode
WHERE aw.SchoolYearId = @schoolYearId
    AND aw.AwardStatus = 'Active'
GROUP BY c.CountyName
ORDER BY TotalAwarded DESC;
```

### Security and Permissions

**Schema-level permissions:**
```sql
-- Create role for enrollment staff
CREATE ROLE EnrollmentStaff;

-- Grant read/write access to Enrollment schema only
GRANT SELECT, INSERT, UPDATE ON SCHEMA::Enrollment TO EnrollmentStaff;

-- Grant read-only access to Households and dbo lookups
GRANT SELECT ON SCHEMA::Households TO EnrollmentStaff;
GRANT SELECT ON SCHEMA::dbo TO EnrollmentStaff;

-- Deny access to Awards and Comms
DENY SELECT ON SCHEMA::Awards TO EnrollmentStaff;
DENY SELECT ON SCHEMA::Comms TO EnrollmentStaff;
```

**Application-level service principal:**
```sql
-- Create user for API service principal
CREATE USER [k12-api-prod-func] FROM EXTERNAL PROVIDER;

-- Grant full access to all schemas
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Enrollment TO [k12-api-prod-func];
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Households TO [k12-api-prod-func];
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Awards TO [k12-api-prod-func];
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Comms TO [k12-api-prod-func];
GRANT SELECT ON SCHEMA::dbo TO [k12-api-prod-func];
```

### Row-Level Security Integration

**RLS works across all schemas:**
```sql
-- Create security predicate function
CREATE FUNCTION dbo.fn_StudentAccessPredicate(@StudentId NVARCHAR(50))
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS AccessResult
    WHERE
        -- Check session context for UserObjectId
        CAST(SESSION_CONTEXT(N'UserObjectId') AS NVARCHAR(50)) IS NOT NULL
        AND EXISTS (
            SELECT 1
            FROM Enrollment.Students s
                INNER JOIN Households.Households h ON s.HouseholdId = h.HouseholdId
                INNER JOIN Households.Guardians g ON h.HouseholdId = g.HouseholdId
            WHERE s.StudentId = @StudentId
                AND g.UserObjectId = CAST(SESSION_CONTEXT(N'UserObjectId') AS NVARCHAR(50))
        );

-- Apply RLS to tables across schemas
CREATE SECURITY POLICY StudentAccessPolicy
    ADD FILTER PREDICATE dbo.fn_StudentAccessPredicate(StudentId)
        ON Enrollment.Students,
    ADD FILTER PREDICATE dbo.fn_StudentAccessPredicate(StudentId)
        ON Enrollment.Applications,
    ADD FILTER PREDICATE dbo.fn_StudentAccessPredicate(StudentId)
        ON Awards.StudentAwards
WITH (STATE = ON);
```

### Dapper Integration

**Repository pattern respects schemas:**
```csharp
public class StudentRepository : IStudentRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public async Task<Student> GetByIdAsync(string studentId)
    {
        using var connection = await _connectionFactory.CreateConnectionAsync();

        // Fully-qualified schema.table name
        return await connection.QueryFirstOrDefaultAsync<Student>(
            @"SELECT
                StudentId, FirstName, LastName, DateOfBirth, Grade, HouseholdId
              FROM Enrollment.Students
              WHERE StudentId = @studentId",
            new { studentId });
    }

    public async Task<ApplicationDetails> GetApplicationDetailsAsync(string applicationId)
    {
        using var connection = await _connectionFactory.CreateConnectionAsync();

        // Cross-schema query
        var sql = @"
            SELECT
                a.ApplicationId, a.Status, a.SubmittedDate,
                s.StudentId, s.FirstName, s.LastName,
                h.HouseholdId, h.TotalIncome,
                aw.AwardId, aw.AwardAmount
            FROM Enrollment.Applications a
                INNER JOIN Enrollment.Students s ON a.StudentId = s.StudentId
                INNER JOIN Households.Households h ON s.HouseholdId = h.HouseholdId
                LEFT JOIN Awards.StudentAwards aw ON a.ApplicationId = aw.ApplicationId
            WHERE a.ApplicationId = @applicationId";

        // Dapper multi-mapping
        var result = await connection.QueryAsync<ApplicationDetails, Student, Household, Award, ApplicationDetails>(
            sql,
            (app, student, household, award) =>
            {
                app.Student = student;
                app.Household = household;
                app.Award = award;
                return app;
            },
            new { applicationId },
            splitOn: "StudentId,HouseholdId,AwardId");

        return result.FirstOrDefault();
    }
}
```

### Database Migrations

**FluentMigrator with schema support:**
```csharp
[Migration(20240815001)]
public class CreateEnrollmentSchema : Migration
{
    public override void Up()
    {
        // Create schema
        Execute.Sql("CREATE SCHEMA Enrollment AUTHORIZATION dbo");

        // Create tables in schema
        Create.Table("Students")
            .InSchema("Enrollment")
            .WithColumn("StudentId").AsString(50).PrimaryKey()
            .WithColumn("HouseholdId").AsString(50).NotNullable()
            .WithColumn("FirstName").AsString(100).NotNullable()
            .WithColumn("LastName").AsString(100).NotNullable()
            .WithColumn("DateOfBirth").AsDate().NotNullable()
            .WithColumn("Grade").AsInt32().NotNullable()
            .WithColumn("CreatedDate").AsDateTime2().NotNullable().WithDefault(SystemMethods.CurrentUTCDateTime);

        // Create foreign key to Households schema
        Create.ForeignKey("FK_Students_Households")
            .FromTable("Students").InSchema("Enrollment").ForeignColumn("HouseholdId")
            .ToTable("Households").InSchema("Households").PrimaryColumn("HouseholdId");

        // Create indexes
        Create.Index("IX_Students_HouseholdId")
            .OnTable("Students").InSchema("Enrollment")
            .OnColumn("HouseholdId");
    }

    public override void Down()
    {
        Delete.Table("Students").InSchema("Enrollment");
        Execute.Sql("DROP SCHEMA Enrollment");
    }
}
```

### Performance Considerations

**Schema-specific indexes:**
```sql
-- Enrollment schema indexes (optimized for student lookups)
CREATE INDEX IX_Students_LastName_FirstName ON Enrollment.Students(LastName, FirstName);
CREATE INDEX IX_Applications_Status_SubmittedDate ON Enrollment.Applications(Status, SubmittedDate);

-- Awards schema indexes (optimized for financial queries)
CREATE INDEX IX_StudentAwards_SchoolYear_Status ON Awards.StudentAwards(SchoolYearId, AwardStatus) INCLUDE (AwardAmount);
CREATE INDEX IX_Disbursements_ScheduledDate ON Awards.Disbursements(ScheduledDate) WHERE Status = 'Pending';

-- Households schema indexes (optimized for income verification)
CREATE INDEX IX_Households_IncomeVerificationStatus ON Households.Households(IncomeVerificationStatus) INCLUDE (TotalIncome);
```

**Schema-specific statistics:**
```sql
-- Update statistics per schema for better query plans
UPDATE STATISTICS Enrollment.Students WITH FULLSCAN;
UPDATE STATISTICS Enrollment.Applications WITH FULLSCAN;
UPDATE STATISTICS Awards.StudentAwards WITH FULLSCAN;
```

## Migration Path to Microservices

**Future state (if needed):**
```
Current: Single database with 5 schemas
├── dbo (shared)
├── Enrollment
├── Households
├── Awards
└── Comms

Future: Separate databases (microservices)
├── k12-shared-db (dbo schema only)
├── k12-enrollment-db (Enrollment schema)
├── k12-households-db (Households schema)
├── k12-awards-db (Awards schema)
└── k12-comms-db (Comms schema)
```

**Migration would involve:**
1. Create separate databases
2. Move each schema to its own database
3. Convert foreign keys to application-level relationships
4. Implement eventual consistency patterns
5. Update connection strings per service

**Current design makes this possible but not urgent.**

## Validation

Success will be measured by:
- All 105 tables organized into appropriate schemas
- Schema-level permissions correctly enforced
- Cross-schema queries perform within SLA (<2 seconds)
- Developers can easily navigate and find tables
- Foreign key relationships work across schemas
- RLS policies work across all schemas
- No naming conflicts between schemas
- Database migration scripts work with schema specification

## Related Decisions

* [ADR-002: Dapper Over Entity Framework](ADR-002-dapper-over-entity-framework.md) - Data access impacts queries
* [SEC-03: Row-Level Security](./../02-architecture/security/SEC-03-row-level-security.md) - RLS spans schemas

## References

* [SQL Server Schemas](https://learn.microsoft.com/en-us/sql/relational-databases/security/authentication-access/create-a-database-schema)
* [Schema-Level Permissions](https://learn.microsoft.com/en-us/sql/t-sql/statements/grant-schema-permissions-transact-sql)
* [Cross-Schema Queries](https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-identifiers)
* [Database Design Best Practices](https://learn.microsoft.com/en-us/sql/relational-databases/database-design/database-design-best-practices)

---

**Decision Made:** August 15, 2024
**Implemented:** August-September 2024
**Total Tables:** 105 across 5 schemas
**Database:** k12-prod-sqldb (Azure SQL)
